"use client";

import { useMemo, useState } from "react";
import type { Insight } from "@/types";
import { ArticleCard } from "@/components/insights/ArticleCard";
import { cn } from "@/lib/utils";

export function InsightFilter({ articles }: { articles: Insight[] }) {
  const categories = useMemo(
    () => ["All Insights", ...Array.from(new Set(articles.map((a) => a.category)))],
    [articles],
  );
  const [active, setActive] = useState("All Insights");

  const filtered =
    active === "All Insights" ? articles : articles.filter((a) => a.category === active);

  return (
    <div>
      <div
        className="flex flex-wrap gap-2"
        role="tablist"
        aria-label="Filter insights by category"
      >
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            role="tab"
            aria-selected={active === cat}
            onClick={() => setActive(cat)}
            className={cn(
              "border px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors duration-300",
              active === cat
                ? "border-sage bg-sage text-ink"
                : "border-line text-fog hover:border-sage hover:text-sage",
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="mt-12 space-y-2">
        {filtered.length > 0 ? (
          filtered.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))
        ) : (
          <p className="py-8 text-fog">
            No published articles in this category yet. Check back soon.
          </p>
        )}
      </div>
    </div>
  );
}