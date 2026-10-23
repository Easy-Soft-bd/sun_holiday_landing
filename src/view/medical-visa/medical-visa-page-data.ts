export type MedicalVisaService = {
  title: string;
  description: string;
  icon: string;
};

export type MedicalVisaStep = {
  title: string;
  description: string;
};

export type MedicalVisaDocument = {
  text: string;
};

export type MedicalVisaPageData = {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  heroBadge: string;
  heroTitleMain: string;
  heroTitleAccent: string;
  heroSubtitle: string;
  heroDescription: string;
  heroImage: string;
  introEyebrow: string;
  introTitle: string;
  introBody: string;
  introImage: string;
  servicesEyebrow: string;
  servicesTitle: string;
  servicesIntro: string;
  services: MedicalVisaService[];
  documentsEyebrow: string;
  documentsTitle: string;
  documentsIntro: string;
  documents: MedicalVisaDocument[];
  stepsEyebrow: string;
  stepsTitle: string;
  stepsIntro: string;
  steps: MedicalVisaStep[];
  urgentEyebrow: string;
  urgentTitle: string;
  urgentBody: string;
  urgentCallLabel: string;
  urgentVisitLabel: string;
  inquiryEyebrow: string;
  inquiryTitle: string;
  inquiryIntro: string;
  inquiryButton: string;
};

export const defaultMedicalVisaPageData: MedicalVisaPageData = {
  metaTitle: "Medical Visa Assistance - Sun Tourism Ltd",
  metaDescription:
    "Sun Tourism Ltd helps travelers prepare medical visa files, hospital appointments, and travel plans for treatment abroad.",
  metaKeywords: "medical visa, treatment abroad, hospital appointment, Sun Tourism, Bangladesh",
  heroBadge: "Service",
  heroTitleMain: "Medical",
  heroTitleAccent: "Visa",
  heroSubtitle: "Treatment travel, arranged with care",
  heroDescription:
    "We help you prepare the visa file, hospital papers, and travel plan for treatment abroad.",
  heroImage:
    "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2070&auto=format&fit=crop",
  introEyebrow: "How we help",
  introTitle: "A clear path from enquiry to departure",
  introBody:
    "Tell us the hospital, the treatment, and who is traveling. We check the visa route, list the papers you need, and stay with the file until it is ready to submit.",
  introImage:
    "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1600&auto=format&fit=crop",
  servicesEyebrow: "What we arrange",
  servicesTitle: "Support around the treatment trip",
  servicesIntro: "Each case is different. These are the parts families ask us to handle most often.",
  services: [
    {
      title: "Hospital papers",
      description: "Appointment letters and treatment estimates from the hospital you choose.",
      icon: "LuHeart",
    },
    {
      title: "Visa file",
      description: "A checklist for the medical visa, including the attendant if someone is traveling with the patient.",
      icon: "LuFileText",
    },
    {
      title: "Travel plan",
      description: "Flights and a stay near the hospital, timed around the appointment.",
      icon: "LuPlane",
    },
    {
      title: "Follow-up",
      description: "We track the file and tell you what the embassy or hospital still needs.",
      icon: "LuCircleCheck",
    },
  ],
  documentsEyebrow: "Papers",
  documentsTitle: "Documents families usually need",
  documentsIntro: "The exact list depends on the country and the hospital. We confirm it before you apply.",
  documents: [
    { text: "Passport with enough validity for the trip" },
    { text: "Recent passport-size photographs" },
    { text: "Hospital appointment or invitation letter" },
    { text: "Treatment estimate or medical reports" },
    { text: "Proof of funds for treatment and stay" },
    { text: "Attendant passport, if someone is traveling with the patient" },
  ],
  stepsEyebrow: "Process",
  stepsTitle: "How a medical visa file moves",
  stepsIntro: "You stay informed at each step. We do not submit a file until the papers are complete.",
  steps: [
    {
      title: "Share the case",
      description: "Tell us the patient, the treatment, the hospital, and the preferred travel dates.",
    },
    {
      title: "Check the route",
      description: "We confirm which visa fits the country and whether an attendant can apply too.",
    },
    {
      title: "Prepare the file",
      description: "You collect the papers on our checklist. We review them before submission.",
    },
    {
      title: "Travel",
      description: "Once the visa is issued, we help line up the flight and the stay.",
    },
  ],
  urgentEyebrow: "Emergency",
  urgentTitle: "A medical case should not wait",
  urgentBody:
    "Treatment travel is often an emergency. Call us directly, or come to the office, and we will start the visa file the same day.",
  urgentCallLabel: "Call now",
  urgentVisitLabel: "Visit the office",
  inquiryEyebrow: "Start here",
  inquiryTitle: "Ask about a medical visa",
  inquiryIntro: "Share your name and phone. A counselor will call to talk through the hospital and the papers.",
  inquiryButton: "Send enquiry",
};

