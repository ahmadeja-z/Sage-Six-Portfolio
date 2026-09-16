"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type FocusEvent } from "react";
import { motion, useInView } from "motion/react";
import {
  ArrowRight,
  Smartphone,
  PanelsTopLeft,
  ShoppingCart,
  PenTool,
  Cloud,
  Cpu,
  Compass,
  Shapes,
  Code2,
  Quote,
} from "lucide-react";
import {
  homeServices,
  homeProjects,
  capabilities,
  testimonials,
  companyRecord,
  REVIEW_MARQUEE_THRESHOLD,
  type HomeService,
  type Testimonial,
} from "@/data/home";
import { sampleTestimonials } from "@/data/home-sample-reviews";
import { Reveal, useHomeReducedMotion, useIsWideViewport } from "./motion";
import {
  StudioIntroduction,
  ServicesCapabilities,
  TechnologyStrip,
  DevelopmentProcess,
  HomeInsights,
} from "./HomeEditorial";
import { HomeAI } from "./HomeAI";
import { CollaborationMap } from "./HomeMap";
import { projectImageLoader } from "./project-image-loader";
import type { HomeInsight } from "@/data/home-editorial";

const MotionLink = motion.create(Link);

const icons = {
  mobile: Smartphone,
  web: PanelsTopLeft,
  commerce: ShoppingCart,
  design: PenTool,
  cloud: Cloud,
  ai: Cpu,
};
const arrow = <ArrowRight size={19} aria-hidden="true" />;

export function ServiceHexagon({
  service,
  index,
  drift = false,
}: {
  service: HomeService;
  index: number;
  drift?: boolean;
}) {
  const reduce = useHomeReducedMotion();
  const [active, setActive] = useState(false);
  const Icon = icons[service.icon];
  return (
    <Reveal
      entrance
      effect="scale"
      delay={0.45 + index * 0.09}
      className="s6-hex-cell"
    >
      <Link
        href="/expertise"
        className={`s6-hex ${service.light ? "s6-hex-light" : ""}`}
        onMouseEnter={() => setActive(true)}
        onMouseLeave={() => setActive(false)}
        onFocus={() => setActive(true)}
        onBlur={() => setActive(false)}
        onTouchStart={() => setActive(true)}
        onTouchEnd={() => setActive(false)}
        onTouchCancel={() => setActive(false)}
      >
        <motion.div
          className="s6-hex-image"
          animate={{
            scale: !reduce && active ? 1.035 : 1,
            x: !reduce && active ? 4 : 0,
            y: drift && !active ? [0, index % 2 ? -3 : 3, 0] : 0,
          }}
          transition={{
            duration: 0.25,
            y: {
              duration: 7,
              repeat: drift && !active ? Infinity : 0,
              ease: "easeInOut",
            },
          }}
        >
          <Image
            src={`/images/hero/${service.image}`}
            alt=""
            fill
            sizes="(max-width: 599px) 46vw, (max-width: 1099px) 29vw, 17vw"
            loading={index === 0 ? "eager" : "lazy"}
          />
        </motion.div>
        <div className="s6-hex-overlay" />
        <Reveal entrance delay={0.56 + index * 0.09} className="s6-hex-copy">
          <motion.div
            animate={{ y: !reduce && active ? -2 : 0 }}
            transition={{ duration: 0.25 }}
          >
            <Icon size={27} strokeWidth={1.4} aria-hidden="true" />
          </motion.div>
          <h2>{service.title}</h2>
          <p>{service.description}</p>
        </Reveal>
      </Link>
    </Reveal>
  );
}

function ReviewCarousel({ reviews }: { reviews: Testimonial[] }) {
  const [selected, setSelected] = useState(0);
  const reduce = useHomeReducedMotion();
  const active = selected % reviews.length;
  return (
    <>
      <div className="s6-review-stage">
        {reviews.map((review, i) => (
          <motion.figure
            key={`${review.clientName}-${i}`}
            initial={false}
            animate={{
              opacity: active === i ? 1 : 0,
              y: reduce ? 0 : active === i ? 0 : 10,
            }}
            transition={{
              duration: reduce ? 0 : 0.55,
              ease: [0.16, 1, 0.3, 1],
            }}
            aria-hidden={active !== i}
            inert={active !== i}
          >
            <Quote aria-hidden="true" />
            <blockquote>{review.quote}</blockquote>
            <figcaption>
              <strong>{review.clientName}</strong>
              <span>
                {[review.role, review.company].filter(Boolean).join(" · ")}
              </span>
              {review.project && <span>{review.project}</span>}
            </figcaption>
          </motion.figure>
        ))}
      </div>
      {reviews.length > 1 && (
        <div className="s6-review-controls">
          <button
            type="button"
            aria-label="Previous review"
            onClick={() =>
              setSelected((active - 1 + reviews.length) % reviews.length)
            }
          >
            <ArrowRight
              size={20}
              style={{ transform: "rotate(180deg)" }}
              aria-hidden="true"
            />
          </button>
          <p aria-live="polite" aria-atomic="true">
            Review {active + 1} of {reviews.length}: {reviews[active].clientName}
          </p>
          <button
            type="button"
            aria-label="Next review"
            onClick={() => setSelected((active + 1) % reviews.length)}
          >
            <ArrowRight size={20} aria-hidden="true" />
          </button>
        </div>
      )}
    </>
  );
}

