"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { Insight } from "@/types";
import { getProject } from "@/data/projects";
import { cn } from "@/lib/utils";
import { formatDate } from "@/components/insights/ArticleMeta";

function CaseStudyTag({ slug }: { slug: string }) {
  const project = getProject(slug);
  if (!project) return null;
  return (
    <span className="inline-flex items-center gap-1.5 border border-line px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-mist">
      Case study: {project.title}
    </span>
  );
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
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={cn("group", featured && "border-y border-line py-12 md:py-16")}
    >
      <Link
        href={`/insights/${article.slug}`}
        className={cn(
          "block focus-visible:outline-offset-8",
          featured
            ? "grid gap-8 md:grid-cols-12 md:items-end"
            : "flex flex-col gap-6 md:flex-row md:items-center",
        )}
        aria-label={`Read ${article.title}`}
      >
        <div className={cn(featured ? "md:col-span-8" : "min-w-0 flex-1")}>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[10px] uppercase tracking-[0.18em] text-mist">
            <span className="text-sage/80">{article.category}</span>
            {article.publishedAt && <span>{formatDate(article.publishedAt)}</span>}
            <span>{article.readingTime}</span>
          </div>
          <h2
            className={cn(
              "mt-4 font-display font-semibold tracking-tight text-bone transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1",
              featured ? "text-3xl md:text-5xl" : "text-2xl md:text-3xl",
            )}
          >
            {article.title}
          </h2>
          <p
            className={cn(
              "mt-4 leading-relaxed text-fog",
              featured ? "max-w-2xl text-base md:text-lg" : "max-w-3xl text-[15px]",
            )}
          >
            {article.excerpt}
          </p>
        </div>

        <div
          className={cn(
            "flex flex-wrap items-center gap-4",
            featured ? "md:col-span-4 md:flex-col md:items-end md:gap-5" : "shrink-0",
          )}
        >
          {article.relatedCaseStudy && (
            <CaseStudyTag slug={article.relatedCaseStudy} />
          )}
          <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-fog transition-colors duration-300 group-hover:text-sage">
            {featured ? "Read the guide" : "Read Article"}
            <ArrowRight
              className={cn(
                "h-4 w-4 transition-transform duration-300 group-hover:translate-x-1",
                featured && "group-hover:-translate-y-0.5 group-hover:translate-x-0.5",
              )}
              strokeWidth={1.75}
            />
          </span>
        </div>
      </Link>
    </motion.article>
  );
}