import type { Metadata } from 'next';
import StaticContentPage from '@/src/components/common/StaticContentPage';
import { buildPageMetadata } from '@/src/lib/site';

export const metadata: Metadata = buildPageMetadata({
  title: 'Privacy Policy - Sun Tourism Ltd',
  description: 'Read how Sun Tourism Ltd collects, uses, and protects customer information across enquiries, bookings, and support requests.',
  path: '/privacy',
});

export default function PrivacyPage() {
  return (
    <StaticContentPage
      eyebrow="Privacy"
      title="Privacy Policy"
      intro="Sun Tourism Ltd handles personal information carefully and only uses it to operate enquiries, bookings, customer support, and lawful business activities."
      sections={[
        {
          title: 'What We Collect',
          body:
            'We may collect contact details, travel preferences, passport or visa-related information, billing details, and communication history when you request assistance or book a service through us.',
        },
        {
          title: 'How We Use Information',
          body:
            'We use customer information to respond to enquiries, process bookings, coordinate travel services, improve service delivery, and meet legal or regulatory obligations connected to travel operations.',
        },
        {
          title: 'Security and Access',
          body:
            'We limit access to personal information to authorized staff and service providers who need it to support our operations. If you want to review or correct your information, please contact our team directly.',
        },
      ]}
    />
  );
}
