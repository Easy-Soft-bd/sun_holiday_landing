import type { Metadata } from 'next';
import type { TourRecord } from '@/src/lib/data/tours';
import type { BlogPostRecord } from '@/src/lib/data/blog';
import { stripHtml } from '@/src/lib/html';

const DEFAULT_SITE_URL = 'https://sunholidaysltd.com';
const DEFAULT_SITE_NAME = 'Sun Tourism Ltd';
const DEFAULT_DESCRIPTION =
  'Book your dream holiday with Sun Tourism Ltd. Specialists in tours, Hajj, Umrah, visa support, and curated travel experiences.';
const DEFAULT_OG_IMAGE = '/hero/hero.jpg';

function trimTrailingSlash(value: string) {
  return value.endsWith('/') ? value.slice(0, -1) : value;
}

export function getSiteUrl() {
  return trimTrailingSlash(process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL);
}

export function absoluteUrl(path = '/') {
  if (!path) {
    return getSiteUrl();
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return `${getSiteUrl()}${path.startsWith('/') ? path : `/${path}`}`;
}

export function splitKeywords(value?: string | string[]) {
  if (!value) {
    return undefined;
  }

  if (Array.isArray(value)) {
    return value;
  }

  return value
    .split(',')
    .map((keyword) => keyword.trim())
    .filter(Boolean);
}

type PageMetadataInput = {
  title: string;
  description: string;
  path?: string;
  image?: string;
  keywords?: string | string[];
  type?: 'website' | 'article';
};

export function buildPageMetadata({
  title,
  description,
  path = '/',
  image = DEFAULT_OG_IMAGE,
  keywords,
  type = 'website',
}: PageMetadataInput): Metadata {
  const canonical = absoluteUrl(path);
  const socialImage = absoluteUrl(image);

  return {
    title,
    description,
    keywords: splitKeywords(keywords),
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: DEFAULT_SITE_NAME,
      locale: 'en_BD',
      type,
      images: [
        {
          url: socialImage,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [socialImage],
    },
  };
}

export function getDefaultSeo() {
  return {
    siteName: DEFAULT_SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    image: DEFAULT_OG_IMAGE,
  };
}

/** Rich metadata + Open Graph article fields for public tour detail pages. */
export function buildTourDetailMetadata(tour: TourRecord, pathname: string): Metadata {
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const plain = stripHtml(tour.description);
  const description =
    plain.length > 160 ? `${plain.slice(0, 157).trim()}…` : plain || DEFAULT_DESCRIPTION;
  const title = `${tour.title} | ${DEFAULT_SITE_NAME}`;
  const canonical = absoluteUrl(path);
  const socialImage = absoluteUrl(tour.image);
  const publishedTime = tour.createdAt ? new Date(tour.createdAt).toISOString() : undefined;
  const modifiedTime = tour.updatedAt ? new Date(tour.updatedAt).toISOString() : undefined;

  return {
    title,
    description,
    keywords: [
      tour.title,
      tour.location,
      tour.category,
      'tour package',
      'travel Bangladesh',
      DEFAULT_SITE_NAME,
    ],
    alternates: {
      canonical,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: DEFAULT_SITE_NAME,
      locale: 'en_BD',
      type: 'article',
      publishedTime,
      modifiedTime,
      images: [
        {
          url: socialImage,
          width: 1200,
          height: 630,
          alt: tour.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [socialImage],
    },
    category: tour.category,
  };
}

/** Article metadata for public blog post pages (canonical, OG article, robots). */
export function buildBlogPostMetadata(post: BlogPostRecord, pathname: string): Metadata {
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const plainExcerpt = stripHtml(post.excerpt || '');
  const plainContent = stripHtml(post.content || '');
  const fallbackDesc =
    plainExcerpt ||
    (plainContent.length > 160 ? `${plainContent.slice(0, 157).trim()}…` : plainContent) ||
    DEFAULT_DESCRIPTION;
  const metaDesc =
    typeof post.metaDescription === 'string' && post.metaDescription.trim()
      ? post.metaDescription.trim()
      : fallbackDesc.length > 160
        ? `${fallbackDesc.slice(0, 157).trim()}…`
        : fallbackDesc;

  const pageTitle =
    typeof post.metaTitle === 'string' && post.metaTitle.trim()
      ? post.metaTitle.trim()
      : post.title;
  const title = pageTitle.includes(DEFAULT_SITE_NAME)
    ? pageTitle
    : `${pageTitle} | ${DEFAULT_SITE_NAME}`;

  const canonical = absoluteUrl(path);
  const socialImage = absoluteUrl(post.image);
  const publishedTime = post.publishedAt
    ? new Date(post.publishedAt).toISOString()
    : post.createdAt
      ? new Date(post.createdAt).toISOString()
      : undefined;
  const modifiedTime = post.updatedAt ? new Date(post.updatedAt).toISOString() : undefined;

  return {
    title,
    description: metaDesc,
    keywords: [
      post.title,
      post.category,
      'travel blog',
      'travel tips',
      'Bangladesh travel',
      DEFAULT_SITE_NAME,
    ],
    alternates: {
      canonical,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
    openGraph: {
      title,
      description: metaDesc,
      url: canonical,
      siteName: DEFAULT_SITE_NAME,
      locale: 'en_BD',
      type: 'article',
      publishedTime,
      modifiedTime,
      authors: [DEFAULT_SITE_NAME],
      images: [
        {
          url: socialImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: metaDesc,
      images: [socialImage],
    },
    category: post.category,
  };
}
