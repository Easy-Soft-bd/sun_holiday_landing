import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { absoluteUrl, getDefaultSeo, getSiteUrl, splitKeywords } from "@/src/lib/site";
import { DEFAULT_SITE_LOGO } from "@/src/lib/public-assets";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: "Sun Tourism Ltd | Experience World-Class Travel",
  description: getDefaultSeo().description,
  keywords: splitKeywords("Travel, Holidays, Hajj, Umrah, Sun Tourism Ltd, Tours, Vacation"),
  alternates: {
    canonical: absoluteUrl('/'),
  },
  openGraph: {
    title: "Sun Tourism Ltd | Experience World-Class Travel",
    description: getDefaultSeo().description,
    type: "website",
    locale: "en_BD",
    url: absoluteUrl('/'),
    siteName: getDefaultSeo().siteName,
    images: [
      {
        url: absoluteUrl(getDefaultSeo().image),
        alt: getDefaultSeo().siteName,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sun Tourism Ltd | Experience World-Class Travel",
    description: getDefaultSeo().description,
    images: [absoluteUrl(getDefaultSeo().image)],
  },
  icons: {
    icon: DEFAULT_SITE_LOGO,
    apple: DEFAULT_SITE_LOGO,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="sunlight" style={{ colorScheme: 'sunlight' }} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
