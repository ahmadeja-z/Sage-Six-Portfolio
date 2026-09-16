"use client";

import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import type { Project, ProjectFact, ProjectSection, StoreApp } from "@/types";
import { projects } from "@/data/projects";
import { Reveal, motionTokens, useHomeReducedMotion } from "@/components/home/motion";
import { CsImage } from "@/components/projects/light/CaseStudyArtwork";

// Restrained rotation across the six-facet Sage Six palette, used only for
// small index labels on numbered cards — never for large fills.
const ACCENTS = ["#14a89d", "#0f75bd", "#273990", "#662d90"];

function GooglePlayIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M3.6 1.8 13.8 12 3.6 22.2c-.3-.2-.6-.6-.6-1.2V3c0-.6.3-1 .6-1.2z" />
      <path d="M15.6 10.2 17.9 8 5.9 1.4c-.5-.3-1-.2-1.5.1l11.2 8.7z" />
      <path d="M17.9 8l-2.3 2.2L17.9 16l2.5-1.4c1-.6 1-2 0-2.6L17.9 8z" />
      <path d="M15.6 13.8 5.9 22.6c.5.3 1 .4 1.5.1L17.9 16l-2.3-2.2z" />
    </svg>
  );
}

function CsStoreLink({
  appName,
  url,
  ariaLabel,
  eyebrow = "Available on Google Play",
}: {
  appName: string;
  url: string;
  ariaLabel: string;
  eyebrow?: string;
}) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" aria-label={ariaLabel} className="s6-cs-store-link">
      <GooglePlayIcon className="s6-cs-store-icon h-5 w-5" />
      <span className="s6-cs-store-copy">
        <span className="s6-cs-store-eyebrow">{eyebrow}</span>
        <span className="s6-cs-store-name">{appName}</span>
      </span>
      <ArrowUpRight className="s6-cs-store-arrow h-4 w-4" strokeWidth={1.75} />
    </a>
  );
}

function CsFacts({ facts }: { facts: ProjectFact[] }) {
  return (
    <dl className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
      {facts.map((fact) => (
        <div key={fact.label} className="s6-cs-fact">
          <dt>{fact.label}</dt>
          <dd>{fact.value}</dd>
        </div>
      ))}
    </dl>
  );
}

