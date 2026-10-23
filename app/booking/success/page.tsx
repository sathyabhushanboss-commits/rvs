"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, Phone } from "lucide-react";
import { COMPANY, telLink, waLink } from "@/lib/data";
import { inr } from "@/lib/pricing";
import { WhatsAppIcon } from "@/components/ui";

function Success() {
  const sp = useSearchParams();
  const id = sp.get("id") || "—";
  const total = Number(sp.get("total") || 0);
  const paid = Number(sp.get("paid") || 0);
  const later = sp.get("pay") === "later";
  const balance = Math.max(0, total - paid);

  return (
    <section className="relative overflow-hidden bg-slate-50 px-4 py-16 md:py-24">
      <div className="stripes stripes-fade absolute inset-x-0 top-0 h-40 text-brand/[0.06]" />
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="relative mx-auto max-w-lg rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-2xl shadow-brand/10 md:p-10"
      >
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.15 }} className="mx-auto grid size-20 place-items-center rounded-full bg-emerald-50">
          <CheckCircle2 className="size-11 text-emerald-500" />
        </motion.div>
        <h1 className="mt-5 text-3xl font-extrabold text-ink">{later ? "Booking received!" : "Booking confirmed!"}</h1>
        <p className="mt-2 text-slate-600">
          {later
            ? "Our team will call you shortly to confirm your cab. A copy has been sent to your email."
            : "Payment received. Driver and vehicle details will be shared before pickup."}
        </p>
        <div className="mt-6 rounded-2xl bg-slate-50 p-5 text-left text-sm">
          <div className="flex justify-between py-1.5"><span className="text-slate-500">Booking ID</span><span className="font-bold text-ink">{id}</span></div>
          {total > 0 && <div className="flex justify-between py-1.5"><span className="text-slate-500">Estimated fare</span><span className="font-semibold text-ink">{inr(total)}</span></div>}
          {paid > 0 && <div className="flex justify-between py-1.5"><span className="text-slate-500">Paid online</span><span className="font-semibold text-emerald-600">{inr(paid)}</span></div>}
          {total > 0 && <div className="flex justify-between border-t border-slate-200 pt-2.5"><span className="text-slate-500">Balance to driver</span><span className="font-bold text-ink">{inr(later ? total : balance)}</span></div>}
        </div>
        <p className="mt-4 text-xs text-slate-500">Tolls, parking and permits (if any) are paid as actuals during the trip.</p>
        <div className="mt-6 grid gap-2 sm:grid-cols-2">
          <a href={waLink(`Hi RVS Tours, sharing my booking ID ${id}.`)} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3 font-bold text-white">
            <WhatsAppIcon className="size-4" /> WhatsApp us
          </a>
          <a href={telLink} className="flex items-center justify-center gap-2 rounded-xl bg-brand py-3 font-bold text-white">
            <Phone className="size-4" /> {COMPANY.phoneDisplay}
          </a>
        </div>
        <Link href="/" className="mt-5 inline-block text-sm font-semibold text-brand">Back to home</Link>
      </motion.div>
    </section>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh]" />}>
      <Success />
    </Suspense>
  );
}
