import type { MetadataRoute } from "next";
import { COMPANY, POLICY_LINKS } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const main = ["", "/book", "/about", "/services", "/fleet", "/corporate", "/contact"].map((p, i) => ({
    url: `${COMPANY.url}${p}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: i === 0 ? 1 : 0.8,
  }));
  const policies = POLICY_LINKS.map((p) => ({ url: `${COMPANY.url}/policies/${p.slug}`, lastModified: now, changeFrequency: "yearly" as const, priority: 0.3 }));
  return [...main, ...policies];
}
