import { TextReveal } from "@/components/ui/TextReveal";
import { Reveal } from "@/components/ui/Reveal";

export function PageHeader({
  eyebrow,
  lines,
  description,
}: {
  eyebrow: string;
  lines: string[];
  description?: string;
}) {
  return (
    <header className="relative border-b border-line pb-16 pt-40 md:pb-24 md:pt-52">
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[60vh] w-[70vw] -translate-x-1/2 rounded-full bg-sage/[0.05] blur-[130px]"
        aria-hidden="true"
      />
      <div className="container-x relative">
        <p className="eyebrow mb-8">{eyebrow}</p>
        <TextReveal
          as="h1"
          lines={lines}
          className="display-2 max-w-5xl font-display text-bone"
          lineClassName="text-bone"
          stagger={0.09}
        />
        {description && (
          <Reveal delay={0.25}>
            <p className="body-lg mt-8 max-w-2xl text-fog">{description}</p>
          </Reveal>
        )}
      </div>
    </header>
  );
}