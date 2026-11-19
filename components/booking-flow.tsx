"use client";

import "leaflet/dist/leaflet.css";
import type * as Leaflet from "leaflet";
import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeftRight,
  CalendarDays,
  Car,
  Check,
  ChevronDown,
  Clock,
  CreditCard,
  Crosshair,
  Info,
  Loader2,
  Luggage,
  MapPin,
  Navigation,
  Plane,
  Route,
  ShieldCheck,
  Timer,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { AIRPORT, BANGALORE_CENTER, BANGALORE_PLACES, COMPANY, OUTSTATION_CITIES, VEHICLES, findPlace, findVehicle, waLink, type Place } from "@/lib/data";
import {
  LOCAL_PACKAGES,
  TIME_SLOTS,
  advanceAmount,
  computeFare,
  daysInclusive,
  estimateRoadKm,
  formatDate,
  haversineKm,
  inBangaloreRegion,
  inr,
  payableFor,
  pickupInstant,
  slotLabel,
  todayIST,
  type PayOption,
  type TripMode,
  type TripType,
} from "@/lib/pricing";
import { VehicleImage, WhatsAppIcon } from "@/components/ui";

type Pt = { lat: number; lng: number; label: string };
type Which = "pickup" | "drop";
type RouteInfo = { km: number; mins: number; coords: [number, number][]; estimated: boolean };
type Suggestion = { title: string; sub: string; lat: number; lng: number; preset?: boolean };

const toPt = (p?: Place | null): Pt | null => (p ? { lat: p.lat, lng: p.lng, label: p.name } : null);
const AIRPORT_PT = toPt(AIRPORT)!;
const isAirport = (p: Pt | null) => !!p && haversineKm(p, AIRPORT) < 4;
const fmtMins = (m: number) => (m >= 60 ? `${Math.floor(m / 60)} hr ${Math.round(m % 60)} min` : `${Math.round(m)} min`);

// Shared client-side caches (survive re-renders and route changes within the session)
const searchCache = new Map<string, Suggestion[]>();
const reverseCache = new Map<string, string>();

async function reverseGeocode(lat: number, lng: number) {
  const key = `${lat.toFixed(4)},${lng.toFixed(4)}`;
  if (reverseCache.has(key)) return reverseCache.get(key)!;
  try {
    const r = await fetch(`/api/geo/reverse?lat=${lat}&lng=${lng}`);
    const j = await r.json();
    const label = j.label || `Pinned location (${lat.toFixed(5)}, ${lng.toFixed(5)})`;
    reverseCache.set(key, label);
    return label as string;
  } catch {
    return `Pinned location (${lat.toFixed(5)}, ${lng.toFixed(5)})`;
  }
}

