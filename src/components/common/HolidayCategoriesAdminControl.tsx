"use client";

import dynamic from "next/dynamic";

const HolidayCategoriesEditButton = dynamic(() => import("./HolidayCategoriesEditButton"), {
    ssr: false,
    loading: () => null,
});

interface HolidayCategoriesAdminControlProps {
    data?: unknown;
}

export default function HolidayCategoriesAdminControl({ data }: HolidayCategoriesAdminControlProps) {
    return <HolidayCategoriesEditButton data={data} />;
}
