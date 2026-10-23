import "server-only";
import crypto from "node:crypto";
import nodemailer, { type Transporter } from "nodemailer";
import { AIRPORT, COMPANY, findVehicle, type Vehicle } from "./data";
import {
  computeFare,
  daysInclusive,
  estimateRoadKm,
  formatDate,
  haversineKm,
  inBangaloreRegion,
  inr,
  LOCAL_PACKAGES,
  payableFor,
  pickupInstant,
  slotLabel,
  type Fare,
  type LatLng,
  type PayOption,
  type TripMode,
  type TripType,
} from "./pricing";

const UA = `RVSToursBooking/1.0 (${COMPANY.url})`;

// ── Routing (OSRM) with graceful fallback ────────────────────
export interface RouteResult {
  km: number;
  mins: number;
  coords: [number, number][];
  estimated: boolean;
}

export async function routeBetween(a: LatLng, b: LatLng): Promise<RouteResult> {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${a.lng},${a.lat};${b.lng},${b.lat}?overview=simplified&geometries=geojson`;
    const r = await fetch(url, {
      headers: { "User-Agent": UA },
      next: { revalidate: 86400 },
      signal: AbortSignal.timeout(8000),
    });
    if (!r.ok) throw new Error(`OSRM ${r.status}`);
    const j = await r.json();
    const route = j?.routes?.[0];
    if (!route) throw new Error("No route");
    return {
      km: Math.round((route.distance / 1000) * 10) / 10,
      mins: Math.round(route.duration / 60),
      coords: (route.geometry.coordinates as [number, number][]).map(([lng, lat]) => [lat, lng]),
      estimated: false,
    };
  } catch {
    const km = estimateRoadKm(a, b);
    return { km, mins: Math.round((km / 40) * 60), coords: [], estimated: true };
  }
}

// ── Booking validation + authoritative quote ─────────────────
export interface Pt extends LatLng {
  label: string;
}

export interface BookingInput {
  type: TripType;
  mode: TripMode;
  vehicleId: string;
  pickup: Pt;
  drop: Pt | null;
  date: string;
  time: string;
  returnDate: string;
  pkg: string;
  name: string;
  phone: string;
  email: string;
  notes: string;
  payOption: PayOption;
}

const str = (v: unknown, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : "");

function pt(v: unknown): Pt | null {
  if (!v || typeof v !== "object") return null;
  const o = v as Record<string, unknown>;
  const lat = Number(o.lat);
  const lng = Number(o.lng);
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) return null;
  return { lat, lng, label: str(o.label, 240) || `${lat.toFixed(5)}, ${lng.toFixed(5)}` };
}

export const cleanPhone = (p: string) => p.replace(/[\s\-()]/g, "").replace(/^(\+91|91|0)(?=\d{10}$)/, "");
export const validPhone = (p: string) => /^[6-9]\d{9}$/.test(cleanPhone(p));
export const validEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e);

export function validateBooking(raw: unknown): { ok: true; data: BookingInput } | { ok: false; error: string } {
  if (!raw || typeof raw !== "object") return { ok: false, error: "Invalid request" };
  const b = raw as Record<string, unknown>;
  const type = b.type as TripType;
  if (!["outstation", "local", "airport"].includes(type)) return { ok: false, error: "Invalid trip type" };
  const mode: TripMode = b.mode === "round" ? "round" : "oneway";
  const vehicleId = str(b.vehicleId, 40);
  if (!findVehicle(vehicleId)) return { ok: false, error: "Please select a vehicle" };

  const pickup = pt(b.pickup);
  const drop = type === "local" ? null : pt(b.drop);
  if (!pickup) return { ok: false, error: "Pickup location is required" };
  if (type !== "local" && !drop) return { ok: false, error: "Drop location is required" };

  if (type === "outstation" && !inBangaloreRegion(pickup))
    return { ok: false, error: "Outstation trips start from Bengaluru. Please choose a pickup inside Bengaluru." };
  if (type === "local" && !inBangaloreRegion(pickup)) return { ok: false, error: "Local packages are available inside Bengaluru only." };
  if (type === "airport") {
    const nearAirport = haversineKm(pickup, AIRPORT) < 4 || (drop && haversineKm(drop, AIRPORT) < 4);
    const other = drop && haversineKm(pickup, AIRPORT) < 4 ? drop : pickup;
    if (!nearAirport) return { ok: false, error: "Airport trips must start or end at Kempegowda International Airport." };
    if (!inBangaloreRegion(other)) return { ok: false, error: "Airport transfers cover Bengaluru city. Choose Outstation for longer trips." };
  }

  const date = str(b.date, 10);
  const time = str(b.time, 5);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time)) return { ok: false, error: "Pickup date and time are required" };
  const when = pickupInstant(date, time).getTime();
  if (Number.isNaN(when) || when < Date.now() + 25 * 60_000)
    return { ok: false, error: "Pickup time must be at least 30 minutes from now" };
  if (when > Date.now() + 180 * 86400_000) return { ok: false, error: "Bookings can be made up to 6 months in advance" };

  const returnDate = mode === "round" && type === "outstation" ? str(b.returnDate, 10) : "";
  if (mode === "round" && type === "outstation" && (!/^\d{4}-\d{2}-\d{2}$/.test(returnDate) || returnDate < date))
    return { ok: false, error: "Please choose a valid return date" };

  const pkg = LOCAL_PACKAGES.some((p) => p.id === b.pkg) ? String(b.pkg) : "8h80";
  const name = str(b.name, 80);
  const phone = cleanPhone(str(b.phone, 20));
  const email = str(b.email, 120).toLowerCase();
  if (name.length < 2) return { ok: false, error: "Please enter your name" };
  if (!validPhone(phone)) return { ok: false, error: "Please enter a valid 10-digit mobile number" };
  if (!validEmail(email)) return { ok: false, error: "Please enter a valid email address" };

  const payOption: PayOption = b.payOption === "full" ? "full" : b.payOption === "later" ? "later" : "advance";

  return {
    ok: true,
    data: { type, mode, vehicleId, pickup, drop, date, time, returnDate, pkg, name, phone, email, notes: str(b.notes, 400), payOption },
  };
}

export interface Quote {
  vehicle: Vehicle;
  km: number;
  days: number;
  fare: Fare;
  payable: number;
}

export async function quoteBooking(d: BookingInput): Promise<Quote> {
  const vehicle = findVehicle(d.vehicleId)!;
  const km = d.type === "local" || !d.drop ? 0 : (await routeBetween(d.pickup, d.drop)).km;
  const days = d.mode === "round" ? daysInclusive(d.date, d.returnDate) : 1;
  const fare = computeFare({ type: d.type, mode: d.mode, vehicle, km, days, pkg: d.pkg });
  return { vehicle, km, days, fare, payable: payableFor(fare.total, d.payOption) };
}

export function newBookingId() {
  const t = Date.now().toString(36).toUpperCase().slice(-5);
  const r = crypto.randomBytes(2).toString("hex").toUpperCase();
  return `RVS${t}${r}`;
}

export function tripLabel(d: Pick<BookingInput, "type" | "mode" | "pkg">) {
  if (d.type === "local") return `Local — ${LOCAL_PACKAGES.find((p) => p.id === d.pkg)?.label ?? "8 Hrs / 80 Km"}`;
  if (d.type === "airport") return "Airport transfer";
  return d.mode === "round" ? "Outstation — Round trip" : "Outstation — One way";
}

export function bookingRows(id: string, d: BookingInput, q: Quote, paid: string): [string, string][] {
  return [
    ["Booking ID", id],
    ["Trip", tripLabel(d)],
    ["Vehicle", `${q.vehicle.name} (${q.vehicle.model})`],
    ["Pickup", d.pickup.label],
    ...(d.drop ? ([["Drop", d.drop.label]] as [string, string][]) : []),
    ["Pickup date & time", `${formatDate(d.date)}, ${slotLabel(d.time)}`],
    ...(d.returnDate ? ([["Return date", formatDate(d.returnDate)]] as [string, string][]) : []),
    ...(q.km ? ([["Route distance", `${q.km} km`]] as [string, string][]) : []),
    ["Estimated fare (incl. GST)", inr(q.fare.total)],
    ["Payment", paid],
    ["Customer", d.name],
    ["Mobile", d.phone],
    ["Email", d.email],
    ...(d.notes ? ([["Notes", d.notes]] as [string, string][]) : []),
  ];
}

// ── Email ────────────────────────────────────────────────────
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export function emailHtml(title: string, intro: string, rows: [string, string][]) {
  const tr = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:10px 14px;border-bottom:1px solid #eef1f7;color:#64748b;font-size:13px;width:38%">${esc(k)}</td><td style="padding:10px 14px;border-bottom:1px solid #eef1f7;color:#0f172a;font-size:14px;font-weight:600">${esc(v)}</td></tr>`,
    )
    .join("");
  return `<!doctype html><html><body style="margin:0;background:#f3f5fb;font-family:Arial,Helvetica,sans-serif">
  <div style="max-width:600px;margin:24px auto;background:#fff;border-radius:14px;overflow:hidden;border:1px solid #e5e9f2">
    <div style="background:#142a73;padding:20px 24px;color:#fff"><div style="font-size:12px;letter-spacing:2px;color:#ff8a8f;font-weight:700">RVS TOURS AND TRAVELS</div><div style="font-size:20px;font-weight:700;margin-top:4px">${esc(title)}</div></div>
    <div style="padding:20px 24px;color:#334155;font-size:14px;line-height:1.6">${esc(intro)}</div>
    <table style="width:100%;border-collapse:collapse">${tr}</table>
    <div style="padding:18px 24px;color:#64748b;font-size:12px;line-height:1.6">Questions? Call or WhatsApp ${esc(COMPANY.phoneDisplay)} · ${esc(COMPANY.email)}<br/>${esc(COMPANY.name)}, ${esc(COMPANY.address)}</div>
  </div></body></html>`;
}

