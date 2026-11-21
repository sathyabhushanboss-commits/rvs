import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CalendarCheck,
  Car,
  Clock,
  CreditCard,
  Headphones,
  Mail,
  MapPin,
  MapPinned,
  Phone,
  Receipt,
  Route,
  ShieldCheck,
  UserCheck,
  Users,
} from "lucide-react";
import BookingWidget from "@/components/booking-widget";
import { ContactCTA, FAQ, Reveal, SectionHeading, ServiceIcon, VehicleImage, WhatsAppIcon } from "@/components/ui";
import { COMPANY, FAQS, POPULAR_ROUTES, SERVICES, VEHICLES, findPlace, mailLink, telLink, waLink } from "@/lib/data";
import { computeFare, inr } from "@/lib/pricing";

const PROMISES = [
  { icon: Clock, title: "24×7, 365 days", text: "Bookings and on-trip support round the clock." },
  { icon: UserCheck, title: "Verified chauffeurs", text: "Background-checked, trained, courteous." },
  { icon: Receipt, title: "Transparent fares", text: "See the full fare before you book. GST invoice." },
  { icon: ShieldCheck, title: "Clean, well-kept fleet", text: "Sanitised, serviced and on-time vehicles." },
];

const GLIMPSES = [
  {
    href: "/about",
    title: "About RVS",
    text: "A Bengaluru transport company built on punctuality, safety and service you can count on — for families and enterprises alike.",
    icon: BadgeCheck,
    chips: ["Our story", "Values", "Why RVS"],
  },
  {
    href: "/services",
    title: "Services",
    text: "Six ways we move you — from airport runs to daily employee commute.",
    icon: Route,
    chips: ["Airport", "Outstation", "Corporate"],
  },
  {
    href: "/fleet",
    title: "Premium Fleet",
    text: "Sedans to S-Class — nine vehicle classes for every trip.",
    icon: Car,
    chips: ["Innova Crysta", "Vellfire", "Urbania"],
  },
  {
    href: "/corporate",
    title: "Corporate",
    text: "Employee transportation programmes with rosters, routing and monthly billing.",
    icon: Building2,
    chips: ["Shift routing", "Night safety", "MIS reports"],
  },
  {
    href: "/contact",
    title: "Contact",
    text: "Call, WhatsApp or email — a real person answers, any hour.",
    icon: Headphones,
    chips: [COMPANY.phoneDisplay, "WhatsApp", "Email"],
  },
];

const STEPS = [
  { icon: MapPinned, title: "Set your trip", text: "Pick trip type, then drop your exact pickup on the live map — or use your current location." },
  { icon: Car, title: "Compare & choose", text: "See the full fare for every vehicle instantly, with distance and travel time." },
  { icon: CreditCard, title: "Confirm & ride", text: "Pay a small advance via Razorpay, pay in full, or pay the driver. Your chauffeur arrives on time." },
];

