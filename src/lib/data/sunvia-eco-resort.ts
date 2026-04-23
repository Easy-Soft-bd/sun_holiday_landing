export const ACTIVITY_ICON_OPTIONS = [
  "LuWaves",
  "LuBaby",
  "LuShip",
  "LuSailboat",
  "LuBike",
  "LuZap",
  "LuFish",
  "LuPresentation",
  "LuDumbbell",
  "LuSparkles",
  "LuTreePine",
  "LuSquareActivity",
] as const;

export const SERVICE_ICON_OPTIONS = [
  "LuShield",
  "LuHeartPulse",
  "LuWashingMachine",
  "LuCar",
  "LuMap",
  "LuPlaneTakeoff",
] as const;

export type ActivityIcon = string;
export type ServiceIcon = string;

export const ACTIVITY_ICON_ALIASES: Record<string, string> = {
  pool: "LuWaves",
  kids: "LuBaby",
  boat: "LuShip",
  kayak: "LuSailboat",
  cycling: "LuBike",
  zipline: "LuZap",
  fishing: "LuFish",
  conference: "LuPresentation",
  gym: "LuDumbbell",
  spa: "LuSparkles",
  nature: "LuTreePine",
  playground: "LuSquareActivity",
};

export const SERVICE_ICON_ALIASES: Record<string, string> = {
  security: "LuShield",
  medical: "LuHeartPulse",
  laundry: "LuWashingMachine",
  car: "LuCar",
  guide: "LuMap",
  helipad: "LuPlaneTakeoff",
};

export interface ResortSeoData {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];
  metaImage: string;
}

export interface ResortHeroData {
  badgeText: string;
  locationText: string;
  titlePart1: string;
  titlePart2: string;
  subtitle: string;
  description: string;
  stat1Value: string;
  stat1Label: string;
  stat2Value: string;
  stat2Label: string;
  stat3Value: string;
  stat3Label: string;
  backgroundImage: string;
  ctaPrimaryText: string;
  ctaPrimaryHref: string;
  ctaSecondaryText: string;
  ctaSecondaryHref: string;
}

export interface ResortAboutHighlight {
  label: string;
  value: string;
}

export interface ResortAboutData {
  badgeText: string;
  heading: string;
  description: string;
  image: string;
  floatingBadgeText: string;
  highlights: ResortAboutHighlight[];
}

export interface ResortAccommodationItem {
  type: string;
  description: string;
  image: string;
  amenities: string[];
}

export interface ResortAccommodationData {
  eyebrow: string;
  titlePrefix: string;
  titleAccent: string;
  description: string;
  items: ResortAccommodationItem[];
}

export interface ResortDiningExperience {
  name: string;
  description: string;
  image: string;
}

export interface ResortDiningData {
  eyebrow: string;
  titlePrefix: string;
  titleAccent: string;
  description: string;
  cuisines: string[];
  experiences: ResortDiningExperience[];
}

export interface ResortActivityItem {
  name: string;
  icon: ActivityIcon;
}

export interface ResortActivitiesData {
  eyebrow: string;
  titlePrefix: string;
  titleAccent: string;
  description: string;
  items: ResortActivityItem[];
}

export interface ResortEcoFeature {
  title: string;
  description: string;
}

export interface ResortEcoData {
  badgeText: string;
  titlePrefix: string;
  titleAccent: string;
  description: string;
  image: string;
  floatingBadgeText: string;
  features: ResortEcoFeature[];
}

export interface ResortEventsData {
  badgeText: string;
  titlePrefix: string;
  titleAccent: string;
  description: string;
  image: string;
  maxCapacity: number;
  services: string[];
}

export interface ResortGalleryItem {
  src: string;
  alt: string;
}

export interface ResortGalleryData {
  eyebrow: string;
  titlePrefix: string;
  titleAccent: string;
  description: string;
  items: ResortGalleryItem[];
}

export interface ResortServiceItem {
  name: string;
  icon: ServiceIcon;
}

