"use client";

import { useState, useEffect, useRef } from "react";
import { X, PhoneCall, Info, LogOut, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

interface TopBannerProps {
    adminUser?: {
        email?: string | null;
        role?: string | null;
    } | null;
    /** Public "Development Mode" strip. Admin strip still shows when logged in. */
    showDevelopmentBanner?: boolean;
}

export default function TopBanner({
    adminUser = null,
    showDevelopmentBanner = false,
}: TopBannerProps) {
    const [isVisible, setIsVisible] = useState(true);
    const bannerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const showAdminBanner = Boolean(adminUser);
    const shouldRender = showAdminBanner || showDevelopmentBanner;

    useEffect(() => {
        const updateHeight = () => {
            if (isVisible && shouldRender && bannerRef.current) {
                document.documentElement.style.setProperty('--banner-height', `${bannerRef.current.offsetHeight}px`);
            } else {
                document.documentElement.style.setProperty('--banner-height', '0px');
            }
        };

        updateHeight();

        const observer = new ResizeObserver(updateHeight);
        if (bannerRef.current) {
            observer.observe(bannerRef.current);
        }

        window.addEventListener('resize', updateHeight);
        return () => {
            window.removeEventListener('resize', updateHeight);
            observer.disconnect();
            document.documentElement.style.setProperty('--banner-height', '0px');
        };
    }, [isVisible, shouldRender]);

    const handleClose = () => {
        setIsVisible(false);
    };

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', {
                method: 'POST',
                cache: 'no-store',
            });
            router.push('/portal/admin/login');
            router.refresh();
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    if (!shouldRender || !isVisible) return null;

    return (
        <div ref={bannerRef} className={`relative isolate flex items-center gap-x-6 overflow-hidden ${showAdminBanner ? 'bg-primary' : 'bg-slate-900'} px-4 py-2 sm:px-6 sm:py-2.5 sm:before:flex-1 animate-in fade-in slide-in-from-top duration-500 sticky top-0 z-50 transition-colors`}>
            {/* Background pattern */}
            <div
                className="absolute left-[max(-7rem,calc(50%-52rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl"
                aria-hidden="true"
            >
                <div
                    className={`aspect-[577/310] w-[36.0625rem] bg-gradient-to-r ${showAdminBanner ? 'from-white/20 to-transparent' : 'from-primary to-secondary'} opacity-20`}
                    style={{
                        clipPath:
                            'polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 52.8% 78.4%, 74.8% 41.9%)',
                    }}
                />
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
                {showAdminBanner ? (
                    <div className="text-sm leading-6 text-white flex items-center gap-2">
                        <ShieldCheck size={16} className="text-white animate-pulse shrink-0" />
                        <span className="flex items-center gap-1.5 truncate">
                            <strong className="font-semibold whitespace-nowrap">Admin Mode</strong>
                            <span className="hidden xs:inline-flex items-center">
                                <svg viewBox="0 0 2 2" className="mx-2 h-0.5 w-0.5 fill-current" aria-hidden="true">
                                    <circle cx={1} cy={1} r={1} />
                                </svg>
                                <span className="truncate opacity-90">{adminUser?.email}</span>
                            </span>
                        </span>
                    </div>
                ) : (
                    <div className="text-sm leading-6 text-white flex items-center gap-2">
                        <Info size={16} className="text-secondary animate-pulse shrink-0" />
                        <div className="flex flex-col sm:flex-row sm:items-center">
                            <strong className="font-semibold whitespace-nowrap">Development Mode</strong>
                            <span className="hidden md:inline-flex items-center">
                                <svg viewBox="0 0 2 2" className="mx-2 h-0.5 w-0.5 fill-current" aria-hidden="true">
                                    <circle cx={1} cy={1} r={1} />
                                </svg>
                                <span className="opacity-90">Site under development. For help:</span>
                            </span>
                        </div>
                    </div>
                )}
                
                {!showAdminBanner && (
                    <a
                        href="tel:+880123456789"
                        className="flex-none rounded-full bg-primary px-3 sm:px-3.5 py-1 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-primary/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 transition-all flex items-center gap-1.5 sm:gap-2"
                    >
                        <PhoneCall size={12} className="sm:w-[14px] sm:h-[14px]" />
                        <span>Call Us <span className="hidden xs:inline">Directly</span></span>
                        <span aria-hidden="true" className="hidden sm:inline">&rarr;</span>
                    </a>
                )}
            </div>
            
            <div className="flex flex-1 justify-end items-center gap-2 sm:gap-4 shrink-0">
                {showAdminBanner && (
                    <button
                        onClick={handleLogout}
                        className="text-[10px] sm:text-xs font-semibold text-white flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md bg-white/10 hover:bg-white/20 transition-all"
                    >
                        <LogOut size={12} className="sm:w-[14px] sm:h-[14px]" />
                        Logout
                    </button>
                )}
                <button 
                    type="button" 
                    onClick={handleClose}
                    aria-label="Dismiss"
                    className="-m-2 p-2 sm:-m-3 sm:p-3 focus-visible:outline-offset-[-4px] group"
                >
                    <span className="sr-only">Dismiss</span>
                    <X size={18} className="text-white opacity-40 group-hover:opacity-100 transition-opacity sm:w-[20px] sm:h-[20px]" aria-hidden="true" />
                </button>
            </div>
        </div>
    );
}
