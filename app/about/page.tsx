import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock, Eye, HeartHandshake, MapPinned, ShieldCheck, Sofa, Target, Timer, Wrench } from "lucide-react";
import { ContactCTA, PageHero, Reveal, SectionHeading } from "@/components/ui";
import { COMPANY, VEHICLES } from "@/lib/data";

export const metadata: Metadata = {
  title: "About Us",
  description: `${COMPANY.name} is a Bengaluru-based premium transport company offering chauffeur-driven cabs, luxury cars and corporate employee transportation.`,
  alternates: { canonical: "/about" },
};

const VALUES = [
  { icon: Timer, title: "Punctuality", text: "We plan buffers into every trip so your driver is there before you are." },
  { icon: ShieldCheck, title: "Safety first", text: "Verified chauffeurs, maintained vehicles and night-travel safety protocols." },
  { icon: HeartHandshake, title: "Honest pricing", text: "Clear fares, no surprises — tolls and permits shown as actuals." },
  { icon: Sofa, title: "Comfort", text: "Clean, sanitised cabins and courteous service on every ride." },
];

const WHY = [
  { icon: Clock, title: "Always reachable", text: `Our team answers on ${COMPANY.phoneDisplay} and WhatsApp, day and night.` },
  { icon: Wrench, title: "Well-kept fleet", text: "Regular servicing and checks keep vehicles reliable on city roads and highways." },
  { icon: MapPinned, title: "Local expertise", text: "Drivers who know Bengaluru's roads, shortcuts and the best routes out of the city." },
  { icon: Target, title: "Built for business", text: "GST invoices, monthly billing, dedicated account management for corporates." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="About RVS" title={<>Moving Bengaluru with <span className="text-red-400">care</span> and <span className="text-red-400">precision</span>.</>} desc={`${COMPANY.name} is a premium transportation company serving individuals, families and corporates across Bengaluru and South India.`} />

      <section className="mx-auto grid max-w-7xl items-center gap-14 px-4 py-20 lg:grid-cols-2">
        <div>
          <SectionHeading eyebrow="Who we are" title="More than a cab service" />
          <Reveal className="mt-6 space-y-4 leading-8 text-slate-600">
            <p>
              We started with a simple idea: ground transport in a busy city should feel effortless. That means a car that arrives on time, a driver who knows the way and treats you with respect, and a fare you understand before you set off.
            </p>
            <p>
              Today our premium fleet spans {VEHICLES.length} vehicle classes — from economical sedans and MUVs to the Toyota Innova Crysta and Hycross, Force Urbania, Tempo Travellers, Mercedes-Benz E-Class and S-Class, and the Toyota Vellfire.
            </p>
            <p>
              Alongside individual bookings, we provide employee transportation to corporate clients — supporting their daily commute requirements with reliable vehicles, professional drivers and flexible transportation solutions.
            </p>
          </Reveal>
        </div>
        <Reveal delay={0.1}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-brand-deep p-8 text-white sm:row-span-2">
              <Eye className="size-8 text-red-300" />
              <h3 className="mt-5 text-2xl font-extrabold">Our vision</h3>
              <p className="mt-3 leading-7 text-white/70">To be Bengaluru&apos;s most trusted name in premium and corporate ground transportation — known for reliability, safety and service.</p>
            </div>
            <div className="rounded-3xl border border-slate-200 p-8">
              <Target className="size-8 text-accent" />
              <h3 className="mt-5 text-xl font-extrabold text-ink">Our mission</h3>
              <p className="mt-3 leading-7 text-slate-600">Deliver safe, punctual, comfortable journeys at fair prices, every single time.</p>
            </div>
            <div className="rounded-3xl bg-accent p-8 text-white">
              <p className="text-4xl font-extrabold">24×7</p>
              <p className="mt-2 text-white/85">Bookings, dispatch and on-trip support, all year round.</p>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHeading center eyebrow="Our values" title="What every ride stands on" />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.06}>
                <div className="h-full rounded-2xl bg-white p-7 ring-1 ring-slate-200">
                  <v.icon className="size-7 text-accent" strokeWidth={1.75} />
                  <h3 className="mt-5 text-lg font-bold text-ink">{v.title}</h3>
                  <p className="mt-2 leading-7 text-slate-600">{v.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20">
        <SectionHeading eyebrow="Why choose us" title="The RVS difference" />
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {WHY.map((w, i) => (
            <Reveal key={w.title} delay={i * 0.06}>
              <div className="flex gap-4 border-t-2 border-slate-200 py-6">
                <w.icon className="mt-0.5 size-6 shrink-0 text-accent" strokeWidth={1.75} />
                <div>
                  <h3 className="text-lg font-bold text-ink">{w.title}</h3>
                  <p className="mt-1.5 leading-7 text-slate-600">{w.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-10">
          <Link href="/fleet" className="inline-flex items-center gap-2 font-bold text-brand">Meet the fleet <ArrowRight className="size-4" /></Link>
        </Reveal>
      </section>

      <ContactCTA />
    </>
  );
}
