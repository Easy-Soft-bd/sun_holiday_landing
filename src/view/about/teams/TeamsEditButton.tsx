"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Edit } from "lucide-react";
import type { TeamsPageData } from "./teams-page-data";

const TeamsEditModal = dynamic(() => import("./TeamsEditModal"));

export default function TeamsEditButton({ data }: { data?: Partial<TeamsPageData> }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="btn btn-primary btn-sm text-white shadow-lg opacity-0 transition-opacity group-hover/about-teams:opacity-100"
      >
        <Edit size={16} /> Edit Teams Page
      </button>
      {open ? <TeamsEditModal isOpen={open} onClose={() => setOpen(false)} initialData={data} /> : null}
    </>
  );
}
