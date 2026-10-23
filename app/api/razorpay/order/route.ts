import { NextResponse } from "next/server";
import { COMPANY } from "@/lib/data";
import { clientIp, newBookingId, quoteBooking, razorpayKeys, rateLimited, tripLabel, validateBooking } from "@/lib/server";
import { slotLabel } from "@/lib/pricing";

export const runtime = "nodejs";

// Creates a Razorpay order for the advance / full fare.
// The amount is ALWAYS recomputed on the server — the browser's figure is never trusted.
export async function POST(req: Request) {
  if (rateLimited(`order:${clientIp(req)}`, 15)) return NextResponse.json({ error: "Too many attempts. Please try again shortly." }, { status: 429 });

  const v = validateBooking(await req.json().catch(() => null));
  if (!v.ok) return NextResponse.json({ error: v.error }, { status: 400 });
  const d = v.data;
  if (d.payOption === "later") return NextResponse.json({ error: "Pay-later bookings don't need an online payment" }, { status: 400 });

  const keys = razorpayKeys();
  if (!keys)
    return NextResponse.json(
      { error: `Online payment is being set up. Please choose "Pay to driver" or call ${COMPANY.phoneDisplay}.` },
      { status: 503 },
    );

  const q = await quoteBooking(d);
  const bookingId = newBookingId();
  const cut = (s: string) => s.slice(0, 250);

  const res = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: { Authorization: keys.auth, "Content-Type": "application/json" },
    body: JSON.stringify({
      amount: q.payable * 100,
      currency: "INR",
      receipt: bookingId,
      notes: {
        booking_id: bookingId,
        trip: tripLabel(d),
        vehicle: q.vehicle.name,
        pickup: cut(d.pickup.label),
        drop: cut(d.drop?.label || "—"),
        when: `${d.date} ${slotLabel(d.time)}${d.returnDate ? ` → return ${d.returnDate}` : ""}`,
        km: String(q.km),
        fare_total: String(q.fare.total),
        pay_option: d.payOption,
        name: d.name,
        phone: d.phone,
        email: d.email,
        notes: cut(d.notes || "—"),
      },
    }),
  });
  const order = await res.json().catch(() => null);
  if (!res.ok || !order?.id) {
    console.error("[razorpay] order failed", order);
    return NextResponse.json({ error: "Could not start payment. Please try again." }, { status: 502 });
  }

  return NextResponse.json({
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    keyId: keys.id,
    bookingId,
    total: q.fare.total,
  });
}
