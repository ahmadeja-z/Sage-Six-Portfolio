"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import type { Insight } from "@/types";
import { ArticleCard } from "@/components/insights/ArticleCard";
import { useHomeReducedMotion } from "@/components/home/motion";
import { cn } from "@/lib/utils";

const ALL = "All Insights";

export function InsightFilter({ articles }: { articles: Insight[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const reduce = useHomeReducedMotion();

  const categories = useMemo(
    () => [ALL, ...Array.from(new Set(articles.map((a) => a.category)))],
    [articles],
  );

  const requestedCategory = searchParams.get("category") ?? ALL;
  const [active, setActive] = useState(
    categories.includes(requestedCategory) ? requestedCategory : ALL,
  );

  function selectCategory(cat: string) {
    setActive(cat);
    const params = new URLSearchParams(searchParams.toString());
    if (cat === ALL) params.delete("category");
    else params.set("category", cat);
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  const filtered = active === ALL ? articles : articles.filter((a) => a.category === active);

  return (
    <div>
      <div className="s6-insights-filters" role="tablist" aria-label="Filter insights by category">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            role="tab"
            aria-selected={active === cat}
            onClick={() => selectCategory(cat)}
            className={cn("s6-insights-filter", active === cat && "s6-insights-filter-active")}
          >
            {cat}
          </button>
        ))}
      </div>

      <motion.div
        key={active}
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="mt-12 space-y-2"
        aria-live="polite"
      >
        {filtered.length > 0 ? (
          filtered.map((article) => <ArticleCard key={article.slug} article={article} />)
        ) : (
          <p className="s6-insights-empty">
            No published articles in this category yet. Check back soon.
          </p>
        )}
      </motion.div>
    </div>
  );
}
