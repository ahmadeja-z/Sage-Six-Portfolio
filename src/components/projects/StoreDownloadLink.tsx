import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

function GooglePlayIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M3.6 1.8 13.8 12 3.6 22.2c-.3-.2-.6-.6-.6-1.2V3c0-.6.3-1 .6-1.2z" />
      <path d="M15.6 10.2 17.9 8 5.9 1.4c-.5-.3-1-.2-1.5.1l11.2 8.7z" />
      <path d="M17.9 8l-2.3 2.2L17.9 16l2.5-1.4c1-.6 1-2 0-2.6L17.9 8z" />
      <path d="M15.6 13.8 5.9 22.6c.5.3 1 .4 1.5.1L17.9 16l-2.3-2.2z" />
    </svg>
  );
}

/**
 * Reusable store-download link rendered as a real crawlable anchor.
 * Opens the store page in a new tab. Hover introduces the project accent
 * and nudges the external-link arrow.
 *
 * Optional analytics: pass `analyticsId` only once an analytics provider
 * exists in the application. No provider is configured today.
 */
export function StoreDownloadLink({
  appName,
  url,
  eyebrow = "Available on Google Play",
  ariaLabel,
  compact = false,
  analyticsId,
  className,
}: {
  appName: string;
  url: string;
  eyebrow?: string;
  ariaLabel: string;
  compact?: boolean;
  analyticsId?: string;
  className?: string;
}) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      onClick={
        analyticsId
          ? () => {
              // Analytics wiring point — no provider is configured today.
            }
          : undefined
      }
      className={cn(
        "group inline-flex items-center gap-3 border border-line bg-ink-2 px-4 text-left transition-colors duration-300 hover:border-sage hover:bg-ink-3 focus-visible:border-sage",
        compact ? "min-h-[44px]" : "min-h-[48px] w-full",
        className,
      )}
    >
      <GooglePlayIcon className="h-4 w-4 shrink-0 text-bone transition-colors duration-300 group-hover:text-sage" />
      <span className="min-w-0">
        {eyebrow && (
          <span className="block truncate font-mono text-[9px] uppercase tracking-[0.18em] text-mist transition-colors duration-300 group-hover:text-fog">
            {eyebrow}
          </span>
        )}
        <span className="block truncate text-sm font-medium text-bone transition-colors duration-300 group-hover:text-sage">
          {appName}
        </span>
      </span>
      <ArrowUpRight
        className="ml-auto h-4 w-4 shrink-0 text-mist transition-[transform,color] duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-sage"
        strokeWidth={1.75}
      />
    </a>
  );
}