"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Reveal, motionTokens } from "@/components/home/motion";

// Closing hexagon motif — the same six-facet pattern already duplicated once
// per page (home, expertise, case studies, work, about, contact) for their
// own closing CTAs.
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

export function ArticleCTA() {
  return (
    <section className="s6-container s6-cta-wrap" aria-label="Start a project">
      <Reveal>
        <div className="s6-cta">
          <CtaMotif />
          <div>
            <p className="s6-eyebrow">Build with Sage Six</p>
            <h2>Planning a digital product?</h2>
            <p>
              Sage Six designs and develops mobile applications, web platforms and
              connected software systems built around real business requirements.
            </p>
          </div>
          <Reveal delay={0.15} className="s6-cta-actions">
            <Link href="/contact" className="s6-button s6-button-white">
              Start a Project
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
            <Link href="/work" className="s6-button s6-button-outline">
              Explore Our Work
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
      </Reveal>
    </section>
  );
}
