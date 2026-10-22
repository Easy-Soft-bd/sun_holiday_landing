import type { SailorMoonResortsPageData } from "@/src/lib/data/sailor-moon-resorts-page";

export type ResortPageEditorConfig = {
  section: string;
  title: string;
  uploadType: string;
  bookingSource: string;
  defaults?: SailorMoonResortsPageData;
};
