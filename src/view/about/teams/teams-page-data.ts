export type DirectorItem = {
  name: string;
  title: string;
  image: string;
  message: string;
};

export type TeamItem = {
  name: string;
  position: string;
  image: string;
};

export type TeamsPageData = {
  heroBadgeText: string;
  heroTitleMain: string;
  heroTitleAccent: string;
  heroTitleSub: string;
  heroDescription: string;
  boardStatLabel: string;
  leadersStatLabel: string;
  membersStatLabel: string;
  boardEyebrow: string;
  boardTitle: string;
  boardDescription: string;
  board: DirectorItem[];
  leadershipEyebrow: string;
  leadershipTitle: string;
  leadershipDescription: string;
  leaderMessageLabel: string;
  directors: DirectorItem[];
  teamSectionEyebrow: string;
  teamSectionTitle: string;
  teamSectionDescription: string;
  teams: TeamItem[];
  ctaTitleMain: string;
  ctaTitleAccent: string;
  ctaTitleEnd: string;
  ctaDescription: string;
  ctaPrimaryLabel: string;
  ctaPrimaryHref: string;
  ctaSecondaryLabel: string;
  ctaSecondaryHref: string;
};

export const defaultTeamsPageData: TeamsPageData = {
  heroBadgeText: "Excellence in Leadership",
  heroTitleMain: "Meet The",
  heroTitleAccent: "Visionaries",
  heroTitleSub: "Behind Your Journey",
  heroDescription:
    "The dedicated professionals working tirelessly to craft unforgettable travel experiences just for you.",
  boardStatLabel: "Directors",
  leadersStatLabel: "Leaders",
  membersStatLabel: "Employees",
  boardEyebrow: "Board of Directors",
  boardTitle: "Our Board",
  boardDescription: "The directors who guide Sun Tourism Ltd.",
  board: [
    {
      name: "Nusrat Jahan",
      title: "Director",
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000&auto=format&fit=crop",
      message:
        "As a Director of Sun Tourism Ltd, I am proud of the care our team puts into every journey. Thank you for trusting us with your travels.",
    },
    {
      name: "Kamrul Hasan",
      title: "Director",
      image:
        "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=1000&auto=format&fit=crop",
      message:
        "Travel should feel clear and well looked after from the first conversation. That is the standard we hold for Sun Tourism Ltd.",
    },
    {
      name: "Farhana Akter",
      title: "Independent Director",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1000&auto=format&fit=crop",
      message:
        "Good governance and honest service go together. I am glad to help guide Sun Tourism Ltd as it grows with its travelers.",
    },
  ],
  leadershipEyebrow: "Leadership",
  leadershipTitle: "Our Top Leaders",
  leadershipDescription: "Meet the visionaries steering Sun Tourism Ltd.",
  leaderMessageLabel: "Message",
  directors: [
    {
      name: "Md. Ferdous",
      title: "Chairman",
      image:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1000&auto=format&fit=crop",
      message:
        "I hope this message finds you in good health and high spirits. As the Director of Sun Tourism Ltd, I want to express my sincere appreciation for your trust and loyalty as one of our valued travelers.",
    },
    {
      name: "Sayed Zillur Rahman",
      title: "Vice Chairman",
      image:
        "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1000&auto=format&fit=crop",
      message:
        "As the Vice Chairman of Sun Tourism Ltd, I take great pride in extending a warm welcome to you. We understand that travel is not just about reaching a destination.",
    },
    {
      name: "Md. Asaduzzaman",
      title: "Managing Director",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1000&auto=format&fit=crop",
      message:
        "As the Managing Director of our Sun Tourism Ltd, I wanted to take a moment to express my gratitude for your trust and loyalty as one of our valued travelers.",
    },
  ],
  teamSectionEyebrow: "Team",
  teamSectionTitle: "Our Employees",
  teamSectionDescription:
    "The people who plan, book, and look after every journey.",
  teams: [
    {
      name: "Md. Shariful Hira",
      position: "Head Of Marketing",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1000&auto=format&fit=crop",
    },
    {
      name: "Farzana Rahman",
      position: "Travel Consultant",
      image:
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=1000&auto=format&fit=crop",
    },
    {
      name: "Nafis Ahmed",
      position: "Tour Coordinator",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop",
    },
    {
      name: "Sumaiya Kabir",
      position: "Customer Service Representative",
      image:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1000&auto=format&fit=crop",
    },
    {
      name: "Rakib Hasan",
      position: "Operations Team",
      image:
        "https://images.unsplash.com/photo-1463453091185-61582044d556?q=80&w=1000&auto=format&fit=crop",
    },
    {
      name: "Nabila Islam",
      position: "Finance and Administration",
      image:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1000&auto=format&fit=crop",
    },
  ],
  ctaTitleMain: "Ready to",
  ctaTitleAccent: "Travel",
  ctaTitleEnd: "With Us?",
  ctaDescription:
    "Our team is here to plan your next journey — from first enquiry to a seamless return home.",
  ctaPrimaryLabel: "Contact Us",
  ctaPrimaryHref: "/contact",
  ctaSecondaryLabel: "Explore Tours",
  ctaSecondaryHref: "/tours",
};

