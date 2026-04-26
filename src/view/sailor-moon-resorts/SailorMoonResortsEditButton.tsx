"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Edit } from "lucide-react";
import type { SailorMoonResortsPageData } from "@/src/lib/data/sailor-moon-resorts-page";

const SailorMoonResortsEditModal = dynamic(() => import("./SailorMoonResortsEditModal"));

type Props = {
  data?: Partial<SailorMoonResortsPageData>;
};

export default function SailorMoonResortsEditButton({ data }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="btn btn-primary btn-sm text-white shadow-lg opacity-0 transition-opacity group-hover/sailor-moon-resorts:opacity-100"
      >
        <Edit size={16} /> Edit page
      </button>

      {isOpen ? (
        <SailorMoonResortsEditModal isOpen={isOpen} onClose={() => setIsOpen(false)} initialData={data} />
      ) : null}
    </>
  );
}
