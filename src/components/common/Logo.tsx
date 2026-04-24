"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { canUseNextImage } from "@/src/lib/media";

interface LogoProps {
    className?: string;
    width?: number;
    height?: number;
    showText?: boolean;
    siteName?: string | null;
    logoUrl?: string | null;
}

const DEFAULT_LOGO_URL = '/logo/logo.png';
const DEFAULT_SITE_NAME = 'Sun Tourism Ltd';

const Logo = ({
    className,
    width = 40,
    height = 40,
    showText = true,
    siteName = DEFAULT_SITE_NAME,
    logoUrl = DEFAULT_LOGO_URL,
}: LogoProps) => {
    const resolvedLogoUrl = logoUrl || DEFAULT_LOGO_URL;
    const supportsImageOptimization = canUseNextImage(resolvedLogoUrl);

    return (
        <div
            className={cn("flex items-center gap-2 transition-opacity hover:opacity-90", className)}
            aria-label="Home"
        >
            {/* Logo Image */}
            <div className="relative">
                <Image
                    src={resolvedLogoUrl}
                    alt="Company Logo"
                    width={width}
                    height={height}
                    unoptimized={!supportsImageOptimization}
                    className="object-contain"
                />
            </div>

            {/* Brand Name - Dynamic from DB */}
            {showText && (
                <span className="font-bold text-primary text-xl tracking-tight text-foreground hidden sm:block">
                    {siteName || DEFAULT_SITE_NAME}
                </span>
            )}
        </div>
    );
};

export default Logo;
