import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import StaticContentPage from '@/src/components/common/StaticContentPage';
import { buildPageMetadata } from '@/src/lib/site';

const resortPages: Record<
  string,
  {
    title: string;
    intro: string;
    description: string;
    keywords: string[];
  }
> = {
  'grandeur-bliss': {
    title: 'Grandeur Bliss',
    intro: 'A luxury beachfront project by Sun Holidays Ltd planned for travelers who want spacious hospitality, elevated comfort, and destination-led stays.',
    description:
      'Grandeur Bliss is a coming-soon resort concept designed around coastal relaxation, premium accommodation, dining, and event-ready hospitality.',
    keywords: ['Grandeur Bliss', 'Coxs Bazar Resort', 'Luxury Resort Bangladesh', 'Sun Holidays Ltd'],
  },
  'city-dhaka': {
    title: 'Sun Holidays City Hotel',
    intro: 'A Dhaka city property concept created for business travelers and guests who want a comfortable base close to the capital’s commercial rhythm.',
    description:
      'Sun Holidays City Hotel is a coming-soon hospitality concept focused on practical comfort, central access, and dependable service for urban stays.',
    keywords: ['City Hotel Dhaka', 'Business Hotel Dhaka', 'Sun Holidays City Hotel', 'Sun Holidays Ltd'],
  },
  city: {
    title: 'Sun Holidays City Hotel',
    intro: 'A Dhaka city property concept created for business travelers and guests who want a comfortable base close to the capital’s commercial rhythm.',
    description:
      'Sun Holidays City Hotel is a coming-soon hospitality concept focused on practical comfort, central access, and dependable service for urban stays.',
    keywords: ['City Hotel Dhaka', 'Business Hotel Dhaka', 'Sun Holidays City Hotel', 'Sun Holidays Ltd'],
  },
};

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const resort = resortPages[slug];

  if (!resort) {
    return buildPageMetadata({
      title: 'Resort Not Found - Sun Holidays Ltd',
      description: 'The requested resort page could not be found.',
      path: `/resort/${slug}`,
    });
  }

  return buildPageMetadata({
    title: `${resort.title} - Sun Holidays Ltd`,
    description: resort.description,
    path: `/resort/${slug}`,
    keywords: resort.keywords,
  });
}

export default async function ResortSlugPage({ params }: Props) {
  const { slug } = await params;
  const resort = resortPages[slug];

  if (!resort) {
    notFound();
  }

  return (
    <StaticContentPage
      eyebrow="Coming Soon"
      title={resort.title}
      intro={resort.intro}
      ctaLabel="Contact Our Team"
      ctaHref="/contact"
      sections={[
        {
          title: 'Project Overview',
          body: resort.description,
        },
        {
          title: 'Planning Status',
          body:
            'This hospitality experience is currently presented as an upcoming property. Contact Sun Holidays Ltd for the latest availability, launch timelines, and package discussions.',
        },
        {
          title: 'How to Enquire',
          body:
            'Our team can help with advance interest, travel planning, and related package support. Use the contact page to discuss preferred dates, group size, and destination requirements.',
        },
      ]}
    />
  );
}
