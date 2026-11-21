import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/plus-jakarta-sans";
import "./globals.css";
import { Footer, FloatingContact, Header } from "@/components/ui";
import { COMPANY, SERVICES } from "@/lib/data";

export const metadata: Metadata = {
  metadataBase: new URL(COMPANY.url),
  title: {
    default: "RVS Tours and Travels | Premium Cab Booking & Corporate Transport in Bangalore",
    template: "%s | RVS Tours and Travels",
  },
  description:
    "Book premium cabs in Bangalore — Innova Crysta, Hycross, Vellfire, Mercedes E & S-Class, Urbania and Tempo Traveller. Airport transfers, outstation trips, local packages and corporate employee transportation. 24×7 on +91 98802 91934.",
  keywords: [
    "cab booking Bangalore",
    "taxi service Bangalore",
    "outstation cabs from Bangalore",
    "airport taxi Bangalore",
    "Innova Crysta rental Bangalore",
    "Tempo Traveller Bangalore",
    "Force Urbania rental",
    "Mercedes car rental Bangalore",
    "Toyota Vellfire rental",
    "corporate employee transportation Bangalore",
    "RVS Tours and Travels",
  ],
  applicationName: COMPANY.short,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: COMPANY.name,
    title: "RVS Tours and Travels — Premium Cabs & Corporate Transport, Bangalore",
    description: "Airport transfers, outstation trips, local packages, luxury cars and employee transportation. Book online in a minute.",
    images: [{ url: "/logo.png", width: 1200, height: 466, alt: COMPANY.name }],
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
  formatDetection: { telephone: true },
};

export const viewport: Viewport = {
  themeColor: "#12276b",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "TaxiService",
  name: COMPANY.name,
  url: COMPANY.url,
  logo: `${COMPANY.url}/logo.png`,
  telephone: COMPANY.phone,
  email: COMPANY.email,
  areaServed: [{ "@type": "City", name: "Bengaluru" }, { "@type": "State", name: "Karnataka" }],
  address: { "@type": "PostalAddress", addressLocality: "Bengaluru", addressRegion: "Karnataka", addressCountry: "IN" },
  provider: { "@type": "LocalBusiness", name: COMPANY.name, telephone: COMPANY.phone, priceRange: "₹₹" },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Transport services",
    itemListElement: SERVICES.map((s) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: s.title, description: s.short } })),
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN">
      <body className="min-h-screen font-sans">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <Header />
        <main>{children}</main>
        <Footer />
        <FloatingContact />
      </body>
    </html>
  );
}
