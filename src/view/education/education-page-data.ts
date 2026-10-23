export type EducationService = {
  title: string;
  description: string;
  icon: string;
};

export type EducationDestination = {
  title: string;
  description: string;
  image: string;
};

export type EducationStep = {
  title: string;
  description: string;
};

export type EducationDocument = {
  text: string;
};

export type EducationPageData = {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  heroBadge: string;
  heroTitleMain: string;
  heroTitleAccent: string;
  heroSubtitle: string;
  heroDescription: string;
  heroImage: string;
  heroEnquireLabel: string;
  heroVisitLabel: string;
  servicesEyebrow: string;
  servicesTitle: string;
  servicesIntro: string;
  services: EducationService[];
  destinationsEyebrow: string;
  destinationsTitle: string;
  destinationsIntro: string;
  destinations: EducationDestination[];
  documentsEyebrow: string;
  documentsTitle: string;
  documentsIntro: string;
  documentsImage: string;
  documents: EducationDocument[];
  stepsEyebrow: string;
  stepsTitle: string;
  stepsIntro: string;
  steps: EducationStep[];
  visitEyebrow: string;
  visitTitle: string;
  visitBody: string;
  visitCallLabel: string;
  visitOfficeLabel: string;
  inquiryEyebrow: string;
  inquiryTitle: string;
  inquiryIntro: string;
  inquiryButton: string;
};

export const defaultEducationPageData: EducationPageData = {
  metaTitle: "Sun Global Education | Education Visa Consultancy - Sun Tourism Ltd",
  metaDescription:
    "Sun Global Education helps students in Bangladesh choose a university, prepare admission papers, and apply for an education visa.",
  metaKeywords:
    "Sun Global Education, education visa, student visa consultancy, university admission, study abroad, Bangladesh",
  heroBadge: "Sun Global Education",
  heroTitleMain: "Education visa",
  heroTitleAccent: "consultancy",
  heroSubtitle: "From the course shortlist to the visa file",
  heroDescription:
    "We counsel students on where to study, prepare the admission papers, and stay with the education visa until it is ready to submit.",
  heroImage:
    "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1600&auto=format&fit=crop",
  heroEnquireLabel: "Ask about a course",
  heroVisitLabel: "Visit the office",
  servicesEyebrow: "What we arrange",
  servicesTitle: "Counselling for study abroad",
  servicesIntro: "Each student starts with a goal. These are the parts families ask us to handle.",
  services: [
    {
      title: "University shortlist",
      description: "Courses and campuses matched to the student's grades, budget, and preferred country.",
      icon: "LuGraduationCap",
    },
    {
      title: "Admission papers",
      description: "Application forms, transcripts, and the documents the university asks for.",
      icon: "LuFileText",
    },
    {
      title: "Student visa file",
      description: "A checklist for the education visa, including funds and the offer letter.",
      icon: "LuPlane",
    },
    {
      title: "Pre-departure briefing",
      description: "What to carry, when to fly, and who to call after the visa is issued.",
      icon: "LuCircleCheck",
    },
  ],
  destinationsEyebrow: "Where students go",
  destinationsTitle: "Study destinations we counsel",
  destinationsIntro: "The right country depends on the course and the budget. We talk through the usual routes before anyone applies.",
  destinations: [
    {
      title: "United Kingdom",
      description: "Universities and colleges, with a student visa file built around the offer.",
      image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=1400&auto=format&fit=crop",
    },
    {
      title: "Canada",
      description: "College and university routes, including the funds and study plan the file needs.",
      image: "https://images.unsplash.com/photo-1517935706615-2717063c2225?q=80&w=1400&auto=format&fit=crop",
    },
    {
      title: "Australia",
      description: "Course shortlists and the student visa papers that follow an offer.",
      image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=1400&auto=format&fit=crop",
    },
    {
      title: "Malaysia",
      description: "A nearer option for degree and diploma study, with visa guidance for the intake.",
      image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=80&w=1400&auto=format&fit=crop",
    },
  ],
  documentsEyebrow: "Papers",
  documentsTitle: "Documents students usually need",
  documentsIntro: "The exact list depends on the country and the university. We confirm it before the application starts.",
  documentsImage:
    "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1400&auto=format&fit=crop",
  documents: [
    { text: "Passport with enough validity for the course" },
    { text: "Academic transcripts and certificates" },
    { text: "English test result, when the university asks for one" },
    { text: "Recent passport-size photographs" },
    { text: "Bank statements or a sponsor letter for the funds" },
    { text: "Offer or admission letter, once the university issues it" },
  ],
  stepsEyebrow: "Process",
  stepsTitle: "How an education visa file moves",
  stepsIntro: "You stay informed at each step. We do not submit a file until the papers are complete.",
  steps: [
    { title: "Tell us the goal", description: "The course, the country, the grades, and when the student wants to start." },
    { title: "Shortlist universities", description: "We match options to the profile and explain what each one asks for." },
    { title: "Prepare the file", description: "Applications, funds, and the education visa checklist, reviewed before submission." },
    { title: "Travel", description: "Once the visa is issued, we help line up the flight and the pre-departure briefing." },
  ],
  visitEyebrow: "Office",
  visitTitle: "Talk it through at the office",
  visitBody:
    "Bring the transcripts, or just the questions. Call us, or come to the office, and a counselor will start the course shortlist with you.",
  visitCallLabel: "Call the office",
  visitOfficeLabel: "Get directions",
  inquiryEyebrow: "Start here",
  inquiryTitle: "Ask about a course",
  inquiryIntro: "Share your name and phone. A counselor will call to talk through the country, the course, and the visa papers.",
  inquiryButton: "Send enquiry",
};

