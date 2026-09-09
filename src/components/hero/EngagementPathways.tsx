"use client";

import { motion, useReducedMotion } from "framer-motion";

const pathways = [
  {
    num: "01",
    title: "Build something new",
    description: "Shape and deliver an app, website or custom software product.",
  },
  {
    num: "02",
    title: "Improve what exists",
    description: "Review, modernise and extend an existing digital platform.",
  },
  {
    num: "03",
    title: "Support and scale",
    description: "Maintain the software or add development expertise to your team.",
  },
];

export function EngagementPathways() {
  const reduce = useReducedMotion();

  return (
    <div className="border border-line bg-ink-2/80 p-6">
      <p className="eyebrow">How we engage</p>

      <div className="mt-5 border border-line bg-ink-3 px-5 py-4 text-center">
        <p className="font-display text-lg font-semibold tracking-tight text-bone">
          Sage Six
        </p>
        <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.18em] text-fog">
          Product thinking · Design · Engineering
        </p>
      </div>

      <div className="flex justify-center" aria-hidden="true">
        <motion.span
          initial={reduce ? { scaleY: 1 } : { scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="block h-6 w-px origin-top bg-sage/60"
        />
      </div>

      <ul className="relative mt-4 space-y-3">
        <span
          className="absolute bottom-3 left-[5px] top-1 w-px bg-line"
          aria-hidden="true"
        />
        {pathways.map((path) => (
          <li
            key={path.num}
            className="group relative border border-line bg-ink-3 p-4 transition-colors duration-300 hover:border-sage/50 focus-within:border-sage/50"
          >
            <span
              className="absolute left-[1px] top-4 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-sage/60 transition-colors duration-300 group-hover:bg-sage"
              aria-hidden="true"
            />
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-[10px] tracking-[0.2em] text-sage">
                {path.num}
              </span>
              <p className="font-display text-base font-medium tracking-tight text-bone">
                {path.title}
              </p>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-fog">{path.description}</p>
          </li>
        ))}
      </ul>

      <div className="mt-5 border-t border-line pt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-mist">
        Discover <span className="text-sage/70">→</span> Design{" "}
        <span className="text-sage/70">→</span> Build{" "}
        <span className="text-sage/70">→</span> Support
      </div>
    </div>
  );
}