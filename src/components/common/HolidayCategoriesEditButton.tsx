"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Edit } from "lucide-react";

const HolidayCategoriesEditModal = dynamic(() => import("./HolidayCategoriesEditModal"));

interface HolidayCategoriesEditButtonProps {
    data?: unknown;
}

export default function HolidayCategoriesEditButton({ data }: HolidayCategoriesEditButtonProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="btn btn-primary btn-sm text-white shadow-lg opacity-0 group-hover/holiday:opacity-100 transition-opacity"
            >
                <Edit size={16} /> Edit Categories
            </button>

            {isModalOpen ? (
                <HolidayCategoriesEditModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    initialData={data}
                />
            ) : null}
        </>
    );
}