export interface ResortServicesData {
  eyebrow: string;
  titlePrefix: string;
  titleAccent: string;
  description: string;
  items: ResortServiceItem[];
}

export interface ResortContactData {
  eyebrow: string;
  titlePrefix: string;
  titleAccent: string;
  description: string;
  checkIn: string;
  checkOut: string;
  phones: string[];
  emails: string[];
  locationFull: string;
  audience: string[];
  ctaText: string;
  ctaHref: string;
  note: string;
}

export interface SunviaEcoResortPageData {
  seo: ResortSeoData;
  hero: ResortHeroData;
  about: ResortAboutData;
  accommodations: ResortAccommodationData;
  dining: ResortDiningData;
  activities: ResortActivitiesData;
  eco: ResortEcoData;
  events: ResortEventsData;
  gallery: ResortGalleryData;
  services: ResortServicesData;
  contact: ResortContactData;
}

export const RESORT_SECTION_KEYS = [
  "seo",
  "hero",
  "about",
  "accommodations",
  "dining",
  "activities",
  "eco",
  "events",
  "gallery",
  "services",
  "contact",
] as const;

export type ResortSectionKey = (typeof RESORT_SECTION_KEYS)[number];

export const defaultSunviaEcoResortPageData: SunviaEcoResortPageData = {
  seo: {
    metaTitle: "Sunvia Eco Resort | 5-Star Eco-Luxury Resort in Manikganj - Sun Holidays Ltd",
    metaDescription:
      "Experience sustainable luxury at Sunvia Eco Resort, a 12-acre nature-focused destination in Manikganj, Bangladesh. 100 premium accommodations, organic dining, adventure activities, and eco-friendly living.",
    metaKeywords: [
      "Sunvia Eco Resort",
      "Eco Resort Bangladesh",
      "Manikganj Resort",
      "Luxury Eco Resort",
      "Nature Resort Bangladesh",
      "Sun Holidays Resort",
      "Sustainable Tourism Bangladesh",
    ],
    metaImage:
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=2080&auto=format&fit=crop",
  },
  hero: {
    badgeText: "5-Star Eco-Luxury",
    locationText: "Manikganj, 1 Hour from Dhaka",
    titlePart1: "SUNVIA",
    titlePart2: "ECO RESORT",
    subtitle: "Where Nature Meets Luxury",
    description:
      "A premier 12-acre nature-focused destination with 100 luxury accommodations, curated dining, and eco-friendly adventures in the heart of Bangladesh.",
    stat1Value: "12 Acres",
    stat1Label: "Lush Grounds",
    stat2Value: "100+",
    stat2Label: "Luxury Units",
    stat3Value: "200-250",
    stat3Label: "Guest Capacity",
    backgroundImage:
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=2080&auto=format&fit=crop",
    ctaPrimaryText: "Plan Your Escape",
    ctaPrimaryHref: "#contact",
    ctaSecondaryText: "Explore Gallery",
    ctaSecondaryHref: "#gallery",
  },
  about: {
    badgeText: "About Our Resort",
    heading: "A Nature-Focused Destination",
    description:
      "Spanning 12 lush acres in Manikganj, Sunvia Eco Resort is a premier 5-star destination combining sustainability with modern sophistication. Surrounded by forests, lakes, and hills, the resort offers an immersive escape into nature without compromising on luxury.",
    image:
      "https://images.unsplash.com/photo-1602002418816-5c0aeef426aa?q=80&w=2074&auto=format&fit=crop",
    floatingBadgeText: "100% Eco-Friendly",
    highlights: [
      { label: "Area", value: "12 Acres" },
      { label: "Established", value: "2029" },
      { label: "Capacity", value: "200-250 Guests" },
    ],
  },
  accommodations: {
    eyebrow: "Stay With Us",
    titlePrefix: "Luxury",
    titleAccent: "Accommodations",
    description:
      "Choose from 100 thoughtfully designed units, each blending modern comfort with natural beauty.",
    items: [
      {
        type: "Deluxe Room",
        description:
          "Spacious rooms featuring modern interiors with calming earth tones, a private balcony overlooking the lake, and all essential amenities for a restful stay.",
        image:
          "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=2070&auto=format&fit=crop",
        amenities: ["Air Conditioning", "Smart TV", "Minibar", "Lake View", "Wi-Fi", "Balcony"],
      },
      {
        type: "Executive Suite",
        description:
          "Elegant suites with a separate living area, premium furnishings, panoramic views, and an upgraded minibar with local organic refreshments.",
        image:
          "https://images.unsplash.com/photo-1587061949409-02df41d5e562?q=80&w=2070&auto=format&fit=crop",
        amenities: ["Air Conditioning", "Smart TV", "Minibar", "Lake View", "Wi-Fi", "Balcony"],
      },
      {
        type: "Family Cottage",
        description:
          "Charming standalone cottages surrounded by greenery, perfect for families. Includes multiple bedrooms, a cozy porch, and kid-friendly arrangements.",
        image:
          "https://images.unsplash.com/photo-1587061949409-02df41d5e562?q=80&w=2070&auto=format&fit=crop",
        amenities: ["Air Conditioning", "Smart TV", "Minibar", "Garden View", "Wi-Fi", "Porch"],
      },
      {
        type: "VIP Villa",
        description:
          "Ultra-luxurious private villas with a personal butler, infinity pool access, designer interiors, and an exclusive garden terrace with breathtaking views.",
        image:
          "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070&auto=format&fit=crop",
        amenities: [
          "Air Conditioning",
          "Smart TV",
          "Minibar",
          "Panoramic View",
          "Wi-Fi",
          "Private Pool",
        ],
      },
    ],
  },
  dining: {
    eyebrow: "Culinary Experiences",
    titlePrefix: "A Culinary",
    titleAccent: "Journey",
    description:
      "Savour a world of flavours with our diverse dining options, prepared with fresh local and organic ingredients.",
    cuisines: ["Bangla", "Chinese", "Indian", "Continental", "Thai", "Bar-B-Q", "Organic / Hill Food"],
    experiences: [
      {
        name: "Halal Fine Dining",
        description: "Premium halal cuisine served in an elegant atmosphere.",
        image:
          "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070&auto=format&fit=crop",
      },
      {
        name: "Garden Dining",
        description: "Al-fresco meals surrounded by lush tropical gardens.",
        image:
          "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=2074&auto=format&fit=crop",
      },
      {
        name: "Lakeside Cafe",
        description: "Casual bites and artisan coffee with serene lake views.",
        image:
          "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2047&auto=format&fit=crop",
      },
      {
        name: "VIP Private Dining",
        description: "Exclusive dining with a personal chef and curated menu.",
        image:
          "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=2074&auto=format&fit=crop",
      },
    ],
  },
  activities: {
    eyebrow: "Fun & Adventure",
    titlePrefix: "Activities &",
    titleAccent: "Entertainment",
    description:
      "From adrenaline-pumping adventures to peaceful spa retreats, there is something for every guest.",
    items: [
      { name: "Swimming Pool", icon: "LuWaves" },
      { name: "Kids Zone", icon: "LuBaby" },
      { name: "Boat Rides", icon: "LuShip" },
      { name: "Kayak Rides", icon: "LuSailboat" },
      { name: "Cycling", icon: "LuBike" },
      { name: "Zip Line", icon: "LuZap" },
      { name: "Fishing Zone", icon: "LuFish" },
      { name: "Conference Hall", icon: "LuPresentation" },
      { name: "Gym & Fitness", icon: "LuDumbbell" },
      { name: "Spa & Wellness", icon: "LuSparkles" },
      { name: "Nature Tours", icon: "LuTreePine" },
      { name: "Open Playgrounds", icon: "LuSquareActivity" },
    ],
  },
  eco: {
    badgeText: "Eco-Friendly Living",
    titlePrefix: "Living in Harmony with",
    titleAccent: "Nature",
    description:
      "Sunvia Eco Resort is committed to sustainable tourism. Every aspect of our resort is designed to minimise environmental impact while maximising comfort and natural beauty.",
    image:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2232&auto=format&fit=crop",
    floatingBadgeText: "Carbon Neutral",
    features: [
      {
        title: "Solar Power System",
        description: "100% renewable energy powering the entire resort through advanced solar panels.",
      },
      {
        title: "Rainwater Harvesting",
        description: "Sophisticated systems collect and purify rainwater for resort use.",
      },
      {
        title: "Plastic-Free Initiative",
        description: "Complete elimination of single-use plastics across all operations.",
      },
      {
        title: "Forest Surroundings",
        description: "Preserved natural forest canopy covering 40% of the resort grounds.",
      },
      {
        title: "Lake Ecosystem",
        description: "A natural lake supporting local biodiversity and providing scenic beauty.",
      },
      {
        title: "Guided Nature Tours",
        description: "Expert-led eco tours educating guests about local flora and fauna.",
      },
    ],
  },
  events: {
    badgeText: "Venue & Events",
    titlePrefix: "Events &",
    titleAccent: "Celebrations",
    description:
      "From intimate gatherings to grand celebrations, our versatile event spaces are equipped with world-class facilities to make every occasion memorable.",
    image:
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=2098&auto=format&fit=crop",
    maxCapacity: 600,
    services: [
      "Weddings & Receptions",
      "Corporate Conferences",
      "Team Building Retreats",
      "Picnics & Day Events",
      "Sound & Lighting Setup",
      "Decoration & Catering",
    ],
  },
  gallery: {
    eyebrow: "Visual Tour",
    titlePrefix: "Photo",
    titleAccent: "Gallery",
    description: "Step inside the spaces, scenery, and experiences that define Sunvia Eco Resort.",
    items: [
      {
        src: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=2080&auto=format&fit=crop",
        alt: "Resort Aerial View",
      },
      {
        src: "https://images.unsplash.com/photo-1602002418816-5c0aeef426aa?q=80&w=2074&auto=format&fit=crop",
        alt: "Luxury Pool Area",
      },
      {
        src: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=2070&auto=format&fit=crop",
        alt: "Deluxe Room Interior",
      },
      {
        src: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070&auto=format&fit=crop",
        alt: "VIP Villa",
      },
      {
        src: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070&auto=format&fit=crop",
        alt: "Fine Dining",
      },
      {
        src: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2232&auto=format&fit=crop",
        alt: "Natural Landscape",
      },
      {
        src: "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=2074&auto=format&fit=crop",
        alt: "Garden Dining",
      },
      {
        src: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=2098&auto=format&fit=crop",
        alt: "Event Space",
      },
      {
        src: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=2098&auto=format&fit=crop",
        alt: "Executive Suite",
      },
    ],
  },
  services: {
    eyebrow: "Guest Support",
    titlePrefix: "Additional",
    titleAccent: "Services",
    description: "Everything you need for a worry-free, comfortable stay at our resort.",
    items: [
      { name: "24/7 Security & CCTV", icon: "LuShield" },
      { name: "Medical Support (50 Guests)", icon: "LuHeartPulse" },
      { name: "Laundry Service", icon: "LuWashingMachine" },
      { name: "Car Rental", icon: "LuCar" },
      { name: "Tour Guide Assistance", icon: "LuMap" },
      { name: "Helipad Access", icon: "LuPlaneTakeoff" },
    ],
  },
  contact: {
    eyebrow: "Plan Your Stay",
    titlePrefix: "Booking",
    titleAccent: "Information",
    description:
      "Ready to experience sustainable luxury? Get in touch with us to book your escape.",
    checkIn: "2:00 PM",
    checkOut: "12:00 PM",
    phones: ["+88 018 73 83 83 01", "+88 018 73 83 83 02"],
    emails: ["info@sunholidaysltd.com", "sunholidays07@gmail.com"],
    locationFull: "Bhum Dokshin, Singrai, Manikganj, Bangladesh",
    audience: ["Families", "Honeymoon Couples", "Corporate Clients"],
    ctaText: "Book Your Escape Now",
    ctaHref: "/contact",
    note: "* Advance booking recommended. Conditions apply.",
  },
};

