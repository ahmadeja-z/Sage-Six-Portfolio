import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { Insight } from "@/types";
import { getProject } from "@/data/projects";
import { getRelatedInsights } from "@/data/insights";
import { Reveal } from "@/components/ui/Reveal";

export function RelatedContent({ article }: { article: Insight }) {
  const related = getRelatedInsights(article.slug, 3);
  const caseStudy = article.relatedCaseStudy ? getProject(article.relatedCaseStudy) : undefined;

  return (
    <section className="border-t border-line py-16 md:py-24" aria-label="Related content">
      <div className="container-x">
        <Reveal>
          <p className="eyebrow mb-10">Keep reading</p>
        </Reveal>

        {related.length > 0 && (
          <div className="grid gap-px overflow-hidden border border-line bg-line md:grid-cols-3">
            {related.map((item, i) => (
              <Reveal key={item.slug} delay={i * 0.08} y={16} className="h-full">
                <Link
                  href={`/insights/${item.slug}`}
                  className="group flex h-full flex-col bg-ink-2 p-7 transition-colors duration-300 hover:bg-ink-3 md:p-8"
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-sage/70">
                    {item.category}
                  </span>
                  <h3 className="mt-4 font-display text-xl font-medium leading-snug tracking-tight text-bone transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1">
                    {item.title}
                  </h3>
                  <span className="mt-6 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-mist transition-colors duration-300 group-hover:text-sage">
                    Read Article
                    <ArrowRight
                      className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                      strokeWidth={1.75}
                    />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        )}

        {(caseStudy || article.relatedService) && (
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {caseStudy && (
              <Link
                href={`/work/${caseStudy.slug}`}
                className="group flex items-center justify-between gap-6 border border-line bg-ink-2 p-7 transition-colors duration-300 hover:border-sage/50 hover:bg-ink-3 md:p-8"
              >
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-sage/70">
                    Related case study
                  </span>
                  <h3 className="mt-3 font-display text-2xl font-medium tracking-tight text-bone">
                    {caseStudy.title}
                  </h3>
                </div>
                <ArrowUpRight
                  className="h-5 w-5 shrink-0 text-fog transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-sage"
                  strokeWidth={1.5}
                />
              </Link>
            )}
            {article.relatedService && (
              <Link
                href="/services"
                className="group flex items-center justify-between gap-6 border border-line bg-ink-2 p-7 transition-colors duration-300 hover:border-sage/50 hover:bg-ink-3 md:p-8"
              >
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-sage/70">
                    Related service
                  </span>
                  <h3 className="mt-3 font-display text-2xl font-medium tracking-tight text-bone">
                    {article.relatedService}
                  </h3>
                </div>
                <ArrowRight
                  className="h-5 w-5 shrink-0 text-fog transition-transform duration-500 group-hover:translate-x-1 group-hover:text-sage"
                  strokeWidth={1.5}
                />
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}