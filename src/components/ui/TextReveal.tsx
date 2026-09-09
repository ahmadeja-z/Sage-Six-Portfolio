"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

const container: Variants = {
  hidden: {},
  visible: (stagger: number) => ({
    transition: { staggerChildren: stagger },
  }),
};

const line: Variants = {
  hidden: { y: "115%" },
  visible: {
    y: "0%",
    transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
  },
};

type Tag = "h1" | "h2" | "h3" | "p" | "div";

const MotionTag = {
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  p: motion.p,
  div: motion.div,
} as const;

export function TextReveal({
  lines,
  className,
  lineClassName,
  lineClassNameAlt,
  stagger = 0.08,
  as = "div",
}: {
  lines: string[];
  className?: string;
  lineClassName?: string;
  lineClassNameAlt?: string;
  stagger?: number;
  as?: Tag;
}) {
  const reduce = useReducedMotion();
  const isLast = (i: number) => i === lines.length - 1;
  const Tag = MotionTag[as];

  if (reduce) {
    return (
      <Tag className={cn("block", className)}>
        {lines.map((t, i) => (
          <span
            key={i}
            className={cn("block", lineClassNameAlt && isLast(i) && lineClassNameAlt)}
          >
            {t}
          </span>
        ))}
      </Tag>
    );
  }

  return (
    <Tag
      className={cn("block", className)}
      variants={container}
      custom={stagger}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
    >
      {lines.map((t, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em]">
          <motion.span
            variants={line}
            className={cn(
              "block will-change-transform",
              lineClassName,
              lineClassNameAlt && isLast(i) && lineClassNameAlt,
            )}
          >
            {t}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}