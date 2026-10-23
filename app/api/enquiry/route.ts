import { NextResponse } from "next/server";
import {
  ADMIN_EMAIL,
  bookingRows,
  cleanPhone,
  clientIp,
  emailHtml,
  newBookingId,
  quoteBooking,
  rateLimited,
  sendMail,
  validateBooking,
  validEmail,
  validPhone,
} from "@/lib/server";
import { inr } from "@/lib/pricing";

export const runtime = "nodejs";

// Handles: kind=booking (pay to driver), kind=contact, kind=corporate.
export async function POST(req: Request) {
  if (rateLimited(`enq:${clientIp(req)}`, 12)) return NextResponse.json({ error: "Too many requests. Please call us instead." }, { status: 429 });
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  if (body.website) return NextResponse.json({ ok: true }); // honeypot

  if (body.kind === "booking") {
    const v = validateBooking({ ...body, payOption: "later" });
    if (!v.ok) return NextResponse.json({ error: v.error }, { status: 400 });
    const q = await quoteBooking(v.data);
    const id = newBookingId();
    const rows = bookingRows(id, v.data, q, `Pay to driver — ${inr(q.fare.total)}`);
    await Promise.all([
      sendMail({
        to: ADMIN_EMAIL,
        subject: `🚖 New booking ${id} (pay to driver) — ${v.data.name}`,
        html: emailHtml("New booking request", "A customer has requested a cab and will pay the driver. Please call to confirm.", rows),
        replyTo: v.data.email,
      }),
      sendMail({
        to: v.data.email,
        subject: `We've received your booking ${id}`,
        html: emailHtml(
          "Booking received",
          `Hi ${v.data.name}, thanks for booking with RVS Tours and Travels. Our team will call you shortly to confirm your cab.`,
          rows,
        ),
      }),
    ]);
    return NextResponse.json({ ok: true, bookingId: id, total: q.fare.total });
  }

  const s = (k: string, max = 500) => (typeof body[k] === "string" ? (body[k] as string).trim().slice(0, max) : "");
  const kind = body.kind === "corporate" ? "corporate" : "contact";
  const name = s("name", 80);
  const phone = cleanPhone(s("phone", 20));
  const email = s("email", 120);
  if (name.length < 2) return NextResponse.json({ error: "Please enter your name" }, { status: 400 });
  if (!validPhone(phone)) return NextResponse.json({ error: "Please enter a valid 10-digit mobile number" }, { status: 400 });
  if (email && !validEmail(email)) return NextResponse.json({ error: "Please enter a valid email" }, { status: 400 });

  const rows: [string, string][] = [
    ["Name", name],
    ["Mobile", phone],
    ["Email", email || "—"],
    ...(kind === "corporate"
      ? ([
          ["Company", s("company", 120) || "—"],
          ["Employees to transport", s("employees", 40) || "—"],
          ["Office location", s("location", 160) || "—"],
        ] as [string, string][])
      : ([["Service", s("service", 80) || "—"]] as [string, string][])),
    ["Message", s("message", 2000) || "—"],
  ];
  const sent = await sendMail({
    to: ADMIN_EMAIL,
    subject: kind === "corporate" ? `🏢 Corporate enquiry — ${s("company", 80) || name}` : `📩 Website enquiry — ${name}`,
    html: emailHtml(kind === "corporate" ? "Corporate transport enquiry" : "New website enquiry", "Submitted from the website.", rows),
    replyTo: email || undefined,
  });
  return NextResponse.json({ ok: true, emailed: sent });
}
