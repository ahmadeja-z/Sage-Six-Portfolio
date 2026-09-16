import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { Insight } from "@/types";
import { getProject } from "@/data/projects";
import { getRelatedInsights } from "@/data/insights";
import { Reveal } from "@/components/home/motion";

export function RelatedContent({ article }: { article: Insight }) {
  const related = getRelatedInsights(article.slug, 3);
  const caseStudy = article.relatedCaseStudy ? getProject(article.relatedCaseStudy) : undefined;

  return (
    <section className="s6-section s6-container" aria-label="Related content">
      <Reveal>
        <p className="s6-eyebrow mb-8">Keep reading</p>
      </Reveal>

      {related.length > 0 && (
        <div className="grid gap-5 md:grid-cols-3">
          {related.map((item, i) => (
            <Reveal key={item.slug} delay={i * 0.06} className="h-full">
              <Link href={`/insights/${item.slug}`} className="s6-cs-card s6-insights-related-card">
                <span className="s6-article-meta-category">{item.category}</span>
                <h3>{item.title}</h3>
                <span className="s6-insights-read-link">
                  Read Article
                  <ArrowRight className="s6-insights-read-arrow" size={14} strokeWidth={1.75} aria-hidden="true" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      )}

      {(caseStudy || article.relatedService) && (
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {caseStudy && (
            <Link href={`/work/${caseStudy.slug}`} className="s6-about-proof-row">
              <div className="s6-about-proof-copy">
                <span className="s6-about-proof-category">Related case study</span>
                <h3>{caseStudy.title}</h3>
              </div>
              <ArrowUpRight className="s6-about-proof-arrow h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
            </Link>
          )}
          {article.relatedService && (
            <Link href="/expertise" className="s6-about-proof-row">
              <div className="s6-about-proof-copy">
                <span className="s6-about-proof-category">Related service</span>
                <h3>{article.relatedService}</h3>
              </div>
              <ArrowRight className="s6-about-proof-arrow h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
            </Link>
          )}
        </div>
      )}
    </section>
  );
}
