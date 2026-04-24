export type StaticResortPage = {
  title: string;
  intro: string;
  description: string;
  keywords: string[];
};

export const staticResortPages: Record<string, StaticResortPage> = {
  'grandeur-bliss': {
    title: 'Grandeur Bliss',
    intro:
      'A luxury beachfront project by Sun Holidays Ltd planned for travelers who want spacious hospitality, elevated comfort, and destination-led stays.',
    description:
      'Grandeur Bliss is a coming-soon resort concept designed around coastal relaxation, premium accommodation, dining, and event-ready hospitality.',
    keywords: ['Grandeur Bliss', 'Coxs Bazar Resort', 'Luxury Resort Bangladesh', 'Sun Holidays Ltd'],
  },
  'city-dhaka': {
    title: 'Sun Holidays City Hotel',
    intro:
      'A Dhaka city property concept created for business travelers and guests who want a comfortable base close to the capital’s commercial rhythm.',
    description:
      'Sun Holidays City Hotel is a coming-soon hospitality concept focused on practical comfort, central access, and dependable service for urban stays.',
    keywords: ['City Hotel Dhaka', 'Business Hotel Dhaka', 'Sun Holidays City Hotel', 'Sun Holidays Ltd'],
  },
  city: {
    title: 'Sun Holidays City Hotel',
    intro:
      'A Dhaka city property concept created for business travelers and guests who want a comfortable base close to the capital’s commercial rhythm.',
    description:
      'Sun Holidays City Hotel is a coming-soon hospitality concept focused on practical comfort, central access, and dependable service for urban stays.',
    keywords: ['City Hotel Dhaka', 'Business Hotel Dhaka', 'Sun Holidays City Hotel', 'Sun Holidays Ltd'],
  },
};

/** Pathnames under `/resort/[slug]` that exist today (for sitemap, redirects, etc.). */
export function listStaticResortPathnames(): string[] {
  return Object.keys(staticResortPages).map((slug) => `/resort/${encodeURIComponent(slug)}`);
}
