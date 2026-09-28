export type ResortsListingResort = {
  id: string;
  name: string;
  tagline: string;
  location: string;
  category: "beach" | "city";
  rating: number;
  image: string;
  description: string;
  features: string[];
  established?: string;
  href: string;
  status: "available" | "coming-soon";
};

export type ResortsListingPageData = {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];
  metaOgImage: string;

  heroBackgroundImage: string;
  heroBadge: string;
  heroTitleBefore: string;
  heroTitleAccent: string;
  heroTagline: string;
  heroDescription: string;

  /** Shown in stats row (e.g. 10K+); beach/city/property counts are computed from listings */
  statGuestsValue: string;
  statGuestsLabel: string;

  beachSectionEyebrow: string;
  beachSectionTitleBefore: string;
  beachSectionTitleAccent: string;
  beachSectionDescription: string;

  citySectionEyebrow: string;
  citySectionTitleBefore: string;
  citySectionTitleAccent: string;
  citySectionDescription: string;

  ctaTitleBefore: string;
  ctaTitleAccent: string;
  ctaDescription: string;
  ctaPrimaryLabel: string;
  ctaPrimaryHref: string;
  ctaSecondaryLabel: string;
  ctaSecondaryHref: string;

  resorts: ResortsListingResort[];
};

export const defaultResortsListingPageData: ResortsListingPageData = {
  metaTitle: "Our Resorts & Hotels | Premium Accommodations - Sun Tourism Ltd",
  metaDescription:
    "Discover our collection of premium resorts and hotels across Bangladesh. From beachfront paradises to luxury city hotels, find your perfect stay with Sun Tourism Ltd.",
  metaKeywords: [
    "Sun Tourism Resorts",
    "Bangladesh Hotels",
    "Beach Resorts",
    "City Hotels",
    "Luxury Accommodation",
    "Cox's Bazar Hotels",
    "Saint Martin Resort",
  ],
  metaOgImage: "/sailor/SHA_6244 copy.jpg",

  heroBackgroundImage: "/sailor/SHA_6251.JPG",
  heroBadge: "Premium Accommodations",
  heroTitleBefore: "Our",
  heroTitleAccent: "Resorts",
  heroTagline: "Experience Luxury & Comfort",
  heroDescription:
    "Discover our collection of premium resorts and hotels across Bangladesh. From pristine beaches to vibrant cities, we offer exceptional stays.",

  statGuestsValue: "10K+",
  statGuestsLabel: "Happy Guests",

  beachSectionEyebrow: "Coastal Paradise",
  beachSectionTitleBefore: "Beach",
  beachSectionTitleAccent: "Resorts",
  beachSectionDescription: "Escape to our stunning beachfront properties where luxury meets the ocean",

  citySectionEyebrow: "Urban Comfort",
  citySectionTitleBefore: "City",
  citySectionTitleAccent: "Hotels",
  citySectionDescription: "Modern accommodations in the heart of Bangladesh's vibrant cities",

  ctaTitleBefore: "Ready to",
  ctaTitleAccent: "Book",
  ctaDescription:
    "Contact us today to reserve your perfect accommodation. Our team is ready to help you plan an unforgettable experience.",
  ctaPrimaryLabel: "Contact Us",
  ctaPrimaryHref: "/contact",
  ctaSecondaryLabel: "Explore Tour Packages",
  ctaSecondaryHref: "/tours",

  resorts: [
    {
      id: "sailor-moon",
      name: "Sailor Moon Resorts",
      tagline: "Premium 3-Star Beach Resort",
      location: "Saint Martin Island, Cox's Bazar",
      category: "beach",
      rating: 5,
      image: "/sailor/SHA_6244 copy.jpg",
      description:
        "Experience paradise at our finest resort in Saint Martin. Offering world-class amenities, stunning ocean views, and unforgettable beach experiences.",
      features: ["Beachfront Access", "Premium Dining", "BBQ & Party", "Beach Activities"],
      established: "2022",
      href: "/sailor-moon-resorts",
      status: "available",
    },
    {
      id: "grandeur-bliss",
      name: "Grandeur Bliss",
      tagline: "5-Star Luxury Resort",
      location: "Inani Beach, Cox's Bazar",
      category: "beach",
      rating: 5,
      image: "/Sun-Holidays-Leaflet-Editable.jpg",
      description:
        "A state-of-the-art luxury escape nestled adjacent to the serene Inani Beach. Experience sophistication and coastal tranquility.",
      features: ["250 Luxury Rooms", "Spa & Gym", "Conference Facilities", "Multiple Restaurants"],
      established: "Coming Soon",
      href: "/resort/grandeur-bliss",
      status: "coming-soon",
    },
    {
      id: "sunvia-eco-resort",
      name: "Sunvia Hotel & Resort",
      tagline: "Planned Hospitality Project",
      location: "Manikganj, Bangladesh",
      category: "city",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop",
      description:
        "A planned hospitality destination in Manikganj. Explore the project and the investment opportunity. Returns are not guaranteed.",
      features: ["50 Bigha Planned", "Hotel & Villas", "Investment Opportunity", "Not Yet Operating"],
      established: "In Planning",
      href: "/sunvia-hotel-resort",
      status: "coming-soon",
    },
  ],
};

export function mergeResortsListingPageData(
  partial?: Partial<ResortsListingPageData> | null
): ResortsListingPageData {
  const d = defaultResortsListingPageData;
  if (!partial) {
    return { ...d, resorts: d.resorts.map((r) => ({ ...r, features: [...r.features] })) };
  }

  const sunviaDefault = d.resorts.find((resort) => resort.id === "sunvia-eco-resort");
  const resorts: ResortsListingResort[] =
    partial.resorts && partial.resorts.length > 0
      ? partial.resorts.map((r) => {
          const next = {
            ...r,
            features: Array.isArray(r.features) && r.features.length > 0 ? [...r.features] : [],
            category: r.category === "city" ? ("city" as const) : ("beach" as const),
            status: r.status === "available" ? ("available" as const) : ("coming-soon" as const),
            rating: Math.min(5, Math.max(1, Number(r.rating) || 5)),
          };
          if (next.id === "sunvia-eco-resort" && next.href === "/sunvia-eco-resort") {
            next.href = "/sunvia-hotel-resort";
          }
          if (
            next.id === "sunvia-eco-resort" &&
            sunviaDefault &&
            /inani beach/i.test(next.description)
          ) {
            return { ...sunviaDefault, features: [...sunviaDefault.features] };
          }
          return next;
        })
      : d.resorts.map((r) => ({ ...r, features: [...r.features] }));

  return {
    ...d,
    ...partial,
    metaKeywords:
      partial.metaKeywords && partial.metaKeywords.length > 0 ? partial.metaKeywords : d.metaKeywords,
    resorts,
  };
}
