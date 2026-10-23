import AppImage from "@/src/components/common/AppImage";
import Link from "next/link";
import Logo from "../common/Logo";
import { Mail, Phone, MapPin } from "lucide-react";
import PublicIconRenderer from "../common/PublicIconRenderer";
import DeferredAdmin from "@/src/components/admin/DeferredAdmin";
import { resolveSocialLinks, type SocialLink } from "@/src/lib/social-links";
import { parseMultiValue, resolveMapsEmbedForIframe, uniqueEmails, uniquePhones } from "@/src/lib/settings-normalize";
import { DEFAULT_SITE_NAME } from "@/src/lib/brand";
import { getSiteUrl } from "@/src/lib/site";
import { ensureSwapnoBilashResortLink } from "@/src/lib/resort-links";
import { ensureMedicalVisaLink } from "@/src/lib/service-links";

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
    resortsTitle?: string;
    resortsLinks?: QuickLink[];
    mediaTitle?: string;
    mediaLinks?: QuickLink[];
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
        { label: "Medical Visa", url: "/medical-visa" },
        { label: "Ticket", url: "/tickets" },
        { label: "Tour", url: "/tours" },
        { label: "News & Blog", url: "/blog" },
    ],
    resortsTitle: "Resorts",
    resortsLinks: [
        { label: "Sailor Moon Beach Resort", url: "/sailor-moon-resorts" },
        { label: "Swapno Bilash Resort", url: "/swapno-bilash-resort" },
        { label: "Sunvia Hotel Resort", url: "/sunvia-hotel-resort" },
        { label: "Grandeur Bliss", url: "/resort/grandeur-bliss" },
    ],
    mediaTitle: "Media",
    mediaLinks: [
        { label: "News", url: "/news" },
        { label: "Event", url: "/events" },
        { label: "Blog", url: "/blog" },
        { label: "CSR", url: "/csr" },
    ],
    contactTitle: "Get In Touch",
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

const PARADISE_SOLUTION_LABEL = "Paradise Solution";
const PARADISE_SOLUTION_URL = "https://www.paradisesolution.us/";

