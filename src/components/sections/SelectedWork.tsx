import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getFeaturedProjects } from "@/data/projects";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { Reveal } from "@/components/ui/Reveal";
import { TextReveal } from "@/components/ui/TextReveal";

export function SelectedWork() {
  const featured = getFeaturedProjects();
  if (featured.length === 0) return null;

  return (
    <section
      id="work"
      className="relative scroll-mt-20 py-24 md:py-36"
      aria-label="Selected work"
    >
      <div className="container-x">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow mb-6">Selected Projects</p>
            <TextReveal
              as="h2"
              lines={["Explore our work."]}
              className="display-3 font-display text-bone"
              lineClassName="text-bone"
            />
            <Reveal delay={0.1}>
              <p className="body-lg mt-6 text-fog">
                Explore selected app, website and software projects, including
                the challenges, product decisions and work delivered.
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.15}>
            <Link
              href="/work"
              className="group inline-flex items-center gap-2 border border-line px-6 py-3.5 font-mono text-xs uppercase tracking-[0.2em] text-bone transition-colors duration-300 hover:border-sage hover:text-sage"
            >
              View all work
              <ArrowRight
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                strokeWidth={1.75}
              />
            </Link>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 md:mt-20 lg:grid-cols-3">
          {featured.map((project) => (
            <ProjectCard key={project.slug} project={project} variant="featured" />
          ))}
        </div>
      </div>
    </section>
  );
}