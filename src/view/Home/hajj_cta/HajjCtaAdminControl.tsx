"use client";

import dynamic from "next/dynamic";

const HajjCtaEditButton = dynamic(() => import("./HajjCtaEditButton"), {
    ssr: false,
    loading: () => null,
});

interface HajjCtaAdminControlProps {
    data?: unknown;
}

export default function HajjCtaAdminControl({ data }: HajjCtaAdminControlProps) {
    return <HajjCtaEditButton data={data} />;
}
