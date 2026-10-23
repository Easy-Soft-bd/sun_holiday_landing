"use client";

import dynamic from "next/dynamic";
import AntdProviders from "@/src/components/providers/AntdProviders";
import type { EducationPageData } from "./education-page-data";

const EducationEditButton = dynamic(() => import("./EducationEditButton"), {
  ssr: false,
  loading: () => null,
});

export default function EducationAdminControl({ data }: { data?: Partial<EducationPageData> }) {
  return (
    <AntdProviders>
      <EducationEditButton data={data} />
    </AntdProviders>
  );
}
