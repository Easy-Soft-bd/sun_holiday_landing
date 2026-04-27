"use client";

import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import { CalendarCheck } from "lucide-react";
import type { TourPackage } from "@/src/view/tours/data/mockTours";

// Lazy-load the heavy modal: 0 KB ships in the initial bundle.
// It is fetched only when the visitor clicks the Book Now button.
const TourBookingModal = dynamic(() => import("./TourBookingModal"), {
    ssr: false,
});

type Props = {
    tour: TourPackage;
    /** Pass-through className so the button can match the parent button styles. */
    className?: string;
};

export default function TourBookingCTA({ tour, className }: Props) {
    const [open, setOpen] = useState(false);
    const [hasMounted, setHasMounted] = useState(false);

    const handleOpen = useCallback(() => {
        setHasMounted(true);
        setOpen(true);
    }, []);

    const handleClose = useCallback(() => {
        setOpen(false);
    }, []);

    return (
        <>
            <button
                type="button"
                onClick={handleOpen}
                className={
                    className ||
                    "btn btn-primary btn-md w-full gap-2 rounded-xl shadow-lg shadow-primary/30 sm:btn-lg sm:gap-3"
                }
            >
                <CalendarCheck size={20} />
                Book Now
            </button>

            {hasMounted ? (
                <TourBookingModal tour={tour} open={open} onClose={handleClose} />
            ) : null}
        </>
    );
}
