"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Edit } from "lucide-react";
import type { SailorMoonResortsPageData } from "@/src/lib/data/sailor-moon-resorts-page";
import type { ResortPageEditorConfig } from "@/src/view/sailor-moon-resorts/editor-config";

const SailorMoonResortsEditModal = dynamic(() => import("./SailorMoonResortsEditModal"));

type Props = {
  data?: Partial<SailorMoonResortsPageData>;
  editor?: ResortPageEditorConfig;
};

export default function SailorMoonResortsEditButton({ data, editor }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="btn btn-primary btn-sm text-white shadow-lg opacity-0 transition-opacity group-hover/resort-page:opacity-100"
      >
        <Edit size={16} /> Edit page
      </button>

      {isOpen ? (
        <SailorMoonResortsEditModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          initialData={data}
          editor={editor}
        />
      ) : null}
    </>
  );
}
