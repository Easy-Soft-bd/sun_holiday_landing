import type { BlogPostRecord } from '@/src/lib/data/blog';
import { absoluteUrl, getDefaultSeo } from '@/src/lib/site';
import { getBlogPublicPath } from '@/src/lib/blog/public-path';
import { listingForCategory } from '@/src/lib/blog/categories';
import { stripHtml } from '@/src/lib/html';

type BlogJsonLdProps = {
  post: BlogPostRecord;
};

export default function BlogJsonLd({ post }: BlogJsonLdProps) {
  const path = getBlogPublicPath(post);
  const pageUrl = absoluteUrl(path);
  const { siteName, image: defaultLogo } = getDefaultSeo();
  const description =
    stripHtml(post.excerpt || post.content || '').slice(0, 2000) || undefined;
  const published =
    post.publishedAt != null
      ? new Date(post.publishedAt).toISOString()
      : post.createdAt
        ? new Date(post.createdAt).toISOString()
        : undefined;
  const modified = post.updatedAt ? new Date(post.updatedAt).toISOString() : published;

  const listing = listingForCategory(post.category);

  const articleLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': listing.schemaType,
    headline: post.title,
    description,
    image: [absoluteUrl(post.image)],
    url: pageUrl,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': pageUrl,
    },
    author: {
      '@type': 'Organization',
      name: siteName,
      url: absoluteUrl('/'),
    },
    publisher: {
      '@type': 'Organization',
      name: siteName,
      logo: {
        '@type': 'ImageObject',
        url: absoluteUrl(defaultLogo),
      },
    },
    articleSection: post.category,
    keywords: [post.category, 'travel', 'blog', siteName].join(', '),
  };

  if (published) articleLd.datePublished = published;
  if (modified) articleLd.dateModified = modified;

  if (post.category === 'Event' && post.eventDate) {
    articleLd['@type'] = 'Event';
    articleLd.name = post.title;
    articleLd.startDate = post.eventDate;
    articleLd.eventAttendanceMode = 'https://schema.org/OfflineEventAttendanceMode';
    articleLd.eventStatus = 'https://schema.org/EventScheduled';
    articleLd.organizer = {
      '@type': 'Organization',
      name: siteName,
      url: absoluteUrl('/'),
    };
    if (post.eventLocation) {
      articleLd.location = {
        '@type': 'Place',
        name: post.eventLocation,
        address: post.eventLocation,
      };
    }
  }

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: absoluteUrl('/'),
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: listing.label,
        item: absoluteUrl(listing.path),
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: pageUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd).replace(/</g, '\\u003c') }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd).replace(/</g, '\\u003c') }}
      />
    </>
  );
}
