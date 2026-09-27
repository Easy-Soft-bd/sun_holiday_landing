export interface InvestorSeoData {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];
  metaImage: string;
}

export interface InvestorHeroData {
  projectName: string;
  eyebrow: string;
  headline: string;
  supportLine: string;
  unitLabel: string;
  unitValue: string;
  paymentLabel: string;
  paymentValue: string;
  backgroundImage: string;
  ctaPrimaryText: string;
  ctaPrimaryHref: string;
  ctaSecondaryText: string;
  whatsappNumber: string;
  whatsappMessage: string;
}

export interface PlanHighlight {
  value: string;
  label: string;
  image: string;
}

export interface PlanZone {
  title: string;
  description: string;
}

export interface MasterPlanData {
  eyebrow: string;
  heading: string;
  description: string;
  image: string;
  imageAlt: string;
  highlights: PlanHighlight[];
  labels: string[];
  zones: PlanZone[];
  caption: string;
}

export interface InvestmentModelData {
  eyebrow: string;
  heading: string;
  steps: string[];
  revenueLabel: string;
  revenueSources: string[];
  disclosure: string;
  backgroundImage: string;
}

export interface InvestmentData {
  eyebrow: string;
  heading: string;
  description: string;
  unitLabel: string;
  unitValue: string;
  ownershipTitle: string;
  ownershipText: string;
  profitTitle: string;
  profitText: string;
  paymentLabel: string;
  paymentValue: string;
  note: string;
  ctaText: string;
  ctaHref: string;
}

export interface DemandCard {
  title: string;
  description: string;
}

export interface DemandData {
  eyebrow: string;
  heading: string;
  description: string;
  items: DemandCard[];
}

export interface RoadmapData {
  eyebrow: string;
  heading: string;
  steps: string[];
}

export interface WhySunviaData {
  eyebrow: string;
  heading: string;
  projectName: string;
  affiliation: string;
  description: string;
  ctaText: string;
  whatsappNumber: string;
  whatsappMessage: string;
  backgroundImage: string;
}

export interface TermCard {
  title: string;
  description: string;
}

