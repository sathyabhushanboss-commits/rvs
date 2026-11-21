import type { Metadata } from "next";
import { BarChart3, CalendarClock, Car, FileText, Headset, MapPinned, ShieldCheck, UserCheck } from "lucide-react";
import { EnquiryForm, PageHero, Reveal, SectionHeading } from "@/components/ui";
import { COMPANY, mailLink, telLink } from "@/lib/data";

export const metadata: Metadata = {
  title: "Corporate Employee Transportation in Bangalore",
  description:
    "Shift-based employee transportation for companies in Bangalore — dedicated vehicles, professional drivers, night-shift safety, monthly GST billing and trip reports. Request a proposal.",
  alternates: { canonical: "/corporate" },
};

const FEATURES = [
  { icon: CalendarClock, title: "Shift & roster planning", text: "Pick-up and drop schedules aligned to every shift, updated as your rosters change." },
  { icon: MapPinned, title: "Optimised routing", text: "Routes planned to cut travel time and keep cab utilisation high." },
  { icon: Car, title: "Dedicated fleet", text: "Sedans, MUVs, Innovas, Urbanias and Tempo Travellers assigned to your programme." },
  { icon: UserCheck, title: "Professional drivers", text: "Verified, trained and in uniform — the same familiar faces on your routes." },
  { icon: ShieldCheck, title: "Night-shift safety", text: "Safety protocols for late-night and early-morning trips, especially for women employees." },
  { icon: Headset, title: "24×7 command support", text: "A team on call to handle delays, changes and emergencies in real time." },
  { icon: FileText, title: "Monthly GST billing", text: "One consolidated, GST-compliant invoice with trip-level details." },
  { icon: BarChart3, title: "Reports & MIS", text: "Trip, attendance and utilisation reports to keep finance and admin in sync." },
];

const PROCESS = [
  { title: "Understand", text: "We study your locations, shifts and headcount." },
  { title: "Plan", text: "Routes, vehicle mix and a clear commercial proposal." },
  { title: "Launch", text: "Driver briefings, pilot run and go-live with your teams." },
  { title: "Improve", text: "Monthly reviews to keep service sharp and costs efficient." },
];

export default function CorporatePage() {
  return (
    <>
      <PageHero
        eyebrow="For businesses"
        title={<>Employee transportation, <span className="text-red-400">done right</span>.</>}
        desc="We support corporate clients with their daily employee commute — reliable vehicles, professional drivers and flexible transportation solutions."
      >
        <div className="flex flex-wrap gap-3">
          <a href="#proposal" className="rounded-xl bg-accent px-6 py-3.5 font-bold text-white transition hover:bg-accent-dark">Request a proposal</a>
          <a href={telLink} className="rounded-xl border border-white/25 px-6 py-3.5 font-bold text-white transition hover:bg-white/10">Call {COMPANY.phoneDisplay}</a>
        </div>
      </PageHero>

      <section className="mx-auto max-w-7xl px-4 py-20">
        <SectionHeading eyebrow="What you get" title="Everything a corporate commute programme needs" />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={(i % 4) * 0.05}>
              <div className="h-full rounded-2xl border border-slate-200 p-6 transition hover:border-brand/40">
                <f.icon className="size-7 text-brand" strokeWidth={1.75} />
                <h3 className="mt-5 font-bold text-ink">{f.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{f.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-brand-deep py-20 text-white">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHeading light center eyebrow="How we onboard" title="Live in four clear steps" />
          <div className="mt-12 grid gap-5 md:grid-cols-4">
            {PROCESS.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08}>
                <div className="h-full border-t-2 border-white/20 pt-5">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-300">Step {i + 1}</p>
                  <h3 className="mt-2 text-lg font-bold">{p.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/65">{p.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="proposal" className="mx-auto grid max-w-7xl scroll-mt-28 gap-12 px-4 py-20 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <SectionHeading eyebrow="Get started" title="Tell us about your commute needs" desc="Share a few details and we'll send a tailored proposal — usually within one working day." />
          <Reveal className="mt-8 space-y-3 text-slate-600">
            <p>Prefer to talk?</p>
            <a href={telLink} className="block text-2xl font-extrabold text-brand">{COMPANY.phoneDisplay}</a>
            <a href={mailLink("Corporate transport proposal")} className="block font-semibold text-ink">{COMPANY.email}</a>
          </Reveal>
        </div>
        <Reveal delay={0.1} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-brand/5 md:p-8">
          <EnquiryForm kind="corporate" />
        </Reveal>
      </section>
    </>
  );
}