function ReviewAvatar({ review }: { review: Testimonial }) {
  if (review.image) {
    return (
      <Image
        src={review.image}
        alt=""
        width={44}
        height={44}
        className="s6-review-avatar"
      />
    );
  }
  const initials =
    review.clientName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "?";
  return (
    <span className="s6-review-avatar s6-review-avatar-fallback" aria-hidden="true">
      {initials}
    </span>
  );
}

function ReviewCard({
  review,
  duplicate = false,
}: {
  review: Testimonial;
  duplicate?: boolean;
}) {
  return (
    <figure
      className="s6-review-card"
      aria-hidden={duplicate || undefined}
      inert={duplicate || undefined}
    >
      <Quote aria-hidden="true" />
      <blockquote>{review.quote}</blockquote>
      <figcaption>
        <ReviewAvatar review={review} />
        <div>
          <strong>{review.clientName}</strong>
          <span>
            {[review.role, review.company].filter(Boolean).join(" · ")}
          </span>
        </div>
      </figcaption>
      {review.source && (
        <a
          className="s6-review-source"
          href={review.source}
          target="_blank"
          rel="noreferrer noopener"
          tabIndex={duplicate ? -1 : undefined}
        >
          View source
        </a>
      )}
    </figure>
  );
}

// Keeps the loop's on-screen speed constant (not just its duration) no
// matter how many approved reviews get added later — a fixed duration
// would make the loop scroll faster, and less readable, as cards are added.
const MARQUEE_SECONDS_PER_CARD = 10;

function ReviewMarquee({ reviews }: { reviews: Testimonial[] }) {
  const reduce = useHomeReducedMotion();
  const isWide = useIsWideViewport();
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
  const animated = isWide && !reduce;
  const running = animated && inView && !tabHidden && !interacting;
  const pause = () => setInteracting(true);
  const resume = (e?: FocusEvent<HTMLDivElement>) => {
    if (e && e.currentTarget.contains(e.relatedTarget as Node)) return;
    setInteracting(false);
  };
  return (
    <div
      ref={wrapper}
      className="s6-review-marquee"
      data-animated={animated}
      role="group"
      aria-label={`Client reviews, ${reviews.length} in total`}
      tabIndex={0}
      onMouseEnter={pause}
      onMouseLeave={() => resume()}
      onFocus={pause}
      onBlur={resume}
      onTouchStart={pause}
      onTouchEnd={() => resume()}
      onTouchCancel={() => resume()}
    >
      <div
        className="s6-review-track"
        data-running={running}
        style={{
          ["--s6-marquee-duration" as string]: `${reviews.length * MARQUEE_SECONDS_PER_CARD}s`,
        }}
      >
        {reviews.map((review, i) => (
          <ReviewCard key={`${review.clientName}-${i}`} review={review} />
        ))}
        {animated &&
          reviews.map((review, i) => (
            <ReviewCard
              key={`dup-${review.clientName}-${i}`}
              review={review}
              duplicate
            />
          ))}
      </div>
    </div>
  );
}

export function CustomerReviews({
  reviews = testimonials,
  sampleMode = false,
}: {
  reviews?: Testimonial[];
  sampleMode?: boolean;
}) {
  const approved = reviews.filter((review) => review.approved === true);
  if (!approved.length) return null;
  const marquee = approved.length >= REVIEW_MARQUEE_THRESHOLD;
  return (
    <section
      className="s6-reviews s6-section"
      aria-labelledby="reviews-heading"
    >
      <div className="s6-container">
        {sampleMode && (
          <p className="s6-review-sample-flag" role="note">
            Sample reviews — for design preview only
          </p>
        )}
        <Reveal>
          <p className="s6-eyebrow">IN GOOD COMPANY</p>
          <h2 id="reviews-heading">Trusted through the work.</h2>
          <p className="s6-section-intro">
            Strong partnerships come from clear communication, thoughtful
            decisions, and reliable delivery.
          </p>
        </Reveal>
        {marquee ? (
          <ReviewMarquee reviews={approved} />
        ) : (
          <ReviewCarousel reviews={approved} />
        )}
      </div>
    </section>
  );
}

