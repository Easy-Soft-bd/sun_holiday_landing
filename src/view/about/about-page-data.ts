import { sanitizeSocialUrl } from "@/src/lib/social-links";

export type AboutPoint = {
  title: string;
  description: string;
  icon: string;
};

export type AboutSocialLink = {
  label: string;
  icon: string;
  url: string;
};

export type AboutPageData = {
  heroBadgeText: string;
  /** Words before the colored part of the hero title. */
  heroTitleLead: string;
  /** Colored words in the hero title. */
  heroTitleAccent: string;
  /** Full hero title, kept in sync with the lead and accent. */
  heroTitleMain: string;
  heroTitleSub: string;
  heroDescription: string;
  heroBackgroundImage: string;
  storyImage: string;
  storyImageAlt: string;
  storyCaption: string;
  storyBadgeText: string;
  storyTitle: string;
  storyParagraph1: string;
  storyParagraph2: string;
  visionTitle: string;
  visionIcon: string;
  visionParagraph1: string;
  visionParagraph2: string;
  missionIcon: string;
  missionTitle: string;
  missionParagraph1: string;
  missionParagraph2: string;
  valuesBadgeText: string;
  valuesTitle: string;
  valuesIntro: string;
  values: AboutPoint[];
  strategyBadgeText: string;
  strategyTitle: string;
  strategyIntro: string;
  strategy: AboutPoint[];
  officeTitle: string;
  officeAddressHtml: string;
  contactButtonText: string;
  contactButtonLink: string;
  callButtonText: string;
  callButtonLink: string;
  socialBadgeText: string;
  socialTitle: string;
  socialIntro: string;
  socialLinks: AboutSocialLink[];
};

export const defaultAboutPageData: AboutPageData = {
  heroBadgeText: "Est. Nov 8, 2021",
  heroTitleLead: "About",
  heroTitleAccent: "Sun Tourism",
  heroTitleMain: "About Sun Tourism",
  heroTitleSub: "Crafting Unforgettable Journeys",
  heroDescription:
    "Your trusted partner in exploring the world, committed to excellence and care in every trip.",
  heroBackgroundImage:
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop",
  storyImage:
    "https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=2070&auto=format&fit=crop",
  storyImageAlt: "Group of friends traveling",
  storyCaption: "Est. Nov 8, 2021",
  storyBadgeText: "Our Origin",
  storyTitle: "Born from Passion",
  storyParagraph1:
    "Sun Tourism Ltd. started when a group of friends decided to make something out of their common passion for travel.",
  storyParagraph2:
    "Armed with a wide array of experience brought by their many travels within Bangladesh and abroad, these friends bonded together to form Sun Tourism Ltd.",
  visionTitle: "Our Vision",
  visionIcon: "LuEye",
  visionParagraph1:
    "To be the First Choice for Clients and Companies. Our personnel are dedicated to learning as much about a destination as possible.",
  visionParagraph2:
    "We are the type of travelers that come back from a city with an abundance of suggestions. We can recommend beaches, hidden oases, restaurants, and shopping to curiosity.",
  missionIcon: "LuHeart",
  missionTitle: "Our Mission",
  missionParagraph1:
    "Customer Service with Care, Empathy & Love. To create and provide a total Travel Management Package in terms of providing comprehensive and professionally effective service at minimum cost to the customer.",
  missionParagraph2:
    "We utilize an environment that promotes total commitment and growth, aiming to become the largest and most reliable Travel Organization in the region.",
  valuesBadgeText: "What we stand for",
  valuesTitle: "Our Values",
  valuesIntro:
    "The promises we keep with travelers, partners, and our own team.",
  values: [
    {
      title: "Care",
      description:
        "Every guest is looked after with patience, from the first question until they are home.",
      icon: "LuHeart",
    },
    {
      title: "Honesty",
      description:
        "We say what a trip includes, what it costs, and what to expect before anyone books.",
      icon: "LuShieldCheck",
    },
    {
      title: "Local knowledge",
      description:
        "Recommendations come from people who have walked the place, not from a generic list.",
      icon: "LuCompass",
    },
    {
      title: "Reliability",
      description:
        "Visas, tickets, and stays are handled carefully so the plan holds together.",
      icon: "LuBadgeCheck",
    },
  ],
  strategyBadgeText: "How we work",
  strategyTitle: "Our Strategy",
  strategyIntro:
    "A simple way of working that keeps service personal as the company grows.",
  strategy: [
    {
      title: "Listen first",
      description: "We start with who is traveling, then shape the trip around them.",
      icon: "LuEar",
    },
    {
      title: "One plan",
      description:
        "Tickets, visas, hotels, and support stay with one team instead of being passed around.",
      icon: "LuRoute",
    },
    {
      title: "Long relationships",
      description:
        "Repeat guests and company accounts are served by people who already know them.",
      icon: "LuHandshake",
    },
  ],
  officeTitle: "Visit Our Office",
  officeAddressHtml:
    "362/1, Holding 13/1 (2nd Floor), Old-27 New-16<br/>Dhanmondi, Dhaka-1209, Bangladesh.",
  contactButtonText: "Contact Us",
  contactButtonLink: "mailto:info@sunholidaysltd.com",
  callButtonText: "Call Support",
  callButtonLink: "tel:+8801873838301",
  socialBadgeText: "Stay in touch",
  socialTitle: "Social Media",
  socialIntro: "Follow Sun Tourism for trips, offers, and updates.",
  socialLinks: [
    { label: "Facebook", icon: "SiFacebook", url: "" },
    { label: "Instagram", icon: "SiInstagram", url: "" },
    { label: "YouTube", icon: "SiYoutube", url: "" },
    { label: "WhatsApp", icon: "SiWhatsapp", url: "" },
  ],
};

