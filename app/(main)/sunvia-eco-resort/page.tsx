import type { Metadata } from "next";
import SunviaEcoResortView from "@/src/view/sunvia-eco-resort/Index";
import { buildPageMetadata } from "@/src/lib/site";

export const metadata: Metadata = buildPageMetadata({
  title:
    "Sunvia Eco Resort | 5-Star Eco-Luxury Resort in Manikganj - Sun Holidays Ltd",
  description:
    "Experience sustainable luxury at Sunvia Eco Resort, a 12-acre nature-focused destination in Manikganj, Bangladesh. 100 premium accommodations, organic dining, adventure activities, and eco-friendly living. Opening 2029.",
  path: "/sunvia-eco-resort",
  keywords: [
    "Sunvia Eco Resort",
    "Eco Resort Bangladesh",
    "Manikganj Resort",
    "Luxury Eco Resort",
    "Nature Resort Bangladesh",
    "Sun Holidays Resort",
    "Sustainable Tourism Bangladesh",
  ],
});

export default function SunviaEcoResortPage() {
  return <SunviaEcoResortView />;
}
