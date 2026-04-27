import Image from "next/image";
import Link from "next/link";
import ClientOnly from "@/src/components/common/ClientOnly";
import { MapPin, Star, Clock, Phone, Mail, ChevronRight, Calendar } from "lucide-react";
import type { SailorMoonResortsPageData } from "@/src/lib/data/sailor-moon-resorts-page";
import { mergeSailorMoonResortsPageData } from "@/src/lib/data/sailor-moon-resorts-page";
import SailorMoonFeatureIcon from "@/src/view/sailor-moon-resorts/SailorMoonFeatureIcon";
import SailorMoonBookingCTA from "@/src/view/sailor-moon-resorts/SailorMoonBookingCTA";

type Props = {
  data?: Partial<SailorMoonResortsPageData> | null;
  admin?: boolean;
};

async function SailorMoonResortsAdminSlot({ data }: { data: SailorMoonResortsPageData }) {
  const SailorMoonResortsAdminControl = (await import("./SailorMoonResortsAdminControl")).default;
  return (
    <ClientOnly>
      <div className="absolute right-4 top-4 z-50 md:right-8 md:top-8">
        <SailorMoonResortsAdminControl data={data} />
      </div>
    </ClientOnly>
  );
}

export default async function SailorMoonResortsView({ data, admin = false }: Props) {
  const resortData = mergeSailorMoonResortsPageData(data);
  const heroImage = resortData.images[0] ?? "/sailor/SHA_6244 copy.jpg";
  const galleryCount = Math.max(1, Math.min(resortData.images.length, resortData.galleryMaxItems || 12));

  return (
    <div className="group/sailor-moon-resorts min-h-screen bg-base-100">
      <section className="relative h-[70vh] overflow-hidden md:h-[80vh]">
        {admin ? <SailorMoonResortsAdminSlot data={resortData} /> : null}
        <div className="absolute inset-0">
          <Image src={heroImage} alt={resortData.name} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        </div>

        <div className="relative container mx-auto flex h-full flex-col items-center justify-center px-4 text-center text-white">
          <div className="mb-4 flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md">
            <MapPin className="size-4 text-primary" />
            <span className="text-sm font-bold tracking-wide">{resortData.heroBadge}</span>
          </div>

          <h1 className="mb-4 font-gilliequest text-5xl leading-none tracking-tighter md:text-7xl lg:text-8xl">
            {resortData.heroTitleLine1}{" "}
            <span className="text-primary italic">{resortData.heroTitleLine2}</span>
          </h1>

          <p className="mb-6 text-xl font-bold uppercase tracking-[0.2em] text-primary md:text-2xl">
            {resortData.tagline}
          </p>

          <p className="mb-8 max-w-2xl text-lg leading-relaxed text-white/90 md:text-xl">{resortData.heroWelcome}</p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href={resortData.heroBookCtaHref}
              className="btn btn-primary btn-lg group rounded-full px-10 text-white shadow-xl shadow-primary/20"
            >
              {resortData.heroBookCtaText}
              <ChevronRight className="size-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href={resortData.heroGalleryCtaHref}
              className="btn btn-outline btn-lg rounded-full border-white px-10 text-white hover:bg-white hover:text-base-content"
            >
              {resortData.heroGalleryCtaText}
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-base-100 py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-primary">{resortData.aboutEyebrow}</p>
            <h2 className="mb-6 font-gilliequest text-4xl leading-tight tracking-tighter md:text-5xl lg:text-6xl">
              {resortData.aboutHeadingBefore}{" "}
              <span className="text-primary italic">{resortData.aboutHeadingAccent}</span>
            </h2>
            <p className="mb-8 text-lg leading-relaxed text-base-content/70">{resortData.description}</p>

            <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="rounded-2xl border border-base-300 bg-base-200 p-6">
                <div className="mx-auto mb-4 w-fit rounded-full bg-primary/10 p-4">
                  <Star className="size-8 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-bold">{resortData.highlight1Title}</h3>
                <p className="text-sm text-base-content/60">{resortData.highlight1Subtitle}</p>
              </div>

              <div className="rounded-2xl border border-base-300 bg-base-200 p-6">
                <div className="mx-auto mb-4 w-fit rounded-full bg-primary/10 p-4">
                  <Calendar className="size-8 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-bold">{resortData.highlight2Title}</h3>
                <p className="text-sm text-base-content/60">{resortData.highlight2Subtitle}</p>
              </div>

              <div className="rounded-2xl border border-base-300 bg-base-200 p-6">
                <div className="mx-auto mb-4 w-fit rounded-full bg-primary/10 p-4">
                  <MapPin className="size-8 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-bold">{resortData.highlight3Title}</h3>
                <p className="text-sm text-base-content/60">{resortData.highlight3Subtitle}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-base-200 py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-16 text-center">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-primary">
              {resortData.facilitiesEyebrow}
            </p>
            <h2 className="font-gilliequest text-4xl leading-tight tracking-tighter md:text-5xl lg:text-6xl">
              {resortData.facilitiesHeadingBefore}{" "}
              <span className="text-primary italic">{resortData.facilitiesHeadingAccent}</span>
            </h2>
          </div>

          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-2">
            {resortData.features.map((feature, index) => (
              <div
                key={`${feature.title}-${index}`}
                className="group rounded-3xl border border-base-300 bg-base-100 p-8 transition-all duration-300 hover:border-primary/30 hover:shadow-xl"
              >
                <div className="mb-6 w-fit rounded-2xl bg-primary/10 p-4 transition-colors group-hover:bg-primary/20">
                  <SailorMoonFeatureIcon icon={feature.icon} />
                </div>
                <h3 className="mb-4 text-2xl font-bold">{feature.title}</h3>
                <p className="leading-relaxed text-base-content/70">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="gallery" className="bg-base-100 py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-16 text-center">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-primary">{resortData.galleryEyebrow}</p>
            <h2 className="font-gilliequest text-4xl leading-tight tracking-tighter md:text-5xl lg:text-6xl">
              {resortData.galleryHeadingBefore}{" "}
              <span className="text-primary italic">{resortData.galleryHeadingAccent}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {resortData.images.slice(0, galleryCount).map((image, index) => (
              <div
                key={`${image}-${index}`}
                className="group relative h-[300px] cursor-pointer overflow-hidden rounded-2xl"
              >
                <Image
                  src={image}
                  alt={`${resortData.name} - Image ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="booking" className="bg-base-200 py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="rounded-3xl border border-base-300 bg-base-100 p-8 shadow-xl md:p-12">
              <div className="mb-12 text-center">
                <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-primary">{resortData.bookingEyebrow}</p>
                <h2 className="mb-4 font-gilliequest text-4xl leading-tight tracking-tighter md:text-5xl">
                  {resortData.bookingHeadingBefore}{" "}
                  <span className="text-primary italic">{resortData.bookingHeadingAccent}</span>
                </h2>
                <p className="text-lg text-base-content/70">{resortData.bookingIntro}</p>
              </div>

              <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2">
                <div className="rounded-2xl border border-base-300 bg-base-200 p-6">
                  <div className="mb-4 flex items-center gap-4">
                    <div className="rounded-full bg-primary/10 p-3">
                      <Clock className="size-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">Check-in</h3>
                      <p className="text-base-content/60">{resortData.checkIn}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-base-300 bg-base-200 p-6">
                  <div className="mb-4 flex items-center gap-4">
                    <div className="rounded-full bg-primary/10 p-3">
                      <Clock className="size-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">Check-out</h3>
                      <p className="text-base-content/60">{resortData.checkOut}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-12 space-y-6">
                <div className="rounded-2xl border border-base-300 bg-base-200 p-6">
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-primary/10 p-3">
                      <Phone className="size-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="mb-2 text-lg font-bold">Contact Numbers</h3>
                      <div className="space-y-1">
                        {resortData.contact.phone.map((phone, index) => (
                          <a
                            key={`${phone}-${index}`}
                            href={`tel:${phone.replace(/\s/g, "")}`}
                            className="block text-base-content/70 transition-colors hover:text-primary"
                          >
                            {phone}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-base-300 bg-base-200 p-6">
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-primary/10 p-3">
                      <Mail className="size-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="mb-2 text-lg font-bold">Email Addresses</h3>
                      <div className="space-y-1">
                        {resortData.contact.email.map((email, index) => (
                          <a
                            key={`${email}-${index}`}
                            href={`mailto:${email}`}
                            className="block text-base-content/70 transition-colors hover:text-primary"
                          >
                            {email}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <SailorMoonBookingCTA
                label={resortData.bookingCtaText}
                resortName={resortData.name}
                location={resortData.location}
                checkIn={resortData.checkIn}
                checkOut={resortData.checkOut}
                disclaimer={resortData.bookingDisclaimer}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-base-100 py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-primary">{resortData.locationEyebrow}</p>
            <h2 className="mb-6 font-gilliequest text-4xl leading-tight tracking-tighter md:text-5xl">
              {resortData.locationHeadingBefore}{" "}
              <span className="text-primary italic">{resortData.locationHeadingAccent}</span>
            </h2>
            <div className="flex items-center justify-center gap-2 text-lg text-base-content/70">
              <MapPin className="size-5 text-primary" />
              <p>{resortData.location}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
