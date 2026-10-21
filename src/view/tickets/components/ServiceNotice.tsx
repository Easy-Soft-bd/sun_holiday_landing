import Link from "next/link";
import { Mail, PhoneCall } from "lucide-react";

type ServiceNoticeProps = {
    phones: string[];
    emails: string[];
};

function telHref(phone: string) {
    const compact = phone.replace(/[^\d+]/g, "");
    return compact ? `tel:${compact}` : null;
}

export default function ServiceNotice({ phones, emails }: ServiceNoticeProps) {
    const hasDirect = phones.length > 0 || emails.length > 0;

    return (
        <section className="container mx-auto px-4 py-12 sm:py-16">
            <div className="relative overflow-hidden rounded-[2rem] border border-primary/10 bg-gradient-to-br from-primary/5 to-secondary/5 p-6 text-center sm:rounded-[3rem] sm:p-10 md:p-12">
                <div className="absolute right-0 top-0 -translate-y-1/2 translate-x-1/2 rounded-full bg-primary/10 p-32 blur-3xl" />
                <div className="relative z-10 mx-auto max-w-2xl">
                    <h2 className="mb-3 text-2xl font-bold sm:text-3xl">Prefer to call?</h2>
                    <p className="mb-8 text-base leading-relaxed text-base-content/70 sm:text-lg">
                        We sell tickets from the desk, not through an online booking engine.
                        {phones.length > 0 && emails.length > 0
                            ? " Call or email and an agent will check the route with you."
                            : phones.length > 0
                              ? " Call and an agent will check the route with you."
                              : emails.length > 0
                                ? " Email and an agent will check the route with you."
                                : " Send a query above, or reach the desk from the contact page."}
                    </p>

                    {phones.length > 0 ? (
                        <div className="mb-4 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap">
                            {phones.map((phone, index) => {
                                const href = telHref(phone);
                                const className =
                                    "btn btn-primary btn-lg h-auto min-h-12 whitespace-normal rounded-full px-6 py-3 text-base shadow-xl";
                                return href ? (
                                    <a key={`${phone}-${index}`} href={href} className={`${className} gap-3`}>
                                        <PhoneCall size={20} className="shrink-0" />
                                        <span className="break-all">{phone}</span>
                                    </a>
                                ) : (
                                    <span key={`${phone}-${index}`} className={className}>
                                        {phone}
                                    </span>
                                );
                            })}
                        </div>
                    ) : null}

                    {emails.length > 0 ? (
                        <div className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap">
                            {emails.map((email, index) => (
                                <a
                                    key={`${email}-${index}`}
                                    href={`mailto:${email}`}
                                    className="btn btn-outline btn-lg h-auto min-h-12 gap-3 whitespace-normal rounded-full px-6 py-3 text-base"
                                >
                                    <Mail size={18} className="shrink-0" />
                                    <span className="break-all">{email}</span>
                                </a>
                            ))}
                        </div>
                    ) : null}

                    {!hasDirect ? (
                        <Link href="/contact" className="btn btn-primary btn-lg rounded-full px-8">
                            Contact the ticket desk
                        </Link>
                    ) : null}
                </div>
            </div>
        </section>
    );
}
