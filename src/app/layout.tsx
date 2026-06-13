import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { siteConfig } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | 3D Printing Calculators`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "3D print cost calculator",
    "filament calculator",
    "3D printing profit calculator",
    "electricity cost calculator",
    "print farm pricing",
  ],
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [
      {
        url: "/assets/fabquote-brand-reference.jpg",
        width: 1536,
        height: 1024,
        alt: "FabQuote brand identity",
      },
    ],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: siteConfig.name,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/assets/fabquote-icon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [
      { url: "/assets/fabquote-icon.png", sizes: "512x512", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
