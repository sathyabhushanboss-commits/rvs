import type { Metadata } from "next";
import { ContactCTA, FleetGrid, PageHero } from "@/components/ui";

export const metadata: Metadata = {
  title: "Our Fleet — Innova Crysta, Hycross, Vellfire, Mercedes, Urbania & Tempo Traveller",
  description:
    "Explore RVS Tours' premium fleet in Bangalore: Toyota Innova Crysta, Innova Hycross, Toyota Vellfire, Force Urbania, Mercedes-Benz E-Class & S-Class, sedans, MUVs and Tempo Travellers.",
  alternates: { canonical: "/fleet" },
};

export default function FleetPage() {
  return (
    <>
      <PageHero eyebrow="Premium fleet" title={<>From everyday sedans to the <span className="text-red-400">S-Class</span>.</>} desc="Nine vehicle classes, all chauffeur-driven. Filter by category, compare rates and book in a tap." />
      <section className="mx-auto max-w-7xl px-4 py-16">
        <FleetGrid />
      </section>
      <ContactCTA />
    </>
  );
}