function ProjectCard({
  project,
  index,
}: {
  project: (typeof homeProjects)[number];
  index: number;
}) {
  const reduce = useHomeReducedMotion();
  const [active, setActive] = useState(false);
  return (
    <Reveal delay={index * 0.09}>
      <article
        className={`s6-project ${index === 0 ? "s6-project-featured" : ""}`}
      >
        <Link
          href={`/work/${project.slug}`}
          onMouseEnter={() => setActive(true)}
          onMouseLeave={() => setActive(false)}
          onFocus={() => setActive(true)}
          onBlur={() => setActive(false)}
        >
          <Reveal effect="image" className="s6-project-image">
            <motion.div
              animate={{ scale: active && !reduce ? 1.025 : 1 }}
              transition={{ duration: 0.35 }}
            >
              <Image
                src={`/images/case-studies/${project.image}`}
                loader={projectImageLoader}
                alt={project.alt}
                width={project.width}
                height={project.height}
                sizes={
                  index === 0
                    ? "(max-width: 1099px) 92vw, 60vw"
                    : "(max-width: 1099px) 92vw, 46vw"
                }
              />
            </motion.div>
          </Reveal>
          <Reveal delay={0.12}>
            <div className="s6-project-copy">
              <p className="s6-project-category">{project.category}</p>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <span className="s6-project-action">
                View case study{" "}
                <motion.span
                  animate={{ x: active && !reduce ? 5 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {arrow}
                </motion.span>
              </span>
            </div>
          </Reveal>
        </Link>
      </article>
    </Reveal>
  );
}

// A hexagon split into six triangular facets, echoing the Sage Six logo's
// six-colour identity, rebuilt as individually animatable SVG paths rather
// than a flattened background image.
const CTA_HEX_CENTER = { x: 170, y: 170 };
const CTA_HEX_VERTICES = [
  [170, 10],
  [308.56, 90],
  [308.56, 250],
  [170, 330],
  [31.44, 250],
  [31.44, 90],
] as const;
const CTA_HEX_COLORS = [
  "#14a89d",
  "#282264",
  "#273990",
  "#0f75bd",
  "#24aae3",
  "#662d90",
];

function CtaGeometry() {
  const reduce = useHomeReducedMotion();
  const scope = useRef<SVGSVGElement>(null);
  const inView = useInView(scope, { once: true, amount: 0.4 });
  const play = inView && !reduce;
  const { x: cx, y: cy } = CTA_HEX_CENTER;
  const facets = CTA_HEX_VERTICES.map((point, i) => {
    const next = CTA_HEX_VERTICES[(i + 1) % CTA_HEX_VERTICES.length];
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
          fill={CTA_HEX_COLORS[i]}
          initial={reduce ? false : { opacity: 0 }}
          animate={play ? { opacity: 0.22 } : reduce ? { opacity: 0.22 } : {}}
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
        animate={
          play ? { pathLength: 1, opacity: 0.9 } : reduce ? { opacity: 0.9 } : {}
        }
        transition={{ duration: 0.7, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
      />
    </svg>
  );
}

function CtaButton() {
  const reduce = useHomeReducedMotion();
  const [active, setActive] = useState(false);
  return (
    <MotionLink
      href="/contact"
      className="s6-button s6-button-white"
      onHoverStart={() => setActive(true)}
      onHoverEnd={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
      whileHover={reduce ? undefined : { y: -2 }}
      whileFocus={reduce ? undefined : { y: -2 }}
      whileTap={reduce ? undefined : { y: 0, scale: 0.99 }}
      transition={{ duration: 0.22 }}
    >
      Discuss your project{" "}
      <motion.span
        animate={{ x: active && !reduce ? 5 : 0 }}
        transition={{ duration: 0.2 }}
      >
        {arrow}
      </motion.span>
    </MotionLink>
  );
}

export function HomePageContent({ articles }: { articles: HomeInsight[] }) {
  const heroGrid = useRef<HTMLDivElement>(null);
  const inView = useInView(heroGrid);
  const reduce = useHomeReducedMotion();
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const update = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);
  // Dev-only preview of the reviews section's layout/animation while no
  // approved reviews exist yet. Never runs in production, and stops as soon
  // as real reviews are added to `testimonials` in data/home.ts.
  const usingSampleReviews =
    process.env.NODE_ENV !== "production" && testimonials.length === 0;
  return (
    <div className="s6 s6-home">
      <section className="s6-hero s6-container" aria-labelledby="hero-heading">
        <div className="s6-hero-copy">
          <Reveal entrance delay={0.08}>
            <p className="s6-eyebrow">STRATEGY × DESIGN × ENGINEERING</p>
          </Reveal>
          <h1 id="hero-heading">
            <Reveal entrance delay={0.16}>
              Complex software.
            </Reveal>
            <Reveal entrance delay={0.26}>
              Made brilliantly simple<span className="s6-full-stop">.</span>
            </Reveal>
          </h1>
          <Reveal entrance delay={0.34}>
            <p className="s6-hero-description">
              Sage Six designs and engineers digital products that help growing
              businesses operate, sell, and scale.
            </p>
          </Reveal>
          <Reveal entrance delay={0.42}>
            <div className="s6-hero-actions">
              <a href="#work" className="s6-button">
                View case studies {arrow}
              </a>
              <Link href="/expertise" className="s6-button s6-button-outline">
                What we do {arrow}
              </Link>
            </div>
          </Reveal>
          <Reveal entrance delay={0.6}>
            <p className="s6-hero-note">
              <span />
              IDEAS. SYSTEMS. REAL IMPACT.
            </p>
          </Reveal>
        </div>
        <div
          ref={heroGrid}
          className="s6-hex-grid"
          id="services"
          aria-label="Six areas of expertise"
        >
          {homeServices.map((service, i) => (
            <ServiceHexagon
              key={service.title}
              service={service}
              index={i}
              drift={!reduce && visible && inView}
            />
          ))}
        </div>
      </section>
      <section className="s6-capabilities" aria-label="Our approach">
        <div className="s6-container">
          <div className="s6-capability-grid">
            {capabilities.map((item, i) => {
              const Icon = [Compass, Shapes, Code2][i];
              return (
                <Reveal key={item.title} delay={i * 0.06}>
                  <div className="s6-capability">
                    <Icon aria-hidden="true" size={29} strokeWidth={1.3} />
                    <div>
                      <h2>{item.title}</h2>
                      <p>{item.description}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
          <p className="s6-company">
            {companyRecord.name}
            <span>UK registered software company</span>
            <a href={companyRecord.url}>
              Company No. {companyRecord.number}{" "}
              <ArrowRight size={13} aria-hidden="true" />
            </a>
          </p>
        </div>
      </section>
      <section
        className="s6-section s6-container"
        id="work"
        aria-labelledby="work-heading"
      >
        <Reveal>
          <div className="s6-section-header">
            <div>
              <p className="s6-eyebrow">IDEAS INTO REALITY</p>
              <h2 id="work-heading">Selected work.</h2>
            </div>
            <Link href="/work" className="s6-text-link">
              View all work {arrow}
            </Link>
          </div>
        </Reveal>
        <div className="s6-project-grid">
          {homeProjects.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} />
          ))}
        </div>
      </section>
      <CustomerReviews
        reviews={usingSampleReviews ? sampleTestimonials : testimonials}
        sampleMode={usingSampleReviews}
      />
      <StudioIntroduction />
      <ServicesCapabilities />
      <TechnologyStrip />
      <HomeAI />
      <DevelopmentProcess />
      <CollaborationMap />
      <HomeInsights articles={articles} />
      <section
        className="s6-container s6-cta-wrap"
        id="contact"
        aria-labelledby="cta-heading"
      >
        <Reveal>
          <div className="s6-cta">
            <CtaGeometry />
            <div>
              <p className="s6-eyebrow">YOUR NEXT CHAPTER STARTS HERE</p>
              <h2 id="cta-heading">
                <Reveal>Put your next</Reveal>
                <Reveal delay={0.1}>idea to work.</Reveal>
              </h2>
              <Reveal delay={0.18}>
                <p>
                  A new product, a better website, or software that
                  simplifies how your business works — tell us what you have
                  in mind.
                </p>
              </Reveal>
            </div>
            <Reveal delay={0.26} className="s6-cta-actions">
              <CtaButton />
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
