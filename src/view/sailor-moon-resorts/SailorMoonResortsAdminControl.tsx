"use client";

import dynamic from "next/dynamic";
import type { SailorMoonResortsPageData } from "@/src/lib/data/sailor-moon-resorts-page";
import type { ResortPageEditorConfig } from "@/src/view/sailor-moon-resorts/editor-config";

const SailorMoonResortsEditButton = dynamic(() => import("./SailorMoonResortsEditButton"), {
  ssr: false,
  loading: () => null,
});

type Props = {
  data?: Partial<SailorMoonResortsPageData>;
  editor?: ResortPageEditorConfig;
};

export default function SailorMoonResortsAdminControl({ data, editor }: Props) {
  return <SailorMoonResortsEditButton data={data} editor={editor} />;
}
