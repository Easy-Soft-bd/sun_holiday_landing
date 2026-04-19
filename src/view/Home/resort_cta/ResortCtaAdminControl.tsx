"use client";

import dynamic from "next/dynamic";

const ResortCtaEditButton = dynamic(() => import("./ResortCtaEditButton"), {
    ssr: false,
    loading: () => null,
});

interface ResortCtaAdminControlProps {
    data?: unknown;
}

export default function ResortCtaAdminControl({ data }: ResortCtaAdminControlProps) {
    return <ResortCtaEditButton data={data} />;
}
