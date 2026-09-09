"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { HeroVisual } from "@/components/hero/HeroVisual";
import { EngagementPathways } from "@/components/hero/EngagementPathways";

const container: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.09, delayChildren: 0.15 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

const proof = [
  { value: "50+", label: "Projects delivered" },
  { value: "Mobile · Web · Software", label: "Development expertise" },
  { value: "Ongoing support", label: "Beyond the initial launch" },
];

export function Hero() {
  const reduce = useReducedMotion();
  const initial = reduce ? "visible" : "hidden";

  return (
    <section className="relative overflow-hidden pb-16 pt-36 md:pb-24 md:pt-44">
      <motion.div
        initial={reduce ? { opacity: 1 } : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.1, ease: "easeOut" }}
        className="absolute inset-0"
      >
        <HeroVisual />
      </motion.div>

      <div className="container-x relative">
        <motion.div
          variants={container}
          initial={initial}
          animate="visible"
          className="grid gap-12 lg:grid-cols-12 lg:items-center"
        >
          <div className="lg:col-span-7">
            <motion.p variants={item} className="eyebrow mb-7">
              App, Web &amp; Software Development
            </motion.p>

            <h1 className="display-2 max-w-[16ch] font-display text-bone">
              Mobile apps, websites and custom software. Built for your business.
            </h1>

            <motion.p variants={item} className="body-lg mt-7 max-w-xl text-fog">
              Sage Six designs and develops mobile apps, websites and custom
              software, with ongoing technical support as your business grows.
            </motion.p>

            <motion.div variants={item} className="mt-10 flex flex-wrap items-center gap-5">
              <Button href="/contact">Start a project</Button>
              <Button href="#work" variant="ghost">
                View our work
              </Button>
            </motion.div>

            <motion.dl variants={item} className="mt-12 grid max-w-lg gap-px overflow-hidden border border-line bg-line sm:grid-cols-3">
              {proof.map((p) => (
                <div key={p.label} className="flex flex-col justify-between bg-ink-2 p-4">
                  <dt className="font-mono text-[9px] uppercase tracking-[0.18em] text-mist">
                    {p.label}
                  </dt>
                  <dd className="mt-4 font-display text-lg font-semibold tracking-tight text-bone">
                    {p.value}
                  </dd>
                </div>
              ))}
            </motion.dl>
          </div>

          <motion.div variants={item} className="lg:col-span-5">
            <EngagementPathways />
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 md:block"
        aria-hidden="true"
      >
        <a href="#work" className="flex flex-col items-center gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-mist">
            Scroll
          </span>
          <span className="block h-12 w-px overflow-hidden bg-line">
            <span className="scroll-line block h-full w-full bg-sage" />
          </span>
        </a>
      </motion.div>
    </section>
  );
}