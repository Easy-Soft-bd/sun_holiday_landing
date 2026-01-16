import Link from "next/link";
import Logo from "../common/Logo";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Send } from "lucide-react";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-base-200 text-base-content border-t border-base-300">
            {/* Main Footer Content */}
            <div className="container mx-auto px-6 pt-16 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

                    {/* Column 1: Brand & Bio */}
                    <div className="space-y-6">
                        <Link href="/" className="inline-block hover:opacity-80 transition-opacity">
                            <Logo showText={false} width={60} height={60} />
                        </Link>
                        <p className="text-base-content/70 leading-relaxed text-sm">
                            Sun Holidays Ltd is your premier gateway to world-class travel experiences.
                            We specialize in curated holidays, seamless visa processing, and luxury resort bookings.
                        </p>
                        <div className="flex gap-4">
                            {[Facebook, Instagram, Twitter, Linkedin].map((Icon, i) => (
                                <Link key={i} href="#" className="btn btn-ghost btn-sm btn-circle hover:bg-primary hover:text-white transition-all">
                                    <Icon size={18} />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h3 className="font-bold text-sm uppercase tracking-[0.2em] mb-6 text-primary">Services</h3>
                        <ul className="space-y-4 text-sm font-medium">
                            <li><Link href="/visa" className="hover:text-primary transition-colors">Visa Processing</Link></li>
                            <li><Link href="/tickets" className="hover:text-primary transition-colors">Air Ticketing</Link></li>
                            <li><Link href="/resorts" className="hover:text-primary transition-colors">Resort Bookings</Link></li>
                            <li><Link href="/tours" className="hover:text-primary transition-colors">Custom Tour Packages</Link></li>
                            <li><Link href="/blog" className="hover:text-primary transition-colors">News & Blog</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Contact Info */}
                    <div>
                        <h3 className="font-bold text-sm uppercase tracking-[0.2em] mb-6 text-primary">Get In Touch</h3>
                        <ul className="space-y-4 text-sm font-medium">
                            <li className="flex items-start gap-3">
                                <MapPin size={18} className="text-primary shrink-0" />
                                <span className="text-base-content/70">123 Travel Plaza, Suite 456<br />Dhaka, Bangladesh</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone size={18} className="text-primary shrink-0" />
                                <span className="text-base-content/70">+880 1234 567 890</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail size={18} className="text-primary shrink-0" />
                                <span className="text-base-content/70">support@sunholidays.com</span>
                            </li>
                        </ul>
                    </div>

                    {/* Column 4: Newsletter */}
                    <div>
                        <h3 className="font-bold text-sm uppercase tracking-[0.2em] mb-6 text-primary">Newsletter</h3>
                        <p className="text-sm text-base-content/70 mb-4">Subscribe for exclusive travel deals and updates.</p>
                        <div className="form-control">
                            <div className="relative group">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="input input-bordered w-full rounded-full bg-base-100 focus:border-primary pr-12 text-sm"
                                />
                                <button
                                    className="btn btn-primary btn-circle btn-sm absolute right-1.5 top-1.5 shadow-lg shadow-primary/20"
                                    aria-label="Subscribe"
                                >
                                    <Send size={14} className="text-white" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Certification & Authorization Section */}
                <div className="mt-16 pt-8 border-t border-base-300">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="text-center md:text-left">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-base-content/40 mb-4">Authorized By & Certified Member</h4>
                            <div className="flex flex-wrap justify-center md:justify-start gap-6 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                                {/* 
                   Replace these src with your actual certification logo paths 
                   (IATA, ATAB, TOAB, Civil Aviation, etc.)
                */}
                                <img src="/certs/iata.png" alt="IATA Member" className="h-10 object-contain" />
                                <img src="/certs/atab.png" alt="ATAB Member" className="h-10 object-contain" />
                                <img src="/certs/civil-aviation.png" alt="Civil Aviation Authorized" className="h-10 object-contain" />
                                <img src="/certs/iso.png" alt="ISO Certified" className="h-10 object-contain" />
                            </div>
                        </div>

                        {/* Payment Methods */}
                        <div className="text-center md:text-right">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-base-content/40 mb-4">Secure Payments</h4>
                            <div className="flex gap-3 justify-center md:justify-end opacity-70">
                                <div className="bg-white px-2 py-1 rounded border border-base-300 text-[10px] font-bold text-black">VISA</div>
                                <div className="bg-white px-2 py-1 rounded border border-base-300 text-[10px] font-bold text-black">MasterCard</div>
                                <div className="bg-white px-2 py-1 rounded border border-base-300 text-[10px] font-bold text-black">Bkash</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Legal Section */}
                <div className="mt-12 pt-8 border-t border-base-300 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium text-base-content/50">
                    <p>© {currentYear} Sun Holidays Ltd. All Rights Reserved.</p>
                    <div className="flex gap-6">
                        <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
                        <Link href="/cookies" className="hover:text-primary transition-colors">Cookie Policy</Link>
                    </div>
                </div>
            </div>

        </footer>
    );
};

export default Footer;