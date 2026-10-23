import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { ContactCTA, PageHero, Reveal, ServiceIcon, WhatsAppIcon } from "@/components/ui";
import { SERVICES, waLink } from "@/lib/data";

export const metadata: Metadata = {
  title: "Services — Airport, Outstation, Corporate & Luxury Cabs",
  description:
    "Corporate employee transportation, airport transfers, local & outstation travel, executive transportation, premium & luxury vehicles and corporate travel solutions in Bangalore.",
  alternates: { canonical: "/services" },
};

const bookHref: Record<string, string> = {
  "airport-transfers": "/book?type=airport",
  "local-outstation": "/book?type=outstation",
  "luxury-vehicles": "/book?veh=sclass",
  "executive-transportation": "/book?type=local&veh=eclass",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero eyebrow="Our services" title={<>Every kind of journey, <span className="text-red-400">handled</span>.</>} desc="Six service lines, one standard of reliability. Book online, on call or on WhatsApp.">
        <div className="flex flex-wrap gap-2">
          {SERVICES.map((s) => (
            <a key={s.id} href={`#${s.id}`} className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/15">
              {s.title}
            </a>
          ))}
        </div>
      </PageHero>

      <div className="mx-auto max-w-7xl space-y-6 px-4 py-20">
        {SERVICES.map((s, i) => (
          <Reveal key={s.id}>
            <article id={s.id} className="grid scroll-mt-32 overflow-hidden rounded-[2rem] border border-slate-200 bg-white md:grid-cols-[0.9fr_1.1fr]">
              <div className={`relative flex flex-col justify-between p-8 md:p-10 ${i % 2 === 0 ? "bg-brand-deep text-white" : "bg-accent text-white"}`}>
                <div className="stripes absolute inset-0 text-white/[0.06]" />
                <div className="relative">
                  <span className="text-sm font-bold text-white/50">0{i + 1}</span>
                  <span className="mt-4 grid size-16 place-items-center rounded-2xl bg-white/10"><ServiceIcon name={s.icon} className="size-8" /></span>
                  <h2 className="mt-6 text-3xl font-extrabold">{s.title}</h2>
                </div>
                <p className="relative mt-6 text-white/75">{s.short}</p>
              </div>
              <div className="p-8 md:p-10">
                <p className="text-lg leading-8 text-slate-600">{s.desc}</p>
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {s.points.map((p) => (
                    <li key={p} className="flex items-start gap-2.5 font-medium text-ink">
                      <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-700"><Check className="size-3.5" strokeWidth={3} /></span>
                      {p}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href={s.id === "employee-transportation" || s.id === "corporate-travel" ? "/corporate" : bookHref[s.id] ?? "/book"}
                    className="inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3 font-bold text-white transition hover:bg-brand-dark"
                  >
                    {s.id === "employee-transportation" || s.id === "corporate-travel" ? "Get a proposal" : "Book now"} <ArrowRight className="size-4" />
                  </Link>
                  <a
                    href={waLink(`Hi RVS Tours, I'm interested in ${s.title}.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-6 py-3 font-bold text-ink transition hover:border-[#25D366]"
                  >
                    <WhatsAppIcon className="size-4 text-[#25D366]" /> Enquire
                  </a>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      <ContactCTA />
    </>
  );
}
