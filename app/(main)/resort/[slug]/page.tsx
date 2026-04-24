import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import StaticContentPage from '@/src/components/common/StaticContentPage';
import { staticResortPages } from '@/src/lib/resorts/static-resort-pages';
import { buildPageMetadata } from '@/src/lib/site';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const resort = staticResortPages[slug];

  if (!resort) {
    return buildPageMetadata({
      title: 'Resort Not Found - Sun Tourism Ltd',
      description: 'The requested resort page could not be found.',
      path: `/resort/${slug}`,
    });
  }

  return buildPageMetadata({
    title: `${resort.title} - Sun Tourism Ltd`,
    description: resort.description,
    path: `/resort/${slug}`,
    keywords: resort.keywords,
  });
}

export default async function ResortSlugPage({ params }: Props) {
  const { slug } = await params;
  const resort = staticResortPages[slug];

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
            'This hospitality experience is currently presented as an upcoming property. Contact Sun Tourism Ltd for the latest availability, launch timelines, and package discussions.',
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
