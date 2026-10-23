import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { EnquiryForm, PageHero, Reveal, WhatsAppIcon } from "@/components/ui";
import { COMPANY, mailLink, telLink, waLink } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contact Us — Call, WhatsApp or Email",
  description: `Contact ${COMPANY.name}: call or WhatsApp ${COMPANY.phoneDisplay}, email ${COMPANY.email}. 24×7 cab bookings in Bangalore.`,
  alternates: { canonical: "/contact" },
};

const CARDS = [
  { icon: Phone, title: "Call us", value: COMPANY.phoneDisplay, href: telLink, note: "24×7 bookings & support", tone: "bg-brand text-white" },
  { icon: WhatsAppIcon, title: "WhatsApp", value: COMPANY.phoneDisplay, href: waLink("Hi RVS Tours, I'd like to book a cab."), note: "Quick replies, share location", tone: "bg-[#25D366] text-white", external: true },
  { icon: Mail, title: "Email", value: COMPANY.email, href: mailLink("Enquiry from website"), note: "Corporate & billing queries", tone: "bg-accent text-white" },
];

export default function ContactPage() {
  return (
    <>
      <PageHero eyebrow="Contact" title={<>Talk to a real person, <span className="text-red-400">any hour</span>.</>} desc="Call, WhatsApp or email — or send us a message and we'll get right back to you." />

      <section className="relative z-10 mx-auto -mt-10 grid max-w-7xl gap-4 px-4 md:grid-cols-3">
        {CARDS.map((c, i) => (
          <Reveal key={c.title} delay={i * 0.06}>
            <a href={c.href} target={c.external ? "_blank" : undefined} rel={c.external ? "noopener noreferrer" : undefined} className="group flex h-full items-center gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-brand/5 transition hover:-translate-y-1">
              <span className={`grid size-14 shrink-0 place-items-center rounded-2xl ${c.tone}`}><c.icon className="size-6" /></span>
              <div className="min-w-0">
                <p className="text-sm text-slate-500">{c.title}</p>
                <p className="truncate text-lg font-extrabold text-ink">{c.value}</p>
                <p className="text-xs text-slate-500">{c.note}</p>
              </div>
            </a>
          </Reveal>
        ))}
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-20 lg:grid-cols-2">
        <Reveal className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-8">
          <h2 className="text-2xl font-extrabold text-ink">Send us a message</h2>
          <p className="mt-1 mb-6 text-slate-500">We usually respond within minutes during the day.</p>
          <EnquiryForm kind="contact" />
        </Reveal>
        <Reveal delay={0.1} className="flex flex-col gap-4">
          <div className="overflow-hidden rounded-[2rem] border border-slate-200">
            <iframe
              title="RVS Tours service area — Bengaluru"
              src="https://www.openstreetmap.org/export/embed.html?bbox=77.40%2C12.82%2C77.80%2C13.14&layer=mapnik"
              className="h-[340px] w-full"
              loading="lazy"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-slate-50 p-6">
              <MapPin className="size-6 text-accent" />
              <p className="mt-3 font-bold text-ink">Service area</p>
              <p className="mt-1 text-sm text-slate-600">All of Bengaluru, plus outstation trips across Karnataka, Tamil Nadu, Kerala, Andhra Pradesh, Telangana and Goa.</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-6">
              <Clock className="size-6 text-accent" />
              <p className="mt-3 font-bold text-ink">Working hours</p>
              <p className="mt-1 text-sm text-slate-600">{COMPANY.hours}. Office: {COMPANY.address}.</p>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