function renderCopyright(text: string) {
    const credit = text.includes(PARADISE_SOLUTION_LABEL)
        ? text
        : `${text} This Site Design & Developed By ${PARADISE_SOLUTION_LABEL}`;
    const index = credit.indexOf(PARADISE_SOLUTION_LABEL);

    return (
        <>
            {credit.slice(0, index)}
            <a
                href={PARADISE_SOLUTION_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary hover:underline"
            >
                {PARADISE_SOLUTION_LABEL}
            </a>
            {credit.slice(index + PARADISE_SOLUTION_LABEL.length)}
        </>
    );
}

function resolveSettingsContactList(
    fromArray: string[] | null | undefined,
    legacySingle: string | null | undefined,
): string[] {
    if (Array.isArray(fromArray) && fromArray.length > 0) {
        return fromArray.map((v) => String(v).trim()).filter(Boolean);
    }
    return parseMultiValue(legacySingle);
}

function httpSocialLinks(links: SocialLink[]): SocialLink[] {
    return links.filter((link) => /^https?:\/\//i.test(link.url));
}

function mergeFooterData(data?: FooterData): FooterData {
    const merged: FooterData = { ...defaultData, ...data };
    if (!Array.isArray(merged.servicesLinks) || merged.servicesLinks.length === 0) {
        merged.servicesLinks = defaultData.servicesLinks;
    }
    merged.servicesLinks = ensureMedicalVisaLink(merged.servicesLinks ?? []);
    if (!Array.isArray(merged.resortsLinks) || merged.resortsLinks.length === 0) {
        merged.resortsLinks = defaultData.resortsLinks;
    }
    if (!Array.isArray(merged.mediaLinks) || merged.mediaLinks.length === 0) {
        merged.mediaLinks = defaultData.mediaLinks;
    }
    merged.mediaTitle = merged.mediaTitle || defaultData.mediaTitle;
    merged.resortsLinks = ensureSwapnoBilashResortLink(
        (merged.resortsLinks ?? []).map((link) =>
            link.url === "/sunvia-eco-resort" ? { ...link, url: "/sunvia-hotel-resort" } : link
        )
    );
    merged.resortsTitle = merged.resortsTitle || defaultData.resortsTitle;
    return merged;
}

interface FooterProps {
    data?: FooterData;
    settings?: {
        contactEmails?: string[] | null;
        contactPhones?: string[] | null;
        contactEmail?: string | null;
        contactPhone?: string | null;
        address?: string | null;
        googleMapsUrl?: string | null;
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

function footerEditorData(data: FooterData): FooterData {
    const {
        contactAddress: _address,
        contactPhones: _phones,
        contactEmails: _emails,
        contactPhone: _phone,
        contactEmail: _email,
        socialLinks: _social,
        ...editorData
    } = data;
    return editorData;
}

function FooterHeading({ children }: { children: string }) {
    return (
        <h2 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-base-content/55">
            <span aria-hidden className="size-1.5 rounded-full bg-primary" />
            {children}
        </h2>
    );
}

function FooterLinkColumn({ title, links }: { title?: string; links?: QuickLink[] }) {
    if (!title) return null;

    return (
        <nav aria-label={title}>
            <FooterHeading>{title}</FooterHeading>
            <ul>
                {links?.map((link) => (
                    <li key={`${link.label}-${link.url}`}>
                        <Link
                            href={link.url}
                            prefetch={false}
                            className="group inline-flex min-h-11 items-center gap-2.5 py-2 text-sm font-medium text-base-content/80 transition-colors hover:text-primary"
                        >
                            <span aria-hidden className="h-px w-3 bg-primary/35 transition-all duration-300 group-hover:w-5 group-hover:bg-primary" />
                            {link.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

const Footer = async ({ data, settings, branding }: FooterProps) => {
    const footerData = mergeFooterData(data);
    const currentYear = new Date().getFullYear();

    const contactPhones = uniquePhones(resolveSettingsContactList(settings?.contactPhones, settings?.contactPhone));
    const contactEmails = uniqueEmails(resolveSettingsContactList(settings?.contactEmails, settings?.contactEmail));
    const address = settings?.address?.trim() || "";
    const mapsHref = settings?.googleMapsUrl?.trim() || null;
    const mapEmbedSrc = mapsHref ? await resolveMapsEmbedForIframe(mapsHref) : null;
    const bio = footerData.bio || defaultData.bio;
    const socialLinks = httpSocialLinks(resolveSocialLinks(settings));
    const showContact = Boolean(address || contactPhones.length || contactEmails.length);
    const showMap = Boolean(mapEmbedSrc);
    const siteName = branding?.siteName || DEFAULT_SITE_NAME;
    const organizationJsonLd = {
        "@context": "https://schema.org",
        "@type": "TravelAgency",
        name: siteName,
        url: getSiteUrl(),
        description: bio,
        ...(contactPhones[0] ? { telephone: contactPhones } : {}),
        ...(contactEmails[0] ? { email: contactEmails[0] } : {}),
        ...(address
            ? {
                  address: {
                      "@type": "PostalAddress",
                      streetAddress: address.replace(/\s*\n\s*/g, ", "),
                      addressCountry: "BD",
                  },
              }
            : {}),
        ...(socialLinks.length > 0 ? { sameAs: socialLinks.map((link) => link.url) } : {}),
    };

    const addressNode = address ? (
        mapsHref ? (
            <a
                href={mapsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="whitespace-pre-line text-sm leading-relaxed text-base-content/75 transition-colors hover:text-primary"
            >
                {address}
            </a>
        ) : (
            <span className="whitespace-pre-line text-sm leading-relaxed text-base-content/75">{address}</span>
        )
    ) : null;

    return (
        <footer className="group/footer relative border-t border-base-300 bg-base-200 text-base-content">
            <div aria-hidden className="h-1 w-full bg-primary" />

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c"),
                }}
            />

            <DeferredAdmin
                name="footer"
                data={footerEditorData(footerData)}
                className="absolute top-5 right-4 z-20"
            />

            <div className="container mx-auto px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
                <div className="grid gap-12 lg:grid-cols-12 lg:items-start lg:gap-10">
                    <div className="space-y-6 lg:col-span-3">
                        <Link href="/" prefetch={false} className="inline-block transition-opacity hover:opacity-80">
                            <Logo
                                showText={false}
                                height={60}
                                siteName={branding?.siteName}
                                logoUrl={branding?.siteLogo}
                            />
                        </Link>
                        <p className="max-w-md text-sm leading-relaxed text-base-content/70">
                            {bio}
                        </p>
                        {socialLinks.length > 0 ? (
                            <nav aria-label="Social media">
                                <h2 className="sr-only">Social media</h2>
                                <ul className="flex flex-wrap gap-3">
                                    {socialLinks.map((social) => (
                                        <li key={`${social.icon}-${social.url}`}>
                                            <a
                                                href={social.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                aria-label={social.label ? `${social.label} (opens in a new tab)` : "Social profile (opens in a new tab)"}
                                                title={social.label || undefined}
                                                className="group/social relative grid size-11 place-items-center overflow-hidden rounded-full bg-base-100 text-base-content/65 shadow-sm ring-1 ring-base-300 transition-[transform,background-color,color,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:bg-primary hover:text-white hover:shadow-[0_14px_28px_-12px] hover:shadow-primary/45 focus-visible:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:translate-y-0 active:scale-[0.96] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                                            >
                                                <PublicIconRenderer
                                                    iconName={social.icon}
                                                    size={18}
                                                    className="relative fill-current stroke-current transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/social:scale-110 group-hover/social:text-white motion-reduce:transition-none motion-reduce:group-hover/social:scale-100"
                                                />
                                                <span className="sr-only">{social.label || "Social profile"}</span>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        ) : null}
                    </div>

                    <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 sm:gap-10 lg:col-span-9 lg:pt-2">
                        <FooterLinkColumn title={footerData.servicesTitle} links={footerData.servicesLinks} />
                        <FooterLinkColumn title={footerData.resortsTitle} links={footerData.resortsLinks} />
                        <FooterLinkColumn title={footerData.mediaTitle} links={footerData.mediaLinks} />
                    </div>
                </div>

                {showContact || showMap ? (
                <section className="mt-12 overflow-hidden rounded-3xl border border-base-300 bg-base-100 shadow-sm">
                    <div className={showContact && showMap ? "grid lg:grid-cols-2" : ""}>
                        {showContact ? (
                        <div className="flex flex-col justify-center gap-6 p-6 sm:p-8">
                            <FooterHeading>{footerData.contactTitle || "Get In Touch"}</FooterHeading>
                            <ul className="space-y-4">
                                {addressNode ? (
                                <li className="flex items-start gap-3">
                                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                                        <MapPin size={18} aria-hidden />
                                    </span>
                                    {addressNode}
                                </li>
                                ) : null}
                                {contactPhones.length > 0 ? (
                                <li className="flex items-start gap-3">
                                    <span className="mt-0.5 grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                                        <Phone size={18} aria-hidden />
                                    </span>
                                    <div className="flex flex-col justify-center py-1">
                                        {contactPhones.map((phone) => (
                                            <a
                                                key={phone}
                                                href={`tel:${phone.replace(/[^\d+]/g, "")}`}
                                                className="inline-flex items-center py-0.5 text-sm font-medium leading-5 text-base-content/80 transition-colors hover:text-primary"
                                            >
                                                {phone}
                                            </a>
                                        ))}
                                    </div>
                                </li>
                                ) : null}
                                {contactEmails.map((email) => (
                                    <li key={email} className="flex items-center gap-3">
                                        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                                            <Mail size={18} aria-hidden />
                                        </span>
                                        <a
                                            href={`mailto:${email}`}
                                            className="inline-flex min-h-11 items-center py-2 text-sm font-medium break-all text-base-content/80 transition-colors hover:text-primary"
                                        >
                                            {email}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        ) : null}
                        {showMap ? (
                        <div className="min-h-72 border-t border-base-300 lg:border-t-0 lg:border-l">
                            <iframe
                                src={mapEmbedSrc || undefined}
                                title="Google Map Office Location"
                                className="h-72 w-full lg:h-full lg:min-h-80"
                                style={{ border: 0 }}
                                loading="lazy"
                                allowFullScreen
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </div>
                        ) : null}
                    </div>
                </section>
                ) : null}

                <div className="mt-10 grid gap-8 border-t border-base-300 pt-8 md:grid-cols-2 md:items-center">
                    <div>
                        <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-base-content/55">
                            {footerData.certificationsTitle}
                        </h3>
                        <div className="flex flex-wrap items-center gap-5">
                            {footerData.certifications?.map((cert, i) => (
                                <AppImage
                                    key={`${cert.name}-${i}`}
                                    src={cert.image}
                                    alt={cert.name}
                                    width={120}
                                    height={40}
                                    loading="lazy"
                                    className="h-10 w-auto object-contain opacity-70 grayscale transition-all duration-500 hover:opacity-100 hover:grayscale-0"
                                />
                            ))}
                        </div>
                    </div>
                    <div className="md:text-right">
                        <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-base-content/55">
                            {footerData.paymentsTitle}
                        </h3>
                        <div className="flex flex-wrap gap-2 md:justify-end">
                            {["VISA", "MasterCard", "Bkash"].map((method) => (
                                <span
                                    key={method}
                                    className="rounded-full bg-base-100 px-3 py-1.5 text-[11px] font-semibold tracking-wide text-base-content ring-1 ring-base-300"
                                >
                                    {method}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-base-300 pt-6 text-center text-xs font-medium text-base-content/60 sm:flex-row sm:text-left">
                    <p>© {currentYear} {renderCopyright(footerData.copyrightText || defaultData.copyrightText || "")}</p>
                    <div className="flex flex-wrap justify-center gap-x-5 gap-y-1">
                        <Link href="/privacy" prefetch={false} className="inline-flex min-h-11 items-center py-2 transition-colors hover:text-primary">Privacy Policy</Link>
                        <Link href="/terms" prefetch={false} className="inline-flex min-h-11 items-center py-2 transition-colors hover:text-primary">Terms of Service</Link>
                        <Link href="/cookies" prefetch={false} className="inline-flex min-h-11 items-center py-2 transition-colors hover:text-primary">Cookie Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
