import { technologies } from "@/data/content";
import { Marquee } from "@/components/ui/Marquee";

export function Technology() {
  return (
    <section className="relative overflow-hidden border-y border-line bg-ink-2 py-16 md:py-24" aria-label="Technologies we use">
      <p className="container-x mb-10 text-center font-mono text-[11px] uppercase tracking-[0.28em] text-mist">
        Technologies we build with
      </p>
      <Marquee items={technologies} duration={34} className="border-y border-line py-6" />
      <Marquee items={technologies} duration={40} reverse className="pt-6" />
    </section>
  );
}