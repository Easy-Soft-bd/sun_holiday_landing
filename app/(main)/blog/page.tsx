import { buildMediaListingMetadata } from "@/src/lib/blog/categories";
import MediaCategoryPage from "@/src/view/blog/MediaCategoryPage";

export const metadata = buildMediaListingMetadata("blog");

export default function BlogPage() {
  return <MediaCategoryPage listingKey="blog" />;
}
