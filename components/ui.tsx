"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Briefcase,
  Building2,
  Bus,
  Car,
  Check,
  ChevronDown,
  Clock,
  Crown,
  Loader2,
  Luggage,
  Mail,
  Map as MapIcon,
  MapPin,
  Menu,
  Phone,
  Plane,
  Send,
  Users,
  X,
} from "lucide-react";
import {
  COMPANY,
  NAV,
  POLICY_LINKS,
  SERVICES,
  VEHICLES,
  mailLink,
  telLink,
  waLink,
  type IconKey,
  type Vehicle,
  type VehicleCategory,
} from "@/lib/data";
import { inr } from "@/lib/pricing";

// ── Icons ────────────────────────────────────────────────────
export function WhatsAppIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

const ICONS = { building: Building2, plane: Plane, map: MapIcon, briefcase: Briefcase, crown: Crown, users: Users };
export function ServiceIcon({ name, className = "size-6" }: { name: IconKey; className?: string }) {
  const I = ICONS[name];
  return <I className={className} />;
}

// ── Motion helpers ───────────────────────────────────────────
export function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  desc,
  center = false,
  light = false,
}: {
  eyebrow: string;
  title: ReactNode;
  desc?: ReactNode;
  center?: boolean;
  light?: boolean;
}) {
  return (
    <Reveal className={`max-w-2xl ${center ? "mx-auto text-center" : ""}`}>
      <span className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] ${light ? "text-red-300" : "text-accent"}`}>
        <span className="h-0.5 w-6 rounded bg-current" /> {eyebrow}
      </span>
      <h2 className={`mt-3 text-3xl font-extrabold leading-tight md:text-4xl ${light ? "text-white" : "text-ink"}`}>{title}</h2>
      {desc && <p className={`mt-4 text-base leading-7 md:text-lg ${light ? "text-white/70" : "text-slate-600"}`}>{desc}</p>}
    </Reveal>
  );
}

export function PageHero({ eyebrow, title, desc, children }: { eyebrow: string; title: ReactNode; desc: ReactNode; children?: ReactNode }) {
  return (
    <section className="relative overflow-hidden bg-brand-deep text-white">
      <div className="stripes stripes-fade absolute inset-0 text-white/[0.06]" />
      <div className="absolute -right-32 -top-32 size-[420px] rounded-full bg-accent/25 blur-3xl" />
      <div className="absolute -bottom-40 -left-20 size-[380px] rounded-full bg-brand/60 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 py-16 md:py-24">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-red-200"
        >
          {eyebrow}
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="mt-5 max-w-3xl text-4xl font-extrabold leading-[1.08] md:text-6xl"
        >
          {title}
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }} className="mt-5 max-w-2xl text-lg text-white/70">
          {desc}
        </motion.p>
        {children && (
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }} className="mt-8">
            {children}
          </motion.div>
        )}
      </div>
    </section>
  );
}

// ── Logo ─────────────────────────────────────────────────────
export function Logo({ className = "h-10 md:h-12" }: { className?: string }) {
  const [failed, setFailed] = useState(false);
  return (
    <Link href="/" className="flex shrink-0 items-center" aria-label={`${COMPANY.name} — Home`}>
      {failed ? (
        <span className="font-display text-xl font-extrabold leading-none">
          <span className="text-accent">RVS</span> <span className="text-brand">Tours &amp; Travels</span>
        </span>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src="/logo.png" alt={COMPANY.name} width={1414} height={549} className={`${className} w-auto`} onError={() => setFailed(true)} />
      )}
    </Link>
  );
}

// ── Header ───────────────────────────────────────────────────
export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className={`sticky top-0 z-[1000] bg-white/95 backdrop-blur-md transition-shadow ${scrolled ? "shadow-[0_6px_30px_-12px_rgba(11,26,74,0.25)]" : ""}`}>
      <div className="hidden bg-brand-deep text-xs text-white/80 md:block">
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5">
              <Clock className="size-3.5 text-red-300" /> 24×7 bookings &amp; support
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="size-3.5 text-red-300" /> All over Bengaluru &amp; South India
            </span>
          </div>
          <div className="flex items-center gap-5">
            <a href={mailLink("Cab booking enquiry")} className="flex items-center gap-1.5 hover:text-white">
              <Mail className="size-3.5" /> {COMPANY.email}
            </a>
            <a href={telLink} className="flex items-center gap-1.5 font-semibold hover:text-white">
              <Phone className="size-3.5" /> {COMPANY.phoneDisplay}
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:h-[76px]">
        <Logo />
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`relative rounded-lg px-3.5 py-2 text-sm font-semibold transition ${isActive(n.href) ? "text-brand" : "text-slate-600 hover:text-brand"}`}
            >
              {n.label}
              {isActive(n.href) && <motion.span layoutId="nav-dot" className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-accent" />}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a
            href={telLink}
            className="hidden items-center gap-2 rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-semibold text-brand transition hover:border-brand xl:inline-flex"
          >
            <Phone className="size-4" /> Call
          </a>
          <a
            href={waLink("Hi RVS Tours, I'd like to book a cab.")}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 rounded-xl bg-[#25D366] px-3.5 py-2.5 text-sm font-semibold text-white transition hover:brightness-95 sm:inline-flex"
          >
            <WhatsAppIcon className="size-4" /> WhatsApp
          </a>
          <Link
            href="/book"
            className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-accent/25 transition hover:bg-accent-dark"
          >
            Book a Cab
          </Link>
          <button
            onClick={() => setOpen((v) => !v)}
            className="grid size-10 place-items-center rounded-xl border border-slate-200 text-brand lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-slate-100 bg-white lg:hidden"
          >
            <div className="mx-auto grid max-w-7xl gap-1 px-4 py-4">
              {NAV.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className={`rounded-xl px-4 py-3 font-semibold ${isActive(n.href) ? "bg-brand-50 text-brand" : "text-slate-700"}`}
                >
                  {n.label}
                </Link>
              ))}
              <div className="mt-3 grid grid-cols-2 gap-2">
                <a href={telLink} className="flex items-center justify-center gap-2 rounded-xl bg-brand py-3 font-semibold text-white">
                  <Phone className="size-4" /> Call now
                </a>
                <a
                  href={waLink("Hi RVS Tours, I'd like to book a cab.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3 font-semibold text-white"
                >
                  <WhatsAppIcon className="size-4" /> WhatsApp
                </a>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

// ── Footer ───────────────────────────────────────────────────
export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-brand-deep text-white/70">
      <div className="stripes stripes-fade absolute inset-x-0 top-0 h-24 text-white/[0.05]" />
      <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.2fr_1.2fr]">
          <div>
            <div className="inline-block rounded-2xl bg-white p-3">
              <Logo className="h-12" />
            </div>
            <p className="mt-5 max-w-sm text-sm leading-6">
              {COMPANY.name} — premium chauffeur-driven cabs, corporate employee transportation, airport transfers and outstation travel from Bengaluru.
            </p>
            <div className="mt-5 flex gap-2">
              <a href={telLink} aria-label="Call" className="grid size-10 place-items-center rounded-xl bg-white/10 transition hover:bg-white/20">
                <Phone className="size-4" />
              </a>
              <a href={waLink()} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="grid size-10 place-items-center rounded-xl bg-white/10 transition hover:bg-[#25D366]">
                <WhatsAppIcon className="size-4" />
              </a>
              <a href={mailLink()} aria-label="Email" className="grid size-10 place-items-center rounded-xl bg-white/10 transition hover:bg-white/20">
                <Mail className="size-4" />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-white">Company</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {NAV.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="hover:text-white">
                    {n.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/book" className="hover:text-white">
                  Book a Cab
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-white">Services</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {SERVICES.map((s) => (
                <li key={s.id}>
                  <Link href={`/services#${s.id}`} className="hover:text-white">
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-white">Policies</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {POLICY_LINKS.map((p) => (
                <li key={p.slug}>
                  <Link href={`/policies/${p.slug}`} className="hover:text-white">
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 space-y-2 text-sm">
              <a href={telLink} className="flex items-center gap-2 hover:text-white">
                <Phone className="size-4 text-red-300" /> {COMPANY.phoneDisplay}
              </a>
              <a href={mailLink()} className="flex items-center gap-2 break-all hover:text-white">
                <Mail className="size-4 shrink-0 text-red-300" /> {COMPANY.email}
              </a>
              <p className="flex items-center gap-2">
                <MapPin className="size-4 text-red-300" /> {COMPANY.address}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs md:flex-row">
          <p>
            © {new Date().getFullYear()} {COMPANY.name}. All rights reserved.
          </p>
          <p className="flex items-center gap-1.5">Secure payments by Razorpay · UPI · Cards · Net banking</p>
        </div>
      </div>
    </footer>
  );
}

