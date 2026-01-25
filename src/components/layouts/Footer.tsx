import Link from "next/link";
import Logo from "../common/Logo";
import * as LucideIcons from "lucide-react";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Send, FacebookIcon, InstagramIcon, TwitterIcon, LinkedinIcon } from "lucide-react";
import FooterEditButton from "./FooterEditButton";
import ClientOnly from "../common/ClientOnly";

interface SocialLink {
    icon: string;
    url: string;
}

interface QuickLink {
    label: string;
    url: string;
}

interface Certification {
    name: string;
    image: string;
}

interface FooterData {
    bio?: string;
    socialLinks?: SocialLink[];
    servicesTitle?: string;
    servicesLinks?: QuickLink[];
    contactTitle?: string;
    contactAddress?: string;
    contactPhone?: string;
    contactEmail?: string;
    newsletterTitle?: string;
    newsletterDescription?: string;
    certificationsTitle?: string;
    certifications?: Certification[];
    paymentsTitle?: string;
    copyrightText?: string;
}

const defaultData: FooterData = {
    bio: "Sun Holidays Ltd is your premier gateway to world-class travel experiences. We specialize in curated holidays, seamless visa processing, and luxury resort bookings.",
    socialLinks: [
        { icon: "Facebook", url: "#" },
        { icon: "Instagram", url: "#" },
        { icon: "Twitter", url: "#" },
        { icon: "Linkedin", url: "#" },
    ],
    servicesTitle: "Services",
    servicesLinks: [
        { label: "Visa Processing", url: "/visa" },
        { label: "Air Ticketing", url: "/tickets" },
        { label: "Resort Bookings", url: "/resorts" },
        { label: "Custom Tour Packages", url: "/tours" },
        { label: "News & Blog", url: "/blog" },
    ],
    contactTitle: "Get In Touch",
    contactAddress: "123 Travel Plaza, Suite 456\nDhaka, Bangladesh",
    contactPhone: "+880 1234 567 890",
    contactEmail: "support@sunholidays.com",
    newsletterTitle: "Newsletter",
    newsletterDescription: "Subscribe for exclusive travel deals and updates.",
    certificationsTitle: "Authorized By & Certified Member",
    certifications: [
        { name: "IATA", image: "/certs/iata.png" },
        { name: "ATAB", image: "/certs/atab.png" },
        { name: "Civil Aviation", image: "/certs/civil-aviation.png" },
        { name: "ISO", image: "/certs/iso.png" },
    ],
    paymentsTitle: "Secure Payments",
    copyrightText: "Sun Holidays Ltd. All Rights Reserved.",
};

const DynamicIcon = ({ name, size = 18 }: { name: string; size?: number }) => {
    // @ts-ignore
    const IconComponent = LucideIcons[name] || LucideIcons.Link;
    return <IconComponent size={size} />;
};

interface FooterProps {
    data?: FooterData;
    admin?: boolean;
    settings?: any; // Pass existing site settings
}

const Footer = ({ data, admin = false, settings }: FooterProps) => {
    const footerData = { ...defaultData, ...data };
    const currentYear = new Date().getFullYear();

    // Use settings as fallback if available
    const contactEmail = footerData.contactEmail || settings?.contactEmail || "support@sunholidays.com";
    const contactPhone = footerData.contactPhone || settings?.contactPhone || "+880 1234 567 890";
    const address = footerData.contactAddress || settings?.address || "123 Travel Plaza, Suite 456\nDhaka, Bangladesh";
    const bio = footerData.bio || settings?.metaDescription || defaultData.bio;

    return (
        <footer className="relative bg-base-200 text-base-content border-t border-base-300 group/footer">
            
            {/* Admin Edit Controls */}
            {admin && (
                <ClientOnly>
                    <div className="absolute top-4 left-4 z-50">
                        <FooterEditButton data={footerData} />
                    </div>
                </ClientOnly>
            )}

            {/* Main Footer Content */}
            <div className="container mx-auto px-6 pt-16 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

                    {/* Column 1: Brand & Bio */}
                    <div className="space-y-6">
                        <Link href="/" className="inline-block hover:opacity-80 transition-opacity">
                            <Logo showText={false} width={60} height={60} />
                        </Link>
                        <p className="text-base-content/70 leading-relaxed text-sm">
                            {bio}
                        </p>
                        <div className="flex gap-4">
                            {footerData.socialLinks?.map((social, i) => (
                                <Link key={i} href={social.url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm btn-circle hover:bg-primary hover:text-white transition-all">
                                    <DynamicIcon name={social.icon} />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h3 className="font-bold text-sm uppercase tracking-[0.2em] mb-6 text-primary">{footerData.servicesTitle}</h3>
                        <ul className="space-y-4 text-sm font-medium">
                            {footerData.servicesLinks?.map((link, i) => (
                                <li key={i}>
                                    <Link href={link.url} className="hover:text-primary transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Contact Info */}
                    <div>
                        <h3 className="font-bold text-sm uppercase tracking-[0.2em] mb-6 text-primary">{footerData.contactTitle}</h3>
                        <ul className="space-y-4 text-sm font-medium">
                            <li className="flex items-start gap-3">
                                <MapPin size={18} className="text-primary shrink-0" />
                                <span className="text-base-content/70 whitespace-pre-line">{address}</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone size={18} className="text-primary shrink-0" />
                                <span className="text-base-content/70">{contactPhone}</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail size={18} className="text-primary shrink-0" />
                                <span className="text-base-content/70">{contactEmail}</span>
                            </li>
                        </ul>
                    </div>

                    {/* Column 4: Newsletter */}
                    <div>
                        <h3 className="font-bold text-sm uppercase tracking-[0.2em] mb-6 text-primary">{footerData.newsletterTitle}</h3>
                        <p className="text-sm text-base-content/70 mb-4">{footerData.newsletterDescription}</p>
                        <div className="form-control">
                            <form className="relative group">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="input input-bordered w-full rounded-full bg-base-100 focus:border-primary pr-12 text-sm"
                                />
                                <button
                                    type="submit"
                                    className="btn btn-primary btn-circle btn-sm absolute right-1.5 top-1.5 shadow-lg shadow-primary/20"
                                    aria-label="Subscribe"
                                >
                                    <Send size={14} className="text-white" />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Certification & Authorization Section */}
                <div className="mt-16 pt-8 border-t border-base-300">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="text-center md:text-left">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-base-content/40 mb-4">{footerData.certificationsTitle}</h4>
                            <div className="flex flex-wrap justify-center md:justify-start gap-6 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                                {footerData.certifications?.map((cert, i) => (
                                    <img key={i} src={cert.image} alt={cert.name} className="h-10 object-contain" />
                                ))}
                            </div>
                        </div>

                        {/* Payment Methods */}
                        <div className="text-center md:text-right">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-base-content/40 mb-4">{footerData.paymentsTitle}</h4>
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
                    <p>© {currentYear} {footerData.copyrightText}</p>
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