import Image from "next/image";
import Link from "next/link";
import Logo from "../common/Logo";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import ClientOnly from "../common/ClientOnly";
import PublicIconRenderer from "../common/PublicIconRenderer";
import { resolveSocialLinks, type SocialLink } from "@/src/lib/social-links";

/** Footer CMS entries predate the settings editor and may not carry a label. */
interface CmsSocialLink {
    icon: string;
    url: string;
    label?: string;
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
    socialLinks?: CmsSocialLink[];
    servicesTitle?: string;
    servicesLinks?: QuickLink[];
    contactTitle?: string;
    contactAddress?: string;
    /** Preferred: one or more numbers shown in the footer */
    contactPhones?: string[];
    /** Preferred: one or more addresses shown in the footer */
    contactEmails?: string[];
    /** @deprecated use contactPhones */
    contactPhone?: string;
    /** @deprecated use contactEmails */
    contactEmail?: string;
    newsletterTitle?: string;
    newsletterDescription?: string;
    certificationsTitle?: string;
    certifications?: Certification[];
    paymentsTitle?: string;
    copyrightText?: string;
}

const defaultData: FooterData = {
    bio: "Sun Tourism Ltd is your premier gateway to world-class travel experiences. We specialize in curated holidays, seamless visa processing, and luxury resort bookings.",
    socialLinks: [
        { icon: "SiFacebook", url: "#", label: "Facebook" },
        { icon: "SiInstagram", url: "#", label: "Instagram" },
        { icon: "SiX", url: "#", label: "X" },
        { icon: "SiLinkedin", url: "#", label: "LinkedIn" },
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
    contactPhones: ["+880 1234 567 890"],
    contactEmails: ["support@sunholidays.com"],
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
    copyrightText: "Sun Tourism Ltd. All Rights Reserved.",
};

function normalizeContactList(
    fromArray: string[] | undefined,
    legacySingle: string | undefined,
    fallback: string[]
): string[] {
    const trimmed = (fromArray ?? [])
        .map((s) => String(s).trim())
        .filter(Boolean);
    if (trimmed.length > 0) {
        return trimmed;
    }
    const one = legacySingle?.trim();
    if (one) {
        return [one];
    }
    return [...fallback];
}

function mergeFooterData(data?: FooterData): FooterData {
    const merged: FooterData = { ...defaultData, ...data };
    merged.contactPhones = normalizeContactList(
        merged.contactPhones,
        merged.contactPhone,
        defaultData.contactPhones ?? []
    );
    merged.contactEmails = normalizeContactList(
        merged.contactEmails,
        merged.contactEmail,
        defaultData.contactEmails ?? []
    );
    return merged;
}

interface FooterProps {
    data?: FooterData;
    admin?: boolean;
    settings?: {
        contactEmails?: string[] | null;
        contactPhones?: string[] | null;
        contactEmail?: string | null;
        contactPhone?: string | null;
        address?: string | null;
        facebookUrl?: string | null;
        twitterUrl?: string | null;
        instagramUrl?: string | null;
        linkedinUrl?: string | null;
        socialLinks?: SocialLink[] | string | null;
    };
    branding?: {
        siteName?: string | null;
        siteLogo?: string | null;
    };
}

async function FooterAdminSlot({ data }: { data: FooterData }) {
    const FooterAdminControl = (await import("./FooterAdminControl")).default;

    return (
        <ClientOnly>
            <div className="absolute top-4 left-4 z-50">
                <FooterAdminControl data={data} />
            </div>
        </ClientOnly>
    );
}

const Footer = async ({ data, admin = false, settings, branding }: FooterProps) => {
    const footerData = mergeFooterData(data);
    const currentYear = new Date().getFullYear();

    let contactPhones = Array.isArray(settings?.contactPhones)
        ? settings.contactPhones.map((v) => String(v).trim()).filter(Boolean)
        : [];
    if (!contactPhones.length && settings?.contactPhone?.trim()) {
        contactPhones = [settings.contactPhone.trim()];
    }
    if (!contactPhones.length) {
        contactPhones = footerData.contactPhones ?? [];
    }
    if (!contactPhones.length) {
        contactPhones = defaultData.contactPhones ?? [];
    }

    let contactEmails = Array.isArray(settings?.contactEmails)
        ? settings.contactEmails.map((v) => String(v).trim()).filter(Boolean)
        : [];
    if (!contactEmails.length && settings?.contactEmail?.trim()) {
        contactEmails = [settings.contactEmail.trim()];
    }
    if (!contactEmails.length) {
        contactEmails = footerData.contactEmails ?? [];
    }
    if (!contactEmails.length) {
        contactEmails = defaultData.contactEmails ?? [];
    }

    const address = settings?.address || footerData.contactAddress || "123 Travel Plaza, Suite 456\nDhaka, Bangladesh";
    const bio = footerData.bio || defaultData.bio;

    const socialLinks = resolveSocialLinks(
        settings,
        footerData.socialLinks ?? defaultData.socialLinks,
    );

    return (
        <footer className="relative bg-base-200 text-base-content border-t border-base-300 group/footer">
            
            {/* Admin Edit Controls */}
            {admin && (
                <FooterAdminSlot data={footerData} />
            )}

            {/* Main Footer Content */}
            <div className="container mx-auto px-6 pt-16 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

                    {/* Column 1: Brand & Bio */}
                    <div className="space-y-6">
                        <Link href="/" className="inline-block hover:opacity-80 transition-opacity">
                            <Logo
                                showText={false}
                                width={60}
                                height={60}
                                siteName={branding?.siteName}
                                logoUrl={branding?.siteLogo}
                            />
                        </Link>
                        <p className="text-base-content/70 leading-relaxed text-sm">
                            {bio}
                        </p>
                        <div className="flex flex-wrap gap-3">
                            {socialLinks.map((social, i) => (
                                <Link
                                    key={`${social.icon}-${social.url}-${i}`}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={social.label || undefined}
                                    title={social.label || undefined}
                                    className="group/social relative grid size-11 place-items-center overflow-hidden rounded-full bg-base-content/6 text-base-content/65 transition-[transform,background-color,color,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:bg-primary hover:text-white hover:shadow-[0_14px_28px_-12px] hover:shadow-primary/45 focus-visible:-translate-y-1.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:translate-y-0 active:scale-[0.96] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                                >
                                    <span
                                        aria-hidden
                                        className="pointer-events-none absolute inset-0 rounded-full bg-linear-to-b from-white/25 to-transparent opacity-0 transition-opacity duration-300 group-hover/social:opacity-100"
                                    />
                                    <PublicIconRenderer
                                        iconName={social.icon}
                                        size={20}
                                        className="relative fill-current stroke-current transition-[transform,color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/social:scale-110 group-hover/social:text-white motion-reduce:transition-none motion-reduce:group-hover/social:scale-100"
                                    />
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
                            {contactPhones.map((phone, i) => (
                                <li key={`phone-${i}`} className="flex items-center gap-3">
                                    <Phone size={18} className="text-primary shrink-0" />
                                    <a
                                        href={`tel:${phone.replace(/\s/g, "")}`}
                                        className="text-base-content/70 hover:text-primary transition-colors"
                                    >
                                        {phone}
                                    </a>
                                </li>
                            ))}
                            {contactEmails.map((email, i) => (
                                <li key={`email-${i}`} className="flex items-center gap-3">
                                    <Mail size={18} className="text-primary shrink-0" />
                                    <a
                                        href={`mailto:${email}`}
                                        className="text-base-content/70 hover:text-primary transition-colors break-all"
                                    >
                                        {email}
                                    </a>
                                </li>
                            ))}
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
                                    <Image
                                        key={i}
                                        src={cert.image}
                                        alt={cert.name}
                                        width={120}
                                        height={40}
                                        className="h-10 w-auto object-contain"
                                    />
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
