import Link from "next/link";
import { Home, Search, LifeBuoy, ArrowLeft } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "404 - Page Not Found | Sun Holidays",
    description: "Sorry, the holiday destination you are looking for doesn't exist.",
};

export default function NotFound() {
    return (
        <main className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6 bg-base-100">
            <div className="max-w-2xl w-full text-center space-y-8">

                {/* Decorative Background Element */}
                <div className="relative">
                    <div className="absolute inset-0 blur-3xl opacity-20 bg-primary/30 rounded-full scale-150 animate-pulse" />

                    {/* Large 404 Text */}
                    <h1 className="relative text-[12rem] md:text-[15rem] font-black leading-none tracking-tighter text-base-content/5 selection:bg-transparent">
                        404
                    </h1>

                    <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2">
                        <h2 className="text-3xl md:text-5xl font-bold text-base-content">
                            Lost in <span className="text-primary">Paradise?</span>
                        </h2>
                        <p className="text-base-content/60 max-w-md mx-auto text-lg">
                            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                        </p>
                    </div>
                </div>

                {/* Primary Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <Link
                        href="/"
                        className="btn btn-primary btn-lg rounded-full px-8 shadow-xl shadow-primary/20 text-white group"
                    >
                        <Home className="size-5 transition-transform group-hover:-translate-y-1" />
                        Back to Home
                    </Link>

                    <Link
                        href="/destinations"
                        className="btn btn-ghost btn-lg rounded-full px-8 border border-base-300"
                    >
                        <Search className="size-5" />
                        Find a Destination
                    </Link>
                </div>

                {/* Secondary Links (Quick Help) */}
                <div className="pt-12 border-t border-base-200">
                    <p className="text-sm font-semibold uppercase tracking-widest text-base-content/40 mb-6">
                        Need immediate help?
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
                        <Link
                            href="/support"
                            className="flex items-center gap-3 p-4 rounded-2xl border border-base-200 hover:border-primary/50 hover:bg-primary/5 transition-all text-left group"
                        >
                            <div className="p-2 rounded-lg bg-base-200 group-hover:bg-primary group-hover:text-white transition-colors">
                                <LifeBuoy size={20} />
                            </div>
                            <div>
                                <p className="font-bold text-sm">Help Center</p>
                                <p className="text-xs text-base-content/60">Browse our documentation</p>
                            </div>
                        </Link>

                        <Link
                            href="/contact"
                            className="flex items-center gap-3 p-4 rounded-2xl border border-base-200 hover:border-primary/50 hover:bg-primary/5 transition-all text-left group"
                        >
                            <div className="p-2 rounded-lg bg-base-200 group-hover:bg-primary group-hover:text-white transition-colors">
                                <ArrowLeft size={20} />
                            </div>
                            <div>
                                <p className="font-bold text-sm">Contact Us</p>
                                <p className="text-xs text-base-content/60">Talk to a holiday expert</p>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Footer Branding */}
                <div className="pt-8">
                    <span className="text-xs font-bold tracking-widest text-base-content/20 uppercase">
                        © {new Date().getFullYear()} Sun Holidays Ltd
                    </span>
                </div>
            </div>
        </main>
    );
}