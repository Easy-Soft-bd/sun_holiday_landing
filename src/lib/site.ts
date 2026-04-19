import type { Metadata } from 'next';

const DEFAULT_SITE_URL = 'https://sunholidaysltd.com';
const DEFAULT_SITE_NAME = 'Sun Holidays Ltd';
const DEFAULT_DESCRIPTION =
  'Book your dream holiday with Sun Holidays Ltd. Specialists in tours, Hajj, Umrah, visa support, and curated travel experiences.';
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
