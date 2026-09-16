"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useAnimate, useInView, stagger } from "motion/react";
import {
  worldMapDots,
  WORLD_MAP_WIDTH,
  WORLD_MAP_HEIGHT,
  collaborationCountries,
  collaborationConnections,
  type CollaborationCountry,
} from "@/data/home-map";
import { Reveal, motionTokens, useHomeReducedMotion } from "./motion";

const AMBIENT_MIN_DELAY = 3800;
const AMBIENT_MAX_DELAY = 7200;
const TRAVEL_DURATION = 1.6;
const TRAVEL_STEPS = 30;

// A gentle quadratic-bezier arc between two points, bulging perpendicular to
// the line between them. Bulge is capped so short and long hops both read as
// calm curves rather than a sharp kink or an exaggerated bow.
function controlPoint(a: CollaborationCountry, b: CollaborationCountry) {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const length = Math.hypot(dx, dy) || 1;
  const bulge = Math.min(length * 0.28, 9);
  return { x: mx - (dy / length) * bulge, y: my - (dx / length) * bulge };
}
function pathFor(a: CollaborationCountry, b: CollaborationCountry) {
  const c = controlPoint(a, b);
  return `M${a.x} ${a.y} Q${c.x} ${c.y} ${b.x} ${b.y}`;
}
function easeInOutCubic(x: number) {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}
function bezierPoint(a: CollaborationCountry, b: CollaborationCountry, t: number) {
  const c = controlPoint(a, b);
  const u = 1 - t;
  return {
    x: u * u * a.x + 2 * u * t * c.x + t * t * b.x,
    y: u * u * a.y + 2 * u * t * c.y + t * t * b.y,
  };
}
// Eased sample spacing baked into the points themselves, so a plain linear
// keyframe transition across them still reads as a gentle ease overall.
function travelPoints(a: CollaborationCountry, b: CollaborationCountry) {
  return Array.from({ length: TRAVEL_STEPS + 1 }, (_, step) =>
    bezierPoint(a, b, easeInOutCubic(step / TRAVEL_STEPS)),
  );
}

type Travel = { key: number; connectionIndex: number };

