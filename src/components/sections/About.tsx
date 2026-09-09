import { aboutBlocks } from "@/data/content";
import { TextReveal } from "@/components/ui/TextReveal";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";

export function About() {
  return (
    <section className="relative py-24 md:py-36" aria-label="About SageSix">
      <div className="container-x grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <p className="eyebrow mb-8">About</p>
          <TextReveal
            as="h2"
            lines={["We&apos;re a small team", "building big ideas."]}
            className="display-2 font-display text-bone"
            lineClassName="text-bone"
            stagger={0.1}
          />
          <Reveal delay={0.2}>
            <p className="body-lg mt-8 max-w-md text-fog">
              SageSix is a software and AI company focused on helping ambitious
              businesses transform ideas into reliable digital products. Small
              enough to move fast. Rigorous enough to build things that last.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="mt-10">
              <Button href="/about" variant="outline">
                More about us
              </Button>
            </div>
          </Reveal>
        </div>

        <div className="grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:col-span-7">
            {aboutBlocks.map((block, i) => (
              <Reveal key={block.label} delay={(i % 2) * 0.08} y={20} className="h-full">
                <div className="flex h-full flex-col bg-ink-2 p-8 transition-colors duration-500 hover:bg-ink-3 md:p-10">
                  <h3 className="eyebrow">{block.label}</h3>
                  <p className="mt-6 text-[15px] leading-relaxed text-fog md:text-base">
                    {block.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
      </div>
    </section>
  );
}