import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { ProjectCta, StoreApp } from "@/types";
import { Reveal } from "@/components/ui/Reveal";
import { StoreDownloadLink } from "@/components/projects/StoreDownloadLink";

const DEFAULT_TITLE = "Have a Multi-Platform Product in Mind?";
const DEFAULT_BODY =
  "We design and develop connected digital products across mobile applications, operational dashboards, payments, and real-time workflows.";

export function ProjectCTA({
  apps,
  cta,
}: {
  apps?: StoreApp[];
  cta?: ProjectCta;
}) {
  const title = cta?.title ?? DEFAULT_TITLE;
  const body = cta?.body ?? DEFAULT_BODY;
  const eyebrow = cta?.eyebrow ?? "Build with SageSix";
  const secondaryLabel = cta?.secondaryLabel ?? "View More Work";
  const secondaryHref = cta?.secondaryUrl ?? "/work";
  const secondaryExternal = cta?.secondaryExternal ?? false;

  return (
    <section
      className="relative overflow-hidden border-t border-line py-24 md:py-32"
      aria-label="Start a project"
    >
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[60vh] w-[60vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sage/[0.05] blur-[120px]"
        aria-hidden="true"
      />
      <div className="container-x relative">
        <Reveal>
          <p className="eyebrow mb-6">{eyebrow}</p>
          <h2 className="display-3 max-w-3xl font-display text-bone">{title}</h2>
          <p className="body-lg mt-6 max-w-2xl text-fog">{body}</p>
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
            {secondaryExternal ? (
              <a
                href={secondaryHref}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 border border-line px-7 py-4 font-mono text-xs uppercase tracking-[0.18em] text-bone transition-colors duration-300 hover:border-sage hover:text-sage"
              >
                {secondaryLabel}
                <ArrowUpRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  strokeWidth={1.75}
                />
              </a>
            ) : (
              <Link
                href={secondaryHref}
                className="group inline-flex items-center gap-2 border border-line px-7 py-4 font-mono text-xs uppercase tracking-[0.18em] text-bone transition-colors duration-300 hover:border-sage hover:text-sage"
              >
                {secondaryLabel}
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  strokeWidth={1.75}
                />
              </Link>
            )}
          </div>
        </Reveal>

        {apps && apps.length > 0 && (
          <Reveal delay={0.25}>
            <div className="mt-14 border-t border-line pt-10">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mist">
                Explore the live SPEEZU applications
              </p>
              <div className="mt-5 flex max-w-xl flex-wrap gap-3">
                {apps.map((app) => (
                  <StoreDownloadLink
                    key={app.url}
                    appName={app.name}
                    url={app.url}
                    ariaLabel={app.label}
                    compact
                    className="min-w-[220px] flex-1"
                  />
                ))}
              </div>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}