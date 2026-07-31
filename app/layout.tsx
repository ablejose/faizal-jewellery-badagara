import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { BRAND } from "@/config/brand";
import { buildJsonLd, getSiteUrl } from "@/lib/seo";
import { LoadingScreen } from "@/components/LoadingScreen";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const siteUrl = getSiteUrl(BRAND);

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: BRAND.seo.title,
    template: `%s | ${BRAND.businessName}`,
  },
  description: BRAND.seo.description,
  keywords: BRAND.seo.keywords,
  applicationName: BRAND.businessName,
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: {
    icon: BRAND.favicon,
  },
  openGraph: {
    type: "website",
    title: BRAND.seo.title,
    description: BRAND.seo.description,
    url: siteUrl,
    siteName: BRAND.businessName,
    images: [{ url: BRAND.seo.ogImage, width: 1200, height: 630, alt: BRAND.businessName }],
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: BRAND.seo.title,
    description: BRAND.seo.description,
    images: [BRAND.seo.ogImage],
  },
};

export const viewport: Viewport = {
  themeColor: "#050509",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = buildJsonLd(BRAND);

  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="" />
        {jsonLd.map((schema, index) => (
          <script
            key={index}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
      </head>
      <body className="bg-background font-sans text-ivory antialiased">
        <LoadingScreen />
        {children}
      </body>
    </html>
  );
}
