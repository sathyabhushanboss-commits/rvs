import { NextResponse } from "next/server";
import { routeBetween } from "@/lib/server";

// Driving distance, duration and route polyline between two points.
// Query: ?from=lat,lng&to=lat,lng
const parse = (v: string | null) => {
  const [lat, lng] = (v || "").split(",").map(Number);
  return Number.isFinite(lat) && Number.isFinite(lng) ? { lat, lng } : null;
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const from = parse(searchParams.get("from"));
  const to = parse(searchParams.get("to"));
  if (!from || !to) return NextResponse.json({ error: "from and to are required" }, { status: 400 });
  const route = await routeBetween(from, to);
  return NextResponse.json(route, { headers: { "Cache-Control": "public, s-maxage=86400" } });
}
