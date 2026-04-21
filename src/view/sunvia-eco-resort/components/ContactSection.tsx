import Link from "next/link";
import { MapPin, Phone, Mail, Clock, ChevronRight, Heart, Briefcase, Users } from "lucide-react";
import type { ResortConfig } from "../Index";

interface ContactSectionProps {
  config: ResortConfig;
}

const audienceIcons: Record<string, React.ReactNode> = {
  Families: <Users className="size-5 text-emerald-600" />,
  "Honeymoon Couples": <Heart className="size-5 text-emerald-600" />,
  "Corporate Clients": <Briefcase className="size-5 text-emerald-600" />,
};

export default function ContactSection({ config }: ContactSectionProps) {
  const { contact, location, targetAudience } = config;

  return (
    <section id="contact" className="py-16 md:py-24 bg-base-100">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-14">
          <p className="text-emerald-600 font-bold tracking-[0.3em] uppercase text-sm mb-4">
            Plan Your Stay
          </p>
          <h2 className="font-gilliequest text-4xl md:text-5xl lg:text-6xl leading-tight tracking-tighter mb-4">
            Booking{" "}
            <span className="text-emerald-600 italic">Information</span>
          </h2>
          <p className="text-base-content/60 text-lg max-w-2xl mx-auto">
            Ready to experience sustainable luxury? Get in touch with us to book your escape.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Main Card */}
          <div className="bg-base-100 rounded-3xl p-6 md:p-10 border border-base-300 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              {/* Check In/Out */}
              <div className="bg-base-200 p-6 rounded-2xl border border-base-300">
                <div className="flex items-center gap-4">
                  <div className="bg-emerald-500/10 p-3 rounded-full">
                    <Clock className="size-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Check-in</h3>
                    <p className="text-base-content/60">{contact.checkIn}</p>
                  </div>
                </div>
              </div>

              <div className="bg-base-200 p-6 rounded-2xl border border-base-300">
                <div className="flex items-center gap-4">
                  <div className="bg-emerald-500/10 p-3 rounded-full">
                    <Clock className="size-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Check-out</h3>
                    <p className="text-base-content/60">{contact.checkOut}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {/* Phone */}
              <div className="bg-base-200 p-6 rounded-2xl border border-base-300">
                <div className="flex items-start gap-4">
                  <div className="bg-emerald-500/10 p-3 rounded-full shrink-0">
                    <Phone className="size-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm mb-2 uppercase tracking-widest text-base-content/50">
                      Phone
                    </h3>
                    <div className="space-y-1">
                      {contact.phone.map((phone, index) => (
                        <a
                          key={index}
                          href={`tel:${phone.replace(/\s/g, "")}`}
                          className="block text-sm text-base-content/70 hover:text-emerald-600 transition-colors"
                        >
                          {phone}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="bg-base-200 p-6 rounded-2xl border border-base-300">
                <div className="flex items-start gap-4">
                  <div className="bg-emerald-500/10 p-3 rounded-full shrink-0">
                    <Mail className="size-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm mb-2 uppercase tracking-widest text-base-content/50">
                      Email
                    </h3>
                    <div className="space-y-1">
                      {contact.email.map((email, index) => (
                        <a
                          key={index}
                          href={`mailto:${email}`}
                          className="block text-sm text-base-content/70 hover:text-emerald-600 transition-colors break-all"
                        >
                          {email}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="bg-base-200 p-6 rounded-2xl border border-base-300">
                <div className="flex items-start gap-4">
                  <div className="bg-emerald-500/10 p-3 rounded-full shrink-0">
                    <MapPin className="size-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm mb-2 uppercase tracking-widest text-base-content/50">
                      Location
                    </h3>
                    <p className="text-sm text-base-content/70 leading-relaxed">
                      {location.full}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Target Audience */}
            <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-2xl p-6 mb-10">
              <h3 className="font-bold text-center mb-4 text-base-content/70 uppercase tracking-widest text-xs">
                Perfect For
              </h3>
              <div className="flex flex-wrap items-center justify-center gap-4">
                {targetAudience.map((audience) => (
                  <div
                    key={audience}
                    className="flex items-center gap-2 bg-base-100 px-4 py-2.5 rounded-full border border-emerald-500/20 text-sm font-medium"
                  >
                    {audienceIcons[audience] ?? <Users className="size-5 text-emerald-600" />}
                    {audience}
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="text-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-full px-10 py-3.5 transition-all shadow-xl shadow-emerald-500/20 group"
              >
                Book Your Escape Now
                <ChevronRight className="size-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <p className="text-xs text-base-content/40 mt-3">
                * Advance booking recommended. Conditions apply.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