export interface TermsData {
  eyebrow: string;
  heading: string;
  items: TermCard[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqData {
  eyebrow: string;
  heading: string;
  items: FaqItem[];
}

export interface LeadOption {
  label: string;
  value: string;
}

export interface LeadData {
  eyebrow: string;
  heading: string;
  description: string;
  namePlaceholder: string;
  phonePlaceholder: string;
  contactLabel: string;
  contactOptions: LeadOption[];
  interestLabel: string;
  interestOptions: LeadOption[];
  consentText: string;
  privacyLabel: string;
  privacyHref: string;
  submitText: string;
  mobileCtaText: string;
  successMessage: string;
  errorMessage: string;
  whatsappLabel: string;
  whatsappNumber: string;
  whatsappMessage: string;
  source: string;
}

export interface SunviaEcoResortPageData {
  investor_seo: InvestorSeoData;
  investor_hero: InvestorHeroData;
  master_plan: MasterPlanData;
  investment_model: InvestmentModelData;
  investment: InvestmentData;
  demand: DemandData;
  roadmap: RoadmapData;
  why_sunvia: WhySunviaData;
  terms: TermsData;
  faq: FaqData;
  lead: LeadData;
}

export const RESORT_SECTION_KEYS = [
  "investor_seo",
  "investor_hero",
  "master_plan",
  "investment_model",
  "investment",
  "demand",
  "roadmap",
  "why_sunvia",
  "terms",
  "faq",
  "lead",
] as const;

export type ResortSectionKey = (typeof RESORT_SECTION_KEYS)[number];

const ARCHITECTURE_IMAGE =
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1600&auto=format&fit=crop";
const PLAN_IMAGE =
  "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1600&auto=format&fit=crop";
const LAND_IMAGE =
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200&auto=format&fit=crop";
const HOTEL_IMAGE =
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1600&auto=format&fit=crop";
const ROOM_IMAGE =
  "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1200&auto=format&fit=crop";
const VILLA_IMAGE =
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1200&auto=format&fit=crop";
const DINING_IMAGE =
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1600&auto=format&fit=crop";
const RESORT_IMAGE =
  "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1600&auto=format&fit=crop";

const WHATSAPP_NUMBER = "+88 018 73 83 83 01";
const WHATSAPP_MESSAGE =
  "Hello, I would like to receive investment details for Sunvia Hotel & Resort, including the project profile, current offer, payment options and applicable terms.";

export const defaultSunviaEcoResortPageData: SunviaEcoResortPageData = {
  investor_seo: {
    metaTitle: "Sunvia Hotel & Resort | Structured Investment Opportunity",
    metaDescription:
      "A planned hospitality destination and a structured investment opportunity in Sunvia Hotel & Resort. Returns are not fixed or guaranteed.",
    metaKeywords: [
      "Sunvia Hotel & Resort",
      "Sun Tourism Ltd",
      "hospitality investment",
      "Manikganj hotel project",
    ],
    metaImage: ARCHITECTURE_IMAGE,
  },
  investor_hero: {
    projectName: "Sunvia Hotel & Resort",
    eyebrow: "Hospitality • Nature • Opportunity",
    headline: "A Planned Hospitality Destination. A Structured Investment Opportunity.",
    supportLine:
      "Explore a structured investment opportunity connected to the development and future operation of Sunvia Hotel & Resort.",
    unitLabel: "Investment Unit",
    unitValue: "1 Share",
    paymentLabel: "Payment Facility",
    paymentValue: "Full Payment or Installment",
    backgroundImage: ARCHITECTURE_IMAGE,
    ctaPrimaryText: "Explore Investment Opportunity",
    ctaPrimaryHref: "#opportunity",
    ctaSecondaryText: "Talk to Investment Team",
    whatsappNumber: WHATSAPP_NUMBER,
    whatsappMessage: WHATSAPP_MESSAGE,
  },
  master_plan: {
    eyebrow: "The vision, at a glance",
    heading: "The Planned Resort",
    description:
      "Accommodation, dining, events and recreation, thoughtfully brought together in one integrated destination.",
    image: PLAN_IMAGE,
    imageAlt: "Illustrative plan for Sunvia Hotel & Resort",
    highlights: [
      { value: "50 Bigha", label: "Planned Development", image: LAND_IMAGE },
      { value: "2 Hotel Blocks", label: "Planned Accommodation", image: HOTEL_IMAGE },
      { value: "Approx. 140", label: "Planned Keys", image: ROOM_IMAGE },
      { value: "10", label: "Private Villas", image: VILLA_IMAGE },
    ],
    labels: [
      "Hotel Block A",
      "Hotel Block B",
      "Private Villas",
      "Presidential / VIP Villa",
      "Restaurant & Dining",
      "Swimming Pool & Recreation",
      "Event / Banquet Area",
      "Central Landscape",
      "Main Entrance",
      "Helipad / VIP Access",
    ],
    zones: [
      { title: "Stay", description: "Two hotel blocks, private villas and premium suites." },
      { title: "Gather", description: "Dining, conference and event spaces." },
      { title: "Unwind", description: "Pools, recreation, lake and landscape." },
      { title: "Arrive", description: "Planned guest, event and VIP access." },
    ],
    caption: "Illustrative zone relationships. Final layout and facilities are subject to approved plans.",
  },
  investment_model: {
    eyebrow: "From development to participation",
    heading: "How the Investment Model Works",
    steps: [
      "Project Development",
      "Resort Operation",
      "Multiple Revenue Sources",
      "Deduct Operating Costs & Reserves",
      "Distributable Profit",
      "Investor Participation in Distributable Profit",
    ],
    revenueLabel: "Revenue sources",
    revenueSources: [
      "Rooms",
      "Food & Dining",
      "Events & Conferences",
      "Recreation",
      "Guest Services",
      "Other Operating Income",
    ],
    disclosure: "Participation depends on actual distributable profit. No fixed or guaranteed return.",
    backgroundImage: DINING_IMAGE,
  },
  investment: {
    eyebrow: "Your participation",
    heading: "Investment Opportunity",
    description:
      "Participate in the development and future business of Sunvia Hotel & Resort through a structured investment model.",
    unitLabel: "Investment Unit",
    unitValue: "1 Share",
    ownershipTitle: "Ownership Participation",
    ownershipText:
      "Proportional participation in the overall resort project, as defined in the investment agreement.",
    profitTitle: "Profit Participation",
    profitText: "Participation in eligible distributable profit from future resort operations.",
    paymentLabel: "Payment Facility",
    paymentValue: "Full Payment or Installment",
    note: "Review the project documents and applicable terms with the investment team before making a decision.",
    ctaText: "Get Investment Details",
    ctaHref: "#lead",
  },
  demand: {
    eyebrow: "The future guest experience",
    heading: "Planned Demand Segments",
    description: "A destination planned around different reasons to visit, stay and return.",
    items: [
      {
        title: "Leisure & Family Stays",
        description: "Weekend stays, short leisure trips and shared family experiences.",
      },
      {
        title: "Corporate Events & Retreats",
        description: "Meetings, training, conferences and team retreats.",
      },
      {
        title: "Weddings & Social Events",
        description: "Weddings, receptions and private celebrations.",
      },
      {
        title: "Dining & Day Visitors",
        description: "Restaurant, recreation and day-use experiences.",
      },
      {
        title: "Premium & VIP Guests",
        description: "Private villas, suites and premium hospitality experiences.",
      },
    ],
  },
  roadmap: {
    eyebrow: "A planned path to operation",
    heading: "Development Roadmap",
    steps: [
      "Planning & Concept",
      "Design & Engineering",
      "Site Development",
      "Construction",
      "Interior & Hospitality Setup",
      "Pre-Opening",
      "Resort Operation",
    ],
  },
  why_sunvia: {
    eyebrow: "The project and the company",
    heading: "Why Sunvia",
    projectName: "Sunvia Hotel & Resort",
    affiliation: "A Project of Sun Tourism Ltd. | A Concern of Sunvia Group",
    description:
      "Discuss the project plan, investment documents and participation terms directly with the investment team.",
    ctaText: "Talk to Investment Team",
    whatsappNumber: WHATSAPP_NUMBER,
    whatsappMessage: WHATSAPP_MESSAGE,
    backgroundImage: RESORT_IMAGE,
  },
  terms: {
    eyebrow: "Clear terms. Informed decisions.",
    heading: "Investor Terms & Important Information",
    items: [
      {
        title: "Return Structure",
        description:
          "Participation is based on actual distributable profit from resort operations. No fixed or guaranteed return. If there is no distributable profit for a period, no distribution is payable for that period.",
      },
      {
        title: "Payment Facility",
        description:
          "Full payment or installment options are available, subject to the current approved offer and payment schedule.",
      },
      {
        title: "Transfer & Exit",
        description:
          "Transfer and exit are subject to applicable company terms, approval and charges. Exit charges may apply.",
      },
      {
        title: "Investment Documents",
        description:
          "Final rights, obligations, charges and conditions are governed by the signed investment agreement and supporting documents.",
      },
    ],
  },
  faq: {
    eyebrow: "Your questions, answered",
    heading: "Investor FAQ",
    items: [
      {
        question: "What is the investment unit?",
        answer:
          "The investment unit is 1 Share in Sunvia Hotel & Resort. The investment agreement defines the associated project rights and obligations. A project share does not make the investor a shareholder of Sun Tourism Ltd.",
      },
      {
        question: "How does investor participation in distributable profit work?",
        answer:
          "Eligible investors participate in the resort’s distributable profit after applicable operating expenses, liabilities, costs and reserves. Entitlement and distribution follow the investment agreement and approved accounts.",
      },
      {
        question: "Is any return guaranteed?",
        answer:
          "No. Returns depend on actual business performance and available distributable profit. No fixed or guaranteed return is promised.",
      },
      {
        question: "Are installment options available?",
        answer:
          "Yes. Full payment and installment options are available, subject to the current approved offer. Contact the investment team for the applicable payment schedule.",
      },
      {
        question: "Can an investor transfer or exit?",
        answer:
          "Transfer and exit are subject to company terms, approval and applicable charges. Request the detailed terms and review them before investing.",
      },
    ],
  },
  lead: {
    eyebrow: "Take the next step",
    heading: "Explore the Investment Opportunity",
    description:
      "Request the latest investment details, current offer, payment options and project documents from our investment team.",
    namePlaceholder: "Your full name",
    phonePlaceholder: "Your contact number",
    contactLabel: "Preferred Contact Method",
    contactOptions: [
      { label: "WhatsApp", value: "WhatsApp" },
      { label: "Phone Call", value: "Phone Call" },
    ],
    interestLabel: "Investment Interest",
    interestOptions: [
      { label: "1 Share", value: "1 Share" },
      { label: "Multiple Shares", value: "Multiple Shares" },
      { label: "Need More Information", value: "Need More Information" },
    ],
    consentText: "I agree to be contacted about this inquiry.",
    privacyLabel: "Privacy Policy",
    privacyHref: "/privacy",
    submitText: "Get Investment Details",
    mobileCtaText: "Get Investment Details",
    successMessage:
      "Thank you. Your inquiry has been received. Our investment team will contact you using your preferred method.",
    errorMessage: "We couldn’t send your inquiry. Please try again or talk to our investment team.",
    whatsappLabel: "Talk to Investment Team",
    whatsappNumber: WHATSAPP_NUMBER,
    whatsappMessage: WHATSAPP_MESSAGE,
    source: "Sunvia Hotel & Resort Investment",
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

function pickString(value: unknown, fallback: string) {
  return typeof value === "string" ? value.trim() : fallback;
}

function sectionRaw(value: unknown): Record<string, unknown> {
  return isRecord(value) ? value : {};
}

function sanitizeStringArray(value: unknown, limit = 16) {
  if (!Array.isArray(value)) return [] as string[];
  return value
    .map((item) => sanitizeString(item))
    .filter(Boolean)
    .slice(0, limit);
}

function isSafeHref(value: string) {
  return /^(\/|#|https?:\/\/|mailto:|tel:)/i.test(value);
}

export function whatsappHref(number: string, message: string) {
  const digits = number.replace(/\D/g, "");
  if (!digits) return "";
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

function validateRequiredString(label: string, value: string, min = 1, max = 700) {
  if (!value || value.length < min) return `${label} is required.`;
  if (value.length > max) return `${label} must be ${max} characters or fewer.`;
  return null;
}

function mergeList<T>(raw: unknown, fallback: T[], map: (item: Record<string, unknown>) => T | null, limit: number) {
  if (!Array.isArray(raw)) return cloneDefault(fallback);
  const items = raw
    .filter(isRecord)
    .map(map)
    .filter((item): item is T => item !== null)
    .slice(0, limit);
  return items.length ? items : cloneDefault(fallback);
}

function stringList(raw: unknown, fallback: string[], limit = 12) {
  if (!Array.isArray(raw)) return cloneDefault(fallback);
  const items = sanitizeStringArray(raw, limit);
  return items.length ? items : cloneDefault(fallback);
}

function isLegacyHero(value: unknown) {
  return isRecord(value) && !("headline" in value) && ("stats" in value || "title" in value);
}

function isLegacyMasterPlan(value: unknown) {
  return isRecord(value) && Array.isArray(value.locations) && !Array.isArray(value.zones);
}

function isLegacyInvestment(value: unknown) {
  return isRecord(value) && Array.isArray(value.rows) && typeof value.unitValue !== "string";
}

function isLegacyFaq(value: unknown) {
  if (!isRecord(value) || !Array.isArray(value.items)) return false;
  const first = value.items.find(isRecord);
  const question = typeof first?.question === "string" ? first.question : "";
  return /[ঀ-৿]/.test(question);
}

function isLegacyLead(value: unknown) {
  return isRecord(value) && Object.keys(value).length > 0 && typeof value.consentText !== "string";
}

export function mergeSunviaEcoResortPageData(
  raw?: Partial<SunviaEcoResortPageData> | null,
): SunviaEcoResortPageData {
  const defaults = cloneDefault(defaultSunviaEcoResortPageData);
  if (!raw || !isRecord(raw)) return defaults;

  const seoRaw = sectionRaw(raw.investor_seo);
  const heroSource = isLegacyHero(raw.investor_hero) ? {} : sectionRaw(raw.investor_hero);
  const planSource = isLegacyMasterPlan(raw.master_plan) ? {} : sectionRaw(raw.master_plan);
  const modelRaw = sectionRaw(raw.investment_model);
  const investmentSource = isLegacyInvestment(raw.investment) ? {} : sectionRaw(raw.investment);
  const demandRaw = sectionRaw(raw.demand);
  const roadmapRaw = sectionRaw(raw.roadmap);
  const whyRaw = sectionRaw(raw.why_sunvia);
  const termsRaw = sectionRaw(raw.terms);
  const faqSource = isLegacyFaq(raw.faq) ? {} : sectionRaw(raw.faq);
  const leadRaw = isLegacyLead(raw.lead) ? {} : sectionRaw(raw.lead);

  const card = (item: Record<string, unknown>): DemandCard | null => {
    const title = sanitizeString(item.title);
    const description = sanitizeString(item.description);
    if (!title || !description) return null;
    return { title, description };
  };

  return {
    investor_seo: {
      metaTitle: pickString(seoRaw.metaTitle, defaults.investor_seo.metaTitle),
      metaDescription: pickString(seoRaw.metaDescription, defaults.investor_seo.metaDescription),
      metaImage: pickString(seoRaw.metaImage, defaults.investor_seo.metaImage),
      metaKeywords: Array.isArray(seoRaw.metaKeywords)
        ? sanitizeStringArray(seoRaw.metaKeywords, 12)
        : defaults.investor_seo.metaKeywords,
    },
    investor_hero: {
      projectName: pickString(heroSource.projectName, defaults.investor_hero.projectName),
      eyebrow: pickString(heroSource.eyebrow, defaults.investor_hero.eyebrow),
      headline: pickString(heroSource.headline, defaults.investor_hero.headline),
      supportLine: pickString(heroSource.supportLine, defaults.investor_hero.supportLine),
      unitLabel: pickString(heroSource.unitLabel, defaults.investor_hero.unitLabel),
      unitValue: pickString(heroSource.unitValue, defaults.investor_hero.unitValue),
      paymentLabel: pickString(heroSource.paymentLabel, defaults.investor_hero.paymentLabel),
      paymentValue: pickString(heroSource.paymentValue, defaults.investor_hero.paymentValue),
      backgroundImage: pickString(heroSource.backgroundImage, defaults.investor_hero.backgroundImage),
      ctaPrimaryText: pickString(heroSource.ctaPrimaryText, defaults.investor_hero.ctaPrimaryText),
      ctaPrimaryHref: pickString(heroSource.ctaPrimaryHref, defaults.investor_hero.ctaPrimaryHref),
      ctaSecondaryText: pickString(heroSource.ctaSecondaryText, defaults.investor_hero.ctaSecondaryText),
      whatsappNumber: pickString(heroSource.whatsappNumber, defaults.investor_hero.whatsappNumber),
      whatsappMessage: pickString(heroSource.whatsappMessage, defaults.investor_hero.whatsappMessage),
    },
    master_plan: {
      eyebrow: pickString(planSource.eyebrow, defaults.master_plan.eyebrow),
      heading: pickString(planSource.heading, defaults.master_plan.heading),
      description: pickString(planSource.description, defaults.master_plan.description),
      image: pickString(planSource.image, defaults.master_plan.image),
      imageAlt: pickString(planSource.imageAlt, defaults.master_plan.imageAlt),
      caption: pickString(planSource.caption, defaults.master_plan.caption),
      highlights: mergeList(
        planSource.highlights,
        defaults.master_plan.highlights,
        (item) => {
          const value = sanitizeString(item.value);
          const label = sanitizeString(item.label);
          if (!value || !label) return null;
          const fallbackImage =
            defaults.master_plan.highlights.find((highlight) => highlight.label === label)?.image ||
            defaults.master_plan.highlights[0].image;
          return { value, label, image: sanitizeString(item.image) || fallbackImage };
        },
        8,
      ),
      labels: stringList(planSource.labels, defaults.master_plan.labels, 16),
      zones: mergeList(planSource.zones, defaults.master_plan.zones, card, 8),
    },
    investment_model: {
      eyebrow: pickString(modelRaw.eyebrow, defaults.investment_model.eyebrow),
      heading: pickString(modelRaw.heading, defaults.investment_model.heading),
      revenueLabel: pickString(modelRaw.revenueLabel, defaults.investment_model.revenueLabel),
      disclosure: pickString(modelRaw.disclosure, defaults.investment_model.disclosure),
      backgroundImage: pickString(modelRaw.backgroundImage, defaults.investment_model.backgroundImage),
      steps: stringList(modelRaw.steps, defaults.investment_model.steps, 8),
      revenueSources: stringList(modelRaw.revenueSources, defaults.investment_model.revenueSources, 8),
    },
    investment: {
      eyebrow: pickString(investmentSource.eyebrow, defaults.investment.eyebrow),
      heading: pickString(investmentSource.heading, defaults.investment.heading),
      description: pickString(investmentSource.description, defaults.investment.description),
      unitLabel: pickString(investmentSource.unitLabel, defaults.investment.unitLabel),
      unitValue: pickString(investmentSource.unitValue, defaults.investment.unitValue),
      ownershipTitle: pickString(investmentSource.ownershipTitle, defaults.investment.ownershipTitle),
      ownershipText: pickString(investmentSource.ownershipText, defaults.investment.ownershipText),
      profitTitle: pickString(investmentSource.profitTitle, defaults.investment.profitTitle),
      profitText: pickString(investmentSource.profitText, defaults.investment.profitText),
      paymentLabel: pickString(investmentSource.paymentLabel, defaults.investment.paymentLabel),
      paymentValue: pickString(investmentSource.paymentValue, defaults.investment.paymentValue),
      note: pickString(investmentSource.note, defaults.investment.note),
      ctaText: pickString(investmentSource.ctaText, defaults.investment.ctaText),
      ctaHref: pickString(investmentSource.ctaHref, defaults.investment.ctaHref),
    },
    demand: {
      eyebrow: pickString(demandRaw.eyebrow, defaults.demand.eyebrow),
      heading: pickString(demandRaw.heading, defaults.demand.heading),
      description: pickString(demandRaw.description, defaults.demand.description),
      items: mergeList(demandRaw.items, defaults.demand.items, card, 8),
    },
    roadmap: {
      eyebrow: pickString(roadmapRaw.eyebrow, defaults.roadmap.eyebrow),
      heading: pickString(roadmapRaw.heading, defaults.roadmap.heading),
      steps: stringList(roadmapRaw.steps, defaults.roadmap.steps, 10),
    },
    why_sunvia: {
      eyebrow: pickString(whyRaw.eyebrow, defaults.why_sunvia.eyebrow),
      heading: pickString(whyRaw.heading, defaults.why_sunvia.heading),
      projectName: pickString(whyRaw.projectName, defaults.why_sunvia.projectName),
      affiliation: pickString(whyRaw.affiliation, defaults.why_sunvia.affiliation),
      description: pickString(whyRaw.description, defaults.why_sunvia.description),
      ctaText: pickString(whyRaw.ctaText, defaults.why_sunvia.ctaText),
      whatsappNumber: pickString(whyRaw.whatsappNumber, defaults.why_sunvia.whatsappNumber),
      whatsappMessage: pickString(whyRaw.whatsappMessage, defaults.why_sunvia.whatsappMessage),
      backgroundImage: pickString(whyRaw.backgroundImage, defaults.why_sunvia.backgroundImage),
    },
    terms: {
      eyebrow: pickString(termsRaw.eyebrow, defaults.terms.eyebrow),
      heading: pickString(termsRaw.heading, defaults.terms.heading),
      items: mergeList(termsRaw.items, defaults.terms.items, card, 8),
    },
    faq: {
      eyebrow: pickString(faqSource.eyebrow, defaults.faq.eyebrow),
      heading: pickString(faqSource.heading, defaults.faq.heading),
      items: mergeList(
        faqSource.items,
        defaults.faq.items,
        (item) => {
          const question = sanitizeString(item.question);
          const answer = sanitizeString(item.answer);
          if (!question || !answer) return null;
          return { question, answer };
        },
        12,
      ),
    },
    lead: {
      eyebrow: pickString(leadRaw.eyebrow, defaults.lead.eyebrow),
      heading: pickString(leadRaw.heading, defaults.lead.heading),
      description: pickString(leadRaw.description, defaults.lead.description),
      namePlaceholder: pickString(leadRaw.namePlaceholder, defaults.lead.namePlaceholder),
      phonePlaceholder: pickString(leadRaw.phonePlaceholder, defaults.lead.phonePlaceholder),
      contactLabel: pickString(leadRaw.contactLabel, defaults.lead.contactLabel),
      interestLabel: pickString(leadRaw.interestLabel, defaults.lead.interestLabel),
      consentText: pickString(leadRaw.consentText, defaults.lead.consentText),
      privacyLabel: pickString(leadRaw.privacyLabel, defaults.lead.privacyLabel),
      privacyHref: pickString(leadRaw.privacyHref, defaults.lead.privacyHref),
      submitText: pickString(leadRaw.submitText, defaults.lead.submitText),
      mobileCtaText: pickString(leadRaw.mobileCtaText, defaults.lead.mobileCtaText),
      successMessage: pickString(leadRaw.successMessage, defaults.lead.successMessage),
      errorMessage: pickString(leadRaw.errorMessage, defaults.lead.errorMessage),
      whatsappLabel: pickString(leadRaw.whatsappLabel, defaults.lead.whatsappLabel),
      whatsappNumber: pickString(leadRaw.whatsappNumber, defaults.lead.whatsappNumber),
      whatsappMessage: pickString(leadRaw.whatsappMessage, defaults.lead.whatsappMessage),
      source: pickString(leadRaw.source, defaults.lead.source),
      contactOptions: mergeList(
        leadRaw.contactOptions,
        defaults.lead.contactOptions,
        (item) => {
          const label = sanitizeString(item.label);
          const value = sanitizeString(item.value);
          if (!label || !value) return null;
          return { label, value };
        },
        6,
      ),
      interestOptions: mergeList(
        leadRaw.interestOptions,
        defaults.lead.interestOptions,
        (item) => {
          const label = sanitizeString(item.label);
          const value = sanitizeString(item.value);
          if (!label || !value) return null;
          return { label, value };
        },
        6,
      ),
    },
  };
}

export function isResortSectionKey(value: unknown): value is ResortSectionKey {
  return typeof value === "string" && RESORT_SECTION_KEYS.includes(value as ResortSectionKey);
}

function requireList(label: string, length: number, min: number) {
  if (length < min) return `Add at least ${min} ${label}.`;
  return null;
}

export function validateSunviaEcoResortSection(
  section: ResortSectionKey,
  value: unknown,
): ValidationResult<SunviaEcoResortPageData[ResortSectionKey]> {
  const merged = mergeSunviaEcoResortPageData({ [section]: value } as Partial<SunviaEcoResortPageData>);
  const data = merged[section];

  const check = (label: string, text: string, min = 2, max = 800) => {
    const error = validateRequiredString(label, text, min, max);
    return error ? ({ success: false, error } as const) : null;
  };

  switch (section) {
    case "investor_seo": {
      const seo = data as InvestorSeoData;
      const titleError = check("Meta title", seo.metaTitle, 10, 90);
      if (titleError) return titleError;
      const descriptionError = check("Meta description", seo.metaDescription, 40, 220);
      if (descriptionError) return descriptionError;
      if (!seo.metaKeywords.length) return { success: false, error: "Add at least one SEO keyword." };
      return { success: true, data: seo };
    }
    case "investor_hero": {
      const hero = data as InvestorHeroData;
      const fields: Array<[string, string, number, number]> = [
        ["Project name", hero.projectName, 2, 80],
        ["Eyebrow", hero.eyebrow, 2, 80],
        ["Headline", hero.headline, 12, 160],
        ["Support line", hero.supportLine, 20, 320],
        ["Investment unit", hero.unitValue, 1, 40],
        ["Payment facility", hero.paymentValue, 2, 80],
        ["Primary button", hero.ctaPrimaryText, 2, 60],
        ["Secondary button", hero.ctaSecondaryText, 2, 60],
        ["WhatsApp number", hero.whatsappNumber, 7, 30],
        ["WhatsApp message", hero.whatsappMessage, 10, 400],
      ];
      for (const [label, fieldValue, min, max] of fields) {
        const error = check(label, fieldValue, min, max);
        if (error) return error;
      }
      if (!isSafeHref(hero.ctaPrimaryHref)) {
        return { success: false, error: "The primary button link must be a path, anchor, or http(s) URL." };
      }
      if (!whatsappHref(hero.whatsappNumber, hero.whatsappMessage)) {
        return { success: false, error: "Enter a WhatsApp number with digits." };
      }
      return { success: true, data: hero };
    }
    case "master_plan": {
      const plan = data as MasterPlanData;
      const error = check("Master plan heading", plan.heading, 4, 120) || check("Caption", plan.caption, 10, 240);
      if (error) return error;
      const highlights = requireList("highlights", plan.highlights.length, 3);
      if (highlights) return { success: false, error: highlights };
      const zones = requireList("zones", plan.zones.length, 3);
      if (zones) return { success: false, error: zones };
      const labels = requireList("plan labels", plan.labels.length, 4);
      if (labels) return { success: false, error: labels };
      return { success: true, data: plan };
    }
    case "investment_model": {
      const model = data as InvestmentModelData;
      const error = check("Model heading", model.heading, 4, 140) || check("Disclosure", model.disclosure, 20, 300);
      if (error) return error;
      const steps = requireList("model steps", model.steps.length, 4);
      if (steps) return { success: false, error: steps };
      const sources = requireList("revenue sources", model.revenueSources.length, 4);
      if (sources) return { success: false, error: sources };
      return { success: true, data: model };
    }
    case "investment": {
      const investment = data as InvestmentData;
      const error =
        check("Opportunity heading", investment.heading, 4, 120) ||
        check("Ownership text", investment.ownershipText, 20, 400) ||
        check("Profit text", investment.profitText, 20, 400);
      if (error) return error;
      if (!isSafeHref(investment.ctaHref)) {
        return { success: false, error: "The opportunity button link must be a path, anchor, or http(s) URL." };
      }
      return { success: true, data: investment };
    }
    case "demand": {
      const demand = data as DemandData;
      const error = check("Demand heading", demand.heading, 4, 120);
      if (error) return error;
      const listError = requireList("demand segments", demand.items.length, 3);
      if (listError) return { success: false, error: listError };
      return { success: true, data: demand };
    }
    case "roadmap": {
      const roadmap = data as RoadmapData;
      const error = check("Roadmap heading", roadmap.heading, 4, 120);
      if (error) return error;
      const listError = requireList("roadmap stages", roadmap.steps.length, 4);
      if (listError) return { success: false, error: listError };
      return { success: true, data: roadmap };
    }
    case "why_sunvia": {
      const why = data as WhySunviaData;
      const error = check("Why Sunvia heading", why.heading, 2, 80) || check("Affiliation", why.affiliation, 8, 160);
      if (error) return error;
      if (!whatsappHref(why.whatsappNumber, why.whatsappMessage)) {
        return { success: false, error: "Enter a WhatsApp number with digits." };
      }
      return { success: true, data: why };
    }
    case "terms": {
      const terms = data as TermsData;
      const error = check("Terms heading", terms.heading, 4, 140);
      if (error) return error;
      const listError = requireList("terms", terms.items.length, 3);
      if (listError) return { success: false, error: listError };
      return { success: true, data: terms };
    }
    case "faq": {
      const faq = data as FaqData;
      const error = check("FAQ heading", faq.heading, 4, 80);
      if (error) return error;
      const listError = requireList("questions", faq.items.length, 3);
      if (listError) return { success: false, error: listError };
      return { success: true, data: faq };
    }
    case "lead": {
      const lead = data as LeadData;
      const error =
        check("Form heading", lead.heading, 4, 140) ||
        check("Success message", lead.successMessage, 20, 400) ||
        check("Error message", lead.errorMessage, 10, 240) ||
        check("Consent", lead.consentText, 8, 200);
      if (error) return error;
      if (!lead.contactOptions.length) return { success: false, error: "Add at least one contact method." };
      if (!isSafeHref(lead.privacyHref)) {
        return { success: false, error: "The privacy link must be a path or http(s) URL." };
      }
      return { success: true, data: lead };
    }
    default:
      return { success: false, error: "Unsupported section." };
  }
}
