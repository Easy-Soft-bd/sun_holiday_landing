import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { DEFAULT_FAVICON, DEFAULT_SITE_LOGO, DEFAULT_SITE_NAME } from "@/src/lib/brand";
import { getCachedSettings } from "@/src/lib/data/home-page";
import { getSiteUrl } from "@/src/lib/site";

const magmaWave = localFont({
  src: "../public/font/MagmaWave.otf",
  variable: "--font-magmawave-face",
  display: "swap",
  weight: "400",
  // Hero brand text uses MagmaWave, but preloading the OTF races the LCP image.
  preload: false,
});

const gillieQuest = localFont({
  src: "../public/font/GillieQuestRegular.otf",
  variable: "--font-gilliequest-face",
  display: "swap",
  weight: "400",
  // Used below the fold on most pages — don't compete with LCP.
  preload: false,
});

function iconHref(url: string, updatedAt?: string | Date | null) {
  const time = updatedAt ? new Date(updatedAt).getTime() : 0;
  if (!time || Number.isNaN(time)) return url;
  return `${url}${url.includes("?") ? "&" : "?"}v=${time}`;
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getCachedSettings().catch(() => null);
  const faviconPath = settings?.favicon?.trim() || DEFAULT_FAVICON;
  const icon = iconHref(faviconPath, settings?.updatedAt);
  const title = `${DEFAULT_SITE_NAME} - Your Gateway to Amazing Holidays`;
  const description = `Discover amazing holiday destinations with ${DEFAULT_SITE_NAME}. Book your dream vacation today!`;

  return {
    metadataBase: new URL(getSiteUrl()),
    title,
    description,
    openGraph: {
      title,
      description,
      images: [DEFAULT_SITE_LOGO],
    },
    icons: {
      icon: [{ url: icon }],
      shortcut: [{ url: icon }],
      apple: [{ url: icon }],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="sunlight"
      data-scroll-behavior="smooth"
      className={`${magmaWave.variable} ${gillieQuest.variable}`}
    >
      <head>
        {/* Discover LCP image before body parse / React hydrate */}
        <link
          rel="preload"
          as="image"
          href="/hero/hero-640.webp"
          type="image/webp"
          imageSrcSet="/hero/hero-640.webp 640w, /hero/hero-750.webp 750w, /hero/hero-1280.webp 1280w, /hero/hero-1920.webp 1920w"
          imageSizes="100vw"
          fetchPriority="high"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
