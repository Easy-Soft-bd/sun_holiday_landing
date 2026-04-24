"use client";

import dynamic from "next/dynamic";
import type { AboutPageData } from "./about-page-data";

const AboutEditButton = dynamic(() => import("./AboutEditButton"), {
  ssr: false,
  loading: () => null,
});

interface Props {
  data?: Partial<AboutPageData>;
}

export default function AboutAdminControl({ data }: Props) {
  return <AboutEditButton data={data} />;
}