type ValidationResult<T> = { success: true; data: T } | { success: false; error: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function cloneDefault<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function sanitizeString(value: unknown, fallback = "") {
  return typeof value === "string" ? value.trim() : fallback;
}

function normalizeIconName(
  value: unknown,
  aliases: Record<string, string>,
  fallback: string,
) {
  const icon = sanitizeString(value);
  return aliases[icon] || icon || fallback;
}

function sanitizeStringArray(value: unknown, min = 0, limit = 20) {
  if (!Array.isArray(value)) {
    return [] as string[];
  }

  return value
    .map((item) => sanitizeString(item))
    .filter(Boolean)
    .slice(0, limit)
    .filter((item, index, arr) => arr.indexOf(item) === index)
    .slice(0, Math.max(min, limit));
}

function isSafeHref(value: string) {
  return /^(\/|#|https?:\/\/|mailto:|tel:)/i.test(value);
}

function validateRequiredString(label: string, value: string, min = 1, max = 300) {
  if (!value || value.length < min) {
    return `${label} is required.`;
  }

  if (value.length > max) {
    return `${label} must be ${max} characters or fewer.`;
  }

  return null;
}

function mergeObject<T extends object>(fallback: T, value: unknown): T {
  if (!isRecord(value)) {
    return cloneDefault(fallback);
  }

  const fallbackRecord = fallback as Record<string, unknown>;
  const merged = cloneDefault(fallback) as Record<string, unknown>;

  Object.keys(fallbackRecord).forEach((key) => {
    const nextValue = value[key];
    const fallbackValue = fallbackRecord[key];

    if (Array.isArray(fallbackValue)) {
      return;
    }

    if (isRecord(fallbackValue) && isRecord(nextValue)) {
      merged[key] = {
        ...fallbackValue,
        ...nextValue,
      };
      return;
    }

    if (nextValue !== undefined) {
      merged[key] = nextValue;
    }
  });

  return merged as T;
}

export function mergeSunviaEcoResortPageData(
  raw?: Partial<SunviaEcoResortPageData> | null,
): SunviaEcoResortPageData {
  const defaults = cloneDefault(defaultSunviaEcoResortPageData);

  if (!raw || !isRecord(raw)) {
    return defaults;
  }

  return {
    seo: {
      ...defaults.seo,
      ...(isRecord(raw.seo) ? raw.seo : {}),
      metaKeywords: Array.isArray(raw.seo?.metaKeywords)
        ? sanitizeStringArray(raw.seo.metaKeywords, 1, 12)
        : defaults.seo.metaKeywords,
    },
    hero: mergeObject(defaults.hero, raw.hero),
    about: {
      ...mergeObject(defaults.about, raw.about),
      highlights: Array.isArray(raw.about?.highlights)
        ? raw.about.highlights
            .filter(isRecord)
            .map((item) => ({
              label: sanitizeString(item.label),
              value: sanitizeString(item.value),
            }))
            .filter((item) => item.label && item.value)
            .slice(0, 6)
        : defaults.about.highlights,
    },
    accommodations: {
      ...mergeObject(defaults.accommodations, raw.accommodations),
      items: Array.isArray(raw.accommodations?.items)
        ? raw.accommodations.items
            .filter(isRecord)
            .map((item) => ({
              type: sanitizeString(item.type),
              description: sanitizeString(item.description),
              image: sanitizeString(item.image),
              amenities: sanitizeStringArray(item.amenities, 1, 8),
            }))
            .filter((item) => item.type && item.description && item.image && item.amenities.length)
            .slice(0, 8)
        : defaults.accommodations.items,
    },
    dining: {
      ...mergeObject(defaults.dining, raw.dining),
      cuisines: Array.isArray(raw.dining?.cuisines)
        ? sanitizeStringArray(raw.dining.cuisines, 1, 12)
        : defaults.dining.cuisines,
      experiences: Array.isArray(raw.dining?.experiences)
        ? raw.dining.experiences
            .filter(isRecord)
            .map((item) => ({
              name: sanitizeString(item.name),
              description: sanitizeString(item.description),
              image: sanitizeString(item.image),
            }))
            .filter((item) => item.name && item.description && item.image)
            .slice(0, 8)
        : defaults.dining.experiences,
    },
    activities: {
      ...mergeObject(defaults.activities, raw.activities),
      items: Array.isArray(raw.activities?.items)
        ? raw.activities.items
            .filter(isRecord)
            .map((item) => ({
              name: sanitizeString(item.name),
              icon: normalizeIconName(item.icon, ACTIVITY_ICON_ALIASES, defaults.activities.items[0].icon),
            }))
            .filter((item) => item.name)
            .slice(0, 18)
        : defaults.activities.items,
    },
    eco: {
      ...mergeObject(defaults.eco, raw.eco),
      features: Array.isArray(raw.eco?.features)
        ? raw.eco.features
            .filter(isRecord)
            .map((item) => ({
              title: sanitizeString(item.title),
              description: sanitizeString(item.description),
            }))
            .filter((item) => item.title && item.description)
            .slice(0, 12)
        : defaults.eco.features,
    },
    events: {
      ...mergeObject(defaults.events, raw.events),
      maxCapacity:
        typeof raw.events?.maxCapacity === "number" && Number.isFinite(raw.events.maxCapacity)
          ? raw.events.maxCapacity
          : defaults.events.maxCapacity,
      services: Array.isArray(raw.events?.services)
        ? sanitizeStringArray(raw.events.services, 1, 12)
        : defaults.events.services,
    },
    gallery: {
      ...mergeObject(defaults.gallery, raw.gallery),
      items: Array.isArray(raw.gallery?.items)
        ? raw.gallery.items
            .filter(isRecord)
            .map((item) => ({
              src: sanitizeString(item.src),
              alt: sanitizeString(item.alt),
            }))
            .filter((item) => item.src && item.alt)
            .slice(0, 18)
        : defaults.gallery.items,
    },
    services: {
      ...mergeObject(defaults.services, raw.services),
      items: Array.isArray(raw.services?.items)
        ? raw.services.items
            .filter(isRecord)
            .map((item) => ({
              name: sanitizeString(item.name),
              icon: normalizeIconName(item.icon, SERVICE_ICON_ALIASES, defaults.services.items[0].icon),
            }))
            .filter((item) => item.name)
            .slice(0, 12)
        : defaults.services.items,
    },
    contact: {
      ...mergeObject(defaults.contact, raw.contact),
      phones: Array.isArray(raw.contact?.phones)
        ? sanitizeStringArray(raw.contact.phones, 1, 6)
        : defaults.contact.phones,
      emails: Array.isArray(raw.contact?.emails)
        ? sanitizeStringArray(raw.contact.emails, 1, 6)
        : defaults.contact.emails,
      audience: Array.isArray(raw.contact?.audience)
        ? sanitizeStringArray(raw.contact.audience, 1, 8)
        : defaults.contact.audience,
    },
  };
}

export function isResortSectionKey(value: unknown): value is ResortSectionKey {
  return typeof value === "string" && RESORT_SECTION_KEYS.includes(value as ResortSectionKey);
}

export function validateSunviaEcoResortSection(
  section: ResortSectionKey,
  value: unknown,
): ValidationResult<SunviaEcoResortPageData[ResortSectionKey]> {
  const merged = mergeSunviaEcoResortPageData({ [section]: value } as Partial<SunviaEcoResortPageData>);
  const data = merged[section];

  switch (section) {
    case "seo": {
      const seo = data as ResortSeoData;
      const titleError = validateRequiredString("Meta title", seo.metaTitle, 10, 70);
      if (titleError) return { success: false, error: titleError };
      const descriptionError = validateRequiredString("Meta description", seo.metaDescription, 50, 170);
      if (descriptionError) return { success: false, error: descriptionError };
      if (!seo.metaKeywords.length) return { success: false, error: "Add at least one SEO keyword." };
      return { success: true, data: seo };
    }
    case "hero": {
      const hero = data as ResortHeroData;
      const fields: Array<[string, string, number, number]> = [
        ["Badge text", hero.badgeText, 2, 40],
        ["Location text", hero.locationText, 2, 80],
        ["Title part 1", hero.titlePart1, 2, 40],
        ["Title part 2", hero.titlePart2, 2, 60],
        ["Subtitle", hero.subtitle, 2, 80],
        ["Description", hero.description, 50, 220],
        ["Primary CTA text", hero.ctaPrimaryText, 2, 30],
        ["Secondary CTA text", hero.ctaSecondaryText, 2, 30],
      ];
      for (const [label, fieldValue, min, max] of fields) {
        const error = validateRequiredString(label, fieldValue, min, max);
        if (error) return { success: false, error };
      }
      if (!isSafeHref(hero.ctaPrimaryHref) || !isSafeHref(hero.ctaSecondaryHref)) {
        return { success: false, error: "Hero CTA links must be valid internal anchors, paths, or URLs." };
      }
      return { success: true, data: hero };
    }
    case "about": {
      const about = data as ResortAboutData;
      const headingError = validateRequiredString("About heading", about.heading, 5, 90);
      if (headingError) return { success: false, error: headingError };
      const descriptionError = validateRequiredString("About description", about.description, 80, 450);
      if (descriptionError) return { success: false, error: descriptionError };
      if (about.highlights.length < 2) {
        return { success: false, error: "Add at least two about highlights." };
      }
      return { success: true, data: about };
    }
    case "accommodations": {
      const accommodations = data as ResortAccommodationData;
      const titleError = validateRequiredString("Accommodation title", accommodations.titleAccent, 2, 40);
      if (titleError) return { success: false, error: titleError };
      if (accommodations.items.length < 1) {
        return { success: false, error: "Add at least one accommodation item." };
      }
      return { success: true, data: accommodations };
    }
    case "dining": {
      const dining = data as ResortDiningData;
      if (!dining.cuisines.length) {
        return { success: false, error: "Add at least one cuisine tag." };
      }
      if (!dining.experiences.length) {
        return { success: false, error: "Add at least one dining experience." };
      }
      return { success: true, data: dining };
    }
    case "activities": {
      const activities = data as ResortActivitiesData;
      if (activities.items.length < 4) {
        return { success: false, error: "Add at least four activities." };
      }
      return { success: true, data: activities };
    }
    case "eco": {
      const eco = data as ResortEcoData;
      const descError = validateRequiredString("Eco description", eco.description, 60, 400);
      if (descError) return { success: false, error: descError };
      if (eco.features.length < 2) {
        return { success: false, error: "Add at least two eco features." };
      }
      return { success: true, data: eco };
    }
    case "events": {
      const events = data as ResortEventsData;
      if (events.maxCapacity < 1 || events.maxCapacity > 50000) {
        return { success: false, error: "Event capacity must be between 1 and 50000." };
      }
      if (!events.services.length) {
        return { success: false, error: "Add at least one event service." };
      }
      return { success: true, data: events };
    }
    case "gallery": {
      const gallery = data as ResortGalleryData;
      if (gallery.items.length < 4) {
        return { success: false, error: "Add at least four gallery images." };
      }
      return { success: true, data: gallery };
    }
    case "services": {
      const services = data as ResortServicesData;
      if (services.items.length < 3) {
        return { success: false, error: "Add at least three services." };
      }
      return { success: true, data: services };
    }
    case "contact": {
      const contact = data as ResortContactData;
      if (!contact.phones.length) return { success: false, error: "Add at least one phone number." };
      if (!contact.emails.length) return { success: false, error: "Add at least one email address." };
      if (!contact.audience.length) return { success: false, error: "Add at least one target audience." };
      if (!isSafeHref(contact.ctaHref)) {
        return { success: false, error: "Contact CTA link must be a valid path, anchor, or URL." };
      }
      return { success: true, data: contact };
    }
    default:
      return { success: false, error: "Unsupported section." };
  }
}