// ── Floating WhatsApp + Call ─────────────────────────────────
export function FloatingContact() {
  const pathname = usePathname();
  const onBook = pathname.startsWith("/book");
  return (
    <div className={`fixed right-4 z-[1100] flex flex-col gap-3 ${onBook ? "bottom-28 lg:bottom-6" : "bottom-6"}`}>
      <motion.a
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.6, type: "spring" }}
        href={waLink("Hi RVS Tours, I'd like to book a cab.")}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="relative grid size-14 place-items-center rounded-full bg-[#25D366] text-white shadow-xl shadow-green-900/25 transition hover:scale-105"
      >
        <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-25" />
        <WhatsAppIcon className="relative size-7" />
      </motion.a>
      <motion.a
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.75, type: "spring" }}
        href={telLink}
        aria-label={`Call ${COMPANY.phoneDisplay}`}
        className="grid size-14 place-items-center rounded-full bg-brand text-white shadow-xl shadow-brand/30 transition hover:scale-105"
      >
        <Phone className="size-6" />
      </motion.a>
    </div>
  );
}

// ── Vehicle image with graceful fallback ─────────────────────
export function VehicleImage({ vehicle, className = "" }: { vehicle: Vehicle; className?: string }) {
  const [failed, setFailed] = useState(false);
  const ref = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  }, []);
  const Icon = vehicle.category === "Van" ? Bus : Car;
  const lux = vehicle.category === "Luxury";
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${lux ? "from-slate-900 via-slate-800 to-slate-700" : "from-brand via-brand-dark to-brand-deep"} ${className}`}>
      {!failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img ref={ref} src={`/fleet/${vehicle.id}.jpg`} alt={vehicle.name} loading="lazy" onError={() => setFailed(true)} className="absolute inset-0 size-full object-cover" />
      ) : (
        <>
          <div className={`stripes absolute inset-0 ${lux ? "text-amber-200/10" : "text-white/10"}`} />
          <div className="absolute inset-0 grid place-items-center">
            <Icon className={`size-16 ${lux ? "text-amber-200/90" : "text-white/90"}`} strokeWidth={1.2} />
          </div>
          <span className="absolute bottom-2.5 left-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/60">{vehicle.model}</span>
        </>
      )}
    </div>
  );
}

// ── Fleet grid with category filter ──────────────────────────
const CATS: ("All" | VehicleCategory)[] = ["All", "Sedan", "MUV", "Van", "Luxury"];

export function FleetGrid() {
  const [cat, setCat] = useState<(typeof CATS)[number]>("All");
  const list = cat === "All" ? VEHICLES : VEHICLES.filter((v) => v.category === cat);
  return (
    <div>
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        {CATS.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`shrink-0 rounded-full px-5 py-2 text-sm font-semibold transition ${cat === c ? "bg-brand text-white shadow-lg shadow-brand/20" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
          >
            {c === "Van" ? "Vans & Travellers" : c}
          </button>
        ))}
      </div>
      <motion.div layout className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {list.map((v) => (
            <motion.article
              layout
              key={v.id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="group overflow-hidden rounded-3xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand/10"
            >
              <div className="relative">
                <VehicleImage vehicle={v} className="aspect-[16/10]" />
                {v.tag && <span className="absolute left-3 top-3 rounded-full bg-accent px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">{v.tag}</span>}
              </div>
              <div className="p-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-accent">{v.category}</p>
                <h3 className="mt-1 text-xl font-bold text-ink">{v.name}</h3>
                <p className="text-sm text-slate-500">{v.model}</p>
                <p className="mt-3 text-sm leading-6 text-slate-600">{v.desc}</p>
                <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <Users className="size-4 text-brand" /> {v.seats}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Luggage className="size-4 text-brand" /> {v.bags} bags
                  </span>
                </div>
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {v.features.map((f) => (
                    <li key={f} className="rounded-md bg-brand-50 px-2 py-1 text-xs font-medium text-brand">
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-5 grid grid-cols-2 gap-3 rounded-2xl bg-slate-50 p-4 text-center">
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-slate-500">Outstation</p>
                    <p className="font-bold text-ink">₹{v.perKm}/km</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-slate-500">Local 8h/80km</p>
                    <p className="font-bold text-ink">{inr(v.local8h)}</p>
                  </div>
                </div>
                <div className="mt-5 flex gap-2">
                  <Link href={`/book?veh=${v.id}`} className="flex-1 rounded-xl bg-brand py-3 text-center text-sm font-bold text-white transition hover:bg-brand-dark">
                    Book now
                  </Link>
                  <a
                    href={waLink(`Hi RVS Tours, I'd like a quote for the ${v.name}.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Enquire about ${v.name} on WhatsApp`}
                    className="grid size-12 place-items-center rounded-xl border border-slate-200 text-[#25D366] transition hover:border-[#25D366]"
                  >
                    <WhatsAppIcon />
                  </a>
                </div>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>
      <p className="mt-6 text-center text-xs text-slate-500">Images are representative. Exact model allotted subject to availability. * Feature varies by variant.</p>
    </div>
  );
}

// ── FAQ accordion ────────────────────────────────────────────
export function FAQ({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-slate-200 overflow-hidden rounded-3xl border border-slate-200 bg-white">
      {items.map((it, i) => (
        <div key={it.q}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left font-semibold text-ink transition hover:bg-slate-50"
            aria-expanded={open === i}
          >
            {it.q}
            <ChevronDown className={`size-5 shrink-0 text-brand transition-transform ${open === i ? "rotate-180" : ""}`} />
          </button>
          <AnimatePresence initial={false}>
            {open === i && (
              <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                <p className="px-6 pb-6 leading-7 text-slate-600">{it.a}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

// ── Enquiry form (Contact + Corporate) ───────────────────────
export function EnquiryForm({ kind }: { kind: "contact" | "corporate" }) {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const body = Object.fromEntries(new FormData(form).entries());
    setState("sending");
    setMsg("");
    try {
      const r = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...body, kind }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "Something went wrong");
      setState("done");
      form.reset();
    } catch (err) {
      setState("error");
      setMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  const input =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-[15px] outline-none transition placeholder:text-slate-400 focus:border-brand focus:ring-4 focus:ring-brand/10";

  if (state === "done")
    return (
      <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <div className="mx-auto grid size-14 place-items-center rounded-full bg-emerald-500 text-white">
          <Check className="size-7" />
        </div>
        <h3 className="mt-4 text-xl font-bold text-ink">Thank you! We&apos;ve received your {kind === "corporate" ? "enquiry" : "message"}.</h3>
        <p className="mt-2 text-slate-600">Our team will get back to you shortly. For anything urgent, call or WhatsApp {COMPANY.phoneDisplay}.</p>
        <button onClick={() => setState("idle")} className="mt-5 text-sm font-semibold text-brand">
          Send another
        </button>
      </div>
    );

  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <input required name="name" placeholder="Full name *" className={input} autoComplete="name" />
      <input required name="phone" type="tel" inputMode="numeric" placeholder="Mobile number *" className={input} autoComplete="tel" />
      <input name="email" type="email" placeholder="Email address" className={`${input} ${kind === "contact" ? "sm:col-span-2" : ""}`} autoComplete="email" />
      {kind === "corporate" ? (
        <>
          <input name="company" placeholder="Company name *" required className={input} autoComplete="organization" />
          <div className="relative">
            <select name="employees" className={input} defaultValue="">
              <option value="" disabled>
                Employees to transport
              </option>
              {["Under 25", "25 – 100", "100 – 500", "500+"].map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          </div>
          <input name="location" placeholder="Office location (e.g. Whitefield)" className={input} />
        </>
      ) : (
        <div className="relative sm:col-span-2">
          <select name="service" className={input} defaultValue="">
            <option value="" disabled>
              What do you need?
            </option>
            {SERVICES.map((s) => (
              <option key={s.id}>{s.title}</option>
            ))}
            <option>Other</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
        </div>
      )}
      <textarea
        name="message"
        rows={4}
        placeholder={kind === "corporate" ? "Shift timings, routes, vehicle preference…" : "Tell us about your trip…"}
        className={`${input} sm:col-span-2`}
      />
      {state === "error" && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 sm:col-span-2">{msg}</p>}
      <button
        disabled={state === "sending"}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3.5 font-bold text-white shadow-lg shadow-accent/25 transition hover:bg-accent-dark disabled:opacity-60 sm:col-span-2"
      >
        {state === "sending" ? <Loader2 className="size-5 animate-spin" /> : <Send className="size-4" />}
        {kind === "corporate" ? "Request a proposal" : "Send message"}
      </button>
    </form>
  );
}

// ── CTA band reused across pages ─────────────────────────────
export function ContactCTA() {
  return (
    <section className="px-4 py-16">
      <Reveal className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-gradient-to-br from-accent to-accent-dark px-6 py-12 text-white md:px-14 md:py-14">
        <div className="stripes absolute inset-y-0 right-0 w-1/2 text-white/10" />
        <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <h2 className="text-3xl font-extrabold md:text-4xl">Ready when you are — 24×7.</h2>
            <p className="mt-3 max-w-xl text-white/85">Book online in under a minute, or talk to our team on call or WhatsApp.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/book" className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-bold text-accent transition hover:bg-red-50">
              Book a Cab <ArrowRight className="size-4" />
            </Link>
            <a href={telLink} className="inline-flex items-center gap-2 rounded-xl border border-white/40 px-6 py-3.5 font-bold transition hover:bg-white/10">
              <Phone className="size-4" /> {COMPANY.phoneDisplay}
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
