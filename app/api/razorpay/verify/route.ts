import { NextResponse } from "next/server";
import { ADMIN_EMAIL, emailHtml, razorpayKeys, sendMail, verifyRazorpaySignature } from "@/lib/server";
import { inr } from "@/lib/pricing";

export const runtime = "nodejs";

// Verifies the Razorpay signature, reads the booking from the order notes and emails admin + customer.
export async function POST(req: Request) {
  const keys = razorpayKeys();
  if (!keys) return NextResponse.json({ error: "Payments not configured" }, { status: 503 });

  const body = await req.json().catch(() => ({}));
  const { razorpay_order_id: orderId, razorpay_payment_id: paymentId, razorpay_signature: signature } = body || {};
  if (!orderId || !paymentId || !verifyRazorpaySignature(orderId, paymentId, signature, keys.secret))
    return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });

  const r = await fetch(`https://api.razorpay.com/v1/orders/${orderId}`, { headers: { Authorization: keys.auth } });
  const order = await r.json().catch(() => null);
  const n: Record<string, string> = order?.notes || {};
  const paid = inr((order?.amount_paid || order?.amount || 0) / 100);
  const total = Number(n.fare_total || 0);
  const balance = Math.max(0, total - (order?.amount_paid || order?.amount || 0) / 100);

  const rows: [string, string][] = [
    ["Booking ID", n.booking_id || order?.receipt || "—"],
    ["Trip", n.trip],
    ["Vehicle", n.vehicle],
    ["Pickup", n.pickup],
    ["Drop", n.drop],
    ["Pickup date & time", n.when],
    ["Route distance", n.km && n.km !== "0" ? `${n.km} km` : "—"],
    ["Estimated fare (incl. GST)", inr(total)],
    ["Paid online", `${paid} (Razorpay ${paymentId})`],
    ["Balance to driver", inr(balance)],
    ["Customer", n.name],
    ["Mobile", n.phone],
    ["Email", n.email],
    ["Notes", n.notes],
  ];

  await Promise.all([
    sendMail({
      to: ADMIN_EMAIL,
      subject: `✅ Paid booking ${n.booking_id} — ${n.trip} — ${n.name}`,
      html: emailHtml("New paid booking", "A customer has booked and paid online. Please assign a vehicle and driver.", rows),
      replyTo: n.email,
    }),
    n.email
      ? sendMail({
          to: n.email,
          subject: `Your RVS booking ${n.booking_id} is confirmed`,
          html: emailHtml(
            "Booking confirmed",
            `Hi ${n.name}, thank you for choosing RVS Tours and Travels. Your payment was received. Driver and vehicle details will be shared with you before pickup.`,
            rows,
          ),
        })
      : Promise.resolve(false),
  ]);

  return NextResponse.json({ ok: true, bookingId: n.booking_id || order?.receipt, paid: (order?.amount_paid || order?.amount || 0) / 100, balance });
}
