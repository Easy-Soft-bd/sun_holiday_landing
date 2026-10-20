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
  leadersStatLabel: string;
  membersStatLabel: string;
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
  leadersStatLabel: "Leaders",
  membersStatLabel: "Members",
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
  teamSectionEyebrow: "Our Team",
  teamSectionTitle: "Our Valuable Team",
  teamSectionDescription:
    "Professionals in various designations, each playing a crucial role in ensuring exceptional service.",
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
