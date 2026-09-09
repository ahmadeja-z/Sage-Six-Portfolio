import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { getPublishedInsights } from "@/data/insights";
import { Reveal } from "@/components/ui/Reveal";
import { TextReveal } from "@/components/ui/TextReveal";
import { formatDate } from "@/components/insights/ArticleMeta";

export function Insights() {
  const posts = getPublishedInsights().slice(0, 4);
  if (posts.length === 0) return null;

  return (
    <section className="relative py-24 md:py-36" aria-label="Insights">
      <div className="container-x">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow mb-6">Insights</p>
            <TextReveal
              as="h2"
              lines={["Thinking out loud,", "in public."]}
              className="display-3 font-display text-bone"
              lineClassName="text-bone"
              stagger={0.08}
            />
          </div>
          <Reveal delay={0.15}>
            <Link
              href="/insights"
              className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-fog transition-colors hover:text-sage"
            >
              All insights
              <ArrowRight
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                strokeWidth={1.75}
              />
            </Link>
          </Reveal>
        </div>

        <ul className="mt-14 md:mt-20">
          {posts.map((post, i) => (
            <li key={post.slug}>
              <Reveal y={16} delay={0.04}>
                <Link
                  href={`/insights/${post.slug}`}
                  className="group hairline-t flex flex-col gap-4 py-8 transition-colors duration-300 hover:bg-ink-2/60 md:flex-row md:items-center md:gap-8 md:px-6"
                >
                  <span className="w-10 shrink-0 font-mono text-[11px] tracking-[0.2em] text-sage/70">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-2xl font-medium tracking-tight text-bone transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 md:text-3xl">
                      {post.title}
                    </h3>
                    <div className="mt-2.5 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-mist">
                      <span className="text-sage/80">{post.category}</span>
                      <span className="h-1 w-1 rounded-full bg-line" />
                      {post.publishedAt && <span>{formatDate(post.publishedAt)}</span>}
                      <span className="h-1 w-1 rounded-full bg-line" />
                      <span>{post.readingTime}</span>
                    </div>
                  </div>
                  <span className="hidden text-fog transition-colors duration-300 group-hover:text-sage sm:block">
                    <ArrowUpRight
                      className="h-5 w-5 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      strokeWidth={1.5}
                    />
                  </span>
                </Link>
              </Reveal>
            </li>
          ))}
          <li className="hairline-t h-px bg-line" aria-hidden="true" />
        </ul>
      </div>
    </section>
  );
}