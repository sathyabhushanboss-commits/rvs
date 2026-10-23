# RVS Tours and Travels — Next.js booking website

Savaari-style cab booking site: Next.js 16 (App Router) + TypeScript + Tailwind v4 + Framer Motion, with backend API routes for maps, Razorpay and email.

## Run

```bash
npm install
cp .env.example .env.local   # fill in keys
npm run dev                  # http://localhost:3000
npm run build && npm start   # production
```

## Pages

| Route | What it is |
|---|---|
| `/` | Hero + booking box (Outstation / Local / Airport · From · To · Date · Time 7:00 AM), glimpses of all 5 pages, services, fleet, popular routes, corporate, how it works, about, FAQ |
| `/book` | Uber/Ola-style booking: live map, address search, GPS, tap/drag pins, route + distance, fares for every vehicle, details, Razorpay |
| `/about` `/services` `/fleet` `/corporate` `/contact` | Inner pages |
| `/booking/success` | Confirmation |
| `/policies/*` | Terms, Privacy, Cancellation & Refund, Payment, Service Delivery, Safety & Conduct |

## Backend (`app/api`)

- `geo/search` — address autocomplete (Photon / OpenStreetMap), Bengaluru-bounded for pickups
- `geo/reverse` — pin → address
- `geo/route` — OSRM driving distance, time and route line (falls back to an estimate if unreachable)
- `razorpay/order` — recomputes the fare **on the server** and creates the Razorpay order
- `razorpay/verify` — HMAC signature check, then emails admin + customer
- `enquiry` — pay-to-driver bookings, contact form, corporate proposals (emails via SMTP)

## Things to edit

- **Phone / email / address** → `lib/data.ts` → `COMPANY` (email is a placeholder)
- **Rates** → `lib/data.ts` → `VEHICLES` (sample rates — confirm with client); GST, advance %, minimums → `lib/pricing.ts`
- **Fleet photos** → put `public/fleet/<id>.jpg` (`sedan, muv, crysta, hycross, tempo, urbania, eclass, sclass, vellfire`). Until then a styled placeholder shows.
- **Logo** → `public/logo.png` · **Favicon** → `app/icon.svg`
- **Policies** → `lib/policies.ts` (have the client review before going live)

## Razorpay go-live checklist

1. Create account, complete KYC, add website URL.
2. Razorpay checks for Terms, Privacy, Refund/Cancellation, Contact and Service Delivery pages — all included.
3. Put `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` in env (test keys first, then live).
4. Optional: add a webhook (`payment.captured`) for extra reliability.

## Production notes

- Maps use free OpenStreetMap services (Photon, OSRM demo server, CARTO tiles). For heavy traffic, switch to a paid/self-hosted provider (e.g. Google Maps Platform, Mapbox, or self-hosted OSRM) — only `app/api/geo/*` and the tile URL in `components/booking-flow.tsx` need changing.
- Bookings are delivered by email. Add a database (Neon/Supabase) later if you need an admin dashboard.
