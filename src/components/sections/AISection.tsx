import { aiAreas } from "@/data/content";
import { AIConnect } from "@/components/sections/AIConnect";
import { Reveal } from "@/components/ui/Reveal";
import { TextReveal } from "@/components/ui/TextReveal";

export function AISection() {
  return (
    <section className="relative overflow-hidden py-24 md:py-36" aria-label="AI and automation">
      <div className="container-x">
        <div className="max-w-4xl">
          <p className="eyebrow mb-8">AI</p>
          <TextReveal
            as="h2"
            lines={["AI is changing how", "products are built."]}
            className="display-2 font-display text-bone"
            lineClassName="text-bone"
            stagger={0.1}
          />
          <Reveal delay={0.2}>
            <p className="body-lg mt-8 max-w-2xl text-fog">
              SageSix uses AI not only inside products, but throughout the way we
              design, engineer and operate digital businesses.
            </p>
          </Reveal>
        </div>

        <AIConnect />

        <ul className="mt-12 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 md:mt-16 lg:grid-cols-4">
          {aiAreas.map((area, i) => (
            <li key={area.title} className="h-full">
              <Reveal delay={(i % 4) * 0.08} y={20} className="h-full">
                <div className="group flex h-full flex-col gap-6 bg-ink p-7 transition-colors duration-500 hover:bg-ink-3 md:p-8">
                  <span className="h-8 w-8 rounded-full border border-sage/40 transition-colors duration-500 group-hover:bg-sage/15" />
                  <div>
                    <h3 className="font-display text-xl font-medium tracking-tight text-bone">
                      {area.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-fog">
                      {area.description}
                    </p>
                  </div>
                  <span className="font-mono text-[10px] tracking-[0.2em] text-sage/60">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}