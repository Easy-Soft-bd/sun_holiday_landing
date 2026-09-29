"use client";

import AppImage from "@/src/components/common/AppImage";
import { DEFAULT_SITE_LOGO, DEFAULT_SITE_NAME, resolveBrandAsset } from "@/src/lib/brand";
import { cn } from "@/lib/utils";

interface LogoProps {
    className?: string;
    /** When omitted, image width follows aspect ratio (`auto`). */
    width?: number;
    height?: number;
    showText?: boolean;
    siteName?: string | null;
    logoUrl?: string | null;
}

const Logo = ({
    className,
    width,
    height = 40,
    showText = true,
    siteName = DEFAULT_SITE_NAME,
    logoUrl = DEFAULT_SITE_LOGO,
}: LogoProps) => {
    const resolvedLogoUrl = resolveBrandAsset(logoUrl);
    const autoWidth = width == null;

    return (
        <div
            className={cn("flex items-center gap-2 transition-opacity hover:opacity-90", className)}
            aria-label="Home"
        >
            {autoWidth ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    key={resolvedLogoUrl}
                    src={resolvedLogoUrl}
                    alt={siteName || DEFAULT_SITE_NAME}
                    height={height}
                    className="object-contain"
                    style={{ width: "auto", height }}
                    decoding="async"
                />
            ) : (
                <div className="relative shrink-0" style={{ width, height }}>
                    <AppImage
                        key={resolvedLogoUrl}
                        src={resolvedLogoUrl}
                        alt={siteName || DEFAULT_SITE_NAME}
                        fill
                        sizes={`${Math.max(width, height) * 3}px`}
                        quality={95}
                        showLoader={false}
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
