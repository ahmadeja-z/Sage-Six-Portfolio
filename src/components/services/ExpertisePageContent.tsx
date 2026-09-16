"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  Smartphone,
  PanelsTopLeft,
  LayoutDashboard,
  Cpu,
  PenTool,
  LifeBuoy,
  Users,
  Plus,
  type LucideIcon,
} from "lucide-react";
import type { Service } from "@/types";
import { Reveal, motionTokens, useHomeReducedMotion } from "@/components/home/motion";
import { TechOrbit } from "@/components/services/TechOrbit";

const arrow = <ArrowRight size={17} aria-hidden="true" />;

const serviceIcons: Record<string, LucideIcon> = {
  "mobile-app-development": Smartphone,
  "website-development": PanelsTopLeft,
  "web-applications": LayoutDashboard,
  "ai-automation": Cpu,
  "product-design": PenTool,
  "technical-support": LifeBuoy,
  "team-extension": Users,
};

export type ResolvedService = Service & {
  caseStudyInfo?: { slug: string; title: string };
  insightInfo?: { slug: string; title: string };
};

type EngagementOption = { title: string; suitable: string; working: string };
type DeliveryStep = { title: string; text: string };
type FaqItem = { q: string; a: string };
type PracticeProject = {
  slug: string;
  title: string;
  shortDescription: string;
  coverImage: { src: string; alt: string; width: number; height: number };
};

// Closing CTA accent: a hexagon split into six triangular facets, echoing
// the Sage Six logo's six-colour identity, with a single cyan line tracing
// an edge toward the CTA once the panel enters view — the one deliberately
// expressive geometric moment on this page.
const CLOSING_HEX_CENTER = { x: 170, y: 170 };
const CLOSING_HEX_VERTICES = [
  [170, 10],
  [308.56, 90],
  [308.56, 250],
  [170, 330],
  [31.44, 250],
  [31.44, 90],
] as const;
const CLOSING_HEX_COLORS = [
  "#14a89d",
  "#282264",
  "#273990",
  "#0f75bd",
  "#24aae3",
  "#662d90",
];

function ClosingMotif() {
  const reduce = useHomeReducedMotion();
  const scope = useRef<SVGSVGElement>(null);
  const inView = useInView(scope, { once: true, amount: 0.4 });
  const play = inView && !reduce;
  const { x: cx, y: cy } = CLOSING_HEX_CENTER;
  const facets = CLOSING_HEX_VERTICES.map((point, i) => {
    const next = CLOSING_HEX_VERTICES[(i + 1) % CLOSING_HEX_VERTICES.length];
    return `M${cx},${cy} L${point[0]},${point[1]} L${next[0]},${next[1]} Z`;
  });
  return (
    <svg
      ref={scope}
      className="s6-cta-motif"
      viewBox="0 0 340 340"
      aria-hidden="true"
    >
      {facets.map((d, i) => (
        <motion.path
          key={i}
          d={d}
          fill={CLOSING_HEX_COLORS[i]}
          initial={reduce ? false : { opacity: 0 }}
          animate={play ? { opacity: 0.22 } : reduce ? { opacity: 0.22 } : {}}
          transition={{ duration: 0.6, delay: 0.1 + i * 0.06 }}
        />
      ))}
      <motion.path
        d={`M${CLOSING_HEX_VERTICES[1][0]},${CLOSING_HEX_VERTICES[1][1]} L${CLOSING_HEX_VERTICES[2][0]},${CLOSING_HEX_VERTICES[2][1]}`}
        fill="none"
        stroke="var(--s6-cyan)"
        strokeWidth={2}
        strokeLinecap="round"
        initial={reduce ? false : { pathLength: 0, opacity: 0 }}
        animate={
          play ? { pathLength: 1, opacity: 0.9 } : reduce ? { opacity: 0.9 } : {}
        }
        transition={{ duration: 0.7, delay: 0.55, ease: motionTokens.easing.gentle }}
      />
    </svg>
  );
}

