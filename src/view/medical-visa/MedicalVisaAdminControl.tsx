"use client";

import dynamic from "next/dynamic";
import AntdProviders from "@/src/components/providers/AntdProviders";
import type { MedicalVisaPageData } from "./medical-visa-page-data";

const MedicalVisaEditButton = dynamic(() => import("./MedicalVisaEditButton"), {
  ssr: false,
  loading: () => null,
});

export default function MedicalVisaAdminControl({ data }: { data?: Partial<MedicalVisaPageData> }) {
  return (
    <AntdProviders>
      <MedicalVisaEditButton data={data} />
    </AntdProviders>
  );
}
