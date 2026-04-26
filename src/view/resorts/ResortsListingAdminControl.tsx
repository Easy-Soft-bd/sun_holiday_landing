"use client";

import dynamic from "next/dynamic";
import type { ResortsListingPageData } from "@/src/lib/data/resorts-listing-page";

const ResortsListingEditButton = dynamic(() => import("./ResortsListingEditButton"), {
  ssr: false,
  loading: () => null,
});

type Props = {
  data?: Partial<ResortsListingPageData>;
};

export default function ResortsListingAdminControl({ data }: Props) {
  return <ResortsListingEditButton data={data} />;
}
