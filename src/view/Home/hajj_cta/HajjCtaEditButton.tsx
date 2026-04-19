"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Edit } from "lucide-react";

const HajjCtaEditModal = dynamic(() => import("./HajjCtaEditModal"));

interface HajjCtaEditButtonProps {
    data?: unknown;
}

export default function HajjCtaEditButton({ data }: HajjCtaEditButtonProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="btn btn-primary btn-sm text-white shadow-lg opacity-0 group-hover/hajj:opacity-100 transition-opacity"
            >
                <Edit size={16} /> Edit Hajj/Umrah Section
            </button>

            {isModalOpen ? (
                <HajjCtaEditModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    initialData={data}
                />
            ) : null}
        </>
    );
}
