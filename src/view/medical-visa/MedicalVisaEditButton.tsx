"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Edit } from "lucide-react";
import type { MedicalVisaPageData } from "./medical-visa-page-data";

const MedicalVisaEditModal = dynamic(() => import("./MedicalVisaEditModal"));

export default function MedicalVisaEditButton({ data }: { data?: Partial<MedicalVisaPageData> }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="btn btn-primary btn-sm text-white shadow-lg opacity-0 transition-opacity group-hover/medical-visa:opacity-100"
      >
        <Edit size={16} /> Edit Medical Visa
      </button>
      {open ? <MedicalVisaEditModal isOpen={open} onClose={() => setOpen(false)} initialData={data} /> : null}
    </>
  );
}
