"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useReducedMotion } from "framer-motion";
import { process as processSteps } from "@/data/content";
import { TextReveal } from "@/components/ui/TextReveal";
import { Reveal } from "@/components/ui/Reveal";

export function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.75", "end 0.65"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 26 });

  return (
    <section className="relative border-t border-line bg-ink-2 py-24 md:py-36" aria-label="How we build">
      <div className="container-x">
        <p className="eyebrow mb-8">How we build</p>
        <TextReveal
          as="h2"
          lines={["From problem to product,", "the same way every time."]}
          className="display-2 font-display text-bone"
          lineClassName="text-bone"
          stagger={0.1}
        />

        <div ref={ref} className="relative mt-16 md:mt-24">
          <div
            className="absolute bottom-0 left-[7px] top-0 w-px bg-line md:left-[11px]"
            aria-hidden="true"
          />
          {!reduce && (
            <motion.div
              className="absolute bottom-0 left-[7px] top-0 w-px origin-top bg-sage md:left-[11px]"
              style={{ scaleY: progress }}
              aria-hidden="true"
            />
          )}

          <ul className="space-y-14 md:space-y-20">
            {processSteps.map((step) => (
              <li key={step.index}>
                <Reveal y={20}>
                  <div className="relative grid grid-cols-[32px_1fr] gap-5 md:grid-cols-[48px_1fr] md:gap-10">
                    <span className="relative z-10 mt-1.5 flex h-4 w-4 items-center justify-center">
                      <span className="h-[9px] w-[9px] rounded-full border border-sage bg-ink-2 md:h-[13px] md:w-[13px]" />
                    </span>
                    <div className="grid gap-3 md:grid-cols-[120px_1fr]">
                      <span className="font-mono text-[11px] tracking-[0.24em] text-sage/70 md:pt-2">
                        {step.index}
                      </span>
                      <div>
                        <h3 className="font-display text-3xl font-medium tracking-tight text-bone md:text-4xl">
                          {step.title}
                        </h3>
                        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-fog md:text-base">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}