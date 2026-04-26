"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Edit } from "lucide-react";
import type { ResortsListingPageData } from "@/src/lib/data/resorts-listing-page";

const ResortsListingEditModal = dynamic(() => import("./ResortsListingEditModal"));

type Props = {
  data?: Partial<ResortsListingPageData>;
};

export default function ResortsListingEditButton({ data }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="btn btn-primary btn-sm text-white shadow-lg opacity-0 transition-opacity group-hover/resorts-listing:opacity-100"
      >
        <Edit size={16} /> Edit page
      </button>

      {isOpen ? (
        <ResortsListingEditModal isOpen={isOpen} onClose={() => setIsOpen(false)} initialData={data} />
      ) : null}
    </>
  );
}
