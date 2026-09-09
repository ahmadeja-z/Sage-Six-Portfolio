import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { projects } from "@/data/projects";
import type { Project } from "@/types";

// Renders previous/next project navigation. Automatically activates once
// more than one real case study exists in the projects data — currently
// hidden while SPEEZU is the only published project.
export function NextProjectNavigation({ current }: { current: Project }) {
  if (projects.length < 2) return null;

  const index = projects.findIndex((p) => p.slug === current.slug);
  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];

  return (
    <nav
      className="container-x grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2"
      aria-label="More case studies"
    >
      <Link
        href={`/work/${prev.slug}`}
        className="group flex items-center justify-between gap-4 bg-ink-2 p-8 transition-colors duration-300 hover:bg-ink-3 md:p-10"
      >
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-mist">
            Previous
          </span>
          <span className="mt-2 block font-display text-2xl font-medium tracking-tight text-bone transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-x-1 md:text-3xl">
            {prev.title}
          </span>
        </div>
        <ArrowLeft
          className="h-6 w-6 shrink-0 text-fog transition-transform duration-500 group-hover:-translate-x-1"
          strokeWidth={1.5}
        />
      </Link>
      <Link
        href={`/work/${next.slug}`}
        className="group flex items-center justify-between gap-4 bg-ink-2 p-8 transition-colors duration-300 hover:bg-ink-3 md:p-10"
      >
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-mist">
            Next
          </span>
          <span className="mt-2 block font-display text-2xl font-medium tracking-tight text-bone transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 md:text-3xl">
            {next.title}
          </span>
        </div>
        <ArrowRight
          className="h-6 w-6 shrink-0 text-fog transition-transform duration-500 group-hover:translate-x-1"
          strokeWidth={1.5}
        />
      </Link>
    </nav>
  );
}