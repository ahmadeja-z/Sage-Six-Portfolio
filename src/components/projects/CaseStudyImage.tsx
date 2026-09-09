"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import type { ProjectImage as ProjectImageType } from "@/types";
import { cn } from "@/lib/utils";

// Editorial case-study image.
//
// Renders at the image's natural aspect ratio (width 100%, height auto) so the
// full artwork is always visible — no cropping of the top, sides, or bottom.
// The reveal animation animates opacity and a subtle scale on the complete
// image frame, so nothing is clipped during or after the transition.
//
// Portfolio card thumbnails (which may intentionally crop) use their own
// object-cover layout in ProjectCard; they are intentionally not affected.
export function CaseStudyImage({
  image,
  className,
  priority = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1280px) 92vw, 1200px",
}: {
  image: ProjectImageType;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <figure
      className={cn("w-full", className)}
    >
      <motion.div
        initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.985, y: 18 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="overflow-visible rounded-xl border border-line-soft bg-ink-3"
      >
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          sizes={sizes}
          preload={priority}
          loading={priority ? "eager" : "lazy"}
          className="block h-auto w-full object-contain object-center"
        />
      </motion.div>
      {image.caption && (
        <figcaption className="mt-3 max-w-3xl font-mono text-[11px] uppercase leading-relaxed tracking-[0.14em] text-mist">
          {image.caption}
        </figcaption>
      )}
    </figure>
  );
}