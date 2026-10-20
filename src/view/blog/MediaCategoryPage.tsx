import BlogView from "@/src/view/blog/BlogView";
import { getCachedActiveBlogPosts, toBlogPostView } from "@/src/lib/data/blog";
import {
  buildMediaListingJsonLd,
  postsForListing,
  type MediaListingKey,
} from "@/src/lib/blog/categories";

export default async function MediaCategoryPage({ listingKey }: { listingKey: MediaListingKey }) {
  const posts = postsForListing(await getCachedActiveBlogPosts(), listingKey).map(toBlogPostView);
  const jsonLd = buildMediaListingJsonLd(listingKey, posts);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <BlogView posts={posts} listingKey={listingKey} />
    </>
  );
}
