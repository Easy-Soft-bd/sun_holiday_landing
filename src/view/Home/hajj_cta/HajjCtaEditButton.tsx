"use client";

import { useState } from "react";
import { Edit } from "lucide-react";
import HajjCtaEditModal from "./HajjCtaEditModal";

interface HajjCtaEditButtonProps {
    data?: any;
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

            <HajjCtaEditModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                initialData={data}
            />
        </>
    );
}