function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if ((window as unknown as { Razorpay?: unknown }).Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.async = true;
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

// ═════════════════════════════════════════════════════════════
// Map (Leaflet + OpenStreetMap / CARTO tiles)
// ═════════════════════════════════════════════════════════════
function RouteMap({
  pickup,
  drop,
  coords,
  estimated,
  onPick,
}: {
  pickup: Pt | null;
  drop: Pt | null;
  coords: [number, number][];
  estimated: boolean;
  onPick: (lat: number, lng: number, which?: Which) => void;
}) {
  const el = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Leaflet.Map | null>(null);
  const LRef = useRef<typeof Leaflet | null>(null);
  const layers = useRef<{ p?: Leaflet.Marker; d?: Leaflet.Marker; line?: Leaflet.Polyline; halo?: Leaflet.Polyline }>({});
  const onPickRef = useRef(onPick);
  onPickRef.current = onPick;
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !el.current || mapRef.current) return;
      LRef.current = L;
      const map = L.map(el.current, { zoomControl: false, attributionControl: true, preferCanvas: true }).setView(
        [BANGALORE_CENTER.lat, BANGALORE_CENTER.lng],
        11,
      );
      // Free OpenStreetMap tiles — no API key needed (CARTO now requires one).
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);
      L.control.zoom({ position: "bottomright" }).addTo(map);
      map.on("click", (e: Leaflet.LeafletMouseEvent) => onPickRef.current(e.latlng.lat, e.latlng.lng));
      mapRef.current = map;
      setReady(true);
    })();
    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      layers.current = {};
    };
  }, []);

  const pinIcon = useCallback((kind: Which) => {
    const L = LRef.current!;
    return L.divIcon({
      className: "",
      html: `<div class="rvs-pin ${kind}"><div class="head"><span>${kind === "pickup" ? "A" : "B"}</span></div></div>`,
      iconSize: [36, 46],
      iconAnchor: [18, 44],
    });
  }, []);

  // Markers
  useEffect(() => {
    const L = LRef.current;
    const map = mapRef.current;
    if (!ready || !L || !map) return;
    (["pickup", "drop"] as const).forEach((kind) => {
      const pt = kind === "pickup" ? pickup : drop;
      const key = kind === "pickup" ? "p" : "d";
      const existing = layers.current[key];
      if (!pt) {
        existing?.remove();
        layers.current[key] = undefined;
        return;
      }
      if (existing) {
        existing.setLatLng([pt.lat, pt.lng]);
        existing.setTooltipContent(pt.label);
      } else {
        const m = L.marker([pt.lat, pt.lng], { icon: pinIcon(kind), draggable: true, autoPan: true })
          .bindTooltip(pt.label, { direction: "top", offset: [0, -40] })
          .addTo(map);
        m.on("dragend", () => {
          const ll = m.getLatLng();
          onPickRef.current(ll.lat, ll.lng, kind);
        });
        layers.current[key] = m;
      }
    });
  }, [ready, pickup, drop, pinIcon]);

  // Route line + framing
  useEffect(() => {
    const L = LRef.current;
    const map = mapRef.current;
    if (!ready || !L || !map) return;
    layers.current.line?.remove();
    layers.current.halo?.remove();
    layers.current.line = layers.current.halo = undefined;

    if (pickup && drop) {
      const path: [number, number][] = coords.length > 1 ? coords : [[pickup.lat, pickup.lng], [drop.lat, drop.lng]];
      layers.current.halo = L.polyline(path, { color: "#12276b", weight: 9, opacity: 0.18 }).addTo(map);
      layers.current.line = L.polyline(path, {
        color: "#1d3a9c",
        weight: 5,
        opacity: 0.95,
        dashArray: estimated || coords.length < 2 ? "8 10" : undefined,
        className: estimated || coords.length < 2 ? "rvs-route" : undefined,
      }).addTo(map);
      map.fitBounds(L.latLngBounds(path), { padding: [60, 60], maxZoom: 15, animate: true });
    } else if (pickup) {
      map.flyTo([pickup.lat, pickup.lng], 14, { duration: 0.8 });
    } else if (drop) {
      map.flyTo([drop.lat, drop.lng], 13, { duration: 0.8 });
    }
  }, [ready, coords, estimated, pickup, drop]);

  return (
    <div className="relative size-full">
      <div ref={el} className="size-full" />
      {!ready && (
        <div className="absolute inset-0 grid place-items-center bg-slate-100">
          <Loader2 className="size-7 animate-spin text-brand" />
        </div>
      )}
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// Place search with presets + live autocomplete + GPS
// ═════════════════════════════════════════════════════════════
function PlaceSearch({
  label,
  kind,
  value,
  onSelect,
  scope,
  presets,
  allowGps,
  focused,
  onFocus,
}: {
  label: string;
  kind: Which;
  value: Pt | null;
  onSelect: (p: Pt) => void;
  scope: "blr" | "all";
  presets: Place[];
  allowGps?: boolean;
  focused: boolean;
  onFocus: () => void;
}) {
  const [q, setQ] = useState(value?.label ?? "");
  const [open, setOpen] = useState(false);
  const [remote, setRemote] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [gpsBusy, setGpsBusy] = useState(false);
  const [hi, setHi] = useState(0);
  const [msg, setMsg] = useState("");
  const wrap = useRef<HTMLDivElement>(null);
  const editing = useRef(false);

  useEffect(() => {
    if (!editing.current) setQ(value?.label ?? "");
  }, [value]);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (wrap.current && !wrap.current.contains(e.target as Node)) {
        setOpen(false);
        editing.current = false;
        setQ(value?.label ?? "");
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [value]);

  // Debounced remote search with abort + cache
  useEffect(() => {
    const term = q.trim();
    if (!open || !editing.current || term.length < 3) {
      setRemote([]);
      setLoading(false);
      return;
    }
    const key = `${scope}:${term.toLowerCase()}`;
    if (searchCache.has(key)) {
      setRemote(searchCache.get(key)!);
      return;
    }
    const ctrl = new AbortController();
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const r = await fetch(`/api/geo/search?scope=${scope}&q=${encodeURIComponent(term)}`, { signal: ctrl.signal });
        const j = await r.json();
        searchCache.set(key, j.results || []);
        setRemote(j.results || []);
      } catch {
        /* aborted or offline */
      } finally {
        if (!ctrl.signal.aborted) setLoading(false);
      }
    }, 280);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [q, open, scope]);

  const term = editing.current ? q.trim().toLowerCase() : "";
  const local: Suggestion[] = (term ? presets.filter((p) => p.name.toLowerCase().includes(term)) : presets)
    .slice(0, term ? 5 : 7)
    .map((p) => ({ title: p.name, sub: OUTSTATION_CITIES.includes(p) ? "Popular destination" : "Bengaluru", lat: p.lat, lng: p.lng, preset: true }));
  const items = [...local, ...remote.filter((r) => !local.some((l) => haversineKm(l, r) < 0.3))];

  function choose(s: Suggestion) {
    editing.current = false;
    const label = s.preset ? s.title : [s.title, s.sub].filter(Boolean).join(", ");
    setQ(label);
    setOpen(false);
    setMsg("");
    onSelect({ lat: s.lat, lng: s.lng, label });
  }

  function useGps() {
    if (!navigator.geolocation) return setMsg("Location isn't available on this device");
    setGpsBusy(true);
    setMsg("");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        if (!inBangaloreRegion({ lat, lng })) {
          setGpsBusy(false);
          setMsg("You seem to be outside Bengaluru — please search for your pickup point.");
          return;
        }
        const label = await reverseGeocode(lat, lng);
        setGpsBusy(false);
        setOpen(false);
        editing.current = false;
        onSelect({ lat, lng, label });
      },
      () => {
        setGpsBusy(false);
        setMsg("Couldn't get your location. Please allow location access or search instead.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    );
  }

  function onKey(e: KeyboardEvent<HTMLInputElement>) {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHi((h) => Math.min(h + 1, items.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHi((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter" && items[hi]) {
      e.preventDefault();
      choose(items[hi]);
    } else if (e.key === "Escape") setOpen(false);
  }

  return (
    <div ref={wrap} className="relative">
      <div
        className={`flex items-center gap-3 rounded-2xl border bg-white px-4 py-3 transition ${focused ? "border-brand ring-4 ring-brand/10" : "border-slate-200 hover:border-slate-300"}`}
      >
        <span className={`grid size-7 shrink-0 place-items-center rounded-full text-xs font-extrabold text-white ${kind === "pickup" ? "bg-emerald-600" : "bg-accent"}`}>
          {kind === "pickup" ? "A" : "B"}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{label}</p>
          <input
            value={q}
            onChange={(e) => {
              editing.current = true;
              setQ(e.target.value);
              setOpen(true);
              setHi(0);
            }}
            onFocus={(e) => {
              onFocus();
              setOpen(true);
              e.target.select();
            }}
            onKeyDown={onKey}
            placeholder={kind === "pickup" ? "Search area, building, landmark…" : "Search destination…"}
            className="w-full truncate bg-transparent text-[15px] font-semibold text-ink outline-none placeholder:font-normal placeholder:text-slate-400"
            aria-autocomplete="list"
            aria-expanded={open}
          />
        </div>
        {q && (
          <button
            type="button"
            onClick={() => {
              editing.current = true;
              setQ("");
              setOpen(true);
            }}
            className="grid size-7 place-items-center rounded-full text-slate-400 hover:bg-slate-100"
            aria-label="Clear"
          >
            <X className="size-4" />
          </button>
        )}
      </div>
      {msg && <p className="mt-1.5 px-1 text-xs text-amber-700">{msg}</p>}

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-x-0 top-full z-[600] mt-2 max-h-80 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-1.5 shadow-2xl"
            role="listbox"
          >
            {allowGps && (
              <li>
                <button type="button" onClick={useGps} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-brand-50">
                  <span className="grid size-8 place-items-center rounded-full bg-brand-50 text-brand">
                    {gpsBusy ? <Loader2 className="size-4 animate-spin" /> : <Crosshair className="size-4" />}
                  </span>
                  <span className="text-sm font-semibold text-brand">Use my current location</span>
                </button>
              </li>
            )}
            {items.map((s, i) => (
              <li key={`${s.title}-${s.lat}-${i}`}>
                <button
                  type="button"
                  onMouseEnter={() => setHi(i)}
                  onClick={() => choose(s)}
                  className={`flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left ${hi === i ? "bg-slate-100" : ""}`}
                  role="option"
                  aria-selected={hi === i}
                >
                  <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-500">
                    {s.title.includes("Airport") ? <Plane className="size-4" /> : <MapPin className="size-4" />}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-ink">{s.title}</span>
                    {s.sub && <span className="block truncate text-xs text-slate-500">{s.sub}</span>}
                  </span>
                </button>
              </li>
            ))}
            {loading && (
              <li className="flex items-center gap-2 px-3 py-3 text-sm text-slate-500">
                <Loader2 className="size-4 animate-spin" /> Searching addresses…
              </li>
            )}
            {!loading && editing.current && q.trim().length >= 3 && items.length === 0 && (
              <li className="px-3 py-3 text-sm text-slate-500">No matches — try a nearby landmark, or tap the map to drop a pin.</li>
            )}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// Booking flow page body
// ═════════════════════════════════════════════════════════════
function Step({ n, title, children, right }: { n: number; title: string; children: ReactNode; right?: ReactNode }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-3 text-lg font-bold text-ink">
          <span className="grid size-8 place-items-center rounded-full bg-brand text-sm font-extrabold text-white">{n}</span>
          {title}
        </h2>
        {right}
      </div>
      {children}
    </section>
  );
}

const inputCls =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-[15px] font-medium outline-none transition placeholder:text-slate-400 focus:border-brand focus:ring-4 focus:ring-brand/10";

export default function BookingFlow() {
  const sp = useSearchParams();
  const router = useRouter();

  const initType = (["outstation", "local", "airport"].includes(sp.get("type") || "") ? sp.get("type") : "outstation") as TripType;
  const initDir = sp.get("dir") === "from" ? "from" : "to";
  const fromPlace = toPt(findPlace(sp.get("from")));

  const [type, setType] = useState<TripType>(initType);
  const [mode, setMode] = useState<TripMode>(sp.get("mode") === "round" ? "round" : "oneway");
  const [dir, setDir] = useState<"to" | "from">(initDir);
  const [pickup, setPickup] = useState<Pt | null>(() => (initType === "airport" && initDir === "from" ? AIRPORT_PT : fromPlace));
  const [drop, setDrop] = useState<Pt | null>(() =>
    initType === "airport" ? (initDir === "from" ? fromPlace : AIRPORT_PT) : initType === "local" ? null : toPt(findPlace(sp.get("to"))),
  );
  const [active, setActive] = useState<Which>(() => (fromPlace ? "drop" : "pickup"));
  const [date, setDate] = useState(() => sp.get("date") || todayIST());
  const [time, setTime] = useState(() => sp.get("time") || "07:00");
  const [ret, setRet] = useState(() => sp.get("ret") || "");
  const [pkg, setPkg] = useState(() => (LOCAL_PACKAGES.some((p) => p.id === sp.get("pkg")) ? sp.get("pkg")! : "8h80"));
  const [vehId, setVehId] = useState(() => findVehicle(sp.get("veh"))?.id ?? "crysta");

  const [route, setRoute] = useState<RouteInfo | null>(null);
  const [routing, setRouting] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [pay, setPay] = useState<PayOption>("advance");
  const [agree, setAgree] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const detailsRef = useRef<HTMLDivElement>(null);
  const seq = useRef({ pickup: 0, drop: 0 });

  // ── Trip type switching keeps sensible points ──
  function changeType(t: TripType) {
    setError("");
    setType(t);
    if (t === "local") {
      if (isAirport(pickup)) setPickup(null);
      setDrop(null);
      setActive("pickup");
    } else if (t === "airport") {
      const area = (isAirport(pickup) ? drop : pickup) ?? null;
      const safeArea = area && inBangaloreRegion(area) && !isAirport(area) ? area : null;
      if (dir === "to") {
        setPickup(safeArea);
        setDrop(AIRPORT_PT);
      } else {
        setPickup(AIRPORT_PT);
        setDrop(safeArea);
      }
      setActive(dir === "to" ? "pickup" : "drop");
    } else {
      if (isAirport(drop) && type === "airport") setDrop(null);
      if (isAirport(pickup) && type === "airport") setPickup(null);
    }
  }

  function swapAirport() {
    const nd = dir === "to" ? "from" : "to";
    setDir(nd);
    setPickup(drop);
    setDrop(pickup);
    setActive(nd === "to" ? "pickup" : "drop");
  }

  // ── Map click / drag → set point with reverse geocode ──
  const handlePick = useCallback(
    async (lat: number, lng: number, which?: Which) => {
      let target: Which = which ?? active;
      if (type === "local") target = "pickup";
      if (type === "airport") target = dir === "to" ? "pickup" : "drop";
      if ((target === "pickup" || type !== "outstation") && !inBangaloreRegion({ lat, lng })) {
        setError("Pickups are available within Bengaluru. Please choose a point inside the city.");
        return;
      }
      setError("");
      const id = ++seq.current[target];
      const temp = { lat, lng, label: "Finding address…" };
      if (target === "pickup") setPickup(temp);
      else setDrop(temp);
      const label = await reverseGeocode(lat, lng);
      if (seq.current[target] !== id) return;
      if (target === "pickup") setPickup({ lat, lng, label });
      else setDrop({ lat, lng, label });
      if (target === "pickup" && type === "outstation" && !drop) setActive("drop");
    },
    [active, type, dir, drop],
  );

  // ── Route (distance / duration / polyline) ──
  const pLat = pickup?.lat, pLng = pickup?.lng, dLat = drop?.lat, dLng = drop?.lng;
  useEffect(() => {
    if (type === "local" || pLat == null || pLng == null || dLat == null || dLng == null) {
      setRoute(null);
      return;
    }
    const ctrl = new AbortController();
    setRouting(true);
    fetch(`/api/geo/route?from=${pLat},${pLng}&to=${dLat},${dLng}`, { signal: ctrl.signal })
      .then((r) => r.json())
      .then((j: RouteInfo) => setRoute(j))
      .catch((e) => {
        if (e?.name === "AbortError") return;
        const km = estimateRoadKm({ lat: pLat, lng: pLng }, { lat: dLat, lng: dLng });
        setRoute({ km, mins: (km / 40) * 60, coords: [], estimated: true });
      })
      .finally(() => {
        if (!ctrl.signal.aborted) setRouting(false);
      });
    return () => ctrl.abort();
  }, [type, pLat, pLng, dLat, dLng]);

  // ── Live fares ──
  const days = type === "outstation" && mode === "round" && ret ? daysInclusive(date, ret) : 1;
  const ready = type === "local" ? !!pickup : !!(pickup && drop && route);
  const fares = useMemo(
    () =>
      VEHICLES.map((v) => ({
        v,
        fare: computeFare({ type, mode, vehicle: v, km: route?.km ?? 0, days, pkg }),
      })),
    [type, mode, route?.km, days, pkg],
  );
  const selected = fares.find((f) => f.v.id === vehId) ?? fares[0];
  const payable = payableFor(selected.fare.total, pay);

  // ── Submit ──
  function validate(): string | null {
    if (!pickup || pickup.label === "Finding address…") return "Please set your pickup location";
    if (type !== "local" && (!drop || drop.label === "Finding address…")) return "Please set your drop location";
    if (type === "outstation" && pickup && drop && haversineKm(pickup, drop) < 20)
      return "That looks like a city trip — choose Local / Hourly or Airport instead of Outstation.";
    if (!date || !time) return "Please choose pickup date and time";
    if (pickupInstant(date, time).getTime() < Date.now() + 30 * 60_000) return "Pickup time must be at least 30 minutes from now";
    if (type === "outstation" && mode === "round" && (!ret || ret < date)) return "Please choose a valid return date";
    if (name.trim().length < 2) return "Please enter your name";
    if (!/^[6-9]\d{9}$/.test(phone.replace(/\D/g, "").replace(/^(91|0)(?=\d{10}$)/, ""))) return "Please enter a valid 10-digit mobile number";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) return "Please enter a valid email address";
    if (!agree) return "Please accept the Terms & Cancellation Policy";
    return null;
  }

  async function book() {
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setError("");
    setBusy(true);
    const payload = {
      type,
      mode,
      vehicleId: selected.v.id,
      pickup,
      drop: type === "local" ? null : drop,
      date,
      time,
      returnDate: type === "outstation" && mode === "round" ? ret : "",
      pkg,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      notes: notes.trim(),
      payOption: pay,
    };

    try {
      if (pay === "later") {
        const r = await fetch("/api/enquiry", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...payload, kind: "booking" }) });
        const j = await r.json();
        if (!r.ok) throw new Error(j.error || "Could not place booking");
        router.push(`/booking/success?id=${j.bookingId}&total=${j.total}&pay=later`);
        return;
      }

      const r = await fetch("/api/razorpay/order", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const order = await r.json();
      if (!r.ok) throw new Error(order.error || "Could not start payment");
      const ok = await loadRazorpay();
      if (!ok) throw new Error("Couldn't load the payment window. Check your connection and try again.");

      const RZP = (window as unknown as { Razorpay: new (o: Record<string, unknown>) => { open: () => void; on: (e: string, cb: (r: { error?: { description?: string } }) => void) => void } }).Razorpay;
      const rzp = new RZP({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.orderId,
        name: COMPANY.short,
        description: `${selected.v.name} · Booking ${order.bookingId}`,
        image: "/logo.png",
        prefill: { name: payload.name, email: payload.email, contact: payload.phone },
        notes: { booking_id: order.bookingId },
        theme: { color: "#1d3a9c" },
        handler: async (resp: Record<string, string>) => {
          try {
            const v = await fetch("/api/razorpay/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(resp) });
            const vj = await v.json();
            if (!v.ok) throw new Error(vj.error || "Payment verification failed");
            router.push(`/booking/success?id=${vj.bookingId}&total=${order.total}&paid=${vj.paid}&pay=${pay}`);
          } catch (e) {
            setBusy(false);
            setError(e instanceof Error ? `${e.message}. If money was debited, please contact us with ID ${order.bookingId}.` : "Verification failed");
          }
        },
        modal: { ondismiss: () => setBusy(false), confirm_close: true },
      });
      rzp.on("payment.failed", (resp) => {
        setBusy(false);
        setError(resp?.error?.description || "Payment failed. Please try again or choose Pay to driver.");
      });
      rzp.open();
    } catch (e) {
      setBusy(false);
      setError(e instanceof Error ? e.message : "Something went wrong");
    }
  }

  const minDate = todayIST();
  const pickupPresets = type === "airport" ? BANGALORE_PLACES.filter((p) => p.id !== AIRPORT.id) : BANGALORE_PLACES;
  const dropPresets = type === "airport" ? BANGALORE_PLACES.filter((p) => p.id !== AIRPORT.id) : OUTSTATION_CITIES;

  return (
    <div className="bg-slate-50">
      <div className="mx-auto grid max-w-7xl gap-6 px-0 pb-32 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-8 lg:px-4 lg:py-8">
        {/* ── Map ── */}
        <div className="lg:order-2">
          <div className="sticky top-16 z-10 h-[42vh] min-h-[280px] overflow-hidden border-b border-slate-200 md:top-[76px] lg:top-[116px] lg:h-[calc(100vh-140px)] lg:rounded-3xl lg:border lg:shadow-xl">
            <RouteMap pickup={pickup} drop={type === "local" ? null : drop} coords={route?.coords ?? []} estimated={route?.estimated ?? false} onPick={handlePick} />
            <div className="pointer-events-none absolute inset-x-3 top-3 z-[500] flex flex-wrap items-start justify-between gap-2">
              <span className="rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-md backdrop-blur">
                Tap map to set{" "}
                <b className={active === "pickup" || type !== "outstation" ? "text-emerald-700" : "text-accent"}>
                  {type === "local" ? "pickup" : type === "airport" ? (dir === "to" ? "pickup" : "drop") : active}
                </b>{" "}
                · drag pins to adjust
              </span>
              {type !== "local" && (routing || route) && (
                <span className="flex items-center gap-2 rounded-full bg-brand-deep/95 px-3 py-1.5 text-xs font-semibold text-white shadow-md">
                  {routing ? (
                    <>
                      <Loader2 className="size-3.5 animate-spin" /> Calculating route…
                    </>
                  ) : (
                    route && (
                      <>
                        <Route className="size-3.5" /> {route.estimated ? "≈ " : ""}
                        {route.km} km <span className="opacity-50">•</span> <Timer className="size-3.5" /> {fmtMins(route.mins)}
                      </>
                    )
                  )}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── Steps ── */}
        <div className="space-y-5 px-3 pt-4 lg:order-1 lg:px-0 lg:pt-0">
          <div className="px-1">
            <h1 className="text-2xl font-extrabold text-ink md:text-3xl">Book your cab</h1>
            <p className="mt-1 text-sm text-slate-500">Instant fares · Verified chauffeurs · 24×7 support on {COMPANY.phoneDisplay}</p>
          </div>

          {/* 1. Trip */}
          <Step n={1} title="Trip details">
            <div className="no-scrollbar mb-4 flex gap-1 overflow-x-auto rounded-2xl bg-slate-100 p-1">
              {(
                [
                  ["outstation", "Outstation", Route],
                  ["local", "Local / Hourly", Car],
                  ["airport", "Airport", Plane],
                ] as const
              ).map(([id, label, Icon]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => changeType(id)}
                  className={`relative flex flex-1 shrink-0 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold transition ${type === id ? "text-white" : "text-slate-600"}`}
                >
                  {type === id && <motion.span layoutId="flow-tab" className="absolute inset-0 rounded-xl bg-brand shadow" />}
                  <Icon className="relative size-4" />
                  <span className="relative whitespace-nowrap">{label}</span>
                </button>
              ))}
            </div>

            {type === "outstation" && (
              <div className="mb-4 flex gap-2">
                {(["oneway", "round"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMode(m)}
                    className={`flex-1 rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${mode === m ? "border-accent bg-accent-50 text-accent" : "border-slate-200 text-slate-600"}`}
                  >
                    {m === "oneway" ? "One Way" : "Round Trip"}
                  </button>
                ))}
              </div>
            )}

            <div className="relative space-y-3">
              {type === "airport" && dir === "from" ? (
                <AirportChip label="Pickup" onSwap={swapAirport} />
              ) : (
                <PlaceSearch
                  key={`p-${type}-${dir}`}
                  label={type === "airport" ? "Pickup (your address)" : "Pickup location"}
                  kind="pickup"
                  value={pickup}
                  onSelect={(p) => {
                    setPickup(p);
                    if (type === "outstation" && !drop) setActive("drop");
                  }}
                  scope="blr"
                  presets={pickupPresets}
                  allowGps
                  focused={active === "pickup"}
                  onFocus={() => setActive("pickup")}
                />
              )}

              {type !== "local" &&
                (type === "airport" && dir === "to" ? (
                  <AirportChip label="Drop" onSwap={swapAirport} />
                ) : (
                  <PlaceSearch
                    key={`d-${type}-${dir}`}
                    label={type === "airport" ? "Drop (your address)" : "Drop location"}
                    kind="drop"
                    value={drop}
                    onSelect={setDrop}
                    scope={type === "airport" ? "blr" : "all"}
                    presets={dropPresets}
                    focused={active === "drop"}
                    onFocus={() => setActive("drop")}
                  />
                ))}
            </div>

            <div className={`mt-3 grid gap-3 ${type === "outstation" && mode === "round" ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-2"}`}>
              <LabeledBox label="Pick up date" icon={<CalendarDays className="size-3.5" />}>
                <input type="date" min={minDate} value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-transparent text-[15px] font-semibold outline-none" />
              </LabeledBox>
              <LabeledBox label="Pick up time" icon={<Clock className="size-3.5" />} caret>
                <select value={time} onChange={(e) => setTime(e.target.value)} className="w-full cursor-pointer bg-transparent pr-5 text-[15px] font-semibold outline-none">
                  {TIME_SLOTS.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </LabeledBox>
              {type === "outstation" && mode === "round" && (
                <LabeledBox label="Return date" icon={<CalendarDays className="size-3.5" />} className="col-span-2 sm:col-span-1">
                  <input type="date" min={date || minDate} value={ret} onChange={(e) => setRet(e.target.value)} className="w-full bg-transparent text-[15px] font-semibold outline-none" />
                </LabeledBox>
              )}
            </div>

            {type === "local" && (
              <div className="mt-3 grid grid-cols-3 gap-2">
                {LOCAL_PACKAGES.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPkg(p.id)}
                    className={`rounded-2xl border px-2 py-3 text-center transition ${pkg === p.id ? "border-brand bg-brand-50 ring-2 ring-brand/15" : "border-slate-200 hover:border-slate-300"}`}
                  >
                    <span className="block text-base font-extrabold text-ink">{p.hours} Hrs</span>
                    <span className="block text-xs text-slate-500">{p.km} Km included</span>
                  </button>
                ))}
              </div>
            )}
          </Step>

          {/* 2. Cabs */}
          <Step
            n={2}
            title="Choose your cab"
            right={
              ready && type !== "local" && route ? (
                <span className="text-xs font-medium text-slate-500">
                  {route.estimated ? "≈ " : ""}
                  {route.km} km{type === "outstation" && mode === "round" ? ` each way · ${days} day${days > 1 ? "s" : ""}` : ""}
                </span>
              ) : null
            }
          >
            {!ready ? (
              <div className="flex items-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-500">
                {routing ? <Loader2 className="size-5 animate-spin text-brand" /> : <Navigation className="size-5 text-brand" />}
                {routing ? "Finding the best route…" : type === "local" ? "Set your pickup to see package fares." : "Set pickup and drop to see live fares for every cab."}
              </div>
            ) : (
              <div className="space-y-2.5">
                {fares.map(({ v, fare }) => {
                  const on = v.id === selected.v.id;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setVehId(v.id)}
                      className={`group flex w-full items-center gap-3 rounded-2xl border p-2.5 text-left transition md:gap-4 ${on ? "border-brand bg-brand-50/60 ring-2 ring-brand/15" : "border-slate-200 bg-white hover:border-slate-300"}`}
                    >
                      <VehicleImage vehicle={v} className="h-16 w-24 shrink-0 rounded-xl md:h-[72px] md:w-28" />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-x-2">
                          <p className="truncate font-bold text-ink">{v.name}</p>
                          {v.tag && <span className="rounded bg-accent/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-accent">{v.tag}</span>}
                        </div>
                        <p className="truncate text-xs text-slate-500">{v.model}</p>
                        <p className="mt-1 flex gap-3 text-xs text-slate-600">
                          <span className="flex items-center gap-1">
                            <Users className="size-3.5" /> {v.seats}
                          </span>
                          <span className="flex items-center gap-1">
                            <Luggage className="size-3.5" /> {v.bags}
                          </span>
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-lg font-extrabold text-ink">{inr(fare.total)}</p>
                        <p className="text-[11px] text-slate-500">incl. GST</p>
                      </div>
                      <span className={`grid size-6 shrink-0 place-items-center rounded-full border-2 transition ${on ? "border-brand bg-brand text-white" : "border-slate-300"}`}>
                        {on && <Check className="size-3.5" strokeWidth={3} />}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </Step>

          {/* 3. Details & payment */}
          <div ref={detailsRef}>
            <Step n={3} title="Your details & payment">
              <div className="grid gap-3 sm:grid-cols-2">
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name *" autoComplete="name" className={inputCls} />
                <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Mobile number *" type="tel" inputMode="numeric" autoComplete="tel" className={inputCls} />
                <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email for confirmation *" type="email" autoComplete="email" className={`${inputCls} sm:col-span-2`} />
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder={type === "airport" ? "Flight number, luggage, special requests (optional)" : "Landmark, luggage, special requests (optional)"}
                  className={`${inputCls} resize-none sm:col-span-2`}
                />
              </div>

              {ready && (
                <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                  <p className="mb-2 text-sm font-bold text-ink">Fare breakdown · {selected.v.name}</p>
                  <dl className="space-y-1.5 text-sm">
                    {selected.fare.lines.map((l) => (
                      <div key={l.label} className="flex justify-between gap-4 text-slate-600">
                        <dt>{l.label}</dt>
                        <dd className="font-medium text-ink">{inr(l.amount)}</dd>
                      </div>
                    ))}
                    <div className="flex justify-between text-slate-600">
                      <dt>GST (5%)</dt>
                      <dd className="font-medium text-ink">{inr(selected.fare.gst)}</dd>
                    </div>
                    <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-extrabold text-ink">
                      <dt>Total fare</dt>
                      <dd>{inr(selected.fare.total)}</dd>
                    </div>
                  </dl>
                  <ul className="mt-3 space-y-1 text-xs text-slate-500">
                    {selected.fare.notes.map((n) => (
                      <li key={n} className="flex items-start gap-1.5">
                        <Info className="mt-0.5 size-3 shrink-0" /> {n}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-5 grid gap-2.5 sm:grid-cols-3">
                {(
                  [
                    ["advance", "Pay advance", ready ? inr(advanceAmount(selected.fare.total)) : "20%", Wallet],
                    ["full", "Pay full now", ready ? inr(selected.fare.total) : "100%", CreditCard],
                    ["later", "Pay to driver", "Cash / UPI", Car],
                  ] as const
                ).map(([id, label, sub, Icon]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setPay(id)}
                    className={`flex items-center gap-3 rounded-2xl border p-3 text-left transition ${pay === id ? "border-accent bg-accent-50 ring-2 ring-accent/15" : "border-slate-200 hover:border-slate-300"}`}
                  >
                    <Icon className={`size-5 shrink-0 ${pay === id ? "text-accent" : "text-slate-400"}`} />
                    <span>
                      <span className="block text-sm font-bold text-ink">{label}</span>
                      <span className="block text-xs text-slate-500">{sub}</span>
                    </span>
                  </button>
                ))}
              </div>

              <label className="mt-4 flex items-start gap-2.5 text-sm text-slate-600">
                <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-0.5 size-4 accent-[var(--color-brand)]" />
                <span>
                  I agree to the{" "}
                  <a href="/policies/terms-and-conditions" target="_blank" className="font-semibold text-brand underline-offset-2 hover:underline">
                    Terms &amp; Conditions
                  </a>{" "}
                  and{" "}
                  <a href="/policies/cancellation-and-refund-policy" target="_blank" className="font-semibold text-brand underline-offset-2 hover:underline">
                    Cancellation Policy
                  </a>
                  .
                </span>
              </label>

              {error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>}

              <button
                type="button"
                onClick={book}
                disabled={busy || !ready}
                className="mt-5 hidden w-full items-center justify-center gap-2 rounded-2xl bg-accent py-4 text-base font-extrabold text-white shadow-lg shadow-accent/30 transition hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-50 lg:flex"
              >
                {busy ? <Loader2 className="size-5 animate-spin" /> : <ShieldCheck className="size-5" />}
                {pay === "later" ? "Confirm booking" : `Pay ${ready ? inr(payable) : ""} securely`}
              </button>
              <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-slate-500">
                <ShieldCheck className="size-3.5 text-emerald-600" /> Payments secured by Razorpay · UPI, cards, net banking
              </p>
              <a
                href={waLink(
                  `Hi RVS Tours, I'd like to book: ${selected.v.name}, ${pickup?.label ?? ""}${drop && type !== "local" ? ` → ${drop.label}` : ""}, ${formatDate(date)} ${slotLabel(time)}.`,
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex items-center justify-center gap-2 text-sm font-semibold text-[#128C7E]"
              >
                <WhatsAppIcon className="size-4" /> Prefer WhatsApp? Send these trip details
              </a>
            </Step>
          </div>
        </div>
      </div>

      {/* ── Mobile sticky pay bar ── */}
      <div className="fixed inset-x-0 bottom-0 z-[1050] border-t border-slate-200 bg-white/95 px-4 py-3 shadow-[0_-10px_30px_-15px_rgba(11,26,74,0.3)] backdrop-blur lg:hidden">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs text-slate-500">{ready ? selected.v.name : "Set your trip to see fare"}</p>
            <p className="text-lg font-extrabold text-ink">{ready ? inr(selected.fare.total) : "—"}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              if (!name || !phone || !email) detailsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
              else book();
            }}
            disabled={busy || !ready}
            className="flex items-center gap-2 rounded-2xl bg-accent px-5 py-3.5 font-extrabold text-white shadow-lg shadow-accent/30 disabled:opacity-50"
          >
            {busy && <Loader2 className="size-4 animate-spin" />}
            {!name || !phone || !email ? "Continue" : pay === "later" ? "Confirm" : `Pay ${inr(payable)}`}
          </button>
        </div>
      </div>
    </div>
  );
}

function AirportChip({ label, onSwap }: { label: string; onSwap: () => void }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <span className="grid size-7 place-items-center rounded-full bg-brand text-white">
        <Plane className="size-3.5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{label}</p>
        <p className="truncate text-[15px] font-semibold text-ink">{AIRPORT.name}</p>
      </div>
      <button type="button" onClick={onSwap} className="flex items-center gap-1.5 rounded-xl bg-white px-3 py-2 text-xs font-bold text-brand shadow-sm" aria-label="Swap direction">
        <ArrowLeftRight className="size-3.5" /> Swap
      </button>
    </div>
  );
}

function LabeledBox({ label, icon, children, caret, className = "" }: { label: string; icon: ReactNode; children: ReactNode; caret?: boolean; className?: string }) {
  return (
    <label className={`relative block rounded-2xl border border-slate-200 bg-white px-4 py-2.5 transition focus-within:border-brand focus-within:ring-4 focus-within:ring-brand/10 ${className}`}>
      <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
        {icon} {label}
      </span>
      {children}
      {caret && <ChevronDown className="pointer-events-none absolute bottom-3.5 right-3 size-4 text-slate-400" />}
    </label>
  );
}

