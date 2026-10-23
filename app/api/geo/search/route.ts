import { NextResponse } from "next/server";
import { clientIp, rateLimited } from "@/lib/server";

// Address autocomplete (Photon / OpenStreetMap), biased to Bengaluru.
// scope=blr restricts to the Bengaluru region; scope=all searches across India.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim().slice(0, 120);
  const scope = searchParams.get("scope") === "all" ? "all" : "blr";
  if (q.length < 3) return NextResponse.json({ results: [] });
  if (rateLimited(`geo:${clientIp(req)}`, 240)) return NextResponse.json({ results: [] }, { status: 429 });

  const url = new URL("https://photon.komoot.io/api/");
  url.searchParams.set("q", q);
  url.searchParams.set("limit", "8");
  url.searchParams.set("lang", "en");
  url.searchParams.set("lat", "12.9716");
  url.searchParams.set("lon", "77.5946");
  if (scope === "blr") url.searchParams.set("bbox", "77.25,12.65,78.0,13.35");

  try {
    const r = await fetch(url, { next: { revalidate: 86400 }, signal: AbortSignal.timeout(6000) });
    if (!r.ok) throw new Error(String(r.status));
    const j = await r.json();
    const seen = new Set<string>();
    const results = (j.features || [])
      .filter((f: { properties?: { countrycode?: string } }) => f.properties?.countrycode === "IN")
      .map((f: { geometry: { coordinates: [number, number] }; properties: Record<string, string> }) => {
        const p = f.properties;
        const title = p.name || [p.housenumber, p.street].filter(Boolean).join(" ") || p.district || p.city || "Location";
        const sub = [p.name ? p.street : null, p.locality, p.district, p.city || p.county, p.state]
          .filter((x, i, a): x is string => !!x && x !== title && a.indexOf(x) === i)
          .join(", ");
        return { title, sub, lat: f.geometry.coordinates[1], lng: f.geometry.coordinates[0] };
      })
      .filter((x: { title: string; sub: string }) => {
        const k = `${x.title}|${x.sub}`;
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      })
      .slice(0, 6);
    return NextResponse.json({ results }, { headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800" } });
  } catch {
    return NextResponse.json({ results: [], error: "Search unavailable" }, { status: 200 });
  }
}