export function CollaborationMap() {
  const section = useRef<HTMLElement>(null);
  const inView = useInView(section, { amount: 0.2 });
  const [scope, animate] = useAnimate();
  const entered = useInView(scope, { once: true, amount: 0.25 });
  const reduce = useHomeReducedMotion();
  const [visible, setVisible] = useState(true);
  const [hovered, setHovered] = useState<number | null>(null);
  const [travel, setTravel] = useState<Travel | null>(null);
  const lastAmbient = useRef<number | null>(null);
  const ambientTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const running = inView && visible && !reduce;
  const ambientEnabled = running && hovered === null;

  useEffect(() => {
    const update = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  // Entrance: the dotted map fades in, markers settle with a short stagger,
  // then each connection draws in turn. Runs once; instant and complete for
  // reduced-motion users.
  useEffect(() => {
    if (reduce) {
      animate(".s6-map-dot", { opacity: 1 }, { duration: 0 });
      animate(".s6-map-marker", { opacity: 1, scale: 1 }, { duration: 0 });
      animate(".s6-map-arc", { pathLength: 1, opacity: 0.8 }, { duration: 0 });
      return;
    }
    if (!entered) return;
    const dots = animate(
      ".s6-map-dot",
      { opacity: [0, 1] },
      { duration: 1, ease: motionTokens.easing.gentle },
    );
    const markers = animate(
      ".s6-map-marker",
      { opacity: [0, 1], scale: [0.5, 1] },
      {
        delay: stagger(0.1, { startDelay: 0.5 }),
        duration: 0.35,
        ease: motionTokens.easing.standard,
      },
    );
    const arcs = animate(
      ".s6-map-arc",
      { pathLength: [0, 1], opacity: [0, 0.8] },
      {
        delay: stagger(0.35, { startDelay: 1 }),
        duration: 0.6,
        ease: motionTokens.easing.gentle,
      },
    );
    return () => {
      dots.stop();
      markers.stop();
      arcs.stop();
    };
  }, [animate, entered, reduce]);

  // Ambient: an occasional point of light travels one connection, with quiet
  // pauses between cycles. Never more than one at once, and it steps aside
  // while someone is exploring a marker.
  useEffect(() => {
    if (!ambientEnabled || travel) {
      if (ambientTimer.current) clearTimeout(ambientTimer.current);
      return;
    }
    const delay =
      AMBIENT_MIN_DELAY + Math.random() * (AMBIENT_MAX_DELAY - AMBIENT_MIN_DELAY);
    ambientTimer.current = setTimeout(() => {
      let index = Math.floor(Math.random() * collaborationConnections.length);
      if (index === lastAmbient.current) {
        index = (index + 1) % collaborationConnections.length;
      }
      lastAmbient.current = index;
      setTravel({ key: Date.now(), connectionIndex: index });
    }, delay);
    return () => {
      if (ambientTimer.current) clearTimeout(ambientTimer.current);
    };
  }, [ambientEnabled, travel]);

  useEffect(() => {
    if (!travel) return;
    const timer = setTimeout(() => setTravel(null), TRAVEL_DURATION * 1000 + 300);
    return () => clearTimeout(timer);
  }, [travel]);

  return (
    <section
      ref={section}
      className="s6-map s6-section"
      aria-labelledby="map-heading"
    >
      <div className="s6-container">
        <Reveal>
          <p className="s6-eyebrow">WORKING ACROSS BORDERS</p>
          <h2 id="map-heading">Built to collaborate, wherever you are.</h2>
          <p className="s6-map-intro">
            Sage Six works remotely with businesses in these regions. This is
            an illustrative view of that reach, not a record of offices,
            staff, or completed projects in each location.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <div ref={scope} className="s6-map-canvas">
            <svg
              viewBox={`0 0 ${WORLD_MAP_WIDTH} ${WORLD_MAP_HEIGHT}`}
              className="s6-map-svg"
              aria-hidden="true"
            >
              {worldMapDots.map(([x, y], i) => (
                <circle key={i} className="s6-map-dot" cx={x} cy={y} r={0.42} />
              ))}
              {collaborationConnections.map(([a, b], i) => (
                <path
                  key={i}
                  className="s6-map-arc"
                  d={pathFor(collaborationCountries[a], collaborationCountries[b])}
                  fill="none"
                  strokeLinecap="round"
                />
              ))}
              {collaborationCountries.map((country, i) => (
                <circle
                  key={country.name}
                  className="s6-map-marker"
                  data-active={hovered === i}
                  cx={country.x}
                  cy={country.y}
                  r={1.15}
                />
              ))}
              {travel &&
                (() => {
                  const [a, b] = collaborationConnections[travel.connectionIndex];
                  const points = travelPoints(
                    collaborationCountries[a],
                    collaborationCountries[b],
                  );
                  return (
                    <motion.circle
                      key={travel.key}
                      className="s6-map-light"
                      r={0.85}
                      initial={{ cx: points[0].x, cy: points[0].y, opacity: 0 }}
                      animate={{
                        cx: points.map((p) => p.x),
                        cy: points.map((p) => p.y),
                        opacity: [0, 1, 1, 0],
                      }}
                      transition={{ duration: TRAVEL_DURATION, ease: "linear" }}
                    />
                  );
                })()}
            </svg>
            <div
              className="s6-map-markers"
              role="group"
              aria-label={`${collaborationCountries.length} countries Sage Six can collaborate with`}
            >
              {collaborationCountries.map((country, i) => (
                <button
                  key={country.name}
                  type="button"
                  className="s6-map-marker-hit"
                  style={{
                    left: `${(country.x / WORLD_MAP_WIDTH) * 100}%`,
                    top: `${(country.y / WORLD_MAP_HEIGHT) * 100}%`,
                  }}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered((v) => (v === i ? null : v))}
                  onFocus={() => setHovered(i)}
                  onBlur={() => setHovered((v) => (v === i ? null : v))}
                  onClick={() => setHovered((v) => (v === i ? null : i))}
                  aria-label={country.name}
                >
                  <span
                    className="s6-map-label"
                    data-anchor={country.labelAnchor}
                    aria-hidden="true"
                  >
                    {country.name}
                  </span>
                  {hovered === i && (
                    <span className="s6-map-tooltip" aria-hidden="true">
                      {country.name}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </Reveal>
        <ul className="sr-only">
          {collaborationCountries.map((country) => (
            <li key={country.name}>{country.name}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
