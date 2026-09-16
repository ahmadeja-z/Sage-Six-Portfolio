"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { Smartphone, Globe, Network, ArrowUpRight } from "lucide-react";
import { motion, useInView } from "motion/react";
import { useHomeReducedMotion } from "@/components/home/motion";
import { getProject } from "@/data/projects";

// The Sage Six Product Impact Prism: one connected geometric core with three
// product faces, each linking straight to the case study it represents.
// Faces, the hex core, and every connecting line share one coordinate
// system (a 340x340 SVG viewBox, centre at 170,170) so nothing is ever
// visually estimated with arbitrary margins.
//
// Two Motion pitfalls to keep in mind for any future edit here (both hit
// during the first build of this component):
// 1. Motion writes its own `transform` inline style for any animated value
//    (scale, whileHover y, etc). If the SAME element also carries a plain
//    CSS `transform: translate(-50%, -50%)` centring rule, Motion's write
//    replaces it outright instead of combining with it — the element then
//    renders off-centre by exactly half its own size. Fix: keep static
//    positioning on an outer plain element, animation on an inner one.
// 2. A plain `style` prop on a `motion.*` element is only applied once, on
//    mount — Motion does not re-diff it on later renders the way it does
//    `animate`/`initial` targets. Anything that needs to keep reacting
//    (dimming, active-colour swaps) either goes through `animate` (numeric
//    values only — Motion cannot interpolate two CSS custom-property colour
//    strings) or lives on a plain, non-motion sibling element instead.
const CENTER = 170;
const FACE_RADIUS = 120;
const CORE_RADIUS = 40;
const FIELD_RADIUS = 150;
const ANGLES = [0, 120, 240] as const;

function pointAt(angleDeg: number, radius: number) {
  const rad = (angleDeg * Math.PI) / 180;
  // Rounded to 2dp: raw Math.sin/cos can differ in its last bit between
  // server and client JS engines, which would otherwise fail hydration
  // since this is computed at module scope and serialised into SSR markup.
  return {
    x: Math.round((CENTER + radius * Math.sin(rad)) * 100) / 100,
    y: Math.round((CENTER - radius * Math.cos(rad)) * 100) / 100,
  };
}

const FACE_POINTS = ANGLES.map((a) => pointAt(a, FACE_RADIUS));
const pct = (value: number) => `${((value / 340) * 100).toFixed(2)}%`;

type Face = {
  id: string;
  category: string;
  slug: string;
  outcome: string;
  Icon: typeof Smartphone;
  color: string;
};

const FACES: Face[] = [
  {
    id: "mobile",
    category: "Mobile Products",
    slug: "speezu",
    outcome: "Commerce and delivery",
    Icon: Smartphone,
    color: "var(--s6-cyan)",
  },
  {
    id: "web",
    category: "Web Platforms",
    slug: "durafoam-3d-foam-configurator-shopify",
    outcome: "Custom commerce and configuration",
    Icon: Globe,
    color: "var(--s6-blue)",
  },
  {
    id: "systems",
    category: "Connected Systems",
    slug: "leicester-medical-society",
    outcome: "Membership and administration",
    Icon: Network,
    color: "var(--s6-indigo)",
  },
];

const EASE_STANDARD = [0.22, 1, 0.36, 1] as const;
const EASE_GENTLE = [0.16, 1, 0.3, 1] as const;
const PULSE_INTERVAL_MS = 4200;

// Hex outline used for the core housing — the same six-vertex construction
// as the logo's own silhouette, at a small radius around the centre.
const CORE_HEX_POINTS = [0, 60, 120, 180, 240, 300]
  .map((a) => pointAt(a, CORE_RADIUS))
  .map((p) => `${p.x},${p.y}`)
  .join(" ");

