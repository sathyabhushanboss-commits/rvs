import type { MetadataRoute } from "next";
import { COMPANY } from "@/lib/data";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: COMPANY.name,
    short_name: "RVS Travels",
    description: "Premium cab booking and corporate transport in Bengaluru",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#12276b",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
