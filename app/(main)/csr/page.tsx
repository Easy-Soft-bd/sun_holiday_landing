import { buildMediaListingMetadata } from "@/src/lib/blog/categories";
import MediaCategoryPage from "@/src/view/blog/MediaCategoryPage";

export const metadata = buildMediaListingMetadata("csr");

export default function CsrPage() {
  return <MediaCategoryPage listingKey="csr" />;
}
