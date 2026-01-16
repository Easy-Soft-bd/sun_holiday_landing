
"use client";

import { useState, useEffect, useRef } from "react";
import { X, PhoneCall, Info, User, LogOut, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useGetMeQuery, useLogoutMutation } from "@/src/lib/redux/api/userApi";

export default function TopBanner() {
    const [isVisible, setIsVisible] = useState(true);
    const bannerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const { data: authData } = useGetMeQuery(undefined);
    const [logout] = useLogoutMutation();

    const adminUser = authData?.authenticated ? authData.user : null;

    useEffect(() => {
        if (isVisible && bannerRef.current) {
            document.documentElement.style.setProperty('--banner-height', `${bannerRef.current.offsetHeight}px`);
        } else {
            document.documentElement.style.setProperty('--banner-height', '0px');
        }
    }, [isVisible]);

    const handleClose = () => {
        setIsVisible(false);
    };

    const handleLogout = async () => {
        try {
            await logout(undefined).unwrap();
            router.push('/portal/admin/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    if (!isVisible) return null;

    return (
        <div ref={bannerRef} className={`relative isolate flex items-center gap-x-6 overflow-hidden ${adminUser ? 'bg-primary' : 'bg-slate-900'} px-6 py-2.5 sm:px-3.5 sm:before:flex-1 animate-in fade-in slide-in-from-top duration-500 sticky top-0 z-50 transition-colors`}>
            {/* Background pattern */}
            <div
                className="absolute left-[max(-7rem,calc(50%-52rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl"
                aria-hidden="true"
            >
                <div
                    className={`aspect-[577/310] w-[36.0625rem] bg-gradient-to-r ${adminUser ? 'from-white/20 to-transparent' : 'from-primary to-secondary'} opacity-20`}
                    style={{
                        clipPath:
                            'polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 52.8% 78.4%, 74.8% 41.9%)',
                    }}
                />
            </div>
            
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                {adminUser ? (
                    <p className="text-sm leading-6 text-white flex items-center gap-2">
                        <ShieldCheck size={16} className="text-white animate-pulse" />
                        <strong className="font-semibold">Admin Mode Active</strong>
                        <svg viewBox="0 0 2 2" className="mx-2 inline h-0.5 w-0.5 fill-current" aria-hidden="true">
                            <circle cx={1} cy={1} r={1} />
                        </svg>
                        You are logged in as <span className="underline decoration-white/30">{adminUser.email}</span>
                    </p>
                ) : (
                    <p className="text-sm leading-6 text-white flex items-center gap-2">
                        <Info size={16} className="text-secondary animate-pulse" />
                        <strong className="font-semibold">Development Mode</strong>
                        <svg viewBox="0 0 2 2" className="mx-2 inline h-0.5 w-0.5 fill-current" aria-hidden="true">
                            <circle cx={1} cy={1} r={1} />
                        </svg>
                        Our website is currently under development. For immediate help or services:
                    </p>
                )}
                
                {!adminUser && (
                    <a
                        href="tel:+880123456789"
                        className="flex-none rounded-full bg-primary px-3.5 py-1 text-sm font-semibold text-white shadow-sm hover:bg-primary/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 transition-all flex items-center gap-2"
                    >
                        <PhoneCall size={14} />
                        Call Us Directly <span aria-hidden="true">&rarr;</span>
                    </a>
                )}
            </div>
            
            <div className="flex flex-1 justify-end items-center gap-4">
                {adminUser && (
                    <button
                        onClick={handleLogout}
                        className="text-xs font-semibold text-white flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 transition-all"
                    >
                        <LogOut size={14} />
                        Logout
                    </button>
                )}
                <button 
                    type="button" 
                    onClick={handleClose}
                    className="-m-3 p-3 focus-visible:outline-offset-[-4px] group"
                >
                    <span className="sr-only">Dismiss</span>
                    <X size={20} className="text-white opacity-40 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
                </button>
            </div>
        </div>
    );
}