export const ADMIN_EMAIL = process.env.BOOKING_EMAIL_TO || COMPANY.email;

let transporter: Transporter | null = null;

export async function sendMail(opts: { to: string; subject: string; html: string; replyTo?: string }) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.warn(`[mail] SMTP not configured — skipped: ${opts.subject}`);
    return false;
  }
  try {
    const port = Number(SMTP_PORT || 465);
    transporter ??= nodemailer.createTransport({ host: SMTP_HOST, port, secure: port === 465, auth: { user: SMTP_USER, pass: SMTP_PASS } });
    await transporter.sendMail({ from: MAIL_FROM || `${COMPANY.short} <${SMTP_USER}>`, ...opts });
    return true;
  } catch (e) {
    console.error("[mail] failed", e);
    return false;
  }
}

// ── Razorpay ─────────────────────────────────────────────────
export function razorpayKeys() {
  const id = process.env.RAZORPAY_KEY_ID;
  const secret = process.env.RAZORPAY_KEY_SECRET;
  return id && secret ? { id, secret, auth: "Basic " + Buffer.from(`${id}:${secret}`).toString("base64") } : null;
}

export function verifyRazorpaySignature(orderId: string, paymentId: string, signature: string, secret: string) {
  const expected = crypto.createHmac("sha256", secret).update(`${orderId}|${paymentId}`).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(signature || "");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

// ── Tiny in-memory rate limiter (per server instance) ────────
const hits = new Map<string, { n: number; t: number }>();
export function rateLimited(key: string, max = 20, windowMs = 10 * 60_000) {
  const now = Date.now();
  const h = hits.get(key);
  if (!h || now - h.t > windowMs) {
    hits.set(key, { n: 1, t: now });
    return false;
  }
  h.n += 1;
  return h.n > max;
}

export const clientIp = (req: Request) =>
  req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "local";
