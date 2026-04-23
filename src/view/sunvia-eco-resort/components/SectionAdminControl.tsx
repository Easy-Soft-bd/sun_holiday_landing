"use client";

import dynamic from "next/dynamic";
import type { ResortSectionKey, SunviaEcoResortPageData } from "@/src/lib/data/sunvia-eco-resort";

const SectionEditButton = dynamic(() => import("./SectionEditButton"), {
  ssr: false,
  loading: () => null,
});

interface SectionAdminControlProps {
  section: ResortSectionKey;
  title: string;
  data: SunviaEcoResortPageData[ResortSectionKey];
}

export default function SectionAdminControl(props: SectionAdminControlProps) {
  return <SectionEditButton {...props} />;
}
