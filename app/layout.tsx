import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import StoreProvider from "@/src/lib/redux/StoreProvider";
import { AntdRegistry } from '@ant-design/nextjs-registry';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sun Holidays Ltd | Experience World-Class Travel",
  description: "Book your dream holiday with Sun Holidays Ltd. Specialists in Hajj, Umrah, and exotic getaways. Curating memories that last a lifetime.",
  keywords: ["Travel", "Holidays", "Hajj", "Umrah", "Sun Holidays Ltd", "Tours", "Vacation"],
  openGraph: {
    title: "Sun Holidays Ltd | Experience World-Class Travel",
    description: "Book your dream holiday with Sun Holidays Ltd. Specialists in Hajj, Umrah, and exotic getaways.",
    type: "website",
    locale: "en_GB", // Assuming UK based on 'Ltd'? Or defaulting to US 'en_US'
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
        <StoreProvider>
          <AntdRegistry>
            {children}
          </AntdRegistry>
        </StoreProvider>
      </body>
    </html>
  );
}
