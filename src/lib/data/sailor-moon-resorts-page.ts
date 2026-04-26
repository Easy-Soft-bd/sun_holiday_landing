export type SailorMoonResortFeature = {
  title: string;
  description: string;
  /** React Icons name, e.g. `LuUtensils` (see IconPicker / IconRenderer) */
  icon: string;
};

/** Maps old CMS keys to React Icons names for backward compatibility */
export const SAILOR_MOON_LEGACY_FEATURE_ICONS: Record<string, string> = {
  dining: "LuUtensils",
  bbq: "LuPartyPopper",
  rest: "LuArmchair",
  beach: "LuWaves",
};

export function normalizeSailorMoonFeatureIcon(icon: string): string {
  const t = (icon || "").trim();
  if (!t) {
    return "LuStar";
  }
  return SAILOR_MOON_LEGACY_FEATURE_ICONS[t] ?? t;
}

function normalizeFeatures(features: SailorMoonResortFeature[]): SailorMoonResortFeature[] {
  return features.map((f) => ({
    ...f,
    icon: normalizeSailorMoonFeatureIcon(f.icon),
  }));
}

export type SailorMoonResortsPageData = {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];
  metaOgImage: string;

  name: string;
  location: string;
  description: string;
  tagline: string;
  features: SailorMoonResortFeature[];
  images: string[];
  galleryMaxItems: number;
  checkIn: string;
  checkOut: string;
  contact: {
    phone: string[];
    email: string[];
  };

  heroBadge: string;
  heroTitleLine1: string;
  heroTitleLine2: string;
  heroWelcome: string;
  heroBookCtaText: string;
  heroBookCtaHref: string;
  heroGalleryCtaText: string;
  heroGalleryCtaHref: string;

  aboutEyebrow: string;
  aboutHeadingBefore: string;
  aboutHeadingAccent: string;
  highlight1Title: string;
  highlight1Subtitle: string;
  highlight2Title: string;
  highlight2Subtitle: string;
  highlight3Title: string;
  highlight3Subtitle: string;

  facilitiesEyebrow: string;
  facilitiesHeadingBefore: string;
  facilitiesHeadingAccent: string;

  galleryEyebrow: string;
  galleryHeadingBefore: string;
  galleryHeadingAccent: string;

  bookingEyebrow: string;
  bookingHeadingBefore: string;
  bookingHeadingAccent: string;
  bookingIntro: string;
  bookingCtaText: string;
  bookingCtaHref: string;
  bookingDisclaimer: string;

  locationEyebrow: string;
  locationHeadingBefore: string;
  locationHeadingAccent: string;
};

