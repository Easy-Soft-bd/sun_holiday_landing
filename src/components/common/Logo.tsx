"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { canUseNextImage } from "@/src/lib/media";

interface LogoProps {
    className?: string;
    /** When omitted, image width follows aspect ratio (`auto`). */
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
    width,
    height = 40,
    showText = true,
    siteName = DEFAULT_SITE_NAME,
    logoUrl = DEFAULT_LOGO_URL,
}: LogoProps) => {
    const resolvedLogoUrl = logoUrl || DEFAULT_LOGO_URL;
    const supportsImageOptimization = canUseNextImage(resolvedLogoUrl);
    const autoWidth = width == null;

    return (
        <div
            className={cn("flex items-center gap-2 transition-opacity hover:opacity-90", className)}
            aria-label="Home"
        >
            {autoWidth ? (
                // Plain img avoids Next/Image aspect-ratio warnings when width is CSS-auto.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    key={resolvedLogoUrl}
                    src={resolvedLogoUrl}
                    alt="Company Logo"
                    height={height}
                    className="object-contain"
                    style={{ width: "auto", height }}
                    decoding="async"
                />
            ) : (
                <div className="relative shrink-0" style={{ width, height }}>
                    <Image
                        key={resolvedLogoUrl}
                        src={resolvedLogoUrl}
                        alt="Company Logo"
                        fill
                        sizes={`${Math.max(width, height) * 3}px`}
                        quality={95}
                        unoptimized={!supportsImageOptimization}
                        className="object-contain"
                    />
                </div>
            )}

            {showText && (
                <span className="font-bold text-primary text-xl tracking-tight text-foreground hidden sm:block">
                    {siteName || DEFAULT_SITE_NAME}
                </span>
            )}
        </div>
    );
};

export default Logo;
