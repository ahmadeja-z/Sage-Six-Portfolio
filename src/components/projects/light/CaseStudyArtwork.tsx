import Image from "next/image";
import type { ProjectImage as ProjectImageType } from "@/types";

// The one dependable artwork frame for the light Sage Six theme — shared by
// every case study and the Work page showcase. Always renders at the
// image's own intrinsic aspect ratio (`h-auto w-full object-contain`), so
// nothing is ever cropped, letterboxed or stretched.
export function CsImage({
  image,
  priority = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1280px) 92vw, 1200px",
}: {
  image: ProjectImageType;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <figure className="s6-cs-image">
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
      {image.caption && <figcaption>{image.caption}</figcaption>}
    </figure>
  );
}
