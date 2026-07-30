import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "Sun Tour LTD - Your Gateway to Amazing Holidays",
  description: "Discover amazing holiday destinations with Sun Tour LTD. Book your dream vacation today!",
  openGraph: {
    title: "Sun Tour LTD - Your Gateway to Amazing Holidays",
    description: "Discover amazing holiday destinations with Sun Tour LTD. Book your dream vacation today!",
    images: ["/logo/logo.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

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
