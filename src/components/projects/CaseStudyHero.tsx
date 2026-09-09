import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import type { Project } from "@/types";
import { Reveal } from "@/components/ui/Reveal";
import { CaseStudyImage } from "@/components/projects/CaseStudyImage";
import { ProjectFacts } from "@/components/projects/ProjectFacts";
import { StoreDownloadLink } from "@/components/projects/StoreDownloadLink";

export function CaseStudyHero({ project }: { project: Project }) {
  return (
    <header className="relative overflow-hidden border-b border-line pb-16 pt-10 md:pb-24">
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[60vh] w-[70vw] -translate-x-1/2 rounded-full blur-[130px]"
        style={{ backgroundColor: `${project.accent}12` }}
        aria-hidden="true"
      />
      <div className="container-x relative">
        <Reveal>
          <Link
            href="/work"
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-fog transition-colors hover:text-sage"
          >
            <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.75} />
            All projects
          </Link>
        </Reveal>

        <div className="mt-12 grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="eyebrow mb-7">{project.heroEyebrow}</p>
            </Reveal>
            <Reveal delay={0.08}>
              <h1 className="display-2 font-display text-bone md:display-1">
                {project.heroTitle}
              </h1>
            </Reveal>
          </div>
          <div className="lg:col-span-5">
            <Reveal delay={0.16}>
              <p className="body-lg max-w-xl text-fog">{project.heroLead}</p>
            </Reveal>
            {project.liveUrl && (
              <Reveal delay={0.2}>
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-8 inline-flex items-center gap-2.5 border border-line px-7 py-4 font-mono text-xs uppercase tracking-[0.18em] text-bone transition-colors duration-300 hover:border-sage hover:text-sage"
                >
                  Visit Live Website
                  <ArrowUpRight
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    strokeWidth={1.75}
                  />
                </a>
              </Reveal>
            )}
            <div className="mt-10">
              <ProjectFacts facts={project.facts} />
            </div>

            {project.apps && project.apps.length > 0 && (
              <Reveal delay={0.2}>
                <div className="mt-10">
                  <p className="eyebrow mb-4">Live Applications</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {project.apps.map((app) => (
                      <StoreDownloadLink
                        key={app.url}
                        appName={app.name}
                        url={app.url}
                        ariaLabel={app.label}
                        compact
                      />
                    ))}
                  </div>
                </div>
              </Reveal>
            )}
          </div>
        </div>
      </div>

      <div className="container-x mt-14 md:mt-20">
        <CaseStudyImage image={project.coverImage} priority />
      </div>
    </header>
  );
}