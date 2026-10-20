import { buildMediaListingMetadata } from "@/src/lib/blog/categories";
import MediaCategoryPage from "@/src/view/blog/MediaCategoryPage";

export const metadata = buildMediaListingMetadata("events");

export default function EventsPage() {
  return <MediaCategoryPage listingKey="events" />;
}
