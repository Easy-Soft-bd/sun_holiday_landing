"use client";

import { useEffect, useState } from "react";
import { Plane, Cloud, Sun } from "lucide-react";

interface LoadingScreenProps {
    show?: boolean;
}

const LoadingScreen = ({ show = true }: LoadingScreenProps) => {
    const [mounted, setMounted] = useState(false);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!show) {
            const timer = setTimeout(() => setIsVisible(false), 800);
            return () => clearTimeout(timer);
        } else {
            setIsVisible(true);
        }
    }, [show]);

    if (!mounted || !isVisible) return null;

    return (
        <div 
            className={`fixed inset-0 z-[9999] flex items-center justify-center bg-base-100/80 backdrop-blur-xl transition-all duration-700 ease-in-out ${
                !show ? "opacity-0 invisible scale-105" : "opacity-100 visible scale-100"
            }`}
        >
            <div className="relative flex flex-col items-center gap-8 w-full max-w-sm">
                
                {/* Scene Container */}
                <div className="relative w-64 h-64 flex items-center justify-center">
                    
                    {/* The Sun (Pulsing Center) */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <div className="relative">
                            <Sun className="w-24 h-24 text-primary animate-sun-pulse" strokeWidth={1.5} />
                            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
                        </div>
                    </div>

                    {/* Drifting Clouds */}
                    <div className="absolute top-10 left-4 animate-float opacity-80">
                         <Cloud className="w-12 h-12 text-base-content/20 fill-base-100" />
                    </div>
                    <div className="absolute bottom-12 right-6 animate-float [animation-delay:-2s] opacity-60">
                         <Cloud className="w-10 h-10 text-base-content/20 fill-base-100" />
                    </div>
                    
                    {/* Flying Plane */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-fly z-10">
                        <Plane className="w-12 h-12 text-secondary fill-secondary/20 -rotate-45" />
                    </div>

                </div>

                {/* Loading Text & Spinner */}
                <div className="flex flex-col items-center gap-3">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                        <span className="w-2 h-2 rounded-full bg-secondary animate-bounce [animation-delay:-0.15s]" />
                        <span className="w-2 h-2 rounded-full bg-primary animate-bounce" />
                    </div>
                    <p className="text-secondary font-magmawave text-lg tracking-[0.2em] uppercase animate-pulse">
                        Warming up your journey...
                    </p>
                </div>
            </div>

            {/* Ambient Background Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `-5%`,
                            animationDelay: `${i * 3}s`,
                            animationDuration: `${15 + Math.random() * 10}s`
                        }}
                    >
                         <Cloud className="w-4 h-4 text-secondary/40 animate-drift blur-[1px]" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LoadingScreen;
