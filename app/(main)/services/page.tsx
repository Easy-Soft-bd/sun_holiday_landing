import type { Metadata } from 'next';
import StaticContentPage from '@/src/components/common/StaticContentPage';
import { buildPageMetadata } from '@/src/lib/site';

export const metadata: Metadata = buildPageMetadata({
  title: 'Travel Services - Sun Holidays Ltd',
  description:
    'Discover Sun Holidays Ltd services including curated tours, visa support, air ticketing, resort bookings, and Hajj and Umrah assistance.',
  path: '/services',
  keywords: ['Travel Services', 'Visa Support', 'Air Ticketing', 'Resort Bookings', 'Sun Holidays Ltd'],
});

export default function ServicesPage() {
  return (
    <StaticContentPage
      eyebrow="What We Do"
      title="Travel Services Built Around Real Journeys"
      intro="Sun Holidays Ltd supports travelers from the first inquiry to the final itinerary with practical planning, trusted support, and destination knowledge."
      ctaLabel="Plan Your Trip"
      ctaHref="/contact"
      sections={[
        {
          title: 'Tours and Holiday Packages',
          body:
            'We design domestic and international travel packages for families, groups, couples, and solo travelers. Each package is shaped around route planning, accommodation, transfers, and local experiences.',
        },
        {
          title: 'Visa and Documentation Support',
          body:
            'Our team helps with document preparation, process guidance, and destination-specific visa requirements so travelers can move through the application process with more confidence and fewer surprises.',
        },
        {
          title: 'Air Ticketing and Resort Booking',
          body:
            'We help clients compare routes, confirm schedules, and book flights and stays that fit both the budget and the travel purpose, whether that is leisure, business, or a special occasion.',
        },
      ]}
    />
  );
}
