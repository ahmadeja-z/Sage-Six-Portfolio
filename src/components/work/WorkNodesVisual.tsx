"use client";

import Image from "next/image";
import { Smartphone, Globe, Network } from "lucide-react";
import { motion } from "motion/react";
import { useHomeReducedMotion } from "@/components/home/motion";

// Restrained architecture motif for the Work hero: a central Sage Six node
// connected to the three product categories the case studies represent.
// One-time line-draw entrance only — no continuous motion, no orbiting.
const NODES = [
  { label: "Mobile products", Icon: Smartphone, position: "top" as const },
  { label: "Web platforms", Icon: Globe, position: "left" as const },
  { label: "Connected business systems", Icon: Network, position: "right" as const },
];

const LINE_ENDPOINTS = {
  top: { x2: 160, y2: 40 },
  left: { x2: 60, y2: 224 },
  right: { x2: 260, y2: 224 },
};

export function WorkNodesVisual() {
  const reduce = useHomeReducedMotion();

  return (
    <div className="s6-work-nodes" role="group" aria-label="Sage Six connects three product categories">
      <svg className="s6-work-nodes-lines" viewBox="0 0 320 320" aria-hidden="true" focusable="false">
        {(["top", "left", "right"] as const).map((key) => {
          const { x2, y2 } = LINE_ENDPOINTS[key];
          return (
            <motion.line
              key={key}
              x1={160}
              y1={160}
              x2={x2}
              y2={y2}
              stroke="var(--s6-border)"
              strokeWidth={1.5}
              initial={reduce ? false : { pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            />
          );
        })}
        <motion.circle
          cx={160}
          cy={160}
          r={30}
          fill="none"
          stroke="var(--s6-cyan)"
          strokeWidth={1.5}
          initial={reduce ? false : { opacity: 0, scale: 0.7 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>

      <div className="s6-work-node-center" aria-hidden="true">
        <Image src="/images/sagesix-icon.svg" alt="" width={22} height={25} />
      </div>

      {NODES.map(({ label, Icon, position }, i) => (
        <motion.div
          key={label}
          className={`s6-work-node s6-work-node-${position}`}
          initial={reduce ? false : { opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, delay: 0.3 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          <Icon className="s6-work-node-icon" size={18} strokeWidth={1.5} aria-hidden="true" />
          <span>{label}</span>
        </motion.div>
      ))}
    </div>
  );
}
