import type { Vehicle } from "./data";

// Shared by the browser (live quotes) and the server (authoritative quote before payment).

export type TripType = "outstation" | "local" | "airport";
export type TripMode = "oneway" | "round";
export type PayOption = "advance" | "full" | "later";

export const GST_RATE = 0.05;
export const ADVANCE_RATE = 0.2;
export const MIN_ADVANCE = 500;
export const ONEWAY_MIN_KM = 130;
export const AIRPORT_INCLUDED_KM = 35;

export const LOCAL_PACKAGES = [
  { id: "4h40", label: "4 Hrs / 40 Km", hours: 4, km: 40, factor: 0.6 },
  { id: "8h80", label: "8 Hrs / 80 Km", hours: 8, km: 80, factor: 1 },
  { id: "12h120", label: "12 Hrs / 120 Km", hours: 12, km: 120, factor: 1.45 },
] as const;

export interface FareLine {
  label: string;
  amount: number;
}

export interface Fare {
  lines: FareLine[];
  subtotal: number;
  gst: number;
  total: number;
  billableKm: number;
  notes: string[];
}

const roundTo = (n: number, step: number) => Math.round(n / step) * step;

export function computeFare(input: {
  type: TripType;
  mode: TripMode;
  vehicle: Vehicle;
  km: number;
  days: number;
  pkg?: string;
}): Fare {
  const { type, mode, vehicle: v, km, days, pkg } = input;
  const lines: FareLine[] = [];
  const notes: string[] = [];
  let billableKm = 0;

  if (type === "local") {
    const p = LOCAL_PACKAGES.find((x) => x.id === pkg) ?? LOCAL_PACKAGES[1];
    lines.push({ label: `${p.label} package`, amount: roundTo(v.local8h * p.factor, 10) });
    billableKm = p.km;
    notes.push(`Extra km ₹${v.perKm}/km`, `Extra hour ₹${v.extraHr}/hr`, "Parking & tolls extra as actuals");
  } else if (type === "airport") {
    const k = Math.max(1, Math.ceil(km));
    lines.push({ label: `Airport transfer (up to ${AIRPORT_INCLUDED_KM} km)`, amount: v.airportBase });
    if (k > AIRPORT_INCLUDED_KM) {
      const extra = k - AIRPORT_INCLUDED_KM;
      lines.push({ label: `Additional ${extra} km × ₹${v.perKm}`, amount: extra * v.perKm });
    }
    billableKm = k;
    notes.push("Airport toll & parking extra as actuals", "45 min free waiting for arrivals");
  } else {
    const d = Math.max(1, days);
    if (mode === "round") {
      const actual = Math.ceil(km * 2);
      billableKm = Math.max(actual, v.minKmDay * d);
      lines.push({
        label: `${billableKm} km × ₹${v.perKm}/km${billableKm > actual ? ` (min ${v.minKmDay} km/day)` : ""}`,
        amount: billableKm * v.perKm,
      });
      lines.push({ label: `Driver allowance × ${d} day${d > 1 ? "s" : ""}`, amount: v.driverDay * d });
    } else {
      const actual = Math.ceil(km);
      billableKm = Math.max(actual, ONEWAY_MIN_KM);
      lines.push({
        label: `${billableKm} km × ₹${v.perKm}/km${billableKm > actual ? " (min fare)" : ""}`,
        amount: billableKm * v.perKm,
      });
      lines.push({ label: "Driver allowance", amount: v.driverDay });
    }
    notes.push("Tolls, state permits & parking extra as actuals", `Extra km ₹${v.perKm}/km`);
  }

  const subtotal = lines.reduce((s, l) => s + l.amount, 0);
  const gst = Math.round(subtotal * GST_RATE);
  return { lines, subtotal, gst, total: subtotal + gst, billableKm, notes };
}

export const advanceAmount = (total: number) =>
  Math.min(total, Math.max(MIN_ADVANCE, Math.round(total * ADVANCE_RATE)));

export const payableFor = (total: number, opt: PayOption) =>
  opt === "full" ? total : opt === "advance" ? advanceAmount(total) : 0;

const inrFmt = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
export const inr = (n: number) => inrFmt.format(n);

// ── Geo helpers ──────────────────────────────────────────────
export type LatLng = { lat: number; lng: number };

export function haversineKm(a: LatLng, b: LatLng) {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** Rough road distance when the routing service is unavailable. */
export const estimateRoadKm = (a: LatLng, b: LatLng) => Math.round(haversineKm(a, b) * 1.3 * 10) / 10;

/** Greater Bengaluru service region for pick-ups. */
export const BLR_BOUNDS = { south: 12.55, north: 13.45, west: 77.15, east: 78.15 };
export const inBangaloreRegion = (p: LatLng) =>
  p.lat >= BLR_BOUNDS.south && p.lat <= BLR_BOUNDS.north && p.lng >= BLR_BOUNDS.west && p.lng <= BLR_BOUNDS.east;

// ── Date / time helpers (IST) ────────────────────────────────
export function todayIST(offsetDays = 0) {
  const d = new Date(Date.now() + 5.5 * 3600_000 + offsetDays * 86400_000);
  return d.toISOString().slice(0, 10);
}

export const pickupInstant = (date: string, time: string) => new Date(`${date}T${time}:00+05:30`);

export function daysInclusive(start: string, end: string) {
  const a = Date.parse(`${start}T00:00:00Z`);
  const b = Date.parse(`${end}T00:00:00Z`);
  if (Number.isNaN(a) || Number.isNaN(b) || b < a) return 1;
  return Math.round((b - a) / 86400_000) + 1;
}

export function slotLabel(v: string) {
  const [h, m] = v.split(":").map(Number);
  const hh = h % 12 === 0 ? 12 : h % 12;
  return `${hh}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
}

export const TIME_SLOTS = Array.from({ length: 96 }, (_, i) => {
  const h = Math.floor(i / 4);
  const m = (i % 4) * 15;
  const value = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  return { value, label: slotLabel(value) };
});

export function formatDate(d: string) {
  if (!d) return "";
  return new Date(`${d}T00:00:00+05:30`).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
}
