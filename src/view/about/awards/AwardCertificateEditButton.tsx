"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Edit } from "lucide-react";
import type { AwardCertificatePageData } from "@/src/lib/data/award-certificate-page";

const AwardCertificateEditModal = dynamic(() => import("./AwardCertificateEditModal"));

type Props = {
  data?: Partial<AwardCertificatePageData> | null;
};

export default function AwardCertificateEditButton({ data }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="btn btn-primary btn-sm text-white shadow-lg opacity-0 transition-opacity group-hover/award-certificate:opacity-100"
      >
        <Edit size={16} /> Edit Awards
      </button>
      {isOpen ? <AwardCertificateEditModal isOpen={isOpen} onClose={() => setIsOpen(false)} initialData={data} /> : null}
    </>
  );
}
