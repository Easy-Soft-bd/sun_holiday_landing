"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Edit } from "lucide-react";
import { Button } from "antd";
import type { ResortSectionKey, SunviaEcoResortPageData } from "@/src/lib/data/sunvia-eco-resort";

const SectionEditModal = dynamic(() => import("./SectionEditModal"));

interface SectionEditButtonProps {
  section: ResortSectionKey;
  title: string;
  data: SunviaEcoResortPageData[ResortSectionKey];
}

export default function SectionEditButton({ section, title, data }: SectionEditButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        type="primary"
        size="small"
        icon={<Edit size={14} />}
      >
        {title}
      </Button>

      {isModalOpen ? (
        <SectionEditModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          section={section}
          title={title}
          initialData={data}
        />
      ) : null}
    </>
  );
}
