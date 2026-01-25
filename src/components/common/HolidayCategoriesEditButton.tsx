"use client";

import { useState } from "react";
import { Edit } from "lucide-react";
import HolidayCategoriesEditModal from "./HolidayCategoriesEditModal";

interface HolidayCategoriesEditButtonProps {
    data?: any;
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

            <HolidayCategoriesEditModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                initialData={data}
            />
        </>
    );
}
