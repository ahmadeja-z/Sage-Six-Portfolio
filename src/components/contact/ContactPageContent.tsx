"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight, Plus } from "lucide-react";
import { siteConfig } from "@/lib/site";
import { ContactForm } from "@/components/forms/ContactForm";
import { Reveal, motionTokens } from "@/components/home/motion";
import type { Project } from "@/types";

const buildWithList = [
  "Mobile applications in Flutter",
  "Business websites and custom web platforms",
  "AI integration and workflow automation",
  "Technical support and team extension",
];

const nextSteps = [
  {
    title: "We review the context.",
    text: "We look at your goals, existing product and the kind of help you need.",
  },
  {
    title: "We clarify the requirements.",
    text: "We follow up with useful questions and, where appropriate, arrange a conversation.",
  },
  {
    title: "We agree the next step.",
    text: "That may be a scoped project, an initial review, a support arrangement or developer assistance.",
  },
];

const faqs = [
  {
    q: "Do I need a complete brief before contacting you?",
    a: "No. A short description of the problem, intended users and your priorities is enough to begin.",
  },
  {
    q: "Can you help with software built by another team?",
    a: "We can discuss an initial review of the product, codebase and available documentation before agreeing a support scope.",
  },
  {
    q: "Can you provide developers to work with our team?",
    a: "We can discuss the expertise, availability and responsibilities required for a team-extension arrangement.",
  },
  {
    q: "What if I am unsure about budget or timing?",
    a: "You can leave those details open. We can clarify scope and constraints before discussing an estimate.",
  },
];

// Restrained construction-line motif for the contact hero's empty corner —
// positioned and layered exactly like the case-study hero's hex facets, but
// a local copy since this page isn't part of that shared component tree.
function ContactHexFacets() {
  return (
    <svg className="s6-contact-hex" viewBox="0 0 200 200" aria-hidden="true" focusable="false">
      <polygon
        points="100,6 176,50 176,138 100,182 24,138 24,50"
        fill="none"
        stroke="var(--s6-blue)"
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

// Closing hexagon motif — the same six-facet pattern already duplicated once
// per page (home, expertise, case studies, work, about) for their own
// closing CTAs.
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
          initial={{ opacity: 0 }}
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
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 0.9 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7, delay: 0.55, ease: motionTokens.easing.gentle }}
      />
    </svg>
  );
}

export function ContactPageContent({
  service,
  enquiryType,
  workProjects,
}: {
  service: string;
  enquiryType: string;
  workProjects: Project[];
}) {
  return (
    <div className="s6 s6-home s6-contact">
      <section className="s6-contact-hero s6-container" aria-labelledby="contact-heading">
        <ContactHexFacets />

        <div className="relative z-10">
          <Reveal entrance>
            <p className="s6-eyebrow">CONTACT SAGE SIX</p>
          </Reveal>
          <Reveal entrance delay={0.1}>
            <h1 id="contact-heading" className="s6-contact-heading">
              Let&apos;s talk about your next project.
            </h1>
          </Reveal>
          <Reveal entrance delay={0.18}>
            <p className="s6-work-hero-lead">
              Planning a mobile app, a new website or improvements to an existing
              platform? Tell us what you need. Sage Six can help with product
              development, ongoing software support and additional development
              expertise for your team.
            </p>
          </Reveal>
          <Reveal entrance delay={0.26}>
            <div className="mt-9">
              <p className="s6-eyebrow mb-2">Prefer email?</p>
              <a href={`mailto:${siteConfig.email}`} className="s6-contact-email-link">
                {siteConfig.email}
              </a>
              <p className="mt-2 text-sm leading-relaxed text-[color:var(--s6-body)]">
                Send your project outline or question directly to us.
              </p>
            </div>
          </Reveal>
          <Reveal entrance delay={0.32}>
            <div className="mt-9 border-t pt-6 border-[color:var(--s6-border)]">
              <p className="s6-eyebrow">We build with</p>
              <ul className="s6-contact-intro-list">
                {buildWithList.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        <Reveal entrance delay={0.16} className="relative z-10">
          <ContactForm initialService={service} initialEnquiryType={enquiryType} />
        </Reveal>
      </section>

      <section className="s6-section s6-work-architecture-section" aria-labelledby="contact-steps-heading">
        <div className="s6-container">
          <Reveal>
            <p className="s6-eyebrow">NEXT STEPS</p>
            <h2 id="contact-steps-heading" className="s6-work-heading-md">
              A clear next step.
            </h2>
            <p className="s6-section-intro">
              Your enquiry helps us understand the work before recommending an
              approach.
            </p>
          </Reveal>
          <ol className="s6-contact-steps">
            {nextSteps.map((step, i) => (
              <Reveal key={step.title} delay={i * 0.06}>
                <li className="s6-contact-step">
                  <span className="s6-contact-step-index">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="s6-section s6-container" aria-labelledby="contact-work-heading">
        <Reveal>
          <p className="s6-eyebrow">EXPLORE OUR WORK</p>
          <h2 id="contact-work-heading" className="s6-work-heading-md">
            Recent projects you can explore
          </h2>
        </Reveal>
        <div className="mt-6">
          {workProjects.map((project, i) => (
            <Reveal key={project.slug} delay={i * 0.05}>
              <Link
                href={`/work/${project.slug}`}
                className="s6-contact-project-row"
                aria-label={`Explore the ${project.title} case study`}
              >
                <div>
                  <h3>{project.title}</h3>
                  <p>{project.category}</p>
                </div>
                <ArrowUpRight className="s6-contact-project-arrow h-5 w-5" strokeWidth={1.5} />
              </Link>
            </Reveal>
          ))}
        </div>
        <p className="mt-6 s6-eyebrow">50+ projects delivered</p>
      </section>

      <section className="s6-section s6-work-architecture-section" aria-labelledby="contact-faq-heading">
        <div className="s6-container">
          <Reveal>
            <p className="s6-eyebrow">QUESTIONS</p>
            <h2 id="contact-faq-heading" className="s6-work-heading-md">
              Common questions before you enquire
            </h2>
          </Reveal>
          <div className="s6-faq-list mt-8">
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
        </div>
      </section>

      <section className="s6-container s6-cta-wrap" aria-label="Start a conversation">
        <Reveal>
          <div className="s6-cta">
            <CtaMotif />
            <div>
              <p className="s6-eyebrow">START A CONVERSATION</p>
              <h2>Have a project or question in mind?</h2>
              <p>
                Tell us what you want to achieve, what already exists and where
                you need help — we&apos;ll help you define a practical starting
                point.
              </p>
            </div>
            <Reveal delay={0.15} className="s6-cta-actions">
              <a href={`mailto:${siteConfig.email}`} className="s6-button s6-button-white">
                Email Sage Six
                <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            </Reveal>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