// Per-item stagger for chips living inside a <ul>/<ol> — renders a real
// <li> (unlike Reveal, which wraps children in a <div> and would otherwise
// break list markup) with the same viewport-triggered fade-and-rise.
function StaggerItem({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useHomeReducedMotion();
  return (
    <motion.li
      className={className}
      initial={reduce ? false : { opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4, delay, ease: motionTokens.easing.standard }}
    >
      {children}
    </motion.li>
  );
}

function SectionHeader({ label, heading }: { label: string; heading: string }) {
  return (
    <div className="mb-8 grid gap-3 md:mb-10 md:grid-cols-12 md:items-baseline md:gap-4">
      <span className="s6-cs-label md:col-span-2">{label}</span>
      <h2 className="md:col-span-10">{heading}</h2>
    </div>
  );
}

// Restrained construction-line motif in an empty hero corner — two hexagon
// outlines in the project's accent and a supporting Sage Six hue. Purely
// decorative: aria-hidden, low opacity, behind content, hidden on narrow
// viewports where the hero has no spare whitespace for it.
function HeroHexFacets() {
  return (
    <svg className="s6-cs-hero-hex" viewBox="0 0 200 200" aria-hidden="true" focusable="false">
      <polygon
        points="100,6 176,50 176,138 100,182 24,138 24,50"
        fill="none"
        stroke="var(--s6-cs-accent)"
        strokeWidth="1"
      />
      <polygon
        points="100,46 146,72 146,128 100,154 54,128 54,72"
        fill="none"
        stroke="var(--s6-cyan)"
        strokeWidth="1"
      />
    </svg>
  );
}

function CaseStudyHeroLight({ project }: { project: Project }) {
  return (
    <header className="s6-cs-hero">
      <HeroHexFacets />
      <div className="s6-container">
        <Reveal entrance>
          <Link href="/work" className="s6-cs-back">
            <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
            All projects
          </Link>
        </Reveal>

        <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-7">
            <Reveal entrance delay={0.08}>
              <p className="s6-eyebrow mb-5">{project.heroEyebrow}</p>
            </Reveal>
            <Reveal entrance delay={0.16}>
              <h1 className="text-[clamp(2.25rem,4.6vw,4rem)] leading-[1.06]">
                {project.heroTitle}
              </h1>
            </Reveal>
          </div>
          <div className="lg:col-span-5">
            <Reveal entrance delay={0.24}>
              <p className="max-w-xl text-[15px] leading-relaxed text-[color:var(--s6-body)] md:text-base">
                {project.heroLead}
              </p>
            </Reveal>
            {project.liveUrl && (
              <Reveal entrance delay={0.3}>
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="s6-button s6-button-outline s6-cs-hero-live mt-8"
                >
                  Visit Live Website
                  <ArrowUpRight size={16} aria-hidden="true" />
                </a>
              </Reveal>
            )}
            <Reveal entrance delay={0.3}>
              <div className="mt-9">
                <CsFacts facts={project.facts} />
              </div>
            </Reveal>

            {project.apps && project.apps.length > 0 && (
              <Reveal entrance delay={0.38}>
                <div className="mt-9">
                  <p className="s6-eyebrow mb-4">Live Applications</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {project.apps.map((app) => (
                      <CsStoreLink key={app.url} appName={app.name} url={app.url} ariaLabel={app.label} />
                    ))}
                  </div>
                </div>
              </Reveal>
            )}
          </div>
        </div>
      </div>

      <div className="s6-container mt-14 md:mt-16">
        <Reveal entrance delay={0.44} effect="image">
          <CsImage image={project.coverImage} priority />
        </Reveal>
      </div>

      <Reveal entrance delay={0.6}>
        <div className="s6-cs-scroll-hint" aria-hidden="true">
          <span className="s6-cs-scroll-line" />
          Scroll
        </div>
      </Reveal>
    </header>
  );
}

function CaseStudySectionLight({ section }: { section: ProjectSection }) {
  switch (section.kind) {
    case "overview":
      return (
        <section className="s6-cs-section" aria-label={section.heading}>
          <Reveal>
            <SectionHeader label={section.label} heading={section.heading} />
          </Reveal>
          <Reveal delay={0.08}>
            <p className="max-w-3xl text-[15px] leading-relaxed text-[color:var(--s6-body)] md:text-base">
              {section.body}
            </p>
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {section.points.map((point, i) => (
              <Reveal key={point.title} delay={i * 0.06} className="h-full">
                <div className="s6-cs-card">
                  <span className="s6-cs-card-index" style={{ color: ACCENTS[i % ACCENTS.length] }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3>{point.title}</h3>
                  <p>{point.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      );

    case "prose":
      return (
        <section className="s6-cs-section" aria-label={section.heading}>
          <Reveal>
            <SectionHeader label={section.label} heading={section.heading} />
          </Reveal>
          <Reveal delay={0.08}>
            <p className="max-w-3xl text-[15px] leading-relaxed text-[color:var(--s6-body)] md:text-base">
              {section.body}
            </p>
          </Reveal>
          {section.steps && section.steps.length > 0 && (
            <ol className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-3">
              {section.steps.map((step, i) => (
                <StaggerItem key={step} delay={0.12 + i * 0.05} className="flex items-center gap-3">
                  <span className="s6-cs-step">{step}</span>
                  {i < section.steps!.length - 1 && (
                    <span className="s6-cs-step-arrow" aria-hidden="true">
                      &rarr;
                    </span>
                  )}
                </StaggerItem>
              ))}
            </ol>
          )}
          {section.features && section.features.length > 0 && (
            <ul className="mt-8 flex max-w-3xl flex-wrap gap-2.5">
              {section.features.map((feature, i) => (
                <StaggerItem key={feature} delay={0.12 + i * 0.04} className="s6-cs-chip">
                  {feature}
                </StaggerItem>
              ))}
            </ul>
          )}
          {section.points && section.points.length > 0 && (
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {section.points.map((point, i) => (
                <Reveal key={point.title} delay={i * 0.08} className="h-full">
                  <div className="s6-cs-card">
                    <span className="s6-cs-card-index" style={{ color: ACCENTS[i % ACCENTS.length] }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3>{point.title}</h3>
                    {point.body && <p>{point.body}</p>}
                    {point.items && point.items.length > 0 && (
                      <ul className="mt-4 space-y-2">
                        {point.items.map((item) => (
                          <li key={item} className="s6-cs-bullet">
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </Reveal>
              ))}
            </div>
          )}
          {section.images && section.images.length > 0 ? (
            <div className="mt-12 space-y-12">
              {section.images.map((image) => (
                <Reveal key={image.src} effect="image">
                  <CsImage image={image} />
                </Reveal>
              ))}
            </div>
          ) : (
            section.image && (
              <div className="mt-12">
                <Reveal effect="image">
                  <CsImage image={section.image} />
                </Reveal>
              </div>
            )
          )}
        </section>
      );

    case "split":
      return (
        <section className="s6-cs-section" aria-label={section.challengeHeading}>
          <Reveal>
            <SectionHeader label={section.label} heading={section.challengeHeading} />
          </Reveal>
          <Reveal delay={0.08}>
            <p className="max-w-3xl text-[15px] leading-relaxed text-[color:var(--s6-body)] md:text-base">
              {section.challenge}
            </p>
          </Reveal>
          <Reveal delay={0.14}>
            <div className="mt-12 border-t pt-10 border-[color:var(--s6-border)]">
              <p className="s6-eyebrow mb-4">The solution</p>
              <h3 className="text-2xl md:text-3xl">{section.solutionHeading}</h3>
              <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-[color:var(--s6-body)] md:text-base">
                {section.solution}
              </p>
            </div>
          </Reveal>
          {section.image && (
            <div className="mt-12">
              <Reveal effect="image">
                <CsImage image={section.image} />
              </Reveal>
            </div>
          )}
        </section>
      );

    case "feature":
      return (
        <section className="s6-cs-section" aria-label={section.heading}>
          <Reveal>
            <SectionHeader label={section.label} heading={section.heading} />
          </Reveal>
          <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
            <Reveal delay={0.08}>
              <p className="text-[15px] leading-relaxed text-[color:var(--s6-body)] md:text-base">
                {section.body}
              </p>
              <ul className="mt-7 space-y-2.5">
                {section.features.map((feature) => (
                  <li key={feature} className="s6-cs-bullet">
                    {feature}
                  </li>
                ))}
              </ul>
              {section.storeLink && (
                <div className="mt-8 max-w-sm">
                  <CsStoreLink
                    appName={section.storeLink.title}
                    url={section.storeLink.url}
                    ariaLabel={section.storeLink.ariaLabel}
                    eyebrow={section.storeLink.eyebrow}
                  />
                </div>
              )}
            </Reveal>
            <Reveal delay={0.12} effect="image">
              <CsImage image={section.image} sizes="(max-width: 768px) 100vw, 40vw" />
            </Reveal>
          </div>
        </section>
      );

    case "engineering":
      return (
        <section className="s6-cs-section" aria-label={section.heading}>
          <Reveal>
            <SectionHeader label={section.label} heading={section.heading} />
          </Reveal>
          <Reveal delay={0.08}>
            <p className="max-w-3xl text-[15px] leading-relaxed text-[color:var(--s6-body)] md:text-base">
              {section.intro}
            </p>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {section.stack.map((item, i) => (
              <Reveal key={item.name} delay={i * 0.05}>
                <div className="s6-cs-tech">
                  <h3>{item.name}</h3>
                  <p>{item.note}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      );

    case "solutions":
      return (
        <section className="s6-cs-section" aria-label={section.heading}>
          <Reveal>
            <SectionHeader label={section.label} heading={section.heading} />
          </Reveal>
          <div className="grid gap-5 md:grid-cols-3">
            {section.blocks.map((block, i) => (
              <Reveal key={block.title} delay={i * 0.08} className="h-full">
                <div className="s6-cs-card">
                  <span className="s6-cs-card-index" style={{ color: ACCENTS[i % ACCENTS.length] }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3>{block.title}</h3>
                  <p>{block.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      );

    case "outcome":
      return (
        <section className="s6-cs-section" aria-label={section.heading}>
          <Reveal>
            <SectionHeader label={section.label} heading={section.heading} />
          </Reveal>
          <Reveal delay={0.08}>
            <p className="max-w-3xl text-[15px] leading-relaxed text-[color:var(--s6-body)] md:text-base">
              {section.body}
            </p>
          </Reveal>
          <div className="mt-12">
            <Reveal effect="image">
              <CsImage image={section.image} />
            </Reveal>
          </div>
        </section>
      );
  }
}

function NextProjectNavigationLight({ current }: { current: Project }) {
  if (projects.length < 2) return null;

  const index = projects.findIndex((p) => p.slug === current.slug);
  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];

  return (
    <nav className="s6-container s6-cs-next" aria-label="More case studies">
      <Link href={`/work/${prev.slug}`} className="s6-cs-next-link">
        <div>
          <span className="s6-cs-next-eyebrow">Previous</span>
          <span className="s6-cs-next-title">{prev.title}</span>
        </div>
        <ArrowLeft className="s6-cs-next-arrow h-6 w-6" strokeWidth={1.5} />
      </Link>
      <Link href={`/work/${next.slug}`} className="s6-cs-next-link">
        <div>
          <span className="s6-cs-next-eyebrow">Next</span>
          <span className="s6-cs-next-title">{next.title}</span>
        </div>
        <ArrowRight className="s6-cs-next-arrow h-6 w-6" strokeWidth={1.5} />
      </Link>
    </nav>
  );
}

// Closing hexagon motif, matching the pattern already used on the homepage
// and expertise-page closing CTAs (six facets in the brand palette with a
// single traced edge once the panel enters view).
const CTA_HEX_CENTER = { x: 170, y: 170 };
const CTA_HEX_VERTICES = [
  [170, 10],
  [308.56, 90],
  [308.56, 250],
  [170, 330],
  [31.44, 250],
  [31.44, 90],
] as const;
const CTA_HEX_COLORS = ["#14a89d", "#282264", "#273990", "#0f75bd", "#24aae3", "#662d90"];

function CtaMotif() {
  const reduce = useHomeReducedMotion();
  const { x: cx, y: cy } = CTA_HEX_CENTER;
  const facets = CTA_HEX_VERTICES.map((point, i) => {
    const next = CTA_HEX_VERTICES[(i + 1) % CTA_HEX_VERTICES.length];
    return `M${cx},${cy} L${point[0]},${point[1]} L${next[0]},${next[1]} Z`;
  });
  return (
    <svg className="s6-cta-motif" viewBox="0 0 340 340" aria-hidden="true">
      {facets.map((d, i) => (
        <motion.path
          key={i}
          d={d}
          fill={CTA_HEX_COLORS[i]}
          initial={reduce ? false : { opacity: 0 }}
          whileInView={{ opacity: 0.22 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, delay: 0.1 + i * 0.06 }}
        />
      ))}
      <motion.path
        d={`M${CTA_HEX_VERTICES[1][0]},${CTA_HEX_VERTICES[1][1]} L${CTA_HEX_VERTICES[2][0]},${CTA_HEX_VERTICES[2][1]}`}
        fill="none"
        stroke="var(--s6-cyan)"
        strokeWidth={2}
        strokeLinecap="round"
        initial={reduce ? false : { pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 0.9 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7, delay: 0.55, ease: motionTokens.easing.gentle }}
      />
    </svg>
  );
}

function ProjectCTALight({ apps, cta }: { apps?: StoreApp[]; cta?: Project["cta"] }) {
  const title = cta?.title ?? "Have a Multi-Platform Product in Mind?";
  const body =
    cta?.body ??
    "We design and develop connected digital products across mobile applications, operational dashboards, payments, and real-time workflows.";
  const eyebrow = cta?.eyebrow ?? "Build with Sage Six";
  const secondaryLabel = cta?.secondaryLabel ?? "View More Work";
  const secondaryHref = cta?.secondaryUrl ?? "/work";
  const secondaryExternal = cta?.secondaryExternal ?? false;

  return (
    <section className="s6-container s6-cta-wrap" aria-label="Start a project">
      <Reveal>
        <div className="s6-cta">
          <CtaMotif />
          <div>
            <p className="s6-eyebrow">{eyebrow}</p>
            <h2>{title}</h2>
            <p>{body}</p>
            <div className="s6-hero-actions">
              <Link href="/contact" className="s6-button s6-button-white">
                Start a Project
                <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
              {secondaryExternal ? (
                <a
                  href={secondaryHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="s6-button s6-button-outline"
                >
                  {secondaryLabel}
                  <ArrowUpRight size={16} aria-hidden="true" />
                </a>
              ) : (
                <Link href={secondaryHref} className="s6-button s6-button-outline">
                  {secondaryLabel}
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </Reveal>

      {apps && apps.length > 0 && (
        <Reveal delay={0.15}>
          <div className="mt-10 border-t pt-8 border-[color:var(--s6-border)]">
            <p className="s6-eyebrow">Explore the live applications</p>
            <div className="mt-5 flex max-w-xl flex-wrap gap-3">
              {apps.map((app) => (
                <CsStoreLink key={app.url} appName={app.name} url={app.url} ariaLabel={app.label} />
              ))}
            </div>
          </div>
        </Reveal>
      )}
    </section>
  );
}

// "Built with" strip — surfaces the project's already-verified technology
// list (Project.technologies) which otherwise only powers metadata. Skipped
// entirely when a project hasn't populated it.
function TechStack({ technologies }: { technologies: Project["technologies"] }) {
  if (!technologies || technologies.length === 0) return null;
  return (
    <section className="s6-cs-section s6-container" aria-labelledby="cs-built-with-heading">
      <Reveal>
        <p id="cs-built-with-heading" className="s6-cs-label">
          Built with
        </p>
      </Reveal>
      <ul className="mt-6 flex flex-wrap gap-4">
        {technologies.map((tech, i) => (
          <StaggerItem key={tech.name} delay={i * 0.05} className="s6-cs-tech-pill">
            <span className="s6-cs-tech-pill-name">{tech.name}</span>
            <span className="s6-cs-tech-pill-note">{tech.note}</span>
          </StaggerItem>
        ))}
      </ul>
    </section>
  );
}

export function CaseStudyLight({ project }: { project: Project }) {
  return (
    <div
      className="s6 s6-home"
      style={{ "--s6-cs-accent": project.accent } as CSSProperties}
    >
      <CaseStudyHeroLight project={project} />

      <div className="s6-container space-y-4 pb-8 pt-4 md:space-y-6 md:pb-12">
        {project.sections.map((section) => (
          <CaseStudySectionLight key={section.label} section={section} />
        ))}
      </div>

      <TechStack technologies={project.technologies} />

      <div className="pb-20 md:pb-28">
        <NextProjectNavigationLight current={project} />
      </div>
      <ProjectCTALight apps={project.apps} cta={project.cta} />
    </div>
  );
}
