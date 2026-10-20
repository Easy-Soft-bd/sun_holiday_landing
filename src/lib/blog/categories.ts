import type { Metadata } from "next";
import { buildPageMetadata, absoluteUrl } from "@/src/lib/site";

export const MEDIA_CATEGORY_NAMES = ["News", "Event", "Blog", "CSR"] as const;
export type MediaCategoryName = (typeof MEDIA_CATEGORY_NAMES)[number];

export type MediaListingKey = "news" | "events" | "blog" | "csr";

export type MediaListing = {
  key: MediaListingKey;
  /** Stored on the post and shown on cards. */
  category: MediaCategoryName;
  /** Footer and breadcrumb label. */
  label: string;
  path: `/${string}`;
  schemaType: "NewsArticle" | "BlogPosting";
  title: string;
  description: string;
  keywords: string[];
  eyebrow: string;
  heading: string;
  headingHighlight: string;
  intro: string;
};

export const MEDIA_LISTINGS: readonly MediaListing[] = [
  {
    key: "news",
    category: "News",
    label: "News",
    path: "/news",
    schemaType: "NewsArticle",
    title: "Travel News | Sun Tourism Ltd",
    description:
      "Company and travel news from Sun Tourism Ltd, including service updates, destination notices, and announcements for travelers in Bangladesh.",
    keywords: ["travel news", "Sun Tourism Ltd news", "Bangladesh travel updates"],
    eyebrow: "Media",
    heading: "Travel",
    headingHighlight: "News",
    intro: "Announcements, service updates, and travel notices from Sun Tourism Ltd.",
  },
  {
    key: "events",
    category: "Event",
    label: "Events",
    path: "/events",
    schemaType: "BlogPosting",
    title: "Events | Sun Tourism Ltd",
    description:
      "Travel events, seasonal programs, and gatherings hosted or supported by Sun Tourism Ltd.",
    keywords: ["travel events", "Sun Tourism Ltd events", "Bangladesh travel programs"],
    eyebrow: "Media",
    heading: "Travel",
    headingHighlight: "Events",
    intro: "Programs, gatherings, and seasonal travel events from Sun Tourism Ltd.",
  },
  {
    key: "blog",
    category: "Blog",
    label: "Blog",
    path: "/blog",
    schemaType: "BlogPosting",
    title: "Travel Blog | Sun Tourism Ltd",
    description:
      "Travel stories, destination guides, and practical tips from Sun Tourism Ltd.",
    keywords: ["travel blog", "Bangladesh travel tips", "destination guides", "Sun Tourism Ltd"],
    eyebrow: "Media",
    heading: "Travel",
    headingHighlight: "Stories",
    intro: "Stories, destination guides, and practical notes for your next journey.",
  },
  {
    key: "csr",
    category: "CSR",
    label: "CSR",
    path: "/csr",
    schemaType: "BlogPosting",
    title: "CSR | Sun Tourism Ltd",
    description:
      "Community and corporate social responsibility work by Sun Tourism Ltd.",
    keywords: ["CSR", "Sun Tourism Ltd community", "corporate social responsibility"],
    eyebrow: "Media",
    heading: "Community",
    headingHighlight: "CSR",
    intro: "How Sun Tourism Ltd supports communities and responsible travel.",
  },
] as const;

const EXCLUSIVE_FROM_BLOG = new Set<string>(["News", "Event", "CSR"]);

export function getMediaListing(key: MediaListingKey): MediaListing {
  const listing = MEDIA_LISTINGS.find((item) => item.key === key);
  if (!listing) {
    return MEDIA_LISTINGS[2];
  }
  return listing;
}

/** Listing a post belongs to. Older categories stay on the blog page. */
export function listingForCategory(category: string): MediaListing {
  const match = MEDIA_LISTINGS.find((item) => item.category === category);
  return match ?? getMediaListing("blog");
}

export function postsForListing<T extends { category: string }>(
  posts: T[],
  key: MediaListingKey,
): T[] {
  if (key === "blog") {
    return posts.filter((post) => !EXCLUSIVE_FROM_BLOG.has(post.category));
  }
  const category = getMediaListing(key).category;
  return posts.filter((post) => post.category === category);
}

export function isMediaCategory(value: string): value is MediaCategoryName {
  return (MEDIA_CATEGORY_NAMES as readonly string[]).includes(value);
}

export function buildMediaListingMetadata(key: MediaListingKey): Metadata {
  const listing = getMediaListing(key);
  return {
    ...buildPageMetadata({
      title: listing.title,
      description: listing.description,
      path: listing.path,
      keywords: listing.keywords,
    }),
    robots: { index: true, follow: true },
  };
}

export function buildMediaListingJsonLd(
  key: MediaListingKey,
  posts: { title: string; slug: string; excerpt: string; image: string; publishedAt?: string }[],
) {
  const listing = getMediaListing(key);
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: listing.title,
    description: listing.description,
    url: absoluteUrl(listing.path),
    mainEntity: {
      "@type": "ItemList",
      itemListElement: posts.slice(0, 20).map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: post.title,
        url: absoluteUrl(`/blog/${post.slug}`),
      })),
    },
  };
}