export function ProductImpactPrism() {
  const reduce = useHomeReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const inView = useInView(stageRef, { amount: 0.4 });
  const play = inView && !reduce;

  // Latches true the first time the stage is in view and stays true — the
  // one-time entrance draw target for lines that also need to keep
  // reacting afterward (dimming on hover elsewhere). Adjusted during
  // render (React's documented pattern for "remember a prop change")
  // rather than in an effect, since it only needs to react to `inView`
  // actually changing value.
  const [hasEntered, setHasEntered] = useState(reduce);
  const [prevInView, setPrevInView] = useState(inView);
  if (inView !== prevInView) {
    setPrevInView(inView);
    if (inView) setHasEntered(true);
  }

  // One shared pulse mechanism for both the one-time entrance cascade (step
  // 7: one pulse through all three paths, shortly after assembly) and the
  // slower recurring idle pulse afterward. `null` means no path is
  // currently pulsing.
  const [pulseIndex, setPulseIndex] = useState<number | null>(null);
  useEffect(() => {
    if (!play) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const cascadeStart = 1400;
    const cascadeStep = 220;
    FACES.forEach((_, i) => {
      timers.push(setTimeout(() => setPulseIndex(i), cascadeStart + i * cascadeStep));
    });
    const idleDelay = cascadeStart + FACES.length * cascadeStep + 400;
    let intervalId: ReturnType<typeof setInterval> | undefined;
    timers.push(
      setTimeout(() => {
        intervalId = setInterval(() => setPulseIndex((i) => ((i ?? -1) + 1) % FACES.length), PULSE_INTERVAL_MS);
      }, idleDelay),
    );
    return () => {
      timers.forEach(clearTimeout);
      if (intervalId) clearInterval(intervalId);
    };
  }, [play]);

  const [hoverId, setHoverId] = useState<string | null>(null);
  const [focusId, setFocusId] = useState<string | null>(null);
  const activeId = hoverId ?? focusId;

  return (
    <div className="s6-prism">
      <div
        ref={stageRef}
        className="s6-prism-stage"
        role="group"
        aria-label="The Sage Six Product Impact Prism: three connected product categories, each linking to its case study"
      >
        <svg className="s6-prism-lines" viewBox="0 0 340 340" aria-hidden="true" focusable="false">
          <defs>
            <radialGradient id="s6-prism-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--s6-cyan)" stopOpacity="0.16" />
              <stop offset="55%" stopColor="var(--s6-indigo)" stopOpacity="0.07" />
              <stop offset="100%" stopColor="var(--s6-indigo)" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Step 1: outer construction lines — a faint field boundary and
              the prism's own triangular silhouette, drawn first. */}
          <motion.circle
            cx={CENTER}
            cy={CENTER}
            r={FIELD_RADIUS}
            fill="none"
            stroke="var(--s6-border)"
            strokeWidth={1}
            initial={reduce ? false : { pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 0.6 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, ease: EASE_STANDARD }}
          />
          <motion.polygon
            points={FACE_POINTS.map((p) => `${p.x},${p.y}`).join(" ")}
            fill="none"
            stroke="var(--s6-border)"
            strokeWidth={1}
            initial={reduce ? false : { pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 0.5 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: reduce ? 0 : 0.1, ease: EASE_STANDARD }}
          />

          {/* Soft brand-colour glow behind the core. */}
          <motion.circle
            cx={CENTER}
            cy={CENTER}
            r={FIELD_RADIUS - 10}
            fill="url(#s6-prism-glow)"
            style={{ transformOrigin: "170px 170px" }}
            initial={reduce ? false : { opacity: 0, scale: 0.92 }}
            animate={
              reduce
                ? { opacity: 1, scale: 1 }
                : play
                  ? { opacity: [0.5, 0.9, 0.5], scale: [0.98, 1.02, 0.98] }
                  : { opacity: 0.65, scale: 1 }
            }
            transition={
              reduce
                ? { duration: 0 }
                : play
                  ? { duration: 6.5, repeat: Infinity, ease: "easeInOut" }
                  : { duration: 0.6, ease: EASE_GENTLE }
            }
          />

          {/* Step 4: connecting paths, three layers per face — base line
              (entrance + dim, both numeric so `animate` re-syncs correctly),
              a plain active-highlight overlay (colour swap; Motion cannot
              interpolate CSS custom-property colours), and a pulse overlay
              shared by the one-time entrance cascade and the recurring idle
              pulse (see the pulseIndex effect above). */}
          {FACES.map((face, i) => {
            const point = FACE_POINTS[i];
            const isActive = activeId === face.id;
            const dimmed = activeId !== null && !isActive;
            const pulsing = pulseIndex === i && activeId === null;
            return (
              <g key={`line-${face.id}`}>
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
                    pathLength: { duration: 0.55, delay: reduce ? 0 : 0.5 + i * 0.08, ease: EASE_STANDARD },
                    opacity: { duration: 0.25 },
                  }}
                />
                <line
                  x1={CENTER}
                  y1={CENTER}
                  x2={point.x}
                  y2={point.y}
                  stroke={face.color}
                  strokeWidth={1.75}
                  strokeLinecap="round"
                  style={{ opacity: isActive ? 1 : 0, transition: "opacity 0.25s ease" }}
                />
                <motion.line
                  x1={CENTER}
                  y1={CENTER}
                  x2={point.x}
                  y2={point.y}
                  stroke={face.color}
                  strokeWidth={2}
                  strokeLinecap="round"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: pulsing ? [0, 0.9, 0] : 0 }}
                  transition={{ duration: 0.9, ease: "easeInOut" }}
                />
              </g>
            );
          })}

          {/* Prism silhouette hex, housing the core icon. */}
          <motion.polygon
            points={CORE_HEX_POINTS}
            fill="var(--s6-card)"
            stroke="var(--s6-border)"
            strokeWidth={1.25}
            initial={reduce ? false : { pathLength: 0, opacity: 0, scale: 0.7 }}
            whileInView={{ pathLength: 1, opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            style={{ transformOrigin: "170px 170px" }}
            transition={{ duration: 0.6, delay: reduce ? 0 : 0.35, ease: EASE_STANDARD }}
          />
        </svg>

        {/* Static centring lives on this plain wrapper; the scale/opacity
            entrance is Motion-animated on the child instead (see note #1
            above) so the centring translate is never overwritten. */}
        <div className="s6-prism-core" aria-hidden="true">
          <motion.div
            className="s6-prism-core-inner"
            initial={reduce ? false : { opacity: 0, scale: 0.6 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, delay: reduce ? 0 : 0.55, ease: EASE_STANDARD }}
          >
            <Image
              src="/images/sagesix-icon.svg"
              alt=""
              width={61}
              height={70}
              style={{ width: "26px", height: "auto" }}
              priority
            />
          </motion.div>
        </div>

        {FACES.map((face, i) => {
          const point = FACE_POINTS[i];
          const project = getProject(face.slug);
          const isActive = activeId === face.id;
          const dimmed = activeId !== null && !isActive;
          const wrapperStyle: CSSProperties = {
            left: pct(point.x),
            top: pct(point.y),
            opacity: dimmed ? 0.55 : 1,
            transition: "opacity 0.25s ease",
          };
          const faceStyle: CSSProperties & Record<string, string> = {
            "--face-color": face.color,
          };
          return (
            <div key={face.id} className="s6-prism-face-wrap" style={wrapperStyle}>
              <motion.div
                initial={reduce ? false : { opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.4 }}
                whileHover={reduce ? undefined : { y: -5 }}
                whileFocus={reduce ? undefined : { y: -5 }}
                transition={{ duration: 0.45, delay: reduce ? 0 : 0.75 + i * 0.1, ease: EASE_STANDARD }}
              >
                <Link
                  href={`/work/${face.slug}`}
                  className={`s6-prism-face${isActive ? " s6-prism-face-active" : ""}`}
                  style={faceStyle}
                  aria-label={`${face.category} — ${project?.title ?? face.slug} — ${face.outcome}. View case study.`}
                  onMouseEnter={() => setHoverId(face.id)}
                  onMouseLeave={() => setHoverId((v) => (v === face.id ? null : v))}
                  onFocus={() => setFocusId(face.id)}
                  onBlur={() => setFocusId((v) => (v === face.id ? null : v))}
                >
                  <face.Icon className="s6-prism-face-icon" size={20} strokeWidth={1.5} aria-hidden="true" />
                  <span className="s6-prism-face-category">{face.category}</span>
                  <span className="s6-prism-face-project">{project?.title ?? face.slug}</span>
                  <span className="s6-prism-face-outcome">{face.outcome}</span>
                  <span className="s6-prism-face-cta" aria-hidden="true">
                    View case study
                    <ArrowUpRight size={13} strokeWidth={1.75} />
                  </span>
                </Link>
              </motion.div>
            </div>
          );
        })}
      </div>

      <p className="s6-prism-footer">MOBILE · WEB · CONNECTED SYSTEMS</p>
    </div>
  );
}