function textField<K extends keyof EducationPageData>(
  key: K,
  partial: Partial<EducationPageData> | undefined,
): EducationPageData[K] {
  const incoming = partial?.[key];
  const fallback = defaultEducationPageData[key];
  if (typeof incoming !== "string" || !incoming.trim()) return fallback;
  return incoming as EducationPageData[K];
}

function cleanServices(value: unknown, fallback: EducationService[]): EducationService[] {
  if (!Array.isArray(value)) return fallback;
  return value
    .filter((item): item is EducationService => Boolean(item) && typeof item === "object")
    .map((item) => ({
      title: String(item.title ?? "").trim(),
      description: String(item.description ?? "").trim(),
      icon: String(item.icon ?? "").trim() || "LuGraduationCap",
    }))
    .filter((item) => item.title);
}

function defaultDestinationImage(title: string) {
  const match = defaultEducationPageData.destinations.find(
    (item) => item.title.toLowerCase() === title.toLowerCase(),
  );
  return match?.image ?? "";
}

function cleanDestinations(value: unknown, fallback: EducationDestination[]): EducationDestination[] {
  if (!Array.isArray(value)) return fallback;
  return value
    .filter((item): item is EducationDestination => Boolean(item) && typeof item === "object")
    .map((item) => {
      const title = String(item.title ?? "").trim();
      return {
        title,
        description: String(item.description ?? "").trim(),
        image: String(item.image ?? "").trim() || defaultDestinationImage(title),
      };
    })
    .filter((item) => item.title);
}

function cleanSteps(value: unknown, fallback: EducationStep[]): EducationStep[] {
  if (!Array.isArray(value)) return fallback;
  return value
    .filter((item): item is EducationStep => Boolean(item) && typeof item === "object")
    .map((item) => ({
      title: String(item.title ?? "").trim(),
      description: String(item.description ?? "").trim(),
    }))
    .filter((item) => item.title);
}

function cleanDocuments(value: unknown, fallback: EducationDocument[]): EducationDocument[] {
  if (!Array.isArray(value)) return fallback;
  return value
    .filter((item): item is EducationDocument => Boolean(item) && typeof item === "object")
    .map((item) => ({ text: String(item.text ?? "").trim() }))
    .filter((item) => item.text);
}

export function mergeEducationPageData(partial?: Partial<EducationPageData> | null): EducationPageData {
  const source = partial ?? {};
  return {
    ...defaultEducationPageData,
    metaTitle: textField("metaTitle", source),
    metaDescription: textField("metaDescription", source),
    metaKeywords: textField("metaKeywords", source),
    heroBadge: textField("heroBadge", source),
    heroTitleMain: textField("heroTitleMain", source),
    heroTitleAccent: textField("heroTitleAccent", source),
    heroSubtitle: textField("heroSubtitle", source),
    heroDescription: textField("heroDescription", source),
    heroImage: textField("heroImage", source),
    heroEnquireLabel: textField("heroEnquireLabel", source),
    heroVisitLabel: textField("heroVisitLabel", source),
    servicesEyebrow: textField("servicesEyebrow", source),
    servicesTitle: textField("servicesTitle", source),
    servicesIntro: textField("servicesIntro", source),
    services: cleanServices(
      Object.prototype.hasOwnProperty.call(source, "services") ? source.services : undefined,
      defaultEducationPageData.services,
    ),
    destinationsEyebrow: textField("destinationsEyebrow", source),
    destinationsTitle: textField("destinationsTitle", source),
    destinationsIntro: textField("destinationsIntro", source),
    destinations: cleanDestinations(
      Object.prototype.hasOwnProperty.call(source, "destinations") ? source.destinations : undefined,
      defaultEducationPageData.destinations,
    ),
    documentsEyebrow: textField("documentsEyebrow", source),
    documentsTitle: textField("documentsTitle", source),
    documentsIntro: textField("documentsIntro", source),
    documentsImage: textField("documentsImage", source),
    documents: cleanDocuments(
      Object.prototype.hasOwnProperty.call(source, "documents") ? source.documents : undefined,
      defaultEducationPageData.documents,
    ),
    stepsEyebrow: textField("stepsEyebrow", source),
    stepsTitle: textField("stepsTitle", source),
    stepsIntro: textField("stepsIntro", source),
    steps: cleanSteps(
      Object.prototype.hasOwnProperty.call(source, "steps") ? source.steps : undefined,
      defaultEducationPageData.steps,
    ),
    visitEyebrow: textField("visitEyebrow", source),
    visitTitle: textField("visitTitle", source),
    visitBody: textField("visitBody", source),
    visitCallLabel: textField("visitCallLabel", source),
    visitOfficeLabel: textField("visitOfficeLabel", source),
    inquiryEyebrow: textField("inquiryEyebrow", source),
    inquiryTitle: textField("inquiryTitle", source),
    inquiryIntro: textField("inquiryIntro", source),
    inquiryButton: textField("inquiryButton", source),
  };
}
