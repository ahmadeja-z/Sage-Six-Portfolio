import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

export function ArticleCTA() {
  return (
    <section
      className="relative overflow-hidden border-t border-line py-20 md:py-28"
      aria-label="Start a project"
    >
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[50vh] w-[50vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sage/[0.05] blur-[110px]"
        aria-hidden="true"
      />
      <div className="container-x relative">
        <Reveal>
          <p className="eyebrow mb-6">Build with Sage Six</p>
          <h2 className="display-3 max-w-3xl font-display text-bone">
            Planning a digital product?
          </h2>
          <p className="body-lg mt-6 max-w-2xl text-fog">
            Sage Six designs and develops mobile applications, web platforms and
            connected software systems built around real business requirements.
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="mt-10 flex flex-wrap items-center gap-5">
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2.5 bg-bone px-7 py-4 font-mono text-xs uppercase tracking-[0.18em] text-ink transition-colors duration-300 hover:bg-sage-bright"
            >
              Start a Project
              <ArrowUpRight
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                strokeWidth={1.75}
              />
            </Link>
            <Link
              href="/work"
              className="group inline-flex items-center gap-2 border border-line px-7 py-4 font-mono text-xs uppercase tracking-[0.18em] text-bone transition-colors duration-300 hover:border-sage hover:text-sage"
            >
              Explore Our Work
              <ArrowRight
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                strokeWidth={1.75}
              />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}