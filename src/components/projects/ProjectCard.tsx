"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/types";
import { cn } from "@/lib/utils";

export function ProjectCard({
  project,
  variant = "featured",
}: {
  project: Project;
  variant?: "featured" | "archive";
}) {
  const isArchive = variant === "archive";
  const TitleTag = isArchive ? "h2" : "h3";

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="group flex h-full"
    >
      <Link
        href={`/work/${project.slug}`}
        data-cursor="view"
        className="flex w-full flex-col border border-line bg-ink-2 p-5 transition-colors duration-500 hover:border-sage/50 hover:bg-ink-3 focus-visible:outline-offset-8 md:p-6"
      >
        <div className="relative aspect-[16/10] overflow-hidden border border-line-soft bg-ink-3">
          <Image
            src={project.coverImage.src}
            alt={project.coverImage.alt}
            width={project.coverImage.width}
            height={project.coverImage.height}
            sizes="(max-width: 768px) 100vw, 33vw"
            className="h-full w-full object-contain transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02]"
          />
        </div>

        <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.22em] text-sage">
          {project.category}
        </p>
        <TitleTag
          className={cn(
            "mt-2 font-display font-semibold tracking-tight text-bone transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1",
            isArchive ? "text-3xl md:text-4xl" : "text-2xl md:text-3xl",
          )}
        >
          {project.title}
        </TitleTag>

        <p className="mt-3 text-[15px] leading-relaxed text-fog">
          {isArchive ? project.fullCardDescription : project.shortDescription}
        </p>

        {isArchive && (
          <>
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1.5">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-mist">
                {project.industry}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-mist">
                {project.type}
              </span>
            </div>
            {project.services.length > 0 && (
              <ul className="mt-5 space-y-1.5">
                {project.services.map((service) => (
                  <li
                    key={service}
                    className="flex gap-2.5 text-[13px] leading-relaxed text-fog"
                  >
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-sage/70" />
                    {service}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}

        <div className="mt-auto flex flex-wrap items-end justify-between gap-x-4 gap-y-4 border-t border-line pt-6">
          <div className="flex flex-wrap gap-x-3.5 gap-y-1.5">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="font-mono text-[10px] uppercase tracking-[0.14em] text-sage/80"
              >
                {tag}
              </span>
            ))}
          </div>
          <span className="inline-flex shrink-0 items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-fog transition-colors duration-300 group-hover:text-sage">
            View Case Study
            <ArrowUpRight
              className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              strokeWidth={1.75}
            />
          </span>
        </div>
      </Link>
    </motion.article>
  );
}