function textField<K extends keyof MedicalVisaPageData>(
  key: K,
  partial: Partial<MedicalVisaPageData> | undefined,
): MedicalVisaPageData[K] {
  const incoming = partial?.[key];
  const fallback = defaultMedicalVisaPageData[key];
  if (typeof incoming !== "string" || !incoming.trim()) return fallback;
  return incoming as MedicalVisaPageData[K];
}

function cleanServices(value: unknown, fallback: MedicalVisaService[]): MedicalVisaService[] {
  if (!Array.isArray(value)) return fallback;
  return value
    .filter((item): item is MedicalVisaService => Boolean(item) && typeof item === "object")
    .map((item) => ({
      title: String(item.title ?? "").trim(),
      description: String(item.description ?? "").trim(),
      icon: String(item.icon ?? "").trim() || "LuHeart",
    }))
    .filter((item) => item.title);
}

function cleanSteps(value: unknown, fallback: MedicalVisaStep[]): MedicalVisaStep[] {
  if (!Array.isArray(value)) return fallback;
  return value
    .filter((item): item is MedicalVisaStep => Boolean(item) && typeof item === "object")
    .map((item) => ({
      title: String(item.title ?? "").trim(),
      description: String(item.description ?? "").trim(),
    }))
    .filter((item) => item.title);
}

function cleanDocuments(value: unknown, fallback: MedicalVisaDocument[]): MedicalVisaDocument[] {
  if (!Array.isArray(value)) return fallback;
  return value
    .filter((item): item is MedicalVisaDocument => Boolean(item) && typeof item === "object")
    .map((item) => ({ text: String(item.text ?? "").trim() }))
    .filter((item) => item.text);
}

export function mergeMedicalVisaPageData(partial?: Partial<MedicalVisaPageData> | null): MedicalVisaPageData {
  const source = partial ?? {};
  return {
    ...defaultMedicalVisaPageData,
    metaTitle: textField("metaTitle", source),
    metaDescription: textField("metaDescription", source),
    metaKeywords: textField("metaKeywords", source),
    heroBadge: textField("heroBadge", source),
    heroTitleMain: textField("heroTitleMain", source),
    heroTitleAccent: textField("heroTitleAccent", source),
    heroSubtitle: textField("heroSubtitle", source),
    heroDescription: textField("heroDescription", source),
    heroImage: textField("heroImage", source),
    introEyebrow: textField("introEyebrow", source),
    introTitle: textField("introTitle", source),
    introBody: textField("introBody", source),
    introImage: textField("introImage", source),
    servicesEyebrow: textField("servicesEyebrow", source),
    servicesTitle: textField("servicesTitle", source),
    servicesIntro: textField("servicesIntro", source),
    services: cleanServices(
      Object.prototype.hasOwnProperty.call(source, "services") ? source.services : undefined,
      defaultMedicalVisaPageData.services,
    ),
    documentsEyebrow: textField("documentsEyebrow", source),
    documentsTitle: textField("documentsTitle", source),
    documentsIntro: textField("documentsIntro", source),
    documents: cleanDocuments(
      Object.prototype.hasOwnProperty.call(source, "documents") ? source.documents : undefined,
      defaultMedicalVisaPageData.documents,
    ),
    stepsEyebrow: textField("stepsEyebrow", source),
    stepsTitle: textField("stepsTitle", source),
    stepsIntro: textField("stepsIntro", source),
    steps: cleanSteps(
      Object.prototype.hasOwnProperty.call(source, "steps") ? source.steps : undefined,
      defaultMedicalVisaPageData.steps,
    ),
    urgentEyebrow: textField("urgentEyebrow", source),
    urgentTitle: textField("urgentTitle", source),
    urgentBody: textField("urgentBody", source),
    urgentCallLabel: textField("urgentCallLabel", source),
    urgentVisitLabel: textField("urgentVisitLabel", source),
    inquiryEyebrow: textField("inquiryEyebrow", source),
    inquiryTitle: textField("inquiryTitle", source),
    inquiryIntro: textField("inquiryIntro", source),
    inquiryButton: textField("inquiryButton", source),
  };
}
