"use client";

import dynamic from "next/dynamic";

const SailorMoonCtaEditButton = dynamic(() => import("./SailorMoonCtaEditButton"), {
    ssr: false,
    loading: () => null,
});

interface SailorMoonCtaAdminControlProps {
    data?: unknown;
}

export default function SailorMoonCtaAdminControl({ data }: SailorMoonCtaAdminControlProps) {
    return <SailorMoonCtaEditButton data={data} />;
}
