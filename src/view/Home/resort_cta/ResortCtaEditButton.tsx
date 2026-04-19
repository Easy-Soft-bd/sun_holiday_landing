"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Edit } from "lucide-react";

const ResortCtaEditModal = dynamic(() => import("./ResortCtaEditModal"));

interface ResortCtaEditButtonProps {
    data?: unknown;
}

export default function ResortCtaEditButton({ data }: ResortCtaEditButtonProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="btn btn-primary btn-sm text-white shadow-lg opacity-0 group-hover/resort:opacity-100 transition-opacity"
            >
                <Edit size={16} /> Edit Resort Section
            </button>

            {isModalOpen ? (
                <ResortCtaEditModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    initialData={data}
                />
            ) : null}
        </>
    );
}
