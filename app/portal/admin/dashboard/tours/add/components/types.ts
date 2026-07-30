export type ItineraryItem = {
  day: number;
  title: string;
  description: string;
};

export type TourFormValues = {
  title: string;
  /** Public URL segment; auto-generated on save if empty. */
  slug?: string;
  /** FK to `locations` table. */
  locationId: number;
  category: "International" | "Domestic" | "Hajj & Umrah";
  status: "Draft" | "Active" | "Inactive";
  price: number;
  duration: string;
  image: string;
  videoUrl?: string;
  inquiryPhone?: string;
  description: string;
  gallery?: string[];
  highlights?: string[];
  includes?: string[];
  excludes?: string[];
  itinerary?: ItineraryItem[];
  /** Show this tour in the home page Popular Tour Packages slider. */
  showOnHome?: boolean;
  /** Display order in the home slider (lower numbers first). */
  homeSortOrder?: number;
};
