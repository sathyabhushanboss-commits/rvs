import type { Metadata } from "next";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import BookingFlow from "@/components/booking-flow";

export const metadata: Metadata = {
  title: "Book a Cab Online — Live Map & Instant Fares",
  description:
    "Book outstation cabs, airport taxis and local hourly packages in Bangalore. Set pickup on the live map, compare fares for every vehicle and pay securely with Razorpay.",
  alternates: { canonical: "/book" },
};

export default function BookPage() {
  return (
    <Suspense
      fallback={
        <div className="grid min-h-[70vh] place-items-center bg-slate-50">
          <Loader2 className="size-8 animate-spin text-brand" />
        </div>
      }
    >
      <BookingFlow />
    </Suspense>
  );
}
