import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

const HORIZONTAL = { width: 790, height: 316 };
const ICON = { width: 1254, height: 1254 };

// Cache-buster: bump when logo artwork is replaced so browsers and the
// image optimizer fetch the new file instead of a cached copy.
const VERSION = "v=2";

type LogoVariant = "color" | "white" | "icon";
type LogoSize = "header" | "mobile" | "footer" | "small";

const iconHeights: Record<LogoSize, string> = {
  header: "h-8",
  mobile: "h-8",
  footer: "h-10",
  small: "h-7",
};

const horizontalWidths: Record<LogoSize, string> = {
  header: "w-[120px] md:w-[150px]",
  mobile: "w-[120px]",
  footer: "w-[170px]",
  small: "w-[110px]",
};

/**
 * Shared Sage Six brand logo.
 *
 * Variants:
 * - "color" — full-colour horizontal wordmark (navbar / footer)
 * - "white" — all-white horizontal wordmark (dark overlays / monochrome sections)
 * - "icon"  — standalone sage icon mark (compact nav, favicon source, small brand)
 *
 * Sizing preserves the natural aspect ratio; horizontal variants size by width,
 * the square icon by height. The link always points to the homepage.
 */
export function Logo({
  variant = "color",
  size = "header",
  className,
}: {
  variant?: LogoVariant;
  size?: LogoSize;
  className?: string;
}) {
  const isIcon = variant === "icon";
  const src = isIcon
    ? `/images/sagesix-icon.png?${VERSION}`
    : variant === "white"
      ? `/images/sagesix-logo-white.png?${VERSION}`
      : `/images/sagesix-logo-color.png?${VERSION}`;
  const dims = isIcon ? ICON : HORIZONTAL;
  const priority = size === "header" || size === "mobile";
  const sizeClass = isIcon ? cn("w-auto", iconHeights[size]) : cn("h-auto", horizontalWidths[size]);

  return (
    <Link
      href="/"
      aria-label="SageSix home"
      className={cn("inline-flex shrink-0 items-center", className)}
    >
      <Image
        src={src}
        alt=""
        width={dims.width}
        height={dims.height}
        priority={priority}
        sizes={isIcon ? "40px" : "180px"}
        className={sizeClass}
      />
    </Link>
  );
}