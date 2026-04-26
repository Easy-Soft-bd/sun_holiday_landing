"use client";

import dynamic from "next/dynamic";
import type { SailorMoonResortsPageData } from "@/src/lib/data/sailor-moon-resorts-page";

const SailorMoonResortsEditButton = dynamic(() => import("./SailorMoonResortsEditButton"), {
  ssr: false,
  loading: () => null,
});

type Props = {
  data?: Partial<SailorMoonResortsPageData>;
};

export default function SailorMoonResortsAdminControl({ data }: Props) {
  return <SailorMoonResortsEditButton data={data} />;
}
