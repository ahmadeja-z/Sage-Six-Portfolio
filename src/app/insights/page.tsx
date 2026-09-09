import type { Metadata } from "next";
import { getPublishedInsights, getFeaturedInsight } from "@/data/insights";
import { PageHeader } from "@/components/layout/PageHeader";
import { ArticleCard } from "@/components/insights/ArticleCard";
import { InsightFilter } from "@/components/insights/InsightFilter";
import { Reveal } from "@/components/ui/Reveal";
import { ArticleCTA } from "@/components/insights/ArticleCTA";
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

      <PageHeader
        eyebrow="Insights"
        lines={["Insights on Software,", "Product Design and", "Digital Growth"]}
        description="Practical thinking from Sage Six on mobile applications, web platforms, artificial intelligence and building digital products that solve real business problems."
      />

      <section className="container-x py-16 md:py-24" aria-label="Published insights">
        {featured && (
          <ArticleCard article={featured} variant="featured" />
        )}

        <div className="mt-16 md:mt-20">
          <Reveal>
            <p className="eyebrow mb-6">Latest Insights</p>
          </Reveal>
          <InsightFilter articles={featured ? rest : published} />
        </div>
      </section>

      <ArticleCTA />
    </>
  );
}