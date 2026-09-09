"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

type Point = { x: number; y: number };

const HUB: Point = { x: 400, y: 200 };

const CLUSTERS: { center: Point; nodes: Point[] }[] = [
  {
    center: { x: 150, y: 110 },
    nodes: [
      { x: 70, y: 60 },
      { x: 230, y: 60 },
      { x: 120, y: 190 },
    ],
  },
  {
    center: { x: 650, y: 110 },
    nodes: [
      { x: 570, y: 60 },
      { x: 730, y: 60 },
      { x: 680, y: 190 },
    ],
  },
  {
    center: { x: 150, y: 290 },
    nodes: [
      { x: 70, y: 230 },
      { x: 230, y: 230 },
      { x: 120, y: 340 },
    ],
  },
  {
    center: { x: 650, y: 290 },
    nodes: [
      { x: 570, y: 230 },
      { x: 730, y: 230 },
      { x: 680, y: 340 },
    ],
  },
];

const linePath = (a: Point, b: Point) =>
  `M ${a.x} ${a.y} L ${b.x} ${b.y}`;

function ConnectionLine({
  progress,
  from,
  to,
  range,
}: {
  progress: MotionValue<number>;
  from: Point;
  to: Point;
  range: [number, number];
}) {
  const pathLength = useTransform(progress, range, [0, 1]);

  return (
    <motion.path
      d={linePath(from, to)}
      fill="none"
      stroke="rgba(163,184,138,0.5)"
      strokeWidth="1.5"
      style={{ pathLength }}
    />
  );
}

function NodeDot({
  point,
  progress,
  range,
  delay,
}: {
  point: Point;
  progress: MotionValue<number>;
  range: [number, number];
  delay: number;
}) {
  const opacity = useTransform(progress, range, [0, 1]);

  return (
    <motion.g style={{ opacity }}>
      <circle cx={point.x} cy={point.y} r="10" fill="rgba(163,184,138,0.12)" />
      <motion.circle
        cx={point.x}
        cy={point.y}
        r="3"
        fill="#a3b88a"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2.6, repeat: Infinity, delay }}
      />
    </motion.g>
  );
}

export function AIConnect() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.45"],
  });

  return (
    <div ref={ref} className="relative mx-auto mt-16 w-full max-w-3xl md:mt-24" aria-hidden="true">
      <svg
        viewBox="0 0 800 400"
        className="w-full"
        fill="none"
        role="img"
        aria-label="Abstract diagram of AI systems connecting"
      >
        {CLUSTERS.map((cluster, ci) => (
          <g key={ci}>
            <ConnectionLine
              progress={scrollYProgress}
              from={HUB}
              to={cluster.center}
              range={[ci * 0.12, 0.4 + ci * 0.12]}
            />
            {cluster.nodes.map((node, ni) => (
              <ConnectionLine
                key={ni}
                progress={scrollYProgress}
                from={cluster.center}
                to={node}
                range={[0.35 + ci * 0.12 + ni * 0.05, 0.75 + ci * 0.08]}
              />
            ))}
          </g>
        ))}

        <NodeDot point={HUB} progress={scrollYProgress} range={[0, 0.15]} delay={0} />
        {CLUSTERS.map((cluster, ci) => (
          <g key={ci}>
            <NodeDot
              point={cluster.center}
              progress={scrollYProgress}
              range={[0.2 + ci * 0.12, 0.5 + ci * 0.12]}
              delay={ci * 0.4}
            />
            {cluster.nodes.map((node, ni) => (
              <NodeDot
                key={ni}
                point={node}
                progress={scrollYProgress}
                range={[0.45 + ci * 0.12 + ni * 0.05, 0.8 + ci * 0.08]}
                delay={ci * 0.4 + ni * 0.2}
              />
            ))}
          </g>
        ))}
      </svg>
    </div>
  );
}