function ServiceCard({
  service,
  index,
}: {
  service: ResolvedService;
  index: number;
}) {
  const Icon = serviceIcons[service.anchor] ?? Smartphone;
  return (
    <li id={service.anchor} className="s6-expertise-anchor">
      <Reveal delay={(index % 3) * 0.05} className="h-full">
        <article className="s6-expertise-card">
          <div className="s6-expertise-card-head">
            <span className="s6-expertise-icon">
              <Icon size={22} strokeWidth={1.5} aria-hidden="true" />
            </span>
            <span className="s6-expertise-index">{service.index}</span>
          </div>
          <div className="s6-expertise-card-body">
            <div>
              <h2>{service.title}</h2>
              <p className="s6-expertise-copy">{service.intro}</p>
              {service.supporting && (
                <p className="s6-expertise-copy s6-expertise-supporting">
                  {service.supporting}
                </p>
              )}
              <p className="s6-expertise-fit">
                <span className="s6-expertise-label">Best fit</span>{" "}
                {service.bestFit}
              </p>
              {service.howItWorks && (
                <div className="s6-expertise-sublist">
                  <p className="s6-expertise-label">How it works</p>
                  <ul>
                    {service.howItWorks.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="s6-expertise-actions">
                <Link
                  href={`/contact?service=${service.anchor}`}
                  className="s6-button"
                >
                  {service.cta} {arrow}
                </Link>
                {service.caseStudyInfo && (
                  <Link
                    href={`/work/${service.caseStudyInfo.slug}`}
                    className="s6-text-link"
                  >
                    Relevant work: {service.caseStudyInfo.title}
                    <ArrowUpRight size={15} aria-hidden="true" />
                  </Link>
                )}
                {service.insightInfo && (
                  <Link
                    href={`/insights/${service.insightInfo.slug}`}
                    className="s6-text-link s6-text-link-muted"
                  >
                    Guide: {service.insightInfo.title}
                    <ArrowRight size={15} aria-hidden="true" />
                  </Link>
                )}
              </div>
            </div>
            {service.scope && service.scope.length > 0 && (
              <div className="s6-expertise-scope">
                <p className="s6-expertise-label">
                  What an engagement can include
                </p>
                <ul>
                  {service.scope.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </article>
      </Reveal>
    </li>
  );
}

export function ExpertisePageContent({
  services,
  engagementOptions,
  deliverySteps,
  faqs,
  practiceProjects,
}: {
  services: ResolvedService[];
  engagementOptions: EngagementOption[];
  deliverySteps: DeliveryStep[];
  faqs: FaqItem[];
  practiceProjects: PracticeProject[];
}) {
  return (
    <div className="s6 s6-home s6-expertise">
      <section
        className="s6-expertise-hero s6-container"
        aria-labelledby="expertise-heading"
      >
        <div className="s6-expertise-hero-copy">
          <Reveal entrance delay={0.05}>
            <p className="s6-eyebrow">OUR EXPERTISE</p>
          </Reveal>
          <h1 id="expertise-heading">
            <Reveal entrance delay={0.12}>Expertise built </Reveal>
            <Reveal entrance delay={0.2}>around your business.</Reveal>
          </h1>
          <Reveal entrance delay={0.3}>
            <p className="s6-expertise-intro">
              Sage Six helps businesses plan, design, build and maintain
              mobile applications, websites and custom software. We also
              support existing products and extend in-house teams with
              development expertise matched to the work.
            </p>
          </Reveal>
          <Reveal entrance delay={0.36}>
            <p className="s6-expertise-intro">
              Start with a new idea, improve a product already in use, or
              bring additional technical support into your team.
            </p>
          </Reveal>
          <Reveal entrance delay={0.42}>
            <div className="s6-hero-actions">
              <Link href="/contact" className="s6-button">
                Discuss your project {arrow}
              </Link>
              <a href="#services" className="s6-button s6-button-outline">
                Explore our expertise {arrow}
              </a>
            </div>
          </Reveal>
        </div>
        <TechOrbit />
      </section>

      <section
        id="services"
        className="s6-section s6-container scroll-mt-28"
        aria-label="Our expertise"
      >
        <ol className="s6-expertise-list">
          {services.map((service, i) => (
            <ServiceCard key={service.anchor} service={service} index={i} />
          ))}
        </ol>
      </section>

      <section
        className="s6-section s6-expertise-engagement"
        aria-label="Engagement options"
      >
        <div className="s6-container">
          <Reveal>
            <div className="s6-section-header">
              <div>
                <p className="s6-eyebrow">ENGAGEMENT</p>
                <h2>Choose the support your business needs.</h2>
              </div>
            </div>
            <p className="s6-section-intro">
              We can take responsibility for an agreed project, support
              software already in use, or contribute development expertise
              alongside your existing team.
            </p>
          </Reveal>
          <div className="s6-engagement-grid">
            {engagementOptions.map((opt, i) => (
              <Reveal key={opt.title} delay={i * 0.06} className="h-full">
                <div className="s6-engagement-card">
                  <h3>{opt.title}</h3>
                  <p>
                    <span className="s6-expertise-label">Suitable when</span>
                    {opt.suitable}
                  </p>
                  <p>
                    <span className="s6-expertise-label">
                      Working arrangement
                    </span>
                    {opt.working}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="s6-section s6-container" aria-label="Delivery and quality">
        <Reveal>
          <div className="s6-section-header">
            <div>
              <p className="s6-eyebrow">PROCESS</p>
              <h2>Clear steps. Shared decisions. Visible progress.</h2>
            </div>
          </div>
          <p className="s6-section-intro">
            Every engagement starts with understanding the work and agreeing
            how it will be delivered. We define responsibilities, review
            progress against the scope and make room for feedback before the
            next stage.
          </p>
        </Reveal>
        <ol className="s6-delivery-grid">
          {deliverySteps.map((step, i) => (
            <li key={step.title}>
              <Reveal delay={i * 0.06} className="h-full">
                <div className="s6-delivery-card">
                  <span className="s6-expertise-index">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
        <Reveal delay={0.1}>
          <p className="s6-expertise-footnote">
            Testing, code review, documentation and release preparation are
            planned around the product and engagement. We make expectations
            visible so you understand what has been checked and what remains
            to be addressed.
          </p>
        </Reveal>
      </section>

      <section
        className="s6-section s6-expertise-practice"
        aria-label="Expertise in practice"
      >
        <div className="s6-container">
          <Reveal>
            <div className="s6-section-header">
              <div>
                <p className="s6-eyebrow">IN PRACTICE</p>
                <h2>See the expertise in practice.</h2>
              </div>
              <Link href="/work" className="s6-text-link">
                View all work {arrow}
              </Link>
            </div>
          </Reveal>
          <div className="s6-expertise-projects">
            {practiceProjects.map((project, i) => (
              <Reveal key={project.slug} delay={i * 0.08} className="h-full">
                <article className="s6-project">
                  <Link href={`/work/${project.slug}`}>
                    <div className="s6-project-image">
                      <div>
                        <Image
                          src={project.coverImage.src}
                          alt={project.coverImage.alt}
                          width={project.coverImage.width}
                          height={project.coverImage.height}
                          sizes="(max-width: 1099px) 92vw, 30vw"
                          loading="lazy"
                        />
                      </div>
                    </div>
                    <div className="s6-project-copy">
                      <h3>{project.title}</h3>
                      <p>{project.shortDescription}</p>
                      <span className="s6-project-action">
                        View case study {arrow}
                      </span>
                    </div>
                  </Link>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="s6-section s6-container" aria-label="Expertise questions">
        <Reveal>
          <div className="s6-section-header">
            <div>
              <p className="s6-eyebrow">QUESTIONS</p>
              <h2>Common questions about working with Sage Six</h2>
            </div>
          </div>
        </Reveal>
        <div className="s6-faq-list">
          {faqs.map((faq, i) => (
            <Reveal key={faq.q} delay={(i % 4) * 0.04}>
              <details className="s6-faq-item">
                <summary>
                  {faq.q}
                  <Plus size={18} className="s6-faq-icon" aria-hidden="true" />
                </summary>
                <p>{faq.a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </section>

      <section
        className="s6-container s6-cta-wrap"
        aria-labelledby="expertise-cta-heading"
      >
        <Reveal>
          <div className="s6-cta">
            <ClosingMotif />
            <div>
              <p className="s6-eyebrow">YOUR NEXT CHAPTER STARTS HERE</p>
              <h2 id="expertise-cta-heading">
                <Reveal>What does your </Reveal>
                <Reveal delay={0.1}>business need next?</Reveal>
              </h2>
              <Reveal delay={0.18}>
                <p>
                  A new application, a stronger website, support for existing
                  software, or additional development capacity — tell us
                  where you need help, and we&apos;ll work through the next
                  step together.
                </p>
              </Reveal>
            </div>
            <Reveal delay={0.26} className="s6-cta-actions">
              <Link href="/contact" className="s6-button s6-button-white">
                Discuss your requirements {arrow}
              </Link>
              <a href="mailto:hello@sagesix.co.uk" className="s6-cta-email">
                hello@sagesix.co.uk
              </a>
            </Reveal>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
