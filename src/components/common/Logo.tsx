"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Skeleton } from 'antd';
import { useGetSettingsQuery } from "@/src/lib/redux/api/settingsApi";

interface LogoProps {
    className?: string;
    width?: number;
    height?: number;
    showText?: boolean;
}

const DEFAULT_LOGO_URL = '/logo.png';

const Logo = ({
    className,
    width = 40,
    height = 40,
    showText = true
}: LogoProps) => {
    const { data: settingsData, isLoading } = useGetSettingsQuery({});
    const logoUrl = settingsData?.data?.siteLogo || DEFAULT_LOGO_URL;
    const siteName = settingsData?.data?.siteName || 'Sun Holidays LTD';

    if (isLoading) {
        return (
            <div className={cn("flex items-center gap-2", className)}>
                <div
                    className="blur-md bg-linear-to-br from-primary to-primary/60 animate-pulse select-none pointer-events-none"
                    style={{ width, height }}
                />
                {showText && (
                    <Skeleton.Input active size="small" style={{ width: 120 }} className="hidden sm:inline-block" />
                )}
            </div>
        );
    }

    return (
        <div
            className={cn("flex items-center gap-2 transition-opacity hover:opacity-90", className)}
            aria-label="Home"
        >
            {/* Logo Image */}
            <div className="relative">
                <Image
                    src={logoUrl}
                    alt="Company Logo"
                    width={width}
                    height={height}
                    priority // Ensures logo loads immediately (Good for LCP)
                    className="object-contain"
                />
            </div>

            {/* Brand Name - Dynamic from DB */}
            {showText && (
                <span className="font-bold text-primary text-xl tracking-tight text-foreground hidden sm:block">
                    {siteName}
                </span>
            )}
        </div>
    );
};

export default Logo;
