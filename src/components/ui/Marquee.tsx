import { cn } from "@/lib/utils";

export function Marquee({
  items,
  className,
  duration = 38,
  reverse = false,
}: {
  items: string[];
  className?: string;
  duration?: number;
  reverse?: boolean;
}) {
  const row = [...items, ...items];

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <div
        className="marquee-track items-center"
        style={{
          ["--marquee-duration" as string]: `${duration}s`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
        aria-hidden="true"
      >
        {row.map((item, i) => (
          <span key={i} className="flex shrink-0 items-center">
            <span className="px-6 font-display text-3xl font-medium tracking-tight text-bone/45 transition-colors duration-300 hover:text-bone/90 md:text-4xl">
              {item}
            </span>
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-sage/50" />
          </span>
        ))}
      </div>
    </div>
  );
}