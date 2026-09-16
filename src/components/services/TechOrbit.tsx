"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Image from "next/image";
import { motion, useAnimate, useInView } from "motion/react";
import { homeTechnologies, type Technology } from "@/data/home-technologies";
import { motionTokens, useHomeReducedMotion } from "@/components/home/motion";

// Six technologies Sage Six can substantiate from the portfolio, balancing
// mobile, web, commerce and backend work: Flutter (SPEEZU apps), React and
// Next.js (this site's own stack), Shopify (DURAFOAM storefront), Firebase
// (SPEEZU notifications) and Node.js (portfolio server runtime). Sourced
// from the already-verified homepage technology data — see
// src/data/home-technologies.ts for provenance and icon licensing.
const ORBIT_TECH_NAMES = [
  "Flutter",
  "React",
  "Shopify",
  "Next.js",
  "Firebase",
  "Node.js",
];

const INNER_RING_SECONDS = 60;
const OUTER_RING_SECONDS = 85;

function TechGlyph({ tech }: { tech: Technology }) {
  return (
    <svg viewBox={tech.icon.viewBox} className="s6-orbit-glyph" aria-hidden="true">
      {tech.icon.paths.map((d, i) => (
        <path key={i} d={d} fill="currentColor" />
      ))}
    </svg>
  );
}

function OrbitSatellite({
  tech,
  angle,
  delaySeconds,
  staggerIndex,
  active,
  onActivate,
  onDeactivate,
  onToggle,
  entered,
}: {
  tech: Technology;
  angle: number;
  delaySeconds: number;
  staggerIndex: number;
  active: boolean;
  onActivate: () => void;
  onDeactivate: () => void;
  onToggle: () => void;
  entered: boolean;
}) {
  const reduce = useHomeReducedMotion();
  const style = {
    "--a": `${angle}deg`,
    animationDelay: `${delaySeconds}s`,
  } as CSSProperties;
  return (
    <div className="s6-orbit-satellite" style={style}>
      <motion.button
        type="button"
        className="s6-orbit-icon"
        data-active={active}
        initial={reduce ? false : { opacity: 0, scale: 0.4 }}
        animate={
          entered
            ? { opacity: 1, scale: 1 }
            : reduce
              ? { opacity: 1, scale: 1 }
              : {}
        }
        transition={{
          duration: 0.35,
          delay: 0.6 + staggerIndex * 0.08,
          ease: motionTokens.easing.standard,
        }}
        onMouseEnter={onActivate}
        onMouseLeave={onDeactivate}
        onFocus={onActivate}
        onBlur={onDeactivate}
        onClick={onToggle}
        aria-label={tech.name}
      >
        <TechGlyph tech={tech} />
      </motion.button>
      {active && <span className="s6-orbit-tooltip">{tech.name}</span>}
    </div>
  );
}

