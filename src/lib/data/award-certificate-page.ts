export type AwardCertificateItem = {
  id: string;
  title: string;
  category: "Award" | "Certificate";
  year: string;
  image: string;
};

export type AwardCertificatePageData = {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];
  heroBadgeText: string;
  heroTitleBefore: string;
  heroTitleAccent: string;
  heroDescription: string;
  items: AwardCertificateItem[];
};

export const defaultAwardCertificatePageData: AwardCertificatePageData = {
  metaTitle: "Awards & Certificates - Sun Tourism Ltd",
  metaDescription:
    "Explore Sun Tourism Ltd awards and certifications that reflect our commitment to trusted service, quality standards, and customer excellence.",
  metaKeywords: ["Sun Tourism awards", "travel certificates", "tourism recognitions", "quality certifications"],
  heroBadgeText: "Recognition & Trust",
  heroTitleBefore: "Awards &",
  heroTitleAccent: "Certificates",
  heroDescription:
    "Our achievements reflect a commitment to service quality, compliance, and memorable travel experiences for every guest.",
  items: [
    {
      id: "cert-tin-bangladesh",
      title: "Taxpayer Identification Number (TIN) Certificate",
      category: "Certificate",
      year: "2021",
      image: "/award&certificate/sunholidastin.jpg",
    },
  ],
};

export function mergeAwardCertificatePageData(
  partial?: Partial<AwardCertificatePageData> | null
): AwardCertificatePageData {
  const d = defaultAwardCertificatePageData;
  if (!partial) {
    return {
      ...d,
      metaKeywords: [...d.metaKeywords],
      items: d.items.map((i) => ({ ...i })),
    };
  }

  const items: AwardCertificateItem[] =
    partial.items && partial.items.length > 0
      ? partial.items.map((i) => ({
          id: String(i.id || "").trim() || `award-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          title: String(i.title || "").trim(),
          category: i.category === "Award" ? ("Award" as const) : ("Certificate" as const),
          year: String(i.year || "").trim(),
          image: String(i.image || "").trim(),
        }))
      : d.items.map((i) => ({ ...i }));

  return {
    ...d,
    ...partial,
    metaKeywords:
      partial.metaKeywords && partial.metaKeywords.length > 0 ? partial.metaKeywords : d.metaKeywords,
    items,
  };
}
