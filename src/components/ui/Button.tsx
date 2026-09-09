import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Magnetic } from "@/components/ui/Magnetic";

type ButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "outline" | "ghost";
  className?: string;
  external?: boolean;
  magnetic?: boolean;
  arrow?: boolean;
};

const base =
  "group inline-flex items-center gap-2.5 whitespace-nowrap font-mono text-xs uppercase tracking-[0.18em] transition-colors duration-300";

const variants: Record<string, string> = {
  primary:
    "bg-bone text-ink px-7 py-4 hover:bg-sage-bright focus-visible:bg-sage-bright",
  outline:
    "border border-line px-7 py-4 text-bone hover:border-sage hover:text-sage",
  ghost: "px-0 py-2 text-bone hover:text-sage",
};

export function Button({
  href,
  children,
  variant = "primary",
  className,
  external = false,
  magnetic = true,
  arrow = true,
}: ButtonProps) {
  const content = (
    <>
      <span>{children}</span>
      {arrow && (
        <ArrowUpRight
          className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          strokeWidth={1.75}
        />
      )}
    </>
  );

  const classes = cn(base, variants[variant], className);

  if (magnetic) {
    return (
      <Magnetic>
        {external ? (
          <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
            {content}
          </a>
        ) : (
          <Link href={href} className={classes}>
            {content}
          </Link>
        )}
      </Magnetic>
    );
  }

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  );
}