export function TechOrbit() {
  const reduce = useHomeReducedMotion();
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const inView = useInView(scope, { amount: 0.3 });
  const entered = useInView(scope, { once: true, amount: 0.3 });
  const [visible, setVisible] = useState(true);
  const [interacting, setInteracting] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    const update = () => setVisible(!document.hidden);
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  const animated = !reduce;
  const running = animated && inView && visible && !interacting;

  useEffect(() => {
    if (reduce) {
      animate(".s6-orbit-ring", { pathLength: 1, opacity: 1 }, { duration: 0 });
      animate(".s6-orbit-center", { opacity: 1, scale: 1 }, { duration: 0 });
      return;
    }
    if (!entered) return;
    const center = animate(
      ".s6-orbit-center",
      { opacity: [0, 1], scale: [0.7, 1] },
      { duration: 0.5, ease: motionTokens.easing.gentle },
    );
    const rings = animate(
      ".s6-orbit-ring",
      { pathLength: [0, 1], opacity: [0, 1] },
      { duration: 0.9, delay: 0.15, ease: motionTokens.easing.gentle },
    );
    return () => {
      center.stop();
      rings.stop();
    };
  }, [animate, entered, reduce]);

  const resume = () => setInteracting(false);
  const activate = (i: number) => {
    setInteracting(true);
    setActiveIndex(i);
  };
  const deactivate = (i: number) =>
    setActiveIndex((current) => (current === i ? null : current));
  // Touch has no hover, so a tap toggles the tooltip/pause directly rather
  // than relying on touchend (which would fire right after touchstart and
  // resume the orbit before the name could be read).
  const toggle = (i: number) =>
    setActiveIndex((current) => {
      if (current === i) {
        setInteracting(false);
        return null;
      }
      setInteracting(true);
      return i;
    });

  const techs = ORBIT_TECH_NAMES.map(
    (name) => homeTechnologies.find((t) => t.name === name)!,
  );
  const inner = techs.slice(0, 3);
  const outer = techs.slice(3, 6);

  return (
    <div
      ref={scope}
      className="s6-orbit"
      data-animated={animated}
      role="group"
      aria-label="Technologies Sage Six works with"
      onMouseLeave={resume}
      onBlur={(e) => {
        if (e.currentTarget.contains(e.relatedTarget as Node)) return;
        resume();
      }}
    >
      {/* No viewBox: the SVG's own user-unit space then equals its rendered
          pixel box (which tracks --s6-orbit-size via width/height:100%), so
          cx/cy/r set in CSS below share the exact same pixel coordinate
          system as the badges' translateX(var(--r)) — one source of truth
          for both, responsive at every breakpoint by construction. */}
      <svg className="s6-orbit-svg" aria-hidden="true">
        <motion.circle
          className="s6-orbit-ring s6-orbit-ring-inner"
          fill="none"
          initial={reduce ? false : { pathLength: 0, opacity: 0 }}
        />
        <motion.circle
          className="s6-orbit-ring s6-orbit-ring-outer"
          fill="none"
          initial={reduce ? false : { pathLength: 0, opacity: 0 }}
        />
      </svg>
      {/* Centering (translate(-50%,-50%)) lives on this plain wrapper, not
          the motion.div below — Motion writes its own `transform` for the
          scale entrance, which would silently replace a CSS transform set
          on the same element and pull the mark off-centre. */}
      <div className="s6-orbit-center-wrap">
        <motion.div
          className="s6-orbit-center"
          initial={reduce ? false : { opacity: 0, scale: 0.7 }}
        >
          <Image
            src="/images/sagesix-icon.svg"
            alt="Sage Six"
            width={36}
            height={41}
          />
        </motion.div>
      </div>
      <div
        className="s6-orbit-ring-track s6-orbit-ring-track-inner"
        data-running={running}
      >
        {inner.map((tech, i) => {
          const angle = i * 120;
          return (
            <OrbitSatellite
              key={tech.name}
              tech={tech}
              angle={angle}
              delaySeconds={-(angle / 360) * INNER_RING_SECONDS}
              staggerIndex={i}
              active={activeIndex === i}
              onActivate={() => activate(i)}
              onDeactivate={() => deactivate(i)}
              onToggle={() => toggle(i)}
              entered={entered}
            />
          );
        })}
      </div>
      <div
        className="s6-orbit-ring-track s6-orbit-ring-track-outer"
        data-running={running}
      >
        {outer.map((tech, i) => {
          const angle = 60 + i * 120;
          const globalIndex = i + 3;
          return (
            <OrbitSatellite
              key={tech.name}
              tech={tech}
              angle={angle}
              delaySeconds={-(angle / 360) * OUTER_RING_SECONDS}
              staggerIndex={globalIndex}
              active={activeIndex === globalIndex}
              onActivate={() => activate(globalIndex)}
              onDeactivate={() => deactivate(globalIndex)}
              onToggle={() => toggle(globalIndex)}
              entered={entered}
            />
          );
        })}
      </div>
    </div>
  );
}
