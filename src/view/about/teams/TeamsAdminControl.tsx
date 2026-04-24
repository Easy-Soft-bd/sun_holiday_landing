"use client";

import dynamic from "next/dynamic";
import type { TeamsPageData } from "./teams-page-data";

const TeamsEditButton = dynamic(() => import("./TeamsEditButton"), {
  ssr: false,
  loading: () => null,
});

export default function TeamsAdminControl({ data }: { data?: Partial<TeamsPageData> }) {
  return <TeamsEditButton data={data} />;
}
