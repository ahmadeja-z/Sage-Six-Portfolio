import type { ImageLoaderProps } from "next/image";

// Pre-optimized variants avoid runtime conversion of these fixed, approved artworks.
const widths = [480, 768, 1080, 1440, 1672] as const;
export function projectImageLoader({ src, width }: ImageLoaderProps) {
  const selected =
    widths.find((size) => size >= width) ?? widths[widths.length - 1];
  const filename = src
    .split("/")
    .pop()
    ?.replace(/\.png$/, "");
  return `/images/case-studies/optimized/${filename}-${selected}.webp`;
}
