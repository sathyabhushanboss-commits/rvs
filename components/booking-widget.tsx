"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeftRight, ArrowRight, CalendarDays, Car, ChevronDown, Clock, MapPin, Navigation, Package, Plane, Route } from "lucide-react";
import { AIRPORT, BANGALORE_PLACES, OUTSTATION_CITIES } from "@/lib/data";
import { LOCAL_PACKAGES, TIME_SLOTS, todayIST, type TripMode, type TripType } from "@/lib/pricing";

const TABS: { id: TripType; label: string; icon: typeof Route }[] = [
  { id: "outstation", label: "Outstation", icon: Route },
  { id: "local", label: "Local / Hourly", icon: Car },
  { id: "airport", label: "Airport", icon: Plane },
];

const AREAS = BANGALORE_PLACES.filter((p) => p.id !== AIRPORT.id);

function Field({ label, icon, children, className = "" }: { label: string; icon: ReactNode; children: ReactNode; className?: string }) {
  return (
    <label
      className={`relative block min-w-0 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 transition focus-within:border-brand focus-within:ring-4 focus-within:ring-brand/10 hover:border-slate-300 ${className}`}
    >
      <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
        {icon}
        {label}
      </span>
      {children}
    </label>
  );
}

const control = "mt-0.5 w-full cursor-pointer truncate bg-transparent pr-6 text-[15px] font-semibold text-ink outline-none";
const Caret = () => <ChevronDown className="pointer-events-none absolute bottom-3.5 right-3 size-4 text-slate-400" />;

