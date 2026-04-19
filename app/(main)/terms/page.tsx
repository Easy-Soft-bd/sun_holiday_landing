import type { Metadata } from 'next';
import StaticContentPage from '@/src/components/common/StaticContentPage';
import { buildPageMetadata } from '@/src/lib/site';

export const metadata: Metadata = buildPageMetadata({
  title: 'Terms of Service - Sun Holidays Ltd',
  description: 'Review the service terms that apply to enquiries, travel planning, bookings, and support provided by Sun Holidays Ltd.',
  path: '/terms',
});

export default function TermsPage() {
  return (
    <StaticContentPage
      eyebrow="Terms"
      title="Terms of Service"
      intro="These terms describe the general conditions for using Sun Holidays Ltd services, requesting travel support, and confirming bookings."
      sections={[
        {
          title: 'Quotes and Availability',
          body:
            'Travel prices, schedules, and room availability can change until a booking is confirmed. Quotes are provided in good faith and may be adjusted if airlines, hotels, embassies, or suppliers change their terms.',
        },
        {
          title: 'Customer Responsibilities',
          body:
            'Travelers are responsible for reviewing visa requirements, passport validity, and destination rules before departure. Accurate information must be provided during enquiries and booking requests.',
        },
        {
          title: 'Changes and Cancellations',
          body:
            'Changes and cancellations may be subject to supplier policies, timing restrictions, and service charges. Any applicable refund or rescheduling amount depends on the airline, hotel, embassy, or package provider involved.',
        },
      ]}
    />
  );
}
