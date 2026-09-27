import AppImage from "@/src/components/common/AppImage";
import SectionAdminControl from "./SectionAdminControl";
import type { ResortSectionKey, SunviaEcoResortPageData } from "@/src/lib/data/sunvia-eco-resort";

interface SectionFrameProps {
  id?: string;
  className?: string;
  admin?: boolean;
  section: ResortSectionKey;
  editTitle: string;
  data: SunviaEcoResortPageData[ResortSectionKey];
  backgroundImage?: string;
  children: React.ReactNode;
}

export default function SectionFrame({
  id,
  className = "",
  admin = false,
  section,
  editTitle,
  data,
  backgroundImage,
  children,
}: SectionFrameProps) {
  return (
    <section id={id} className={`relative scroll-mt-40 overflow-hidden ${className}`}>
      {backgroundImage ? (
        <>
          <AppImage src={backgroundImage} alt="" fill sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-black/60" />
        </>
      ) : null}
      {admin ? (
        <div className="absolute right-4 top-4 z-20">
          <SectionAdminControl section={section} title={editTitle} data={data} />
        </div>
      ) : null}
      <div className={`container relative z-10 mx-auto px-4 py-16 md:py-24 lg:px-8 ${backgroundImage ? "text-white" : ""}`}>
        {children}
      </div>
    </section>
  );
}

export function SectionIntro({
  eyebrow,
  heading,
  description,
}: {
  eyebrow: string;
  heading: string;
  description?: string;
}) {
  return (
    <div className="mb-10 max-w-3xl">
      <p className="mb-3 text-xs font-bold tracking-[0.28em] text-primary uppercase">{eyebrow}</p>
      <h2 className="font-gilliequest mb-4 text-3xl leading-none tracking-tight text-base-content md:text-5xl">{heading}</h2>
      {description ? (
        <p className="text-base leading-relaxed text-base-content/70 md:text-lg">{description}</p>
      ) : null}
    </div>
  );
}
