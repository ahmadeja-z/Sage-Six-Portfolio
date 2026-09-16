"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Insight } from "@/types";
import { getProject } from "@/data/projects";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/home/motion";
import { formatDate } from "@/components/insights/ArticleMeta";

function CaseStudyTag({ slug }: { slug: string }) {
  const project = getProject(slug);
  if (!project) return null;
  return <span className="s6-cs-chip">Case study: {project.title}</span>;
}

export function ArticleCard({
  article,
  variant = "row",
}: {
  article: Insight;
  variant?: "row" | "featured";
}) {
  const featured = variant === "featured";

  return (
    <Reveal effect="rise">
      <article className={cn("group", featured && "s6-insights-featured")}>
        <Link
          href={`/insights/${article.slug}`}
          className={cn("s6-insights-card-link", featured ? "s6-insights-featured-grid" : "s6-insights-row")}
          aria-label={`Read ${article.title}`}
        >
          <div className={featured ? "s6-insights-featured-copy" : "min-w-0 flex-1"}>
            <div className="s6-article-meta">
              <span className="s6-article-meta-category">{article.category}</span>
              {article.publishedAt && <span>{formatDate(article.publishedAt)}</span>}
              <span>{article.readingTime}</span>
            </div>
            <h2 className={cn("s6-insights-title", featured && "s6-insights-title-featured")}>
              {article.title}
            </h2>
            <p className={cn("s6-insights-excerpt", featured && "s6-insights-excerpt-featured")}>
              {article.excerpt}
            </p>
          </div>

          <div className={featured ? "s6-insights-featured-aside" : "s6-insights-row-aside"}>
            {article.relatedCaseStudy && <CaseStudyTag slug={article.relatedCaseStudy} />}
            <span className="s6-insights-read-link">
              {featured ? "Read the guide" : "Read Article"}
              <ArrowRight className="s6-insights-read-arrow" size={16} strokeWidth={1.75} aria-hidden="true" />
            </span>
          </div>
        </Link>
      </article>
    </Reveal>
  );
}