const PREVIOUS_COPY: Record<string, string> = {
  membersStatLabel: "Members",
  teamSectionEyebrow: "Our Team",
  teamSectionTitle: "Our Valuable Team",
  teamSectionDescription:
    "Professionals in various designations, each playing a crucial role in ensuring exceptional service.",
};

function textField<K extends keyof TeamsPageData>(
  key: K,
  partial: Partial<TeamsPageData> | undefined,
): TeamsPageData[K] {
  const incoming = partial?.[key];
  const fallback = defaultTeamsPageData[key];
  if (typeof incoming !== "string" || !incoming.trim()) return fallback;
  if (incoming === PREVIOUS_COPY[key as string]) return fallback;
  return incoming as TeamsPageData[K];
}

function cleanDirectors(value: unknown, fallback: DirectorItem[]): DirectorItem[] {
  if (!Array.isArray(value)) return fallback;
  return value
    .filter((item): item is DirectorItem => Boolean(item) && typeof item === "object")
    .map((item) => ({
      name: String(item.name ?? "").trim(),
      title: String(item.title ?? "").trim(),
      image: String(item.image ?? "").trim(),
      message: String(item.message ?? "").trim(),
    }))
    .filter((item) => item.name || item.title);
}

function cleanEmployees(value: unknown, fallback: TeamItem[]): TeamItem[] {
  if (!Array.isArray(value)) return fallback;
  return value
    .filter((item): item is TeamItem => Boolean(item) && typeof item === "object")
    .map((item) => ({
      name: String(item.name ?? "").trim(),
      position: String(item.position ?? "").trim(),
      image: String(item.image ?? "").trim(),
    }))
    .filter((item) => item.name || item.position);
}

export function mergeTeamsPageData(partial?: Partial<TeamsPageData> | null): TeamsPageData {
  const source = partial ?? {};
  return {
    ...defaultTeamsPageData,
    heroBadgeText: textField("heroBadgeText", source),
    heroTitleMain: textField("heroTitleMain", source),
    heroTitleAccent: textField("heroTitleAccent", source),
    heroTitleSub: textField("heroTitleSub", source),
    heroDescription: textField("heroDescription", source),
    boardStatLabel: textField("boardStatLabel", source),
    leadersStatLabel: textField("leadersStatLabel", source),
    membersStatLabel: textField("membersStatLabel", source),
    boardEyebrow: textField("boardEyebrow", source),
    boardTitle: textField("boardTitle", source),
    boardDescription: textField("boardDescription", source),
    board: cleanDirectors(
      Object.prototype.hasOwnProperty.call(source, "board") ? source.board : undefined,
      defaultTeamsPageData.board,
    ),
    leadershipEyebrow: textField("leadershipEyebrow", source),
    leadershipTitle: textField("leadershipTitle", source),
    leadershipDescription: textField("leadershipDescription", source),
    leaderMessageLabel: textField("leaderMessageLabel", source),
    directors: cleanDirectors(source.directors, defaultTeamsPageData.directors),
    teamSectionEyebrow: textField("teamSectionEyebrow", source),
    teamSectionTitle: textField("teamSectionTitle", source),
    teamSectionDescription: textField("teamSectionDescription", source),
    teams: cleanEmployees(source.teams, defaultTeamsPageData.teams),
    ctaTitleMain: textField("ctaTitleMain", source),
    ctaTitleAccent: textField("ctaTitleAccent", source),
    ctaTitleEnd: textField("ctaTitleEnd", source),
    ctaDescription: textField("ctaDescription", source),
    ctaPrimaryLabel: textField("ctaPrimaryLabel", source),
    ctaPrimaryHref: textField("ctaPrimaryHref", source),
    ctaSecondaryLabel: textField("ctaSecondaryLabel", source),
    ctaSecondaryHref: textField("ctaSecondaryHref", source),
  };
}
