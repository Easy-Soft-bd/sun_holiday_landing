"use client";

import { useState } from "react";
import { Edit } from "lucide-react";
import SailorMoonCtaEditModal from "./SailorMoonCtaEditModal";

interface SailorMoonCtaEditButtonProps {
    data?: any;
}

export default function SailorMoonCtaEditButton({ data }: SailorMoonCtaEditButtonProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="btn btn-primary btn-sm text-white shadow-lg opacity-0 group-hover/sailor-moon:opacity-100 transition-opacity"
            >
                <Edit size={16} /> Edit Sailor Moon Section
            </button>

            <SailorMoonCtaEditModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                initialData={data}
            />
        </>
    );
}
