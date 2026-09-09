import { siteConfig } from "@/lib/site";
import { TextReveal } from "@/components/ui/TextReveal";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { Magnetic } from "@/components/ui/Magnetic";

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden border-t border-line py-28 md:py-36" aria-label="Start a project">
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[70vh] w-[70vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sage/[0.05] blur-[120px]"
        aria-hidden="true"
      />
      <div className="container-x relative text-center">
        <TextReveal
          as="h2"
          lines={["Put your next idea", "to work."]}
          className="display-2 font-display text-bone"
          lineClassName="text-bone"
          stagger={0.1}
        />
        <Reveal delay={0.25}>
          <p className="body-lg mx-auto mt-8 max-w-xl text-fog">
            A new app, a better website or software that simplifies your
            day-to-day work&mdash;tell us what you have in mind. We&apos;ll help
            shape the scope and a practical plan to build it.
          </p>
        </Reveal>
        <Reveal delay={0.35}>
          <div className="mt-12 flex flex-col items-center justify-center gap-6 sm:flex-row">
            <Button href="/contact" variant="primary">
              Discuss your project
            </Button>
            <Magnetic strength={0.25}>
              <a
                href={`mailto:${siteConfig.email}`}
                className="font-mono text-xs uppercase tracking-[0.2em] text-fog underline-offset-8 transition-colors hover:text-sage hover:underline"
              >
                Prefer email? {siteConfig.email}
              </a>
            </Magnetic>
          </div>
        </Reveal>
      </div>
    </section>
  );
}