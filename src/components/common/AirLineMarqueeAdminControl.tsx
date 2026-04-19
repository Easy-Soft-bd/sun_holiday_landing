"use client";

import dynamic from "next/dynamic";

const AirLineMarqueeEditButton = dynamic(() => import("./AirLineMarqueeEditButton"), {
    ssr: false,
    loading: () => null,
});

interface AirLineMarqueeAdminControlProps {
    data?: unknown;
}

export default function AirLineMarqueeAdminControl({ data }: AirLineMarqueeAdminControlProps) {
    return <AirLineMarqueeEditButton data={data} />;
}
