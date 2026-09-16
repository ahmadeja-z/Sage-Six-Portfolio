import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { homeServices } from "@/data/content";
import { TextReveal } from "@/components/ui/TextReveal";
import { Reveal } from "@/components/ui/Reveal";

export function Services() {
  return (
    <section id="services" className="relative scroll-mt-20 border-y border-line bg-ink-2 py-24 md:py-32" aria-label="Services">
      <div className="container-x">
        <div className="max-w-3xl">
          <p className="eyebrow mb-6">How we can help</p>
          <TextReveal
            as="h2"
            lines={["From the first build to", "ongoing support."]}
            className="display-3 font-display text-bone"
            lineClassName="text-bone"
            stagger={0.08}
          />
          <Reveal delay={0.1}>
            <p className="body-lg mt-6 text-fog">
              Work with Sage Six on a new product, improvements to an existing
              platform or additional development support for your team.
            </p>
          </Reveal>
        </div>

        <ul className="mt-14 md:mt-20">
          {homeServices.map((service, i) => (
            <li key={service.title}>
              <Reveal y={16} delay={0.04}>
                <div className="hairline-t group flex flex-col gap-3 py-7 transition-colors duration-300 hover:bg-ink-3/40 md:flex-row md:items-baseline md:gap-12 md:px-6 md:py-8">
                  <span className="w-12 shrink-0 font-mono text-[11px] tracking-[0.24em] text-sage/70">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="w-full shrink-0 font-display text-2xl font-medium tracking-tight text-bone transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 md:w-2/5 md:text-3xl">
                    {service.title}
                  </h3>
                  <p className="max-w-md text-[15px] leading-relaxed text-fog md:w-1/2 md:text-base">
                    {service.description}
                  </p>
                </div>
              </Reveal>
            </li>
          ))}
          <li className="hairline-t h-px bg-line" aria-hidden="true" />
        </ul>

        <Reveal delay={0.1}>
          <Link
            href="/expertise"
            className="group mt-10 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-fog transition-colors hover:text-sage"
          >
            Explore our services
            <ArrowRight
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              strokeWidth={1.75}
            />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}