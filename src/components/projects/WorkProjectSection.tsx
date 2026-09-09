"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/types";
import { cn } from "@/lib/utils";

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

const rise: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

const tagStagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.15 } },
};

const tagItem: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export function WorkProjectSection({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const reduce = useReducedMotion();
  const number = String(index + 1).padStart(2, "0");
  const imageLeft = index % 2 === 0;

  return (
    <section
      aria-label={`${project.title} case study`}
      className={cn(index > 0 && "border-t border-line")}
    >
      <div className="container-x grid gap-10 py-20 md:py-28 lg:grid-cols-2 lg:items-start">
        <motion.div
          variants={fadeIn}
          initial={reduce ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className={cn(
            "flex flex-col",
            imageLeft ? "lg:col-start-2 lg:row-start-1" : "lg:col-start-1 lg:row-start-1",
          )}
        >
          <motion.div
            variants={fadeIn}
            initial={reduce ? "visible" : "hidden"}
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="flex items-baseline gap-5"
          >
            <span className="font-mono text-sm tracking-[0.24em] text-sage">{number}</span>
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-mist">
              {project.category}
            </span>
          </motion.div>

          <motion.h2
            variants={rise}
            initial={reduce ? "visible" : "hidden"}
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="mt-6 font-display text-4xl font-semibold tracking-tight text-bone md:text-6xl"
          >
            {project.title}
          </motion.h2>

          <motion.p
            variants={rise}
            initial={reduce ? "visible" : "hidden"}
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="body-lg mt-6 max-w-xl text-fog"
          >
            {project.shortDescription}
          </motion.p>

          <motion.ul
            variants={tagStagger}
            initial={reduce ? "visible" : "hidden"}
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="mt-8 flex flex-wrap gap-x-5 gap-y-2"
          >
            {project.tags.map((tag) => (
              <motion.li
                key={tag}
                variants={tagItem}
                className="font-mono text-[10px] uppercase tracking-[0.16em] text-sage/80"
              >
                {tag}
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>

        <motion.div
          initial={reduce ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.98, y: 24 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            "group relative aspect-[16/10] overflow-hidden border border-line-soft bg-ink-3",
            imageLeft ? "lg:col-start-1 lg:row-start-1" : "lg:col-start-2 lg:row-start-1",
          )}
        >
          <Image
            src={project.coverImage.src}
            alt={project.coverImage.alt}
            width={project.coverImage.width}
            height={project.coverImage.height}
            sizes="(max-width: 768px) 100vw, 50vw"
            className="h-full w-full object-contain transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.01]"
          />
        </motion.div>

        <motion.div
          variants={rise}
          initial={reduce ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className={cn(
            imageLeft ? "lg:col-start-2 lg:row-start-2" : "lg:col-start-1 lg:row-start-2",
          )}
        >
          <Link
            href={`/work/${project.slug}`}
            data-cursor="hover"
            className="group inline-flex items-center gap-2.5 border border-line px-6 py-3.5 font-mono text-xs uppercase tracking-[0.2em] text-bone transition-colors duration-300 hover:border-sage hover:text-sage"
          >
            View {project.title} Case Study
            <ArrowUpRight
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              strokeWidth={1.75}
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}