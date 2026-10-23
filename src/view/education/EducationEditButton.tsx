"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Edit } from "lucide-react";
import type { EducationPageData } from "./education-page-data";

const EducationEditModal = dynamic(() => import("./EducationEditModal"));

export default function EducationEditButton({ data }: { data?: Partial<EducationPageData> }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="btn btn-primary btn-sm text-white shadow-lg opacity-0 transition-opacity group-hover/education:opacity-100"
      >
        <Edit size={16} /> Edit Education
      </button>
      {open ? <EducationEditModal isOpen={open} onClose={() => setOpen(false)} initialData={data} /> : null}
    </>
  );
}
