"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Reveal, motionTokens, useHomeReducedMotion } from "@/components/home/motion";
import { CsImage } from "@/components/projects/light/CaseStudyArtwork";
import { CompanySystemVisual } from "@/components/company/CompanySystemVisual";
import { homeServices } from "@/data/content";
import { workSectors } from "@/data/work-content";
import {
  aboutArchitectureLayers,
  aboutEvidence,
  aboutJourneyStages,
  aboutPrinciples,
  aboutSupportCapabilities,
} from "@/data/about-content";
import type { Project } from "@/types";

const arrow = <ArrowRight size={17} aria-hidden="true" />;

// Closing hexagon motif — the same six-facet pattern already duplicated once
// per page (home, expertise, case studies, work) for their own closing CTAs.
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

function SectorCard({ sector, index }: { sector: (typeof workSectors)[number]; index: number }) {
  return (
    <Reveal delay={index * 0.08} className="h-full">
      <Link href={`/work/${sector.slug}`} className="s6-cs-card s6-about-sector-card">
        <span className="s6-cs-card-index" style={{ color: CTA_HEX_COLORS[index] }}>
          {String(index + 1).padStart(2, "0")}
        </span>
        <h3>{sector.label}</h3>
        <p>{sector.response}</p>
        <span className="s6-about-sector-link">
          View case study
          <ArrowUpRight size={14} aria-hidden="true" />
        </span>
      </Link>
    </Reveal>
  );
}

function ProjectRow({ project, index }: { project: Project; index: number }) {
  return (
    <Reveal delay={index * 0.06}>
      <Link href={`/work/${project.slug}`} className="s6-about-proof-row">
        <div className="s6-about-proof-thumb">
          <CsImage image={project.coverImage} sizes="(max-width: 768px) 100vw, 160px" />
        </div>
        <div className="s6-about-proof-copy">
          <span className="s6-about-proof-category">{project.category}</span>
          <h3>{project.title}</h3>
          <p>{project.shortDescription}</p>
        </div>
        <ArrowUpRight className="s6-about-proof-arrow" size={18} aria-hidden="true" />
      </Link>
    </Reveal>
  );
}

