"use client";

import dynamic from "next/dynamic";

const FooterEditButton = dynamic(() => import("./FooterEditButton"), {
    ssr: false,
    loading: () => null,
});

interface FooterAdminControlProps {
    data?: unknown;
}

export default function FooterAdminControl({ data }: FooterAdminControlProps) {
    return <FooterEditButton data={data} />;
}
