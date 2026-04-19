"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Edit } from "lucide-react";

const FooterEditModal = dynamic(() => import("./FooterEditModal"));

interface FooterEditButtonProps {
    data?: unknown;
}

export default function FooterEditButton({ data }: FooterEditButtonProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="btn btn-primary btn-sm text-white shadow-lg opacity-0 group-hover/footer:opacity-100 transition-opacity"
            >
                <Edit size={16} /> Edit Footer
            </button>

            {isModalOpen ? (
                <FooterEditModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    initialData={data}
                />
            ) : null}
        </>
    );
}