export default function Home() {
  const sedan = VEHICLES[0];
  const routes = POPULAR_ROUTES.map((r) => ({
    ...r,
    place: findPlace(r.to)!,
    from: computeFare({ type: "outstation", mode: "oneway", vehicle: sedan, km: r.km, days: 1 }).total,
  }));

  return (
    <>
      {/* ───────────── HERO ───────────── */}
      <section className="relative overflow-hidden bg-brand-deep text-white">
        <div className="stripes absolute inset-y-0 right-0 hidden w-1/2 text-white/[0.06] lg:block" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 pb-36 pt-12 md:pb-40 md:pt-20 lg:grid-cols-[1.15fr_1fr]">
          <Reveal>
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-red-300">
              <span className="h-0.5 w-6 bg-current" /> Bengaluru · Available 24×7
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-[64px]">
              Premium cabs &amp; <span className="text-red-400">corporate transport</span>, on time — every time.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-white/70">
              Airport transfers, outstation trips, hourly city rides and daily employee commute — in Innova Crysta, Hycross, Vellfire, Mercedes-Benz, Urbania and more.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={telLink} className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3.5 font-bold text-brand-deep transition hover:bg-brand-50">
                <Phone className="size-4" /> {COMPANY.phoneDisplay}
              </a>
              <a
                href={waLink("Hi RVS Tours, I'd like to book a cab.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-5 py-3.5 font-bold text-white transition hover:brightness-95"
              >
                <WhatsAppIcon className="size-4" /> Book on WhatsApp
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.15} className="hidden lg:block">
            <div className="relative mx-auto w-full max-w-md">
              <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-white/10 to-transparent blur-sm" />
              <div className="relative rounded-[2rem] border border-white/15 bg-white/[0.07] p-6 backdrop-blur-xl">
                <div className="flex items-center justify-between text-xs uppercase tracking-widest text-white/50">
                  <span>Sample trip</span>
                  <span className="rounded-full bg-emerald-400/15 px-2.5 py-1 font-bold text-emerald-300">Instant fare</span>
                </div>
                <div className="mt-5 space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="mt-1 grid size-7 place-items-center rounded-full bg-emerald-500 text-xs font-extrabold">A</span>
                    <div>
                      <p className="text-xs text-white/50">Pickup</p>
                      <p className="font-semibold">Koramangala, Bengaluru</p>
                    </div>
                  </div>
                  <div className="ml-3.5 h-6 border-l-2 border-dashed border-white/25" />
                  <div className="flex items-start gap-3">
                    <span className="mt-1 grid size-7 place-items-center rounded-full bg-accent text-xs font-extrabold">B</span>
                    <div>
                      <p className="text-xs text-white/50">Drop</p>
                      <p className="font-semibold">Mysuru Palace, Mysuru</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex items-center gap-4 rounded-2xl bg-white p-3 text-ink">
                  <VehicleImage vehicle={VEHICLES[2]} className="h-16 w-24 shrink-0 rounded-xl" />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold">Toyota Innova Crysta</p>
                    <p className="text-xs text-slate-500">7 + 1 seats · 148 km · ~3.5 hrs</p>
                  </div>
                  <p className="text-right text-lg font-extrabold">
                    {inr(computeFare({ type: "outstation", mode: "oneway", vehicle: VEHICLES[2], km: 148, days: 1 }).total)}
                  </p>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[11px] text-white/60">
                  <span className="rounded-xl bg-white/5 py-2">Live map</span>
                  <span className="rounded-xl bg-white/5 py-2">Razorpay</span>
                  <span className="rounded-xl bg-white/5 py-2">GST invoice</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────────── BOOKING WIDGET ───────────── */}
      <div id="book" className="relative z-20 mx-auto -mt-28 max-w-6xl scroll-mt-28 px-3 md:-mt-32 md:px-4">
        <BookingWidget />
      </div>

      {/* ───────────── PROMISES ───────────── */}
      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-4">
          {PROMISES.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.06}>
              <div className="h-full border-t-2 border-slate-200 pt-5">
                <p className="flex items-center gap-2 font-bold text-ink">
                  <p.icon className="size-5 shrink-0 text-accent" strokeWidth={1.75} /> {p.title}
                </p>
                <p className="mt-1.5 text-sm leading-6 text-slate-500">{p.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ───────────── ALL PAGES GLIMPSE ───────────── */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHeading eyebrow="Explore RVS" title="Everything we do, at a glance" desc="Take a quick look around — every section opens to a full page with details." />
          <div className="mt-12 grid gap-4 md:grid-cols-6">
            {GLIMPSES.map((g, i) => (
              <Reveal key={g.href} delay={i * 0.06} className={i < 2 ? "md:col-span-3" : "md:col-span-2"}>
                <Link
                  href={g.href}
                  className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border p-6 transition duration-300 hover:-translate-y-1 md:p-7 ${
                    i === 0
                      ? "border-transparent bg-brand-deep text-white hover:shadow-2xl hover:shadow-brand/30"
                      : "border-slate-200 bg-white hover:border-brand/30 hover:shadow-xl hover:shadow-brand/10"
                  }`}
                >
                  {i === 0 && <div className="stripes absolute inset-y-0 right-0 w-1/2 text-white/[0.06]" />}
                  <h3 className="relative flex items-center gap-2.5 text-2xl font-extrabold">
                    <g.icon className={`size-6 shrink-0 ${i === 0 ? "text-red-300" : "text-accent"}`} strokeWidth={1.75} /> {g.title}
                  </h3>
                  <p className={`relative mt-2 flex-1 leading-7 ${i === 0 ? "text-white/70" : "text-slate-600"}`}>{g.text}</p>
                  <div className="relative mt-5 flex flex-wrap gap-1.5">
                    {g.chips.map((c) => (
                      <span key={c} className={`rounded-full px-3 py-1 text-xs font-semibold ${i === 0 ? "bg-white/10 text-white/80" : "bg-slate-100 text-slate-600"}`}>
                        {c}
                      </span>
                    ))}
                  </div>
                  <span className={`relative mt-6 inline-flex items-center gap-1.5 text-sm font-bold ${i === 0 ? "text-red-300" : "text-brand"}`}>
                    Open page <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── SERVICES ───────────── */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading eyebrow="Our services" title="Built for every journey you make" desc="From a 5 AM airport drop to a 500-employee shift commute." />
          <Reveal>
            <Link href="/services" className="inline-flex items-center gap-1.5 font-bold text-brand">
              All services <ArrowRight className="size-4" />
            </Link>
          </Reveal>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => (
            <Reveal key={s.id} delay={(i % 3) * 0.07}>
              <Link
                href={`/services#${s.id}`}
                className="group flex h-full flex-col rounded-2xl border border-slate-200 border-t-brand bg-white p-7 transition [border-top-width:3px] hover:border-t-accent hover:shadow-lg hover:shadow-slate-900/5"
              >
                <ServiceIcon name={s.icon} className="size-8 text-brand transition group-hover:text-accent" />
                <h3 className="mt-5 text-xl font-bold text-ink">{s.title}</h3>
                <p className="mt-2 flex-1 leading-7 text-slate-600">{s.short}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-brand">
                  Learn more <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ───────────── FLEET ───────────── */}
      <section className="overflow-hidden bg-brand-deep py-20 text-white">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading light eyebrow="Premium fleet" title="Choose your ride" desc="Sedans and MUVs for everyday travel, vans for groups, and luxury for the moments that matter." />
            <Reveal>
              <Link href="/fleet" className="inline-flex items-center gap-1.5 font-bold text-red-300">
                View full fleet <ArrowRight className="size-4" />
              </Link>
            </Reveal>
          </div>
        </div>
        <div className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 md:px-[max(1rem,calc((100vw-80rem)/2+1rem))]">
          {VEHICLES.map((v) => (
            <Link
              key={v.id}
              href={`/book?veh=${v.id}`}
              className="group w-[280px] shrink-0 snap-start overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] transition hover:border-white/25 hover:bg-white/[0.07] md:w-[300px]"
            >
              <div className="relative">
                <VehicleImage vehicle={v} className="aspect-[16/10]" />
                {v.tag && <span className="absolute left-3 top-3 rounded-full bg-accent px-3 py-1 text-[11px] font-bold uppercase tracking-wider">{v.tag}</span>}
              </div>
              <div className="p-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-red-300">{v.category}</p>
                <h3 className="mt-1 text-lg font-bold">{v.name}</h3>
                <div className="mt-3 flex items-center justify-between text-sm text-white/60">
                  <span className="flex items-center gap-1.5">
                    <Users className="size-4" /> {v.seats}
                  </span>
                  <span>
                    from <b className="text-white">₹{v.perKm}/km</b>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ───────────── POPULAR ROUTES ───────────── */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <SectionHeading eyebrow="Outstation from Bengaluru" title="Popular routes" desc="One-way fares for a sedan, including driver allowance and GST. Tolls and permits at actuals." />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {routes.map((r, i) => (
            <Reveal key={r.to} delay={(i % 4) * 0.05}>
              <Link
                href={`/book?type=outstation&mode=oneway&from=majestic&to=${r.to}`}
                className="group flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-brand/40 hover:shadow-lg"
              >
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-500">Bengaluru →</p>
                  <p className="truncate text-lg font-bold text-ink">{r.place.name}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {r.km} km · {r.hrs}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] text-slate-500">from</p>
                  <p className="text-lg font-extrabold text-accent">{inr(r.from)}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ───────────── CORPORATE BAND ───────────── */}
      <section className="px-4">
        <Reveal className="relative mx-auto grid max-w-7xl overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand to-brand-deep text-white lg:grid-cols-2">
          <div className="stripes absolute inset-0 text-white/[0.05]" />
          <div className="relative p-8 md:p-14">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-red-300">For businesses</span>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight md:text-4xl">Employee transportation your teams can rely on.</h2>
            <p className="mt-4 leading-7 text-white/70">
              We support corporate clients with their daily employee commute — reliable vehicles, professional drivers and flexible transportation solutions that scale with your shifts.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/corporate" className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3.5 font-bold transition hover:bg-accent-dark">
                Request a proposal <ArrowRight className="size-4" />
              </Link>
              <a href={mailLink("Corporate transport enquiry")} className="inline-flex items-center gap-2 rounded-xl border border-white/25 px-6 py-3.5 font-bold transition hover:bg-white/10">
                <Mail className="size-4" /> Email us
              </a>
            </div>
          </div>
          <div className="relative grid grid-cols-2 gap-3 p-8 pt-0 md:p-14 lg:pl-0">
            {["Shift-wise routing & rosters", "Dedicated vehicles & drivers", "Night-shift safety protocols", "Backup vehicles on standby", "Monthly GST billing", "Trip & attendance reports"].map((t) => (
              <div key={t} className="flex items-start gap-2.5 rounded-2xl bg-white/[0.07] p-4 text-sm font-semibold">
                <BadgeCheck className="size-5 shrink-0 text-red-300" /> {t}
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ───────────── HOW IT WORKS ───────────── */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <SectionHeading eyebrow="How it works" title="Booked in three easy steps" />
        <div className="relative mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
          <div className="absolute left-5 right-[16%] top-5 hidden h-px bg-slate-200 md:block" />
          {STEPS.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.1} className="relative">
              <div>
                <span className="relative grid size-10 place-items-center rounded-full bg-brand font-display text-sm font-extrabold text-white ring-8 ring-white">{i + 1}</span>
                <h3 className="mt-5 flex items-center gap-2 text-xl font-bold text-ink">
                  <s.icon className="size-5 text-accent" strokeWidth={1.75} /> {s.title}
                </h3>
                <p className="mt-2 max-w-xs leading-7 text-slate-600">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-12">
          <Link href="/book" className="inline-flex items-center gap-2 rounded-xl bg-brand px-7 py-4 font-bold text-white shadow-lg shadow-brand/25 transition hover:bg-brand-dark">
            <CalendarCheck className="size-5" /> Start booking
          </Link>
        </Reveal>
      </section>

      {/* ───────────── ABOUT GLIMPSE ───────────── */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 lg:grid-cols-2">
          <Reveal>
            <div className="relative rounded-[2rem] bg-white p-8 shadow-xl shadow-brand/5 ring-1 ring-slate-200 md:p-10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.webp" alt={COMPANY.name} width={800} height={305} loading="lazy" decoding="async" className="mx-auto h-auto w-full max-w-sm" />
              <div className="mt-8 grid grid-cols-3 gap-3 text-center">
                {[
                  ["9", "Vehicle classes"],
                  ["24×7", "Support"],
                  ["6", "Service lines"],
                ].map(([n, l]) => (
                  <div key={l} className="rounded-2xl bg-slate-50 py-4">
                    <p className="text-2xl font-extrabold text-brand">{n}</p>
                    <p className="text-xs text-slate-500">{l}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
          <div>
            <SectionHeading
              eyebrow="About us"
              title="A Bengaluru company that moves people with care"
              desc={`${COMPANY.name} provides premium chauffeur-driven transport for individuals, families and corporates — combining a well-maintained fleet, professional drivers and a team that's reachable any hour.`}
            />
            <Reveal className="mt-8 flex flex-wrap gap-3">
              <Link href="/about" className="inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3.5 font-bold text-white transition hover:bg-brand-dark">
                Read our story <ArrowRight className="size-4" />
              </Link>
              <Link href="/contact" className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-6 py-3.5 font-bold text-ink transition hover:border-brand">
                <MapPin className="size-4" /> Contact us
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ───────────── FAQ ───────────── */}
      <section className="mx-auto max-w-4xl px-4 py-20">
        <SectionHeading center eyebrow="FAQ" title="Questions, answered" />
        <Reveal className="mt-10">
          <FAQ items={FAQS} />
        </Reveal>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
            }),
          }}
        />
      </section>

      <ContactCTA />
    </>
  );
}
