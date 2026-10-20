"use client";

import dynamic from "next/dynamic";
import AntdProviders from "@/src/components/providers/AntdProviders";
import type { TeamsPageData } from "./teams-page-data";

const TeamsEditButton = dynamic(() => import("./TeamsEditButton"), {
  ssr: false,
  loading: () => null,
});

export default function TeamsAdminControl({ data }: { data?: Partial<TeamsPageData> }) {
  return (
    <AntdProviders>
      <TeamsEditButton data={data} />
    </AntdProviders>
  );
}
