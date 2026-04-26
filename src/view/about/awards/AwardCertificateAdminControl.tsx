"use client";

import dynamic from "next/dynamic";
import type { AwardCertificatePageData } from "@/src/lib/data/award-certificate-page";

const AwardCertificateEditButton = dynamic(() => import("./AwardCertificateEditButton"), {
  ssr: false,
  loading: () => null,
});

type Props = {
  data?: Partial<AwardCertificatePageData> | null;
};

export default function AwardCertificateAdminControl({ data }: Props) {
  return <AwardCertificateEditButton data={data} />;
}
