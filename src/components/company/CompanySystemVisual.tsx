"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import { motion, useInView } from "motion/react";
import { useHomeReducedMotion } from "@/components/home/motion";
import { companyRecord } from "@/data/home";

// A single connected system, not five isolated bullet points: one large
// Sage Six hex at the centre, six capabilities arranged at the icon's own
// hexagon vertices, joined by thin architectural lines. The hex frame,
// wedge segments and line endpoints all share one set of vertices so the
// whole composition reads as one shape rather than three overlapping ones.
//
// Each animated piece below is split into two layers on purpose: an inner
// <motion.*> element that only ever plays the one-time scroll-in entrance
// (initial -> whileInView, viewport once), and an outer plain element whose
// opacity/colour is set via ordinary inline style for the ongoing
// hover/focus/pulse state. Motion's `animate` prop takes priority over
// `whileInView` on the same element, so mixing them there would make the
// entrance fire instantly instead of on scroll — keeping them on separate
// elements avoids that entirely.
const CENTER = 170;
const RADIUS = 127.5;
const ANGLES = [0, 60, 120, 180, 240, 300] as const;

// Rounded to 2dp: raw Math.sin/cos output can differ in its last bit between
// server and client JS engines, which would otherwise fail hydration since
// this is computed at module scope and serialised straight into SSR markup.
function pointAt(angleDeg: number, radius: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: Math.round((CENTER + radius * Math.sin(rad)) * 100) / 100,
    y: Math.round((CENTER - radius * Math.cos(rad)) * 100) / 100,
  };
}

const NODE_POINTS = ANGLES.map((a) => pointAt(a, RADIUS));
const pct = (value: number) => `${((value / 340) * 100).toFixed(2)}%`;

type Capability = {
  id: string;
  label: string;
  description: string;
  color: string;
};

const CAPABILITIES: Capability[] = [
  {
    id: "strategy",
    label: "Strategy",
    description: "Clarifying the product direction and priorities before a line of code is written.",
    color: "var(--s6-indigo)",
  },
  {
    id: "product-design",
    label: "Product Design",
    description: "Interfaces and flows shaped around real users, not generic templates.",
    color: "var(--s6-purple)",
  },
  {
    id: "web-platforms",
    label: "Web Platforms",
    description: "Custom web applications and business platforms built to scale.",
    color: "var(--s6-blue)",
  },
  {
    id: "mobile-apps",
    label: "Mobile Apps",
    description: "Native-feeling mobile experiences for iOS and Android.",
    color: "var(--s6-cyan)",
  },
  {
    id: "ai-automation",
    label: "AI & Automation",
    description: "Practical AI tooling and workflow automation built into the product.",
    color: "var(--s6-teal)",
  },
  {
    id: "delivery-support",
    label: "Delivery & Support",
    description: "Dependable releases and ongoing technical support after launch.",
    color: "var(--s6-facet-navy)",
  },
];

const EASE_STANDARD = [0.22, 1, 0.36, 1] as const;
const EASE_GENTLE = [0.16, 1, 0.3, 1] as const;
const PULSE_INTERVAL_MS = 3600;