export function CompanyPageContent({ featuredProjects }: { featuredProjects: Project[] }) {
  return (
    <div className="s6 s6-home s6-about">
      {/* ---------- Hero ---------- */}
      <section className="s6-work-hero s6-container" aria-labelledby="about-heading">
        <div className="s6-work-hero-copy">
          <Reveal entrance>
            <p className="s6-eyebrow">COMPANY / SAGE SIX</p>
          </Reveal>
          <Reveal entrance delay={0.1}>
            <h1 id="about-heading">Software built around the business it needs to move.</h1>
          </Reveal>
          <Reveal entrance delay={0.2}>
            <p className="s6-work-hero-lead">
              Sage Six is a product design and software engineering company creating mobile
              applications, web platforms, custom business systems and AI-enabled solutions for
              organisations ready to improve how they operate and grow.
            </p>
          </Reveal>
          <Reveal entrance delay={0.28}>
            <div className="s6-hero-actions">
              <Link href="/work" className="s6-button">
                Explore our work {arrow}
              </Link>
              <Link href="/contact" className="s6-button s6-button-outline">
                Start a conversation {arrow}
              </Link>
            </div>
          </Reveal>
        </div>
        <Reveal entrance delay={0.32}>
          <CompanySystemVisual />
        </Reveal>
      </section>

      {/* ---------- Who we are ---------- */}
      <section className="s6-section s6-container" aria-labelledby="about-who-heading">
        <Reveal>
          <p className="s6-eyebrow">WHO WE ARE</p>
          <h2 id="about-who-heading" className="s6-work-heading-md">
            A focused team for ambitious digital products.
          </h2>
        </Reveal>
        <div className="mt-8 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal delay={0.06}>
              <p className="max-w-2xl text-[15px] leading-relaxed text-[color:var(--s6-body)] md:text-base">
                Every business has its own customers, challenges and ways of working. We take the
                time to understand that context before deciding what to build.
              </p>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-[color:var(--s6-body)] md:text-base">
                Our work brings strategy, interface design and development into one connected
                process. We help clients define the right scope, make informed technology
                decisions and turn complex requirements into experiences people can navigate with
                confidence.
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-[color:var(--s6-body)] md:text-base">
                Whether the project is a customer-facing app, a company website or an internal
                management platform, our starting point is the same: understand the purpose, then
                build around it.
              </p>
            </Reveal>
          </div>
          <div className="lg:col-span-5">
            <Reveal delay={0.16}>
              <p className="s6-eyebrow mb-4">What we combine</p>
              <ul className="flex flex-wrap gap-2.5">
                {homeServices.map((service) => (
                  <li key={service.title} className="s6-cs-chip">
                    {service.title}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------- Principles ---------- */}
      <section className="s6-section s6-work-architecture-section" aria-labelledby="about-principles-heading">
        <div className="s6-container">
          <Reveal>
            <p className="s6-eyebrow">WHAT GUIDES THE WORK</p>
            <h2 id="about-principles-heading" className="s6-work-heading-md">
              Clarity in the process. Purpose in the product.
            </h2>
          </Reveal>
          <ol className="s6-work-architecture mt-8">
            {aboutPrinciples.map((principle, i) => (
              <Reveal key={principle.title} delay={i * 0.06}>
                <li className="s6-work-architecture-layer">
                  <span className="s6-work-architecture-index">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3>{principle.title}</h3>
                    <p>{principle.body}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- Client relationships / journey ---------- */}
      <section className="s6-section s6-container" aria-labelledby="about-journey-heading">
        <Reveal>
          <p className="s6-eyebrow">CLIENT RELATIONSHIPS</p>
          <h2 id="about-journey-heading" className="s6-work-heading-md">
            Close collaboration from first conversation to long-term support.
          </h2>
          <p className="s6-section-intro">
            Strong software comes from shared understanding. We keep communication direct, make
            progress visible and involve clients in the decisions that shape their product — and
            we discuss trade-offs openly whenever priorities change.
          </p>
        </Reveal>
        <Reveal delay={0.12}>
          <ol className="s6-work-journey">
            {aboutJourneyStages.map((stage, i) => (
              <li key={stage.title} className="s6-work-journey-step">
                <span className="s6-work-journey-index">{String(i + 1).padStart(2, "0")}</span>
                <h3>{stage.title}</h3>
                <p>{stage.body}</p>
              </li>
            ))}
          </ol>
        </Reveal>
      </section>

      {/* ---------- Delivery experience ---------- */}
      <section className="s6-work-architecture-section" aria-labelledby="about-evidence-heading">
        <div className="s6-container s6-section">
          <Reveal>
            <p className="s6-eyebrow">DELIVERY EXPERIENCE</p>
            <h2 id="about-evidence-heading" className="s6-work-heading-md">
              Experience across products, platforms and industries.
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {aboutEvidence.map((item, i) => (
              <Reveal key={item.label} delay={i * 0.06} className="h-full">
                <div className="s6-about-evidence-item">
                  <span className="s6-about-evidence-value">{item.value}</span>
                  <span className="s6-about-evidence-label">{item.label}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Cross-sector perspective ---------- */}
      <section className="s6-section s6-container" aria-labelledby="about-sectors-heading">
        <Reveal>
          <p className="s6-eyebrow">INDUSTRIES</p>
          <h2 id="about-sectors-heading" className="s6-work-heading-md">
            Different businesses. Different workflows. The same engineering discipline.
          </h2>
          <p className="s6-section-intro">
            Every sector brings different users, operational pressures and technical
            requirements. Our approach adapts to the organisation while maintaining the same
            standards of clarity, maintainability and product quality.
          </p>
        </Reveal>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {workSectors.map((sector, i) => (
            <SectorCard key={sector.slug} sector={sector} index={i} />
          ))}
        </div>
      </section>

      {/* ---------- Delivery architecture ---------- */}
      <section className="s6-work-architecture-section" aria-labelledby="about-architecture-heading">
        <div className="s6-container s6-section">
          <Reveal>
            <p className="s6-eyebrow">HOW THE WORK CONNECTS</p>
            <h2 id="about-architecture-heading" className="s6-work-heading-md">
              One connected approach to digital product delivery.
            </h2>
          </Reveal>
          <ol className="s6-work-architecture mt-8">
            {aboutArchitectureLayers.map((layer, i) => (
              <Reveal key={layer.title} delay={i * 0.06}>
                <li className="s6-work-architecture-layer s6-about-architecture-layer">
                  <span className="s6-work-architecture-index">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3>{layer.title}</h3>
                    <p>{layer.body}</p>
                    <ul className="s6-about-outputs">
                      {layer.outputs.map((output) => (
                        <li key={output} className="s6-cs-chip">
                          {output}
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- Selected proof ---------- */}
      <section className="s6-section s6-container" aria-labelledby="about-proof-heading">
        <Reveal>
          <p className="s6-eyebrow">SELECTED WORK</p>
          <h2 id="about-proof-heading" className="s6-work-heading-md">
            The work behind the company.
          </h2>
        </Reveal>
        <div className="mt-8 flex flex-col gap-4">
          {featuredProjects.map((project, i) => (
            <ProjectRow key={project.slug} project={project} index={i} />
          ))}
        </div>
        <Reveal delay={0.2}>
          <Link href="/work" className="s6-about-proof-more">
            View all work
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </Reveal>
      </section>

      {/* ---------- Support beyond launch ---------- */}
      <section className="s6-section s6-container" aria-labelledby="about-support-heading">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="s6-eyebrow">TECHNICAL PARTNERSHIP</p>
              <h2 id="about-support-heading" className="s6-work-heading-md">
                Delivery does not have to end at launch.
              </h2>
              <p className="s6-section-intro">
                Digital products continue to change after release. Sage Six can remain involved
                to resolve issues, improve performance, extend functionality and support the
                product as the business evolves.
              </p>
            </Reveal>
          </div>
          <div className="lg:col-span-5">
            <Reveal delay={0.12}>
              <ul className="flex flex-wrap gap-2.5">
                {aboutSupportCapabilities.map((item) => (
                  <li key={item} className="s6-cs-chip">
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------- Final CTA ---------- */}
      <section className="s6-container s6-cta-wrap" aria-label="Start a conversation">
        <Reveal>
          <div className="s6-cta">
            <CtaMotif />
            <div>
              <p className="s6-eyebrow">START WITH THE CHALLENGE</p>
              <h2>Tell us what needs to work better.</h2>
              <p>
                Whether you are shaping a new product, replacing an outdated system or connecting
                complex business workflows, we can help clarify the requirements and identify the
                smartest route forward.
              </p>
            </div>
            <Reveal delay={0.15} className="s6-cta-actions">
              <Link href="/contact" className="s6-button s6-button-white">
                Start a conversation {arrow}
              </Link>
              <Link href="/work" className="s6-button s6-button-outline">
                Explore our work {arrow}
              </Link>
              <a className="s6-cta-email" href="mailto:hello@sagesix.co.uk">
                hello@sagesix.co.uk
              </a>
            </Reveal>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
