import type { Metadata, Viewport } from "next";
import dynamic from "next/dynamic";
import { Geist_Mono, Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import "./home.css";
import { siteConfig } from "@/lib/site";
import { SmoothScroll } from "@/components/layout/SmoothScroll";

import {
  SiteHeader,
  SiteFooter,
  LegacyEffects,
} from "@/components/layout/SiteChrome";

const AIProjectAssistant = dynamic(
  () =>
    import("@/components/assistant/AIProjectAssistant").then(
      (m) => m.AIProjectAssistant,
    ),
  { loading: () => null },
);

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "SageSix — Software, AI & Digital Product Development",
    template: "%s — SageSix",
  },
  description:
    "SageSix builds digital products that move businesses forward. We design, engineer and scale mobile apps, web platforms, AI solutions and digital products for ambitious businesses.",
  keywords: [
    "SageSix",
    "software development",
    "AI solutions",
    "mobile app development",
    "web development",
    "product development",
    "MVP development",
  ],
  authors: [{ name: "SageSix" }],
  creator: "SageSix",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: "SageSix",
    title: "SageSix — Software, AI & Digital Product Development",
    description:
      "Software. AI. Product. Built to scale. We build digital products that move businesses forward.",
  },
  twitter: {
    card: "summary_large_image",
    title: "SageSix — Software, AI & Digital Product Development",
    description:
      "Software. AI. Product. Built to scale. We build digital products that move businesses forward.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/images/sagesix-icon.svg", sizes: "any", type: "image/svg+xml" },
    ],
    apple: "/images/sagesix-apple-icon-new.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${geistMono.variable}`}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "@id": `${siteConfig.url}/#organization`,
              name: "SageSix",
              url: siteConfig.url,
              email: siteConfig.email,
              logo: {
                "@type": "ImageObject",
                url: `${siteConfig.url}/images/sagesix-icon.svg`,
                width: 61,
                height: 70,
              },
              slogan: "Software. AI. Product. Built to scale.",
              description:
                "SageSix builds digital products that move businesses forward. Software, AI and product development.",
              knowsAbout: [
                "Software Development",
                "AI Solutions",
                "Mobile Development",
                "Web Development",
                "MVP Development",
                "Business Automation",
              ],
            }),
          }}
        />
        <LegacyEffects />
        <SmoothScroll />
        <SiteHeader />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <SiteFooter />
        <AIProjectAssistant />
      </body>
    </html>
  );
}
