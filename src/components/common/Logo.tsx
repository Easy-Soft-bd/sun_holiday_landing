"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils"; // Standard Tailwind class merger utility

interface LogoProps {
    className?: string;
    width?: number;
    height?: number;
    showText?: boolean;
}

const LogoUrl = '/logo/logo.png';

const Logo = ({
    className,
    width = 40,
    height = 40,
    showText = true
}: LogoProps) => {
    return (
        <div

            className={cn("flex items-center gap-2 transition-opacity hover:opacity-90", className)}
            aria-label="Home"
        >
            {/* Logo Image */}
            <div className="relative">
                <Image
                    src={LogoUrl}
                    alt="Company Logo"
                    width={width}
                    height={height}
                    priority // Ensures logo loads immediately (Good for LCP)
                    className="object-contain"
                />
            </div>

            {/* Brand Name - Optimized for SEO */}
            {showText && (
                <span className="font-bold text-primary text-xl tracking-tight text-foreground hidden sm:block">
                    Sun Holidays LTD
                </span>
            )}
        </div>
    );
};

export default Logo;