export function CompanySystemVisual() {
  const reduce = useHomeReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const inView = useInView(stageRef, { amount: 0.4 });
  const play = inView && !reduce;

  // Motion only re-applies a plain `style` prop once, on mount — it won't
  // pick up later changes to it the way animate/initial targets do. The
  // connecting lines need both a one-time entrance (pathLength) and ongoing
  // reactive updates (dimming), so both live in a single `animate` target
  // driven by this latch rather than mixing `style` with `whileInView` on
  // the same element. Adjusted during render (React's documented pattern
  // for "remember something from a prop change") rather than in an effect,
  // since it only needs to react to `inView` actually changing.
  const [hasEntered, setHasEntered] = useState(reduce);
  const [prevInView, setPrevInView] = useState(inView);
  if (inView !== prevInView) {
    setPrevInView(inView);
    if (inView) setHasEntered(true);
  }

  const [hoverId, setHoverId] = useState<string | null>(null);
  const [focusId, setFocusId] = useState<string | null>(null);
  const [pinnedId, setPinnedId] = useState<string | null>(null);
  const activeId = hoverId ?? focusId ?? pinnedId;
  const activeCapability = CAPABILITIES.find((c) => c.id === activeId) ?? null;

  // Idle "light pulse" — cycles through one connecting line at a time, well
  // spaced out, only while the widget is in view and motion is allowed.
  const [pulseIndex, setPulseIndex] = useState(0);
  useEffect(() => {
    if (!play) return;
    const id = setInterval(() => setPulseIndex((i) => (i + 1) % CAPABILITIES.length), PULSE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [play]);

  const hexPoints = NODE_POINTS.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <div className="s6-company-system">
      <div
        ref={stageRef}
        className="s6-company-system-stage"
        role="group"
        aria-label="Sage Six's six connected capabilities: strategy, product design, web platforms, mobile apps, AI and automation, and delivery and support"
      >
        <svg className="s6-company-system-lines" viewBox="0 0 340 340" aria-hidden="true" focusable="false">
          <defs>
            <radialGradient id="s6-company-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--s6-cyan)" stopOpacity="0.16" />
              <stop offset="55%" stopColor="var(--s6-blue)" stopOpacity="0.07" />
              <stop offset="100%" stopColor="var(--s6-blue)" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Soft brand-colour glow. Self-contained animate-only loop (no
              whileInView here), so there is nothing for it to conflict with. */}
          <motion.circle
            cx={CENTER}
            cy={CENTER}
            r={150}
            fill="url(#s6-company-glow)"
            style={{ transformOrigin: "170px 170px" }}
            initial={reduce ? false : { opacity: 0, scale: 0.92 }}
            animate={
              reduce
                ? { opacity: 1, scale: 1 }
                : play
                  ? { opacity: [0.55, 0.95, 0.55], scale: [0.98, 1.03, 0.98] }
                  : { opacity: 0.7, scale: 1 }
            }
            transition={
              reduce
                ? { duration: 0 }
                : play
                  ? { duration: 6, repeat: Infinity, ease: "easeInOut" }
                  : { duration: 0.6, ease: EASE_GENTLE }
            }
          />

          {/* Six wedge segments — entrance only; dimming is a plain CSS
              opacity on the wrapping <g>, independent of Motion. */}
          {CAPABILITIES.map((cap, i) => {
            const next = NODE_POINTS[(i + 1) % NODE_POINTS.length];
            const point = NODE_POINTS[i];
            const dimmed = activeId !== null && activeId !== cap.id;
            return (
              <g key={`segment-${cap.id}`} style={{ opacity: dimmed ? 0.45 : 1, transition: "opacity 0.25s ease" }}>
                <motion.path
                  d={`M${CENTER},${CENTER} L${point.x},${point.y} L${next.x},${next.y} Z`}
                  fill={cap.color}
                  initial={reduce ? false : { opacity: 0 }}
                  whileInView={{ opacity: 0.12 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.5, delay: reduce ? 0 : 0.15 + i * 0.05, ease: EASE_GENTLE }}
                />
              </g>
            );
          })}

          {/* Outer hexagonal frame — the icon's own silhouette, drawn once. */}
          <motion.polygon
            points={hexPoints}
            fill="none"
            stroke="var(--s6-border)"
            strokeWidth={1.25}
            initial={reduce ? false : { pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: EASE_STANDARD }}
          />

          {/* Connecting lines, three layers per capability:
              1. base line — Motion `animate` only (numeric pathLength/opacity,
                 which Motion correctly re-syncs every render); constant colour.
              2. active-highlight overlay — a plain (non-motion) <line>, since
                 Motion cannot interpolate between two CSS custom-property
                 colour strings and a plain element re-renders normally.
              3. idle pulse overlay — independent, Motion `animate` only. */}
          {CAPABILITIES.map((cap, i) => {
            const point = NODE_POINTS[i];
            const isActive = activeId === cap.id;
            const dimmed = activeId !== null && !isActive;
            const pulsing = play && pulseIndex === i && activeId === null;
            return (
              <g key={`line-${cap.id}`}>
                <motion.line
                  x1={CENTER}
                  y1={CENTER}
                  x2={point.x}
                  y2={point.y}
                  stroke="var(--s6-border)"
                  strokeWidth={1.25}
                  strokeLinecap="round"
                  initial={reduce ? false : { pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: hasEntered ? 1 : 0, opacity: dimmed ? 0.35 : 1 }}
                  transition={{
                    pathLength: { duration: 0.6, delay: reduce ? 0 : 0.35 + i * 0.05, ease: EASE_STANDARD },
                    opacity: { duration: 0.25 },
                  }}
                />
                <line
                  x1={CENTER}
                  y1={CENTER}
                  x2={point.x}
                  y2={point.y}
                  stroke={cap.color}
                  strokeWidth={1.75}
                  strokeLinecap="round"
                  style={{ opacity: isActive ? 1 : 0, transition: "opacity 0.25s ease" }}
                />
                <motion.line
                  x1={CENTER}
                  y1={CENTER}
                  x2={point.x}
                  y2={point.y}
                  stroke={cap.color}
                  strokeWidth={2}
                  strokeLinecap="round"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: pulsing ? [0, 0.9, 0] : 0 }}
                  transition={{ duration: 1.3, ease: "easeInOut" }}
                />
              </g>
            );
          })}
        </svg>

        {/* Static centring lives on this plain wrapper (CSS transform:
            translate(-50%,-50%) against the stage's exact top:50%/left:50%).
            The scale/opacity entrance is Motion-animated on the child below
            instead of on this element — Motion writes its own `transform`
            inline style for animated values, which would otherwise replace
            (not combine with) the CSS translate and visibly shift the circle
            off-centre once the animation ran. */}
        <div className="s6-company-system-core" aria-hidden="true">
          <motion.div
            className="s6-company-system-core-inner"
            initial={reduce ? false : { opacity: 0, scale: 0.6 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.55, delay: reduce ? 0 : 0.5, ease: EASE_STANDARD }}
          >
            <Image
              src="/images/sagesix-icon.svg"
              alt=""
              width={61}
              height={70}
              style={{ width: "30px", height: "auto" }}
              priority
            />
          </motion.div>
        </div>

        {CAPABILITIES.map((cap, i) => {
          const point = NODE_POINTS[i];
          const isActive = activeId === cap.id;
          const dimmed = activeId !== null && !isActive;
          const wrapperStyle: CSSProperties = {
            left: pct(point.x),
            top: pct(point.y),
            opacity: dimmed ? 0.45 : 1,
            transition: "opacity 0.25s ease",
          };
          const nodeStyle: CSSProperties & Record<string, string> = {
            "--node-color": cap.color,
          };
          return (
            <div key={cap.id} className="s6-company-node-wrap" style={wrapperStyle}>
              <motion.button
                type="button"
                className={`s6-company-node${isActive ? " s6-company-node-active" : ""}`}
                style={nodeStyle}
                aria-label={`${cap.label} — ${cap.description}`}
                aria-pressed={pinnedId === cap.id}
                onMouseEnter={() => setHoverId(cap.id)}
                onMouseLeave={() => setHoverId((v) => (v === cap.id ? null : v))}
                onFocus={() => setFocusId(cap.id)}
                onBlur={() => setFocusId((v) => (v === cap.id ? null : v))}
                onClick={() => setPinnedId((v) => (v === cap.id ? null : cap.id))}
                initial={reduce ? false : { opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.45, delay: reduce ? 0 : 0.65 + i * 0.06, ease: EASE_STANDARD }}
              >
                <span className="s6-company-node-dot" aria-hidden="true" />
                <span className="s6-company-node-label">{cap.label}</span>
              </motion.button>
            </div>
          );
        })}
      </div>

      <div className="s6-company-system-caption">
        <p className="s6-company-system-tagline">ONE CONNECTED DELIVERY SYSTEM</p>
        <p
          className="s6-company-system-desc"
          aria-hidden="true"
          style={{
            opacity: activeCapability ? 1 : 0,
            transition: "opacity 0.2s ease",
          }}
        >
          {activeCapability ? (
            <>
              <span style={{ color: activeCapability.color }}>{activeCapability.label}</span>
              {" — "}
              {activeCapability.description}
            </>
          ) : (
            <span style={{ visibility: "hidden" }}>
              <span>Placeholder</span> — Practical AI tooling and workflow automation built into the product.
            </span>
          )}
        </p>
      </div>

    </div>
  );
}
