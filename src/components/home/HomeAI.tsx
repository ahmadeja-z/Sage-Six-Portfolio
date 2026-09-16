"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useAnimate,
  useInView,
  useMotionValue,
  useSpring,
  stagger,
} from "motion/react";
import { ArrowUpRight, Pause, Play } from "lucide-react";
import { aiCapabilities } from "@/data/home-editorial";
import { Reveal, motionTokens, useHomeReducedMotion } from "./motion";

type AINode = { x: number; y: number; label: string; color: string };

// Diagram is authored in a fixed 600x524 coordinate space (matches the SVG
// viewBox). Node labels live in an HTML overlay positioned by percentage of
// that space, so their text size never shrinks with the SVG at small widths.
const VIEW_W = 600;
const VIEW_H = 524;
const CENTER = { x: 300, y: 262 };

const nodes: AINode[] = [
  { x: 300, y: 54, label: "PRODUCT", color: "#24aae3" },
  { x: 480, y: 158, label: "WORKFLOWS", color: "#14a89d" },
  { x: 480, y: 366, label: "SYSTEMS", color: "#818cf8" },
  { x: 300, y: 470, label: "PEOPLE", color: "#bb8de2" },
  { x: 120, y: 366, label: "ENGINEERING", color: "#24aae3" },
  { x: 120, y: 158, label: "KNOWLEDGE", color: "#14a89d" },
];

// Reusable timing/easing for the whole diagram, named so entrance, ambient
// and interaction motion all read from the same values.
const ENTRANCE = {
  hex: { delay: 0, duration: 0.45 },
  connections: { delay: 0.3, duration: 0.9 },
  nodes: { delay: 0.75, duration: 0.4, stagger: 0.07 },
};
const INTERACTION_DURATION = 0.25;
const AMBIENT_MIN_DELAY = 3400;
const AMBIENT_MAX_DELAY = 6400;
const TRAVEL_DURATION = 1;
const TRAVEL_STEPS = 24;

// Quadratic-bezier control point for a node's connection to the centre mark,
// alternating bulge direction by index so the six curves fan out evenly.
function controlPoint(i: number) {
  return { x: 300, y: i % 2 ? 340 : 184 };
}
function pathFor(node: AINode, i: number) {
  const c = controlPoint(i);
  return `M${node.x} ${node.y} Q${c.x} ${c.y} ${CENTER.x} ${CENTER.y}`;
}
function bezierPoint(node: AINode, i: number, t: number) {
  const c = controlPoint(i);
  const u = 1 - t;
  return {
    x: u * u * node.x + 2 * u * t * c.x + t * t * CENTER.x,
    y: u * u * node.y + 2 * u * t * c.y + t * t * CENTER.y,
  };
}
function easeInOutCubic(x: number) {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}
// Sample points along the curve with eased spacing, so a plain linear
// keyframe transition still reads as a gentle ease over the full travel.
function travelPoints(index: number) {
  const node = nodes[index];
  return Array.from({ length: TRAVEL_STEPS + 1 }, (_, step) =>
    bezierPoint(node, index, easeInOutCubic(step / TRAVEL_STEPS)),
  );
}

type Travel = { key: number; index: number };

