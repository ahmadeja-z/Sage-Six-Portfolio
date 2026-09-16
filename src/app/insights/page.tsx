import type { Metadata } from "next";
import { getPublishedInsights, getFeaturedInsight } from "@/data/insights";
import { InsightsPageContent } from "@/components/insights/InsightsPageContent";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Software Development Insights | Sage Six",
  description:
    "Explore practical Sage Six insights on mobile app development, web platforms, Flutter, artificial intelligence, MVP strategy and business automation.",
  alternates: { canonical: "/insights" },
  openGraph: {
    title: "Software Development Insights | Sage Six",
    description:
      "Practical thinking from Sage Six on mobile applications, web platforms, artificial intelligence and building digital products.",
    url: `${siteConfig.url}/insights`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Software Development Insights | Sage Six",
    description:
      "Practical thinking from Sage Six on mobile applications, web platforms, AI and digital product development.",
  },
};

export default function InsightsPage() {
  const published = getPublishedInsights();
  const featured = getFeaturedInsight();
  const rest = published.filter((i) => i.slug !== featured?.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Sage Six Insights",
    description: metadata.description,
    url: `${siteConfig.url}/insights`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: published.map((post, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: post.title,
        url: `${siteConfig.url}/insights/${post.slug}`,
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <InsightsPageContent featured={featured} articles={featured ? rest : published} />
    </>
  );
}
