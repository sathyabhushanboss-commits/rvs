import { NextResponse } from "next/server";

// Reverse geocode a dropped/dragged pin into a readable address.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lat = Number(searchParams.get("lat"));
  const lng = Number(searchParams.get("lng"));
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return NextResponse.json({ error: "Invalid coordinates" }, { status: 400 });
  const fallback = `Pinned location (${lat.toFixed(5)}, ${lng.toFixed(5)})`;
  try {
    const r = await fetch(`https://photon.komoot.io/reverse?lat=${lat}&lon=${lng}&lang=en`, {
      next: { revalidate: 86400 },
      signal: AbortSignal.timeout(6000),
    });
    const j = await r.json();
    const p = j?.features?.[0]?.properties;
    if (!p) return NextResponse.json({ label: fallback });
    const parts = [p.name, [p.housenumber, p.street].filter(Boolean).join(" "), p.locality || p.district, p.city]
      .filter((x: string | undefined, i: number, a: (string | undefined)[]) => !!x && a.indexOf(x) === i);
    return NextResponse.json({ label: parts.join(", ") || fallback });
  } catch {
    return NextResponse.json({ label: fallback });
  }
}
