"use client";

import Link from "next/link";
import { Home, Search, LifeBuoy, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const MotionLink = motion(Link);

export default function NotFoundClient() {
    return (
        <main className="min-h-screen flex items-center justify-center p-4 md:p-6 bg-base-100 overflow-hidden relative">
            {/* Mesh Gradient Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                 {/* Orb 1 - Primary (Red/Orange) */}
                <motion.div 
                    animate={{ 
                        scale: [1, 1.2, 0.9, 1],
                        x: [0, 100, -50, 0],
                        y: [0, -50, 50, 0],
                    }}
                    transition={{ 
                        duration: 20, 
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] bg-primary/30 rounded-full blur-[120px] mix-blend-multiply" 
                />
                
                {/* Orb 2 - Secondary (Warm Orange) */}
                <motion.div 
                    animate={{ 
                        scale: [1, 1.1, 0.9, 1],
                         x: [0, -70, 30, 0],
                        y: [0, 50, -50, 0],
                    }}
                    transition={{ 
                        duration: 15, 
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 2
                    }}
                    className="absolute top-[20%] -right-[10%] w-[60vw] h-[60vw] bg-secondary/30 rounded-full blur-[100px] mix-blend-multiply" 
                />

                {/* Orb 3 - Accent (Yellow) */}
                 <motion.div 
                    animate={{ 
                        scale: [1, 1.3, 0.8, 1],
                        x: [0, 50, -50, 0],
                        y: [0, -30, 30, 0],
                    }}
                    transition={{ 
                        duration: 18, 
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 4
                    }}
                    className="absolute -bottom-[20%] left-[20%] w-[80vw] h-[80vw] bg-accent/30 rounded-full blur-[140px] mix-blend-multiply" 
                />
            </div>

            <div className="max-w-4xl w-full text-center space-y-8 relative z-10">
                {/* Main Content */}
                <div className="relative py-12">
                    {/* Animated 404 Text */}
                    <div className="relative inline-block">
                        <motion.h1 
                            initial={{ opacity: 0, y: 100, scale: 0.5 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ 
                                type: "spring",
                                stiffness: 50,
                                damping: 20,
                                duration: 0.8 
                            }}
                            className="text-[8rem] sm:text-[12rem] md:text-[16rem] font-black leading-none tracking-tighter text-base-content/5 selection:bg-transparent select-none"
                        >
                            404
                        </motion.h1>
                        
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                            className="absolute inset-0 flex flex-col items-center justify-center"
                        >
                            <motion.h2 
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.7 }}
                                className="text-2xl sm:text-4xl md:text-5xl font-bold text-base-content"
                            >
                                Lost in <span className="text-primary">Paradise?</span>
                            </motion.h2>
                            
                            <motion.p 
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.8 }}
                                className="text-base-content/60 max-w-sm sm:max-w-md mx-auto text-base sm:text-lg mt-4 px-4"
                            >
                                The page you are looking for might have vanished into the sunset or is temporarily unavailable.
                            </motion.p>
                        </motion.div>
                    </div>
                </div>

                {/* Primary Actions */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <MotionLink
                        href="/"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn btn-primary btn-lg rounded-full px-8 shadow-xl shadow-primary/20 text-white w-full sm:w-auto"
                    >
                        <Home className="size-5" />
                        Back to Home
                    </MotionLink>

                    <MotionLink
                        href="/destinations"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn btn-ghost btn-lg rounded-full px-8 border border-base-300 w-full sm:w-auto"
                    >
                        <Search className="size-5" />
                        Find a Destination
                    </MotionLink>
                </motion.div>

                {/* Secondary Links (Quick Help) */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2, duration: 1 }}
                    className="pt-12 border-t border-base-200 mt-8"
                >
                    <p className="text-sm font-semibold uppercase tracking-widest text-base-content/40 mb-6">
                        Need immediate help?
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto px-4">
                        <MotionLink
                            href="/support"
                            whileHover={{ scale: 1.02, backgroundColor: "rgba(var(--p) / 0.05)" }}
                            className="flex items-center gap-3 p-4 rounded-2xl border border-base-200 transition-colors text-left group cursor-pointer"
                        >
                            <div className="p-2 rounded-lg bg-base-200 group-hover:bg-primary group-hover:text-white transition-colors">
                                <LifeBuoy size={20} />
                            </div>
                            <div>
                                <p className="font-bold text-sm">Help Center</p>
                                <p className="text-xs text-base-content/60">Browse our documentation</p>
                            </div>
                        </MotionLink>

                        <MotionLink
                            href="/contact"
                            whileHover={{ scale: 1.02, backgroundColor: "rgba(var(--p) / 0.05)" }}
                            className="flex items-center gap-3 p-4 rounded-2xl border border-base-200 transition-colors text-left group cursor-pointer"
                        >
                            <div className="p-2 rounded-lg bg-base-200 group-hover:bg-primary group-hover:text-white transition-colors">
                                <ArrowLeft size={20} />
                            </div>
                            <div>
                                <p className="font-bold text-sm">Contact Us</p>
                                <p className="text-xs text-base-content/60">Talk to a holiday expert</p>
                            </div>
                        </MotionLink>
                    </div>
                </motion.div>

            </div>
        </main>
    );
}
