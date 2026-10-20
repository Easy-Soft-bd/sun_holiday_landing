import { buildMediaListingMetadata } from "@/src/lib/blog/categories";
import MediaCategoryPage from "@/src/view/blog/MediaCategoryPage";

export const metadata = buildMediaListingMetadata("news");

export default function NewsPage() {
  return <MediaCategoryPage listingKey="news" />;
}