export default function BookingWidget() {
  const router = useRouter();
  const [type, setType] = useState<TripType>("outstation");
  const [mode, setMode] = useState<TripMode>("oneway");
  const [dir, setDir] = useState<"to" | "from">("to");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("07:00");
  const [ret, setRet] = useState("");
  const [pkg, setPkg] = useState("8h80");
  const [error, setError] = useState("");
  const [min, setMin] = useState("");

  useEffect(() => {
    const t = todayIST();
    setMin(t);
    setDate(t);
  }, []);

  function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!from) return setError(type === "airport" ? "Please select your pickup / drop area" : "Please select a pickup location from the dropdown");
    if (type === "outstation" && !to) return setError("Please select your destination from the dropdown");
    if (!date) return setError("Please choose a pickup date");
    if (type === "outstation" && mode === "round" && (!ret || ret < date)) return setError("Please choose a valid return date");

    const p = new URLSearchParams({ type, from, date, time });
    if (type === "outstation") {
      p.set("mode", mode);
      if (to !== "custom") p.set("to", to);
      if (mode === "round") p.set("ret", ret);
    }
    if (type === "local") p.set("pkg", pkg);
    if (type === "airport") p.set("dir", dir);
    router.push(`/book?${p.toString()}`);
  }

  const placeSelect = (value: string, onChange: (v: string) => void, placeholder: string, list = AREAS, extra?: ReactNode) => (
    <>
      <select value={value} onChange={(e) => onChange(e.target.value)} className={`${control} ${value ? "" : "text-slate-400"}`}>
        <option value="">{placeholder}</option>
        {list.map((p) => (
          <option key={p.id} value={p.id} className="text-ink">
            {p.name}
          </option>
        ))}
        {extra}
      </select>
      <Caret />
    </>
  );

  return (
    <motion.form
      onSubmit={submit}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-[1.75rem] border border-slate-200/70 bg-white p-3 shadow-[0_30px_80px_-20px_rgba(11,26,74,0.35)] md:p-4"
      aria-label="Book a cab"
    >
      {/* Trip type tabs */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="no-scrollbar flex gap-1 overflow-x-auto rounded-2xl bg-slate-100 p-1">
          {TABS.map((t) => (
            <button
              type="button"
              key={t.id}
              onClick={() => {
                setType(t.id);
                setError("");
              }}
              className={`relative flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition ${type === t.id ? "text-white" : "text-slate-600 hover:text-brand"}`}
            >
              {type === t.id && <motion.span layoutId="widget-tab" className="absolute inset-0 rounded-xl bg-brand shadow-md" transition={{ type: "spring", bounce: 0.2, duration: 0.5 }} />}
              <t.icon className="relative size-4" />
              <span className="relative">{t.label}</span>
            </button>
          ))}
        </div>
        {type === "outstation" && (
          <div className="flex gap-4 px-2 text-sm font-semibold">
            {(["oneway", "round"] as const).map((m) => (
              <label key={m} className="flex cursor-pointer items-center gap-2">
                <input type="radio" name="mode" checked={mode === m} onChange={() => setMode(m)} className="size-4 accent-[var(--color-accent)]" />
                {m === "oneway" ? "One Way" : "Round Trip"}
              </label>
            ))}
          </div>
        )}
        {type === "airport" && (
          <button
            type="button"
            onClick={() => setDir((d) => (d === "to" ? "from" : "to"))}
            className="flex items-center gap-2 self-start rounded-xl bg-brand-50 px-3 py-2 text-sm font-semibold text-brand md:self-auto"
          >
            <ArrowLeftRight className="size-4" /> {dir === "to" ? "Drop to airport" : "Pickup from airport"}
          </button>
        )}
      </div>

      {/* Fields */}
      <div className="mt-3 grid gap-2.5 sm:grid-cols-2 lg:flex">
        {type === "outstation" && (
          <>
            <Field label="From" icon={<MapPin className="size-3.5 text-emerald-600" />} className="lg:flex-[1.3]">
              {placeSelect(from, setFrom, "Please select from Dropdown")}
            </Field>
            <Field label="To" icon={<Navigation className="size-3.5 text-accent" />} className="lg:flex-[1.3]">
              {placeSelect(
                to,
                setTo,
                "Please select from Dropdown",
                OUTSTATION_CITIES,
                <option value="custom" className="text-ink">
                  Other city — pick on map
                </option>,
              )}
            </Field>
          </>
        )}

        {type === "local" && (
          <>
            <Field label="Pickup city area" icon={<MapPin className="size-3.5 text-emerald-600" />} className="lg:flex-[1.4]">
              {placeSelect(from, setFrom, "Please select from Dropdown")}
            </Field>
            <Field label="Package" icon={<Package className="size-3.5 text-accent" />} className="lg:flex-1">
              <select value={pkg} onChange={(e) => setPkg(e.target.value)} className={control}>
                {LOCAL_PACKAGES.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>
              <Caret />
            </Field>
          </>
        )}

        {type === "airport" && (
          <>
            <Field label={dir === "to" ? "From" : "To"} icon={<MapPin className="size-3.5 text-emerald-600" />} className="lg:flex-[1.4]">
              {placeSelect(from, setFrom, "Please select from Dropdown")}
            </Field>
            <Field label={dir === "to" ? "To" : "From"} icon={<Plane className="size-3.5 text-accent" />} className="lg:flex-1">
              <p className={`${control} cursor-default`}>Kempegowda Intl. Airport</p>
            </Field>
          </>
        )}

        <Field label="Pick up date" icon={<CalendarDays className="size-3.5 text-brand" />} className="lg:flex-[0.9]">
          <input type="date" value={date} min={min} onChange={(e) => setDate(e.target.value)} className={control} required />
        </Field>
        {type === "outstation" && mode === "round" && (
          <Field label="Return date" icon={<CalendarDays className="size-3.5 text-brand" />} className="lg:flex-[0.9]">
            <input type="date" value={ret} min={date || min} onChange={(e) => setRet(e.target.value)} className={control} />
          </Field>
        )}
        <Field label="Pick up time" icon={<Clock className="size-3.5 text-brand" />} className="lg:flex-[0.8]">
          <select value={time} onChange={(e) => setTime(e.target.value)} className={control}>
            {TIME_SLOTS.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
          <Caret />
        </Field>

        <button
          type="submit"
          className="group flex items-center justify-center gap-2 rounded-2xl bg-accent px-7 py-4 text-base font-extrabold uppercase tracking-wide text-white shadow-lg shadow-accent/30 transition hover:bg-accent-dark active:scale-[0.98] sm:col-span-2 lg:col-span-1"
        >
          Explore Cabs <ArrowRight className="size-5 transition group-hover:translate-x-0.5" />
        </button>
      </div>

      {error && <p className="mt-3 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700">{error}</p>}
      <p className="mt-3 px-1 text-xs text-slate-500">Next step: set your exact pickup on the live map, compare fares and pay securely.</p>
    </motion.form>
  );
}