export function HomeAI() {
  const section = useRef<HTMLElement>(null);
  const inView = useInView(section, { amount: 0.15 });
  const [scope, animate] = useAnimate();
  const entered = useInView(scope, { once: true, amount: 0.3 });
  const reduce = useHomeReducedMotion();
  const [visible, setVisible] = useState(true);
  const [paused, setPaused] = useState(false);
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const [focused, setFocused] = useState<number | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [travel, setTravel] = useState<Travel | null>(null);
  const lastAmbientNode = useRef<number | null>(null);
  const ambientTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const smoothX = useSpring(x, { stiffness: 85, damping: 25 });
  const smoothY = useSpring(y, { stiffness: 85, damping: 25 });
  const running = inView && visible && !reduce && !paused;
  const highlightIndex = hovered ?? focused ?? selected;
  const ambientEnabled = running && highlightIndex === null;

  useEffect(() => {
    const update = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  // Entrance: centre mark, then the six connections draw outward, then
  // nodes and labels settle in with a short stagger. ~1.5s end to end.
  useEffect(() => {
    if (reduce) {
      animate(".s6-hex-core", { opacity: 1, scale: 1 }, { duration: 0 });
      animate(".s6-connection", { pathLength: 1 }, { duration: 0 });
      animate(
        ".s6-node-ring, .s6-node-dot, .s6-ai-node-label",
        { opacity: 1 },
        { duration: 0 },
      );
      return;
    }
    if (!entered) return;
    const hex = animate(
      ".s6-hex-core",
      { opacity: [0, 1], scale: [0.85, 1] },
      { ...ENTRANCE.hex, ease: motionTokens.easing.gentle },
    );
    const connections = animate(
      ".s6-connection",
      { pathLength: [0, 1] },
      { ...ENTRANCE.connections, ease: motionTokens.easing.gentle },
    );
    const nodeStagger = stagger(ENTRANCE.nodes.stagger, {
      startDelay: ENTRANCE.nodes.delay,
    });
    const nodeReveal = {
      delay: nodeStagger,
      duration: ENTRANCE.nodes.duration,
      ease: motionTokens.easing.standard,
    };
    const rings = animate(".s6-node-ring", { opacity: [0, 1], scale: [0.7, 1] }, nodeReveal);
    const dots = animate(".s6-node-dot", { opacity: [0, 1], scale: [0.7, 1] }, nodeReveal);
    const labels = animate(
      ".s6-ai-node-label",
      { opacity: [0, 1], y: [6, 0] },
      nodeReveal,
    );
    return () => {
      hex.stop();
      connections.stop();
      rings.stop();
      dots.stop();
      labels.stop();
    };
  }, [animate, entered, reduce]);

  // Ambient: an occasional point of light travels one connection toward the
  // centre, with quiet pauses between cycles. Never more than one at once,
  // and it steps aside while someone is actively exploring a node.
  useEffect(() => {
    if (!ambientEnabled || travel) {
      if (ambientTimer.current) clearTimeout(ambientTimer.current);
      return;
    }
    const delay =
      AMBIENT_MIN_DELAY + Math.random() * (AMBIENT_MAX_DELAY - AMBIENT_MIN_DELAY);
    ambientTimer.current = setTimeout(() => {
      let index = Math.floor(Math.random() * nodes.length);
      if (index === lastAmbientNode.current) {
        index = (index + 1) % nodes.length;
      }
      lastAmbientNode.current = index;
      setTravel({ key: Date.now(), index });
    }, delay);
    return () => {
      if (ambientTimer.current) clearTimeout(ambientTimer.current);
    };
  }, [ambientEnabled, travel]);

  // Clear the travel state once the light has arrived and the centre's
  // response has finished playing, so the next cycle can be scheduled.
  useEffect(() => {
    if (!travel) return;
    const totalMs = (TRAVEL_DURATION + 0.55) * 1000;
    const timer = setTimeout(() => setTravel(null), totalMs);
    return () => clearTimeout(timer);
  }, [travel]);

  return (
    <section
      ref={section}
      id="ai"
      className="s6-ai s6-section"
      aria-labelledby="ai-heading"
      data-motion-running={running}
    >
      <div className="s6-container">
        <div className="s6-ai-top">
          <div>
            <Reveal>
              <p className="s6-eyebrow">INTELLIGENCE, WITH INTENTION</p>
              <h2 id="ai-heading">AI is changing how products are built.</h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="s6-ai-intro">
                Sage Six uses AI to improve products, streamline operations, and
                support better decisions—always around a clear business need.
              </p>
              <p className="s6-ai-note">
                <span />
                Clear purpose. Connected thinking.
              </p>
            </Reveal>
          </div>
          <div
            ref={scope}
            className="s6-ai-widget"
            onPointerMove={(event) => {
              if (
                reduce ||
                paused ||
                event.pointerType !== "mouse" ||
                !window.matchMedia("(hover: hover) and (pointer: fine)").matches
              )
                return;
              const rect = event.currentTarget.getBoundingClientRect();
              x.set(((event.clientX - rect.left) / rect.width - 0.5) * 8);
              y.set(((event.clientY - rect.top) / rect.height - 0.5) * 8);
            }}
            onPointerLeave={() => {
              x.set(0);
              y.set(0);
            }}
          >
            <motion.div
              className="s6-constellation"
              style={{ x: reduce ? 0 : smoothX, y: reduce ? 0 : smoothY }}
            >
              <svg
                viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
                fill="none"
                aria-hidden="true"
                className="s6-ai-svg"
              >
                <defs>
                  <radialGradient id="s6-ai-halo">
                    <stop stopColor="#24aae3" stopOpacity=".13" />
                    <stop offset="1" stopColor="#24aae3" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <circle cx="300" cy="262" r="246" fill="url(#s6-ai-halo)" />
                <path
                  d="M300 54 480 158 480 366 300 470 120 366 120 158Z"
                  stroke="#828cb0"
                  strokeOpacity=".3"
                  strokeDasharray="3 8"
                />
                {nodes.map((node, i) => {
                  const isActive = highlightIndex === i;
                  const isDimmed = highlightIndex !== null && !isActive;
                  return (
                    <g key={node.label}>
                      <motion.path
                        className="s6-connection"
                        d={pathFor(node, i)}
                        stroke={node.color}
                        strokeLinecap="round"
                        animate={{
                          opacity: isActive ? 1 : isDimmed ? 0.2 : 0.55,
                          strokeWidth: isActive ? 2 : 1,
                        }}
                        transition={{ duration: INTERACTION_DURATION }}
                      />
                      <motion.circle
                        className="s6-node-ring"
                        cx={node.x}
                        cy={node.y}
                        r="15"
                        fill="#1a204e"
                        stroke={node.color}
                        animate={{
                          strokeOpacity: isActive ? 0.9 : isDimmed ? 0.22 : 0.5,
                        }}
                        transition={{ duration: INTERACTION_DURATION }}
                      />
                      <motion.circle
                        className="s6-node-dot"
                        cx={node.x}
                        cy={node.y}
                        r="3.5"
                        fill={node.color}
                        animate={{ fillOpacity: isDimmed ? 0.4 : 1 }}
                        transition={{ duration: INTERACTION_DURATION }}
                      />
                    </g>
                  );
                })}
                <g className="s6-hex-core" style={{ transformOrigin: "300px 262px" }}>
                  <path
                    d="M300 202 352 232 352 292 300 322 248 292 248 232Z"
                    fill="#1b2455"
                    stroke="#647bc0"
                    strokeWidth="1"
                  />
                  <path
                    d="M300 202V262L352 232M300 262L248 232M300 262V322M300 262L352 292M300 262L248 292"
                    stroke="#647bc0"
                    strokeOpacity=".45"
                  />
                </g>
                {travel && (
                  <>
                    <motion.circle
                      key={`origin-${travel.key}`}
                      cx={nodes[travel.index].x}
                      cy={nodes[travel.index].y}
                      r={15}
                      fill="none"
                      stroke={nodes[travel.index].color}
                      style={{
                        transformOrigin: `${nodes[travel.index].x}px ${nodes[travel.index].y}px`,
                      }}
                      initial={{ opacity: 0.5, scale: 1 }}
                      animate={{ opacity: [0.5, 0], scale: [1, 1.6] }}
                      transition={{ duration: 0.5, ease: motionTokens.easing.gentle }}
                    />
                    <motion.circle
                      key={`light-${travel.key}`}
                      r={4}
                      fill={nodes[travel.index].color}
                      initial={{
                        cx: travelPoints(travel.index)[0].x,
                        cy: travelPoints(travel.index)[0].y,
                        opacity: 0,
                      }}
                      animate={{
                        cx: travelPoints(travel.index).map((p) => p.x),
                        cy: travelPoints(travel.index).map((p) => p.y),
                        opacity: [0, 1, 1, 0],
                      }}
                      transition={{ duration: TRAVEL_DURATION, ease: "linear" }}
                    />
                    <motion.circle
                      key={`centre-${travel.key}`}
                      cx={CENTER.x}
                      cy={CENTER.y}
                      r={30}
                      fill="none"
                      stroke="#8fb8ff"
                      style={{ transformOrigin: `${CENTER.x}px ${CENTER.y}px` }}
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: [0, 0.55, 0], scale: [0.85, 1.15, 1.15] }}
                      transition={{
                        duration: 0.55,
                        delay: TRAVEL_DURATION,
                        ease: motionTokens.easing.gentle,
                      }}
                    />
                  </>
                )}
              </svg>
              <div
                className="s6-ai-nodes"
                role="group"
                aria-label="Connected capability diagram: Product, Workflows, Systems, People, Engineering and Knowledge"
              >
                {nodes.map((node, i) => {
                  const isActive = highlightIndex === i;
                  const isDimmed = highlightIndex !== null && !isActive;
                  return (
                    <div
                      key={node.label}
                      className="s6-ai-node"
                      style={{
                        left: `${(node.x / VIEW_W) * 100}%`,
                        top: `${(node.y / VIEW_H) * 100}%`,
                      }}
                    >
                      <button
                        type="button"
                        className="s6-ai-node-hit"
                        aria-pressed={selected === i}
                        onPointerEnter={(event) => {
                          if (event.pointerType === "mouse") setHovered(i);
                        }}
                        onPointerLeave={(event) => {
                          if (event.pointerType === "mouse")
                            setHovered((current) => (current === i ? null : current));
                        }}
                        onFocus={() => setFocused(i)}
                        onBlur={() =>
                          setFocused((current) => (current === i ? null : current))
                        }
                        onClick={() =>
                          setSelected((current) => (current === i ? null : i))
                        }
                      >
                        <span
                          className="s6-ai-node-label"
                          data-pos={i === 0 ? "above" : "below"}
                          style={{
                            color: isActive
                              ? node.color
                              : isDimmed
                                ? "#5b6489"
                                : "#b8c4df",
                          }}
                        >
                          {node.label}
                        </span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </motion.div>
            <Reveal delay={0.2}>
              <div
                className="s6-ai-selection"
                aria-live="polite"
                aria-atomic="true"
              >
                <span>CONNECTED CAPABILITY</span>
                <strong>{aiCapabilities[active].title}</strong>
              </div>
            </Reveal>
            <button
              type="button"
              className="s6-ai-pause"
              onClick={() => {
                setPaused(!paused);
                x.set(0);
                y.set(0);
              }}
              aria-pressed={paused}
              aria-label={
                paused ? "Resume visual animation" : "Pause visual animation"
              }
            >
              {paused ? (
                <Play size={15} aria-hidden="true" />
              ) : (
                <Pause size={15} aria-hidden="true" />
              )}
              <span>{paused ? "Resume motion" : "Pause motion"}</span>
            </button>
          </div>
        </div>
        <p className="s6-ai-instruction">Explore a capability</p>
        <div className="s6-ai-capabilities">
          {aiCapabilities.map((item, i) => (
            <button
              type="button"
              key={item.title}
              aria-pressed={active === i}
              onClick={() => setActive(i)}
              className={active === i ? "is-selected" : ""}
            >
              <span className="s6-ai-card-top">
                <span>0{i + 1}</span>
                <ArrowUpRight size={18} aria-hidden="true" />
              </span>
              <span className="s6-ai-card-title">{item.title}</span>
              <span className="s6-ai-card-description">{item.description}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
