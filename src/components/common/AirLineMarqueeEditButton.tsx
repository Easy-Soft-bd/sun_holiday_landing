"use client";

import { useState } from "react";
import { Edit } from "lucide-react";
import AirLineMarqueeEditModal from "./AirLineMarqueeEditModal";

interface AirLineMarqueeEditButtonProps {
    data?: any;
}

export default function AirLineMarqueeEditButton({ data }: AirLineMarqueeEditButtonProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="btn btn-primary btn-sm text-white shadow-lg opacity-0 group-hover/marquee:opacity-100 transition-opacity"
            >
                <Edit size={16} /> Edit Airline Marquee
            </button>

            <AirLineMarqueeEditModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                initialData={data}
            />
        </>
    );
}
