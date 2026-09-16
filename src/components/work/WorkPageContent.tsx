"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { Reveal, motionTokens, useHomeReducedMotion } from "@/components/home/motion";
import { CsImage } from "@/components/projects/light/CaseStudyArtwork";
import { ProductImpactPrism } from "@/components/work/ProductImpactPrism";
import type { WorkShowcaseProject } from "@/lib/work-projects";
import {
  workArchitectureLayers,
  workCapabilitySteps,
  workRelationshipPrinciples,
  workSectors,
} from "@/data/work-content";

const arrow = <ArrowRight size={17} aria-hidden="true" />;

// Closing hexagon motif — the same six-facet pattern already duplicated once
// per page (home, expertise, case studies) for their own closing CTAs.
// Following that existing convention rather than introducing a shared
// import across unrelated route trees.
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

function ProjectShowcase({
  showcase,
  index,
}: {
  showcase: WorkShowcaseProject;
  index: number;
}) {
  const { project, supportingLine, capabilities, challenge, solution } = showcase;
  const number = String(index + 1).padStart(2, "0");
  const imageLeft = index % 2 === 1;
  const accentStyle = { "--s6-cs-accent": project.accent } as CSSProperties;

  return (
    <article
      id={index === 0 ? "work-projects" : undefined}
      className="s6-work-project"
      style={accentStyle}
      aria-labelledby={`work-project-${project.slug}-heading`}
    >
      <div className="s6-container">
        <div className={`s6-work-project-grid${imageLeft ? " s6-work-project-grid-reverse" : ""}`}>
          <div className="s6-work-project-copy">
            <Reveal>
              <p className="s6-work-project-eyebrow">
                <span>{number}</span>
                {project.industry}
              </p>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 id={`work-project-${project.slug}-heading`}>{project.title}</h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="s6-work-project-summary">{supportingLine}</p>
            </Reveal>
            <Reveal delay={0.16}>
              <ul className="s6-work-project-tags">
                {capabilities.slice(0, 4).map((tag) => (
                  <li key={tag} className="s6-cs-chip">
                    {tag}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.2}>
              <dl className="s6-work-project-meta">
                <div>
                  <dt>Challenge</dt>
                  <dd>{challenge}</dd>
                </div>
                <div>
                  <dt>Sage Six solution</dt>
                  <dd>{solution}</dd>
                </div>
              </dl>
            </Reveal>
            <Reveal delay={0.26}>
              <Link href={`/work/${project.slug}`} className="s6-work-project-cta">
                View {project.title} case study
                <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
            </Reveal>
          </div>

          <Reveal delay={0.1} effect="image" className="s6-work-project-art">
            <CsImage image={project.coverImage} priority={index === 0} />
          </Reveal>
        </div>
      </div>
    </article>
  );
}

function SectorCard({ sector, index }: { sector: (typeof workSectors)[number]; index: number }) {
  return (
    <Reveal delay={index * 0.08} className="h-full">
      <div className="s6-cs-card s6-work-sector-card">
        <span className="s6-cs-card-index" style={{ color: CTA_HEX_COLORS[index] }}>
          {String(index + 1).padStart(2, "0")}
        </span>
        <h3>{sector.label}</h3>
        <dl>
          <div>
            <dt>Challenge</dt>
            <dd>{sector.challenge}</dd>
          </div>
          <div>
            <dt>Users</dt>
            <dd>{sector.users}</dd>
          </div>
          <div>
            <dt>System response</dt>
            <dd>{sector.response}</dd>
          </div>
        </dl>
      </div>
    </Reveal>
  );
}

export function WorkPageContent({ showcaseProjects }: { showcaseProjects: WorkShowcaseProject[] }) {
  return (
    <div className="s6 s6-home s6-work">
      {/* ---------- Hero ---------- */}
      <section className="s6-work-hero s6-container" aria-labelledby="work-heading">
        <div className="s6-work-hero-copy">
          <Reveal entrance>
            <p className="s6-eyebrow">SELECTED WORK / DIGITAL PRODUCTS</p>
          </Reveal>
          <Reveal entrance delay={0.1}>
            <h1 id="work-heading">Products designed for real businesses, real users and real growth.</h1>
          </Reveal>
          <Reveal entrance delay={0.2}>
            <p className="s6-work-hero-lead">
              Explore selected mobile applications, web platforms and custom software systems
              designed and developed by Sage Six across commerce, manufacturing, healthcare and
              professional communities.
            </p>
          </Reveal>
          <Reveal entrance delay={0.28}>
            <div className="s6-hero-actions">
              <a href="#work-projects" className="s6-button">
                Explore the work {arrow}
              </a>
              <Link href="/contact" className="s6-button s6-button-outline">
                Start a project {arrow}
              </Link>
            </div>
          </Reveal>
        </div>
        <Reveal entrance delay={0.3}>
          <ProductImpactPrism />
        </Reveal>
      </section>

      {/* ---------- Capability journey ---------- */}
      <section className="s6-section s6-container" aria-labelledby="work-capability-heading">
        <Reveal>
          <p className="s6-eyebrow">ONE TEAM / COMPLETE PRODUCT DELIVERY</p>
          <h2 id="work-capability-heading" className="s6-work-heading-md">
            From product direction to dependable delivery.
          </h2>
          <p className="s6-section-intro">
            Our work connects product thinking, interface design, frontend and backend
            engineering, integrations, deployment and ongoing technical support.
          </p>
        </Reveal>
        <Reveal delay={0.12}>
          <ol className="s6-work-journey">
            {workCapabilitySteps.map((step, i) => (
              <li key={step.title} className="s6-work-journey-step">
                <span className="s6-work-journey-index">{String(i + 1).padStart(2, "0")}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </li>
            ))}
          </ol>
        </Reveal>
      </section>

      {/* ---------- Selected projects ---------- */}
      <section aria-labelledby="work-projects-heading">
        <div className="s6-container">
          <Reveal>
            <p className="s6-eyebrow">CASE STUDIES</p>
            <h2 id="work-projects-heading" className="s6-work-heading-md">
              Different industries. The same engineering discipline.
            </h2>
            <p className="s6-section-intro">
              Each project begins with a different business challenge. Our role is to turn that
              complexity into a focused, usable and maintainable digital product.
            </p>
          </Reveal>
        </div>

        {showcaseProjects.map((showcase, i) => (
          <ProjectShowcase key={showcase.project.slug} showcase={showcase} index={i} />
        ))}
      </section>

      {/* ---------- Cross-sector experience ---------- */}
      <section className="s6-section s6-container" aria-labelledby="work-sectors-heading">
        <Reveal>
          <p className="s6-eyebrow">CROSS-SECTOR EXPERIENCE</p>
          <h2 id="work-sectors-heading" className="s6-work-heading-md">
            Different industries demand different systems.
          </h2>
          <p className="s6-section-intro">
            The interface, workflows and technology should respond to the business — not force
            every organisation into the same template.
          </p>
        </Reveal>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {workSectors.map((sector, i) => (
            <SectorCard key={sector.slug} sector={sector} index={i} />
          ))}
        </div>
      </section>

      {/* ---------- Product architecture ---------- */}
      <section className="s6-section s6-work-architecture-section" aria-labelledby="work-architecture-heading">
        <div className="s6-container">
          <Reveal>
            <h2 id="work-architecture-heading" className="s6-work-heading-md">
              Designed as a product. Engineered as a system.
            </h2>
          </Reveal>
          <ol className="s6-work-architecture">
            {workArchitectureLayers.map((layer, i) => (
              <Reveal key={layer.title} delay={i * 0.06}>
                <li className="s6-work-architecture-layer">
                  <span className="s6-work-architecture-index">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3>{layer.title}</h3>
                    <p>{layer.body}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- How we work ---------- */}
      <section className="s6-section s6-container" aria-labelledby="work-trust-heading">
        <Reveal>
          <p className="s6-eyebrow">HOW WE WORK</p>
          <h2 id="work-trust-heading" className="s6-work-heading-md">
            A clear process. A collaborative relationship.
          </h2>
          <p className="s6-section-intro">
            We work closely with clients to understand the business, clarify priorities and
            deliver software that can evolve after launch.
          </p>
        </Reveal>
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {workRelationshipPrinciples.map((principle, i) => (
            <Reveal key={principle.title} delay={i * 0.06} className="h-full">
              <div className="s6-cs-card">
                <h3>{principle.title}</h3>
                <p>{principle.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- Final CTA ---------- */}
      <section className="s6-container s6-cta-wrap" aria-label="Start a project">
        <Reveal>
          <div className="s6-cta">
            <CtaMotif />
            <div>
              <p className="s6-eyebrow">YOUR NEXT PRODUCT</p>
              <h2>Bring us the challenge. We&rsquo;ll help shape the right digital product.</h2>
              <p>
                Whether you are planning a mobile application, modernising a web platform or
                connecting complex business workflows, start with a conversation. We&rsquo;ll help
                clarify the requirements, technical direction and smartest route forward.
              </p>
              <p className="s6-work-cta-note">
                Mobile apps · Web platforms · Custom software · AI solutions · Technical support
              </p>
            </div>
            <Reveal delay={0.15} className="s6-cta-actions">
              <Link href="/contact" className="s6-button s6-button-white">
                Start a conversation {arrow}
              </Link>
              <a className="s6-cta-email" href="mailto:hello@sagesix.co.uk">
                hello@sagesix.co.uk
              </a>
              <button
                type="button"
                className="s6-work-cta-assistant"
                onClick={() => window.dispatchEvent(new CustomEvent("sagesix:open-assistant"))}
              >
                Ask Sage Six
              </button>
            </Reveal>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
