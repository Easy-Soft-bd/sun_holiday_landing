import type { Metadata } from 'next';
import StaticContentPage from '@/src/components/common/StaticContentPage';
import { buildPageMetadata } from '@/src/lib/site';

export const metadata: Metadata = buildPageMetadata({
  title: 'Cookie Policy - Sun Tourism Ltd',
  description: 'Learn how Sun Tourism Ltd uses cookies and similar technologies to support website functionality and improve the user experience.',
  path: '/cookies',
});

export default function CookiesPage() {
  return (
    <StaticContentPage
      eyebrow="Cookies"
      title="Cookie Policy"
      intro="We use cookies and similar technologies to keep the website working smoothly, understand usage patterns, and support secure administration features."
      sections={[
        {
          title: 'Essential Cookies',
          body:
            'Essential cookies support core site behavior such as session handling, admin authentication, and route-level functionality needed for the site to work correctly.',
        },
        {
          title: 'Performance and Experience',
          body:
            'Some browser-side storage or cookies may help us understand how visitors navigate the website so we can improve speed, usability, and content structure over time.',
        },
        {
          title: 'Managing Cookies',
          body:
            'Most browsers let you review, block, or clear cookies. Disabling some cookies may reduce functionality for admin tools or parts of the website that rely on session state.',
        },
      ]}
    />
  );
}
