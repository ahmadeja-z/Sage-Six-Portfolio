"use client";

import { Suspense } from "react";
import type { Insight } from "@/types";
import { Reveal } from "@/components/home/motion";
import { ArticleCard } from "@/components/insights/ArticleCard";
import { InsightFilter } from "@/components/insights/InsightFilter";
import { ArticleCTA } from "@/components/insights/ArticleCTA";

// Restrained construction-line motif for the hero's empty corner — the same
// technique already used in the case-study, Work, About and Contact heroes,
// duplicated locally to keep this page independent of those trees.
function InsightsHexFacets() {
  return (
    <svg className="s6-cs-hero-hex" viewBox="0 0 200 200" aria-hidden="true" focusable="false">
      <polygon
        points="100,6 176,50 176,138 100,182 24,138 24,50"
        fill="none"
        stroke="var(--s6-indigo)"
        strokeWidth="1"
      />
      <polygon
        points="100,46 146,72 146,128 100,154 54,128 54,72"
        fill="none"
        stroke="var(--s6-cyan)"
        strokeWidth="1"
      />
    </svg>
  );
}

export function InsightsPageContent({
  featured,
  articles,
}: {
  featured: Insight | undefined;
  articles: Insight[];
}) {
  return (
    <div className="s6 s6-home s6-insights">
      <header className="s6-cs-hero" aria-labelledby="insights-heading">
        <InsightsHexFacets />
        <div className="s6-container relative z-10">
          <Reveal entrance>
            <p className="s6-eyebrow">INSIGHTS</p>
          </Reveal>
          <Reveal entrance delay={0.08}>
            <h1 id="insights-heading" className="s6-insights-heading">
              Insights on Software, Product Design and Digital Growth
            </h1>
          </Reveal>
          <Reveal entrance delay={0.16}>
            <p className="s6-work-hero-lead">
              Practical thinking from Sage Six on mobile applications, web
              platforms, artificial intelligence and building digital products
              that solve real business problems.
            </p>
          </Reveal>
        </div>
      </header>

      <section className="s6-section s6-container" aria-label="Published insights">
        {featured && <ArticleCard article={featured} variant="featured" />}

        <div className="mt-16">
          <Reveal>
            <p className="s6-eyebrow mb-6">Latest Insights</p>
          </Reveal>
          {/* Suspense fallback keeps every article visible immediately —
              useSearchParams (read for shareable filter URLs) requires a
              boundary, but content must never disappear while it resolves. */}
          <Suspense
            fallback={
              <div className="mt-12 space-y-2">
                {articles.map((article) => (
                  <ArticleCard key={article.slug} article={article} />
                ))}
              </div>
            }
          >
            <InsightFilter articles={articles} />
          </Suspense>
        </div>
      </section>

      <ArticleCTA />
    </div>
  );
}
