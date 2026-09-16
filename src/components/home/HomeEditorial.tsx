"use client";

import { useEffect, useRef, useState, type FocusEvent } from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useInView,
} from "motion/react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import {
  studioPrinciples,
  serviceCapabilities,
  developmentSteps,
  type HomeInsight,
} from "@/data/home-editorial";
import { homeTechnologies, type Technology } from "@/data/home-technologies";
import { Reveal, motionTokens, useHomeReducedMotion } from "./motion";

const MotionLink = motion.create(Link);

function EditorialLink({
  title,
  description,
  index,
  href,
  category,
}: {
  title: string;
  description?: string;
  index: number;
  href: string;
  category?: string;
}) {
  const reduce = useHomeReducedMotion();
  const [active, setActive] = useState(false);
  return (
    <MotionLink
      href={href}
      className="s6-editorial-row"
      onHoverStart={() => setActive(true)}
      onHoverEnd={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
      whileTap={reduce ? undefined : { backgroundColor: "#f0f5fb" }}
    >
      <motion.span
        className="s6-row-number"
        animate={{ x: active && !reduce ? 4 : 0 }}
        transition={{ duration: motionTokens.duration.fast }}
      >
        0{index + 1}
      </motion.span>
      <div className="s6-row-title">
        {category && <span className="s6-row-category">{category}</span>}
        <h3>{title}</h3>
      </div>
      {description && <p>{description}</p>}
      <motion.span
        className="s6-row-arrow"
        animate={{ x: active && !reduce ? 5 : 0 }}
        transition={{ duration: motionTokens.duration.fast }}
      >
        <ArrowUpRight size={22} strokeWidth={1.4} aria-hidden="true" />
      </motion.span>
    </MotionLink>
  );
}

export function StudioIntroduction() {
  return (
    <section
      id="studio"
      className="s6-studio s6-section"
      aria-labelledby="studio-heading"
    >
      <div className="s6-container">
        <div className="s6-studio-intro">
          <Reveal>
            <p className="s6-eyebrow">ABOUT SAGE SIX</p>
            <h2 id="studio-heading">
              A focused team building ambitious digital products.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p>
              Sage Six is a software and AI company helping businesses turn
              ideas into reliable digital products. We stay close to the work,
              communicate clearly, and build with the long term in mind.
            </p>
            <Link href="/company" className="s6-text-link">
              Meet Sage Six <ArrowRight size={19} aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
        <Reveal effect="line" className="s6-drawn-divider">
          <span />
        </Reveal>
        <div className="s6-principles">
          {studioPrinciples.map((principle, i) => (
            <Reveal key={principle.title} delay={i * 0.05}>
              <div className="s6-principle">
                <span className="s6-principle-number">0{i + 1}</span>
                <h3>{principle.title}</h3>
                <p>{principle.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ServicesCapabilities() {
  return (
    <section
      id="capabilities"
      className="s6-section s6-container"
      aria-labelledby="capabilities-heading"
    >
      <Reveal>
        <div className="s6-section-header">
          <div>
            <p className="s6-eyebrow">HOW WE CAN HELP</p>
            <h2 id="capabilities-heading">
              From the first build
              <br />
              to ongoing support.
            </h2>
          </div>
          <p className="s6-section-intro">
            Work with Sage Six on a new product, an existing platform, or the
            next stage of growth.
          </p>
        </div>
      </Reveal>
      <div className="s6-services-list">
        {serviceCapabilities.map((service, i) => (
          <Reveal key={service.title} delay={i * 0.03}>
            <EditorialLink {...service} index={i} href="/expertise" />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

// Kept slightly different so the two rows read as one composed display
// rather than a mechanically mirrored pair.
const TECH_SECONDS_PER_ITEM_TOP = 9;
const TECH_SECONDS_PER_ITEM_BOTTOM = 10.5;

function TechIcon({ technology }: { technology: Technology }) {
  return (
    <svg
      viewBox={technology.icon.viewBox}
      className="s6-tech-icon"
      aria-hidden="true"
    >
      {technology.icon.paths.map((d, i) => (
        <path key={i} d={d} fill="currentColor" />
      ))}
    </svg>
  );
}

function TechPill({
  technology,
  duplicate = false,
}: {
  technology: Technology;
  duplicate?: boolean;
}) {
  if (technology.caseStudySlug) {
    return (
      <Link
        href={`/work/${technology.caseStudySlug}`}
        className="s6-tech-pill"
        aria-hidden={duplicate || undefined}
        inert={duplicate || undefined}
        tabIndex={duplicate ? -1 : undefined}
      >
        <TechIcon technology={technology} />
        <span>{technology.name}</span>
        <span className="sr-only"> — view case study</span>
      </Link>
    );
  }
  return (
    <span
      className="s6-tech-pill"
      aria-hidden={duplicate || undefined}
      inert={duplicate || undefined}
    >
      <TechIcon technology={technology} />
      <span>{technology.name}</span>
    </span>
  );
}

function TechRow({
  items,
  secondsPerItem,
  reverse,
  running,
  animated,
}: {
  items: Technology[];
  secondsPerItem: number;
  reverse: boolean;
  running: boolean;
  animated: boolean;
}) {
  return (
    <div className="s6-tech-marquee" data-animated={animated}>
      <div
        className="s6-tech-track"
        data-running={running}
        style={{
          animationDirection: reverse ? "reverse" : "normal",
          ["--s6-tech-duration" as string]: `${items.length * secondsPerItem}s`,
        }}
      >
        {items.map((technology) => (
          <TechPill key={technology.name} technology={technology} />
        ))}
        {animated &&
          items.map((technology) => (
            <TechPill
              key={`dup-${technology.name}`}
              technology={technology}
              duplicate
            />
          ))}
      </div>
    </div>
  );
}

export function TechnologyStrip() {
  const reduce = useHomeReducedMotion();
  const wrapper = useRef<HTMLDivElement>(null);
  const inView = useInView(wrapper, { amount: 0.2 });
  const [interacting, setInteracting] = useState(false);
  const [tabHidden, setTabHidden] = useState(false);
  useEffect(() => {
    const update = () => setTabHidden(document.hidden);
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);
  const animated = !reduce;
  const running = animated && inView && !tabHidden && !interacting;
  const pause = () => setInteracting(true);
  const resume = (e?: FocusEvent<HTMLDivElement>) => {
    if (e && e.currentTarget.contains(e.relatedTarget as Node)) return;
    setInteracting(false);
  };
  const half = Math.ceil(homeTechnologies.length / 2);
  const topRow = homeTechnologies.slice(0, half);
  const bottomRow = homeTechnologies.slice(half);
  return (
    <section className="s6-tech" aria-labelledby="technology-heading">
      <div className="s6-container">
        <Reveal>
          <div className="s6-tech-heading">
            <p id="technology-heading" className="s6-eyebrow">
              TECHNOLOGIES WE BUILD WITH
            </p>
            <p>The right tools for the work.</p>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <div
            ref={wrapper}
            className="s6-tech-rows"
            onMouseEnter={pause}
            onMouseLeave={() => resume()}
            onFocus={pause}
            onBlur={resume}
            onTouchStart={pause}
            onTouchEnd={() => resume()}
            onTouchCancel={() => resume()}
          >
            <TechRow
              items={topRow}
              secondsPerItem={TECH_SECONDS_PER_ITEM_TOP}
              reverse={false}
              running={running}
              animated={animated}
            />
            <TechRow
              items={bottomRow}
              secondsPerItem={TECH_SECONDS_PER_ITEM_BOTTOM}
              reverse={true}
              running={running}
              animated={animated}
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function DevelopmentProcess() {
  const section = useRef<HTMLElement>(null);
  const reduce = useHomeReducedMotion();
  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start center", "end center"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [0.015, 1]);
  const [active, setActive] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (value) =>
    setActive(Math.min(5, Math.floor(value * 6))),
  );
  return (
    <section
      ref={section}
      id="process"
      className="s6-section s6-development"
      aria-labelledby="process-heading"
    >
      <div className="s6-container s6-process-layout">
        <div className="s6-process-intro">
          <Reveal>
            <p className="s6-eyebrow">A CLEAR WAY FORWARD</p>
            <h2 id="process-heading">
              From problem to product, with a clear path forward.
            </h2>
            <p>
              One connected process.
              <br />
              Six considered steps.
            </p>
          </Reveal>
        </div>
        <div className="s6-timeline">
          <div className="s6-timeline-track" aria-hidden="true">
            <motion.div style={{ scaleY: reduce ? 1 : scale }} />
          </div>
          <ol>
            {developmentSteps.map((step, i) => (
              <li key={step.title} className={active === i ? "is-current" : ""}>
                <span className="s6-timeline-dot" aria-hidden="true" />
                <Reveal>
                  <div className="s6-timeline-heading">
                    <span>0{i + 1}</span>
                    <h3>{step.title}</h3>
                  </div>
                  <p>{step.description}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

export function HomeInsights({ articles }: { articles: HomeInsight[] }) {
  if (!articles.length) return null;
  return (
    <section
      id="insights"
      className="s6-section s6-container s6-home-insights"
      aria-labelledby="insights-heading"
    >
      <Reveal>
        <div className="s6-section-header">
          <div>
            <p className="s6-eyebrow">INSIGHTS</p>
            <h2 id="insights-heading">
              Thinking out loud,
              <br />
              in public.
            </h2>
          </div>
          <Link href="/insights" className="s6-text-link">
            All insights <ArrowRight size={19} aria-hidden="true" />
          </Link>
        </div>
      </Reveal>
      <div>
        {articles.map((article, i) => (
          <Reveal key={article.slug} delay={i * 0.05}>
            <EditorialLink
              title={article.title}
              category={article.category}
              index={i}
              href={`/insights/${article.slug}`}
            />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