export const defaultSailorMoonResortsPageData: SailorMoonResortsPageData = {
  metaTitle: "Sailor Moon Resorts, Saint Martin | Premium Beach Resort - Sun Tourism Ltd",
  metaDescription:
    "Experience paradise at Sailor Moon Resorts, Saint Martin. Premium 3-star beach resort offering dining, BBQ, beach activities, and stunning ocean views. Book your stay at Cox's Bazar's finest resort.",
  metaKeywords: [
    "Sailor Moon Resort",
    "Saint Martin Resort",
    "Cox's Bazar Beach Resort",
    "Bangladesh Beach Hotel",
    "Sun Holidays Resort",
    "Saint Martin Island Accommodation",
  ],
  metaOgImage: "/sailor/SHA_6244 copy.jpg",

  name: "Sailor Moon Resorts, Saint Martin",
  location: "West Sea-Beach Konarpara, Saint Martin, Cox's Bazar, Bangladesh",
  description:
    "Sailor Moon Resorts, Saint Martin is situated at West Sea-Beach Konarpara, Saint Martin, Cox's Bazar, Bangladesh. We own this resort since 2022. Sailor Moon Resorts one of the finest resort in Saint Martin. With the variety of services Sailor Moon Resort try to provide the best value for money service to their customer. 100% Customer Satisfactory obtaining is our main goal.",
  tagline: "Premium 3 star Resorts experience",
  features: [
    {
      title: "Dining",
      description:
        "The Sailor Moon Resort, Saint Martin in Cox's Bazar offers a diverse and tantalizing dining experience, featuring an array of delectable cuisines picturesque dining settings overlooking the stunning beach.",
      icon: "LuUtensils",
    },
    {
      title: "BBQ & Party",
      description:
        "The Sailor Moon Resort, Saint Martin in Cox's Bazar offers an enticing BBQ and party experience, providing guests with delectable grilled delights and a vibrant atmosphere, creating memorable moments for gatherings and celebrations.",
      icon: "LuPartyPopper",
    },
    {
      title: "Resting Area",
      description:
        "The Sailor Moon Resort, Saint Martin in Cox's Bazar offers a calm and pleasant resting space where visitors may unwind and relax while taking in the spectacular views of the coastline.",
      icon: "LuArmchair",
    },
    {
      title: "Beach Activities",
      description:
        "The Sailor Moon Resort, Saint Martin in Cox's Bazar offers a plethora of beach activities, including sunbathing, swimming, beach volleyball ensuring a fun-filled and rejuvenating experience for all guests.",
      icon: "LuWaves",
    },
  ],
  images: [
    "/sailor/SHA_6244 copy.jpg",
    "/sailor/SHA_6251.JPG",
    "/sailor/Sailor_Room_1.jpg",
    "/sailor/sailor_ (16).jpg",
    "/sailor/sailor_ (17).jpg",
    "/sailor/sailor_ (2).jpg",
    "/sailor/sailor_ (21).jpg",
    "/sailor/sailor_ (26).jpg",
    "/sailor/sailor_ (28).jpg",
    "/sailor/sailor_ (31).jpg",
    "/sailor/sailor_ (5).jpg",
    "/sailor/sailor_-(11).jpg",
    "/sailor/sailor_-(30).jpg",
    "/sailor/sailor_-(8).jpg",
  ],
  galleryMaxItems: 12,
  checkIn: "12:00 PM",
  checkOut: "11:00 AM",
  contact: {
    phone: ["+88 02 2222 43452", "+88 018 73 83 83 01", "+88 018 73 83 83 02"],
    email: ["info@sunholidaysltd.com", "sunholidays07@gmail.com"],
  },

  heroBadge: "Saint Martin Island",
  heroTitleLine1: "Sailor Moon",
  heroTitleLine2: "Resorts",
  heroWelcome: "Welcome to Sailor Moon Resort, Saint Martin where enchantment meets relaxation!",
  heroBookCtaText: "Book Now",
  heroBookCtaHref: "#booking",
  heroGalleryCtaText: "View Gallery",
  heroGalleryCtaHref: "#gallery",

  aboutEyebrow: "About Our Resort",
  aboutHeadingBefore: "Experience Paradise on",
  aboutHeadingAccent: "Saint Martin",
  highlight1Title: "Premium 3-Star",
  highlight1Subtitle: "Finest resort experience in Saint Martin",
  highlight2Title: "Since 2022",
  highlight2Subtitle: "Serving guests with excellence",
  highlight3Title: "Prime Location",
  highlight3Subtitle: "West Sea-Beach Konarpara",

  facilitiesEyebrow: "Our Facilities",
  facilitiesHeadingBefore: "Premium",
  facilitiesHeadingAccent: "Amenities",

  galleryEyebrow: "Explore Our Resort",
  galleryHeadingBefore: "Photo",
  galleryHeadingAccent: "Gallery",

  bookingEyebrow: "Plan Your Stay",
  bookingHeadingBefore: "Booking",
  bookingHeadingAccent: "Information",
  bookingIntro: "We provide the best price in Saint Martin",
  bookingCtaText: "Book Your Stay Now",
  bookingCtaHref: "/contact",
  bookingDisclaimer: "*Conditions apply",

  locationEyebrow: "Find Us",
  locationHeadingBefore: "Our",
  locationHeadingAccent: "Location",
};

export function mergeSailorMoonResortsPageData(
  partial?: Partial<SailorMoonResortsPageData> | null
): SailorMoonResortsPageData {
  const d = defaultSailorMoonResortsPageData;
  if (!partial) {
    return { ...d };
  }

  return {
    ...d,
    ...partial,
    metaKeywords:
      partial.metaKeywords && partial.metaKeywords.length > 0 ? partial.metaKeywords : d.metaKeywords,
    features:
      partial.features && partial.features.length > 0 ? normalizeFeatures(partial.features) : d.features,
    images: partial.images && partial.images.length > 0 ? partial.images : d.images,
    contact: {
      phone:
        partial.contact?.phone && partial.contact.phone.length > 0
          ? partial.contact.phone
          : d.contact.phone,
      email:
        partial.contact?.email && partial.contact.email.length > 0
          ? partial.contact.email
          : d.contact.email,
    },
  };
}
