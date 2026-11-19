// ─────────────────────────────────────────────────────────────
// RVS Tours and Travels — single source of truth for site content.
// Edit phone, email, fleet rates, places and FAQs here.
// ─────────────────────────────────────────────────────────────

export const COMPANY = {
  name: "RVS Tours and Travels Pvt Ltd",
  short: "RVS Tours & Travels",
  phoneDisplay: "+91 98802 91934",
  phone: "+919880291934",
  whatsapp: "919880291934",
  email: "bookings@rvstravels.in", // ← replace with the client's real email
  address: "Bengaluru, Karnataka, India",
  hours: "24 × 7, all 365 days",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.rvstoursandtravels.com",
};

export const telLink = `tel:${COMPANY.phone}`;
export const waLink = (text?: string) =>
  `https://wa.me/${COMPANY.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
export const mailLink = (subject?: string) =>
  `mailto:${COMPANY.email}${subject ? `?subject=${encodeURIComponent(subject)}` : ""}`;

export const NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/fleet", label: "Fleet" },
  { href: "/corporate", label: "Corporate" },
  { href: "/contact", label: "Contact" },
];

export const POLICY_LINKS = [
  { slug: "terms-and-conditions", label: "Terms & Conditions" },
  { slug: "privacy-policy", label: "Privacy Policy" },
  { slug: "cancellation-and-refund-policy", label: "Cancellation & Refund" },
  { slug: "payment-policy", label: "Payment Policy" },
  { slug: "service-delivery-policy", label: "Service Delivery Policy" },
  { slug: "safety-and-conduct-policy", label: "Safety & Conduct" },
];

// ── Fleet ────────────────────────────────────────────────────
// Rates are sample figures — confirm with the client before launch.
// Drop real photos into /public/fleet/<id>.webp (e.g. /public/fleet/crysta.webp).
export type VehicleCategory = "Sedan" | "MUV" | "Van" | "Luxury";

export interface Vehicle {
  id: string;
  name: string;
  model: string;
  category: VehicleCategory;
  seats: string;
  bags: number;
  perKm: number; // outstation / extra km rate
  local8h: number; // 8 hr / 80 km local package
  airportBase: number; // airport transfer up to included km
  extraHr: number;
  minKmDay: number; // round-trip minimum km per day
  driverDay: number; // driver allowance per day
  tag?: string;
  desc: string;
  features: string[];
}

export const VEHICLES: Vehicle[] = [
  {
    id: "sedan",
    name: "Sedan",
    model: "Swift Dzire, Etios, Aura or similar",
    category: "Sedan",
    seats: "4 + 1",
    bags: 2,
    perKm: 12,
    local8h: 2200,
    airportBase: 950,
    extraHr: 200,
    minKmDay: 250,
    driverDay: 300,
    tag: "Best value",
    desc: "Comfortable, fuel-efficient sedans for city rides, airport runs and short getaways.",
    features: ["AC", "4 passengers", "2 bags", "Music system"],
  },
  {
    id: "muv",
    name: "MUV",
    model: "Maruti Ertiga, Kia Carens or similar",
    category: "MUV",
    seats: "6 + 1",
    bags: 3,
    perKm: 14,
    local8h: 2600,
    airportBase: 1150,
    extraHr: 250,
    minKmDay: 250,
    driverDay: 300,
    desc: "Spacious 7-seaters for small families and groups travelling together.",
    features: ["AC", "6 passengers", "3 bags", "Rear AC vents"],
  },
  {
    id: "crysta",
    name: "Toyota Innova Crysta",
    model: "Innova Crysta",
    category: "MUV",
    seats: "7 + 1",
    bags: 4,
    perKm: 18,
    local8h: 3400,
    airportBase: 1600,
    extraHr: 300,
    minKmDay: 250,
    driverDay: 400,
    tag: "Most booked",
    desc: "India's favourite highway cruiser — the go-to for outstation trips and corporate guests.",
    features: ["Captain seats", "Dual AC", "4 bags", "Highway comfort"],
  },
  {
    id: "hycross",
    name: "Toyota Innova Hycross",
    model: "Innova Hycross (Hybrid)",
    category: "MUV",
    seats: "7 + 1",
    bags: 4,
    perKm: 20,
    local8h: 3800,
    airportBase: 1800,
    extraHr: 350,
    minKmDay: 250,
    driverDay: 400,
    tag: "Hybrid",
    desc: "Strong-hybrid quietness with a premium cabin — refined, efficient executive travel.",
    features: ["Hybrid", "Captain seats", "Panoramic roof*", "Ambient lighting"],
  },
  {
    id: "tempo",
    name: "Tempo Traveller",
    model: "Force Tempo Traveller 12 / 17 / 26 seater",
    category: "Van",
    seats: "12 – 26",
    bags: 10,
    perKm: 26,
    local8h: 5500,
    airportBase: 3200,
    extraHr: 500,
    minKmDay: 250,
    driverDay: 500,
    desc: "Push-back seats and ample luggage room for group tours, weddings and team outings.",
    features: ["Push-back seats", "AC", "Large boot", "Group tours"],
  },
  {
    id: "urbania",
    name: "Force Urbania",
    model: "Force Urbania 13 / 17 seater",
    category: "Van",
    seats: "13 – 17",
    bags: 12,
    perKm: 32,
    local8h: 7000,
    airportBase: 4200,
    extraHr: 600,
    minKmDay: 250,
    driverDay: 500,
    tag: "Premium van",
    desc: "The modern premium van — car-like ride, monocoque body and lounge-style seating.",
    features: ["Monocoque ride", "Individual AC vents", "USB charging", "Premium seats"],
  },
  {
    id: "eclass",
    name: "Mercedes-Benz E-Class",
    model: "E-Class LWB",
    category: "Luxury",
    seats: "3 + 1",
    bags: 3,
    perKm: 45,
    local8h: 9500,
    airportBase: 5500,
    extraHr: 1000,
    minKmDay: 200,
    driverDay: 600,
    tag: "Executive",
    desc: "Long-wheelbase luxury for CXOs, VIP guests and wedding arrivals.",
    features: ["Chauffeur in uniform", "Rear recline", "Leather", "Bottled water"],
  },
  {
    id: "sclass",
    name: "Mercedes-Benz S-Class",
    model: "S-Class",
    category: "Luxury",
    seats: "3 + 1",
    bags: 3,
    perKm: 90,
    local8h: 19000,
    airportBase: 11000,
    extraHr: 2000,
    minKmDay: 200,
    driverDay: 800,
    tag: "Flagship",
    desc: "The benchmark of chauffeur-driven luxury — for the moments that must be perfect.",
    features: ["Executive rear seats", "Massage seats*", "Senior chauffeur", "Red-carpet service"],
  },
  {
    id: "vellfire",
    name: "Toyota Vellfire",
    model: "Vellfire Executive Lounge",
    category: "Luxury",
    seats: "6 + 1",
    bags: 4,
    perKm: 75,
    local8h: 16000,
    airportBase: 9000,
    extraHr: 1800,
    minKmDay: 200,
    driverDay: 800,
    tag: "Luxury MPV",
    desc: "A first-class lounge on wheels — power ottomans, privacy and whisper-quiet hybrid drive.",
    features: ["Lounge seats", "Power ottomans", "Hybrid", "Privacy blinds"],
  },
];

export const findVehicle = (id?: string | null) => VEHICLES.find((v) => v.id === id);

// ── Services ─────────────────────────────────────────────────
export type IconKey = "building" | "plane" | "map" | "briefcase" | "crown" | "users";

export interface Service {
  id: string;
  title: string;
  short: string;
  desc: string;
  points: string[];
  icon: IconKey;
}

export const SERVICES: Service[] = [
  {
    id: "employee-transportation",
    title: "Corporate Employee Transportation",
    short: "Daily shift-based commute for your teams with dedicated vehicles and drivers.",
    desc: "We run daily pick-up and drop programmes for corporate clients across Bengaluru — planned routes, shift-wise rosters and dependable vehicles so your people reach work on time, every day.",
    points: ["Shift & roster-based routing", "Dedicated vehicles and trained drivers", "Night-shift safety protocols", "Monthly GST billing & trip reports"],
    icon: "building",
  },
  {
    id: "airport-transfers",
    title: "Airport Transfers",
    short: "On-time pickups and drops at Kempegowda International Airport, 24×7.",
    desc: "Fixed, transparent fares to and from Kempegowda International Airport (BLR). Flight-aware pickups, name-board meet & greet and waiting time built in.",
    points: ["Flight tracking for pickups", "Meet & greet on request", "Fixed upfront fares", "Every terminal, every hour"],
    icon: "plane",
  },
  {
    id: "local-outstation",
    title: "Local & Outstation Travel",
    short: "Hourly city packages and one-way or round trips across South India.",
    desc: "Hire a car by the hour inside Bengaluru, or head out to Mysuru, Coorg, Ooty, Tirupati, Chennai and beyond — one-way or round trip, with experienced highway drivers.",
    points: ["4 / 8 / 12 hour city packages", "One-way & round trips", "Experienced highway drivers", "All-inclusive quotes on request"],
    icon: "map",
  },
  {
    id: "executive-transportation",
    title: "Executive Transportation",
    short: "Chauffeur-driven cars for leadership, clients and visiting delegates.",
    desc: "Polished chauffeurs, immaculate vehicles and discreet service for executives, board members and visiting clients — booked by the trip, day or month.",
    points: ["Uniformed, vetted chauffeurs", "Day & multi-day disposal", "Discreet, punctual service", "Single point of contact"],
    icon: "briefcase",
  },
  {
    id: "luxury-vehicles",
    title: "Premium & Luxury Vehicles",
    short: "Mercedes-Benz E-Class, S-Class and Toyota Vellfire for special occasions.",
    desc: "Make an entrance. Our luxury line-up serves weddings, celebrity movements, VIP guests and milestone celebrations with senior chauffeurs.",
    points: ["E-Class, S-Class & Vellfire", "Wedding & event packages", "Senior chauffeurs", "Décor on request"],
    icon: "crown",
  },
  {
    id: "corporate-travel",
    title: "Corporate Travel Solutions",
    short: "Event logistics, offsites and conference movement for groups of any size.",
    desc: "From a single airport pickup to a 300-guest conference, we plan and run ground transportation end-to-end with a mixed fleet of cars, Urbanias and Tempo Travellers.",
    points: ["Conferences & offsites", "Mixed fleet coordination", "On-ground coordinator", "Consolidated invoicing"],
    icon: "users",
  },
];

// ── Places ───────────────────────────────────────────────────
export interface Place {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

export const BANGALORE_CENTER = { lat: 12.9716, lng: 77.5946 };

export const AIRPORT: Place = {
  id: "blr-airport",
  name: "Kempegowda International Airport (BLR)",
  lat: 13.1989,
  lng: 77.7068,
};

export const BANGALORE_PLACES: Place[] = [
  AIRPORT,
  { id: "majestic", name: "Majestic / KSR Bengaluru City Railway Station", lat: 12.9779, lng: 77.5713 },
  { id: "smvt", name: "SMVT Railway Station, Baiyappanahalli", lat: 12.9906, lng: 77.652 },
  { id: "cantonment", name: "Cantonment Railway Station", lat: 12.9937, lng: 77.5986 },
  { id: "yeshwanthpur", name: "Yeshwanthpur", lat: 13.0285, lng: 77.5409 },
  { id: "mg-road", name: "MG Road", lat: 12.9756, lng: 77.605 },
  { id: "indiranagar", name: "Indiranagar", lat: 12.9784, lng: 77.6408 },
  { id: "koramangala", name: "Koramangala", lat: 12.9352, lng: 77.6245 },
  { id: "hsr-layout", name: "HSR Layout", lat: 12.9116, lng: 77.6474 },
  { id: "btm-layout", name: "BTM Layout", lat: 12.9166, lng: 77.6101 },
  { id: "jayanagar", name: "Jayanagar", lat: 12.925, lng: 77.5938 },
  { id: "jp-nagar", name: "JP Nagar", lat: 12.9063, lng: 77.5857 },
  { id: "banashankari", name: "Banashankari", lat: 12.9255, lng: 77.5468 },
  { id: "basavanagudi", name: "Basavanagudi", lat: 12.9422, lng: 77.5737 },
  { id: "bannerghatta-road", name: "Bannerghatta Road", lat: 12.888, lng: 77.597 },
  { id: "electronic-city", name: "Electronic City", lat: 12.8452, lng: 77.6602 },
  { id: "bommanahalli", name: "Bommanahalli", lat: 12.902, lng: 77.623 },
  { id: "whitefield", name: "Whitefield", lat: 12.9698, lng: 77.75 },
  { id: "marathahalli", name: "Marathahalli", lat: 12.9569, lng: 77.7011 },
  { id: "bellandur", name: "Bellandur", lat: 12.926, lng: 77.6762 },
  { id: "sarjapur-road", name: "Sarjapur Road", lat: 12.91, lng: 77.686 },
  { id: "kr-puram", name: "KR Puram", lat: 13.0076, lng: 77.695 },
  { id: "hoodi", name: "Hoodi", lat: 12.992, lng: 77.716 },
  { id: "domlur", name: "Domlur", lat: 12.961, lng: 77.6387 },
  { id: "ulsoor", name: "Ulsoor", lat: 12.9817, lng: 77.62 },
  { id: "frazer-town", name: "Frazer Town", lat: 12.998, lng: 77.615 },
  { id: "kalyan-nagar", name: "Kalyan Nagar", lat: 13.028, lng: 77.64 },
  { id: "hennur", name: "Hennur", lat: 13.0389, lng: 77.6386 },
  { id: "manyata", name: "Manyata Tech Park", lat: 13.0475, lng: 77.621 },
  { id: "hebbal", name: "Hebbal", lat: 13.0358, lng: 77.597 },
  { id: "rt-nagar", name: "RT Nagar", lat: 13.0213, lng: 77.5946 },
  { id: "yelahanka", name: "Yelahanka", lat: 13.1007, lng: 77.5963 },
  { id: "devanahalli", name: "Devanahalli", lat: 13.247, lng: 77.712 },
  { id: "malleshwaram", name: "Malleshwaram", lat: 13.0035, lng: 77.5709 },
  { id: "rajajinagar", name: "Rajajinagar", lat: 12.991, lng: 77.5525 },
  { id: "vijayanagar", name: "Vijayanagar", lat: 12.9719, lng: 77.53 },
  { id: "nagarbhavi", name: "Nagarbhavi", lat: 12.96, lng: 77.51 },
  { id: "kengeri", name: "Kengeri", lat: 12.914, lng: 77.483 },
  { id: "peenya", name: "Peenya", lat: 13.029, lng: 77.519 },
  { id: "jalahalli", name: "Jalahalli", lat: 13.045, lng: 77.548 },
];

export const OUTSTATION_CITIES: Place[] = [
  { id: "mysuru", name: "Mysuru", lat: 12.2958, lng: 76.6394 },
  { id: "coorg", name: "Coorg (Madikeri)", lat: 12.4244, lng: 75.7382 },
  { id: "ooty", name: "Ooty", lat: 11.4102, lng: 76.695 },
  { id: "chikmagalur", name: "Chikkamagaluru", lat: 13.3161, lng: 75.772 },
  { id: "sakleshpur", name: "Sakleshpur", lat: 12.9442, lng: 75.7856 },
  { id: "hassan", name: "Hassan", lat: 13.0072, lng: 76.0962 },
  { id: "kabini", name: "Kabini", lat: 11.9369, lng: 76.284 },
  { id: "bandipur", name: "Bandipur", lat: 11.668, lng: 76.63 },
  { id: "wayanad", name: "Wayanad (Kalpetta)", lat: 11.6103, lng: 76.0828 },
  { id: "nandi-hills", name: "Nandi Hills", lat: 13.3702, lng: 77.6835 },
  { id: "hampi", name: "Hampi", lat: 15.335, lng: 76.46 },
  { id: "shivamogga", name: "Shivamogga", lat: 13.9299, lng: 75.5681 },
  { id: "mangaluru", name: "Mangaluru", lat: 12.9141, lng: 74.856 },
  { id: "udupi", name: "Udupi", lat: 13.3409, lng: 74.7421 },
  { id: "dharmasthala", name: "Dharmasthala", lat: 12.953, lng: 75.38 },
  { id: "murudeshwar", name: "Murudeshwar", lat: 14.094, lng: 74.484 },
  { id: "gokarna", name: "Gokarna", lat: 14.5479, lng: 74.3188 },
  { id: "goa", name: "Goa (Panaji)", lat: 15.4909, lng: 73.8278 },
  { id: "tirupati", name: "Tirupati", lat: 13.6288, lng: 79.4192 },
  { id: "chennai", name: "Chennai", lat: 13.0827, lng: 80.2707 },
  { id: "pondicherry", name: "Puducherry", lat: 11.9416, lng: 79.8083 },
  { id: "vellore", name: "Vellore", lat: 12.9165, lng: 79.1325 },
  { id: "hosur", name: "Hosur", lat: 12.7409, lng: 77.8253 },
  { id: "kolar", name: "Kolar", lat: 13.1357, lng: 78.1326 },
  { id: "yercaud", name: "Yercaud", lat: 11.7753, lng: 78.2093 },
  { id: "coimbatore", name: "Coimbatore", lat: 11.0168, lng: 76.9558 },
  { id: "kodaikanal", name: "Kodaikanal", lat: 10.2381, lng: 77.4892 },
  { id: "madurai", name: "Madurai", lat: 9.9252, lng: 78.1198 },
  { id: "kochi", name: "Kochi", lat: 9.9312, lng: 76.2673 },
  { id: "hyderabad", name: "Hyderabad", lat: 17.385, lng: 78.4867 },
];

export const ALL_PLACES: Place[] = [...BANGALORE_PLACES, ...OUTSTATION_CITIES];
export const findPlace = (id?: string | null) => ALL_PLACES.find((p) => p.id === id);

export const POPULAR_ROUTES: { to: string; km: number; hrs: string }[] = [
  { to: "mysuru", km: 145, hrs: "3.5 hrs" },
  { to: "coorg", km: 250, hrs: "5.5 hrs" },
  { to: "ooty", km: 270, hrs: "6.5 hrs" },
  { to: "chikmagalur", km: 245, hrs: "5 hrs" },
  { to: "tirupati", km: 250, hrs: "5 hrs" },
  { to: "pondicherry", km: 310, hrs: "6 hrs" },
  { to: "chennai", km: 345, hrs: "6.5 hrs" },
  { to: "hampi", km: 340, hrs: "6.5 hrs" },
];

export const FAQS = [
  {
    q: "How do I book a cab with RVS Tours and Travels?",
    a: "Choose your trip type, pick-up point, destination, date and time in the booking box, compare cabs with their fares, add your details and confirm. You can pay a small advance online with Razorpay, pay the full fare, or choose pay-to-driver. You can also book on call or WhatsApp at +91 98802 91934.",
  },
  {
    q: "What is included in the fare?",
    a: "The fare covers the vehicle, fuel, driver and driver allowance for the billed kilometres, plus 5% GST. Tolls, state permits and parking are charged as actuals. Night charges may apply for driving between 10 PM and 6 AM on outstation trips.",
  },
  {
    q: "Can I cancel or reschedule my booking?",
    a: "Yes. Cancellations made more than 24 hours before pick-up are fully refunded. See our Cancellation & Refund Policy for the complete slab-wise details. Rescheduling is free subject to vehicle availability.",
  },
  {
    q: "Do you provide employee transportation for companies?",
    a: "Yes — this is one of our core services. We run shift-based daily commute programmes with dedicated vehicles, trained drivers, night-shift safety protocols and monthly consolidated GST billing. Visit the Corporate page to request a proposal.",
  },
  {
    q: "Which payment methods do you accept?",
    a: "UPI, debit and credit cards, net banking and wallets through Razorpay's secure checkout, plus cash or UPI to the driver for pay-later bookings. Corporate clients can be billed monthly.",
  },
  {
    q: "Are your drivers verified?",
    a: "All our chauffeurs go through background and licence verification, and are trained in defensive driving and courteous customer service.",
  },
];
