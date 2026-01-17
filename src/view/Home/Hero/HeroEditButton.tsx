"use client";

import { useState } from "react";
import { Edit } from "lucide-react";
import HeroEditModal from "./HeroEditModal";

interface HeroData {
    badgeText?: string;
    titlePart1?: string;
    titlePart2?: string;
    titlePart3?: string;
    description?: string;
    button1Text?: string;
    button1Link?: string;
    button2Text?: string;
    button2Link?: string;
    stat1Count?: string;
    stat1Label?: string;
    stat2Count?: string;
    stat2Label?: string;
    stat3Count?: string;
    stat3Label?: string;
    videoSrc?: string;
    backgroundImage?: string;
}

interface HeroEditButtonProps {
    data?: HeroData;
}

export default function HeroEditButton({ data }: HeroEditButtonProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="btn btn-primary btn-sm text-white shadow-lg opacity-0 group-hover/hero:opacity-100 transition-opacity"
            >
                <Edit size={16} /> Edit Hero
            </button>

            <HeroEditModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                initialData={data}
            />
        </>
    );
}
