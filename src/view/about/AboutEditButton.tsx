"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Edit } from "lucide-react";
import type { AboutPageData } from "./about-page-data";

const AboutEditModal = dynamic(() => import("./AboutEditModal"));

interface AboutEditButtonProps {
  data?: Partial<AboutPageData>;
}

export default function AboutEditButton({ data }: AboutEditButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="btn btn-primary btn-sm text-white shadow-lg opacity-0 transition-opacity group-hover/about:opacity-100"
      >
        <Edit size={16} /> Edit About
      </button>

      {isOpen ? (
        <AboutEditModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          initialData={data}
        />
      ) : null}
    </>
  );
}
