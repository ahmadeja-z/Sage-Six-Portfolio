import type { Metadata } from "next";
import { HomePageContent } from "@/components/home/HomePageContent";
import { getPublishedInsights } from "@/data/insights";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Sage Six | Mobile App & Website Development" },
  description:
    "Sage Six provides mobile app development, website development, custom software and ongoing technical support. Explore our work and discuss your project.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Sage Six | Mobile App & Website Development",
    description:
      "Sage Six provides mobile app development, website development, custom software and ongoing technical support.",
    url: siteConfig.url,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sage Six | Mobile App & Website Development",
    description:
      "Sage Six provides mobile app development, website development, custom software and ongoing technical support.",
  },
};

export default function HomePage() {
  const selectedSlugs = [
    "admin-dashboard-development-guide",
    "flutter-for-business-apps",
    "app-website-maintenance-checklist",
    "flutter-vs-react-native",
  ];
  const articles = selectedSlugs.flatMap((slug) => {
    const article = getPublishedInsights().find((item) => item.slug === slug);
    return article
      ? [
          {
            title: article.title,
            slug: article.slug,
            category: article.category,
          },
        ]
      : [];
  });
  return <HomePageContent articles={articles} />;
}