function splitHeroTitle(main: string) {
  const words = main.trim().split(/\s+/).filter(Boolean);
  if (words.length <= 2) {
    return { lead: "", accent: words.join(" ") };
  }
  return { lead: words.slice(0, -2).join(" "), accent: words.slice(-2).join(" ") };
}

function normalizeSocial(items: AboutSocialLink[] | undefined, fallback: AboutSocialLink[]): AboutSocialLink[] {
  if (!Array.isArray(items)) return fallback;
  return items
    .map((item) => ({
      label: String(item?.label ?? "").trim(),
      icon: String(item?.icon ?? "").trim() || "LuGlobe",
      url: sanitizeSocialUrl(item?.url),
    }))
    .filter((item) => item.label || item.url);
}

function normalizePoints(items: AboutPoint[] | undefined, fallback: AboutPoint[]): AboutPoint[] {
  if (!Array.isArray(items)) return fallback;
  return items
    .map((item, index) => ({
      title: String(item?.title ?? "").trim(),
      description: String(item?.description ?? "").trim(),
      icon: String(item?.icon ?? "").trim() || fallback[index]?.icon || "LuStar",
    }))
    .filter((item) => item.title);
}

/** Fill missing About fields from defaults without overwriting saved copy. */
export function mergeAboutPageData(partial?: Partial<AboutPageData> | null): AboutPageData {
  const d = defaultAboutPageData;
  const p = partial ?? {};
  const savedMain = typeof p.heroTitleMain === "string" ? p.heroTitleMain : d.heroTitleMain;
  const split = splitHeroTitle(savedMain);
  const heroTitleLead = typeof p.heroTitleLead === "string" ? p.heroTitleLead.trim() : split.lead;
  const heroTitleAccent = typeof p.heroTitleAccent === "string" ? p.heroTitleAccent.trim() : split.accent;
  const heroTitleMain = [heroTitleLead, heroTitleAccent].filter(Boolean).join(" ") || savedMain;
  const heroBadgeText =
    typeof p.heroBadgeText === "string" && p.heroBadgeText.trim() ? p.heroBadgeText.trim() : d.heroBadgeText;
  const storyCaption =
    typeof p.storyCaption === "string" && p.storyCaption.trim() ? p.storyCaption.trim() : heroBadgeText;

  return {
    ...d,
    ...p,
    heroBadgeText,
    heroTitleLead,
    heroTitleAccent,
    heroTitleMain,
    storyImageAlt:
      typeof p.storyImageAlt === "string" && p.storyImageAlt.trim() ? p.storyImageAlt.trim() : d.storyImageAlt,
    storyCaption,
    visionIcon: typeof p.visionIcon === "string" && p.visionIcon.trim() ? p.visionIcon.trim() : d.visionIcon,
    missionIcon: typeof p.missionIcon === "string" && p.missionIcon.trim() ? p.missionIcon.trim() : d.missionIcon,
    values: normalizePoints(p.values, d.values),
    strategy: normalizePoints(p.strategy, d.strategy),
    socialLinks: normalizeSocial(p.socialLinks, d.socialLinks),
  };
}
