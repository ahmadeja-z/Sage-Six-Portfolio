import type { ProjectSection as ProjectSectionType } from "@/types";
import { Reveal } from "@/components/ui/Reveal";
import { CaseStudyImage } from "@/components/projects/CaseStudyImage";
import { FeatureList } from "@/components/projects/FeatureList";
import { TechnologyGrid } from "@/components/projects/TechnologyGrid";
import { StoreDownloadLink } from "@/components/projects/StoreDownloadLink";

function SectionHeader({ label, heading }: { label: string; heading: string }) {
  return (
    <div className="mb-8 grid gap-4 md:grid-cols-12 md:items-baseline md:mb-10">
      <span className="font-mono text-[11px] tracking-[0.24em] text-sage/70 md:col-span-2">
        {label}
      </span>
      <h2 className="display-3 font-display text-bone md:col-span-10">
        {heading}
      </h2>
    </div>
  );
}

export function CaseStudySection({ section }: { section: ProjectSectionType }) {
  switch (section.kind) {
    case "overview":
      return (
        <section aria-label={section.heading}>
          <Reveal>
            <SectionHeader label={section.label} heading={section.heading} />
          </Reveal>
          <Reveal delay={0.08}>
            <p className="body-lg max-w-3xl text-fog">{section.body}</p>
          </Reveal>
          <div className="mt-10 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2">
            {section.points.map((point, i) => (
              <Reveal key={point.title} delay={i * 0.06} y={16} className="h-full">
                <div className="flex h-full flex-col bg-ink-2 p-6 transition-colors duration-300 hover:bg-ink-3 md:p-7">
                  <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-bone">
                    {point.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-fog">
                    {point.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      );

    case "prose":
      return (
        <section aria-label={section.heading}>
          <Reveal>
            <SectionHeader label={section.label} heading={section.heading} />
          </Reveal>
          <Reveal delay={0.08}>
            <p className="body-lg max-w-3xl text-fog">{section.body}</p>
          </Reveal>
          {section.steps && section.steps.length > 0 && (
            <Reveal delay={0.12}>
              <ol className="mt-8 flex flex-wrap items-center gap-x-2 gap-y-3">
                {section.steps.map((step, i) => (
                  <li key={step} className="flex items-center gap-2">
                    <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-sage/80">
                      {step}
                    </span>
                    {i < section.steps!.length - 1 && (
                      <span className="font-mono text-[11px] text-mist" aria-hidden="true">
                        →
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </Reveal>
          )}
          {section.features && section.features.length > 0 && (
            <Reveal delay={0.12}>
              <ul className="mt-8 flex max-w-3xl flex-wrap gap-2">
                {section.features.map((feature) => (
                  <li
                    key={feature}
                    className="border border-line px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-fog"
                  >
                    {feature}
                  </li>
                ))}
              </ul>
            </Reveal>
          )}
          {section.points && section.points.length > 0 && (
            <div className="mt-10 grid gap-px overflow-hidden border border-line bg-line md:grid-cols-3">
              {section.points.map((point, i) => (
                <Reveal key={point.title} delay={i * 0.08} y={16} className="h-full">
                  <div className="flex h-full flex-col bg-ink-2 p-7 transition-colors duration-300 hover:bg-ink-3 md:p-8">
                    <span className="font-mono text-[10px] tracking-[0.24em] text-sage/60">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-5 font-display text-xl font-medium tracking-tight text-bone">
                      {point.title}
                    </h3>
                    {point.body && (
                      <p className="mt-3 text-[15px] leading-relaxed text-fog">{point.body}</p>
                    )}
                    {point.items && point.items.length > 0 && (
                      <ul className="mt-4 space-y-2">
                        {point.items.map((item) => (
                          <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-fog">
                            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-sage/70" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </Reveal>
              ))}
            </div>
          )}
          {section.images && section.images.length > 0 ? (
            <div className="mt-12 space-y-12">
              {section.images.map((image) => (
                <CaseStudyImage key={image.src} image={image} />
              ))}
            </div>
          ) : (
            section.image && (
              <div className="mt-12">
                <CaseStudyImage image={section.image} />
              </div>
            )
          )}
        </section>
      );

    case "split":
      return (
        <section aria-label={section.challengeHeading}>
          <Reveal>
            <SectionHeader label={section.label} heading={section.challengeHeading} />
          </Reveal>
          <Reveal delay={0.08}>
            <p className="body-lg max-w-3xl text-fog">{section.challenge}</p>
          </Reveal>
          <Reveal delay={0.12}>
            <div className="mt-14 border-t border-line pt-10">
              <p className="eyebrow mb-4">The solution</p>
              <h3 className="font-display text-3xl font-medium tracking-tight text-bone md:text-4xl">
                {section.solutionHeading}
              </h3>
              <p className="mt-5 max-w-3xl text-[15px] leading-relaxed text-fog md:text-base">
                {section.solution}
              </p>
            </div>
          </Reveal>
          {section.image && (
            <div className="mt-12">
              <CaseStudyImage image={section.image} />
            </div>
          )}
        </section>
      );

    case "feature":
      return (
        <section aria-label={section.heading}>
          <Reveal>
            <SectionHeader label={section.label} heading={section.heading} />
          </Reveal>
          <div className="grid gap-10 lg:grid-cols-2">
            <Reveal delay={0.08}>
              <p className="text-[15px] leading-relaxed text-fog md:text-base">
                {section.body}
              </p>
              <div className="mt-8">
                <FeatureList features={section.features} />
              </div>
              {section.storeLink && (
                <div className="mt-8 max-w-sm">
                  <StoreDownloadLink
                    appName={section.storeLink.title}
                    url={section.storeLink.url}
                    eyebrow={section.storeLink.eyebrow}
                    ariaLabel={section.storeLink.ariaLabel}
                  />
                </div>
              )}
            </Reveal>
            <div className="lg:pt-2">
              <CaseStudyImage image={section.image} sizes="(max-width: 768px) 100vw, 40vw" />
            </div>
          </div>
        </section>
      );

    case "engineering":
      return (
        <section aria-label={section.heading}>
          <Reveal>
            <SectionHeader label={section.label} heading={section.heading} />
          </Reveal>
          <Reveal delay={0.08}>
            <p className="body-lg max-w-3xl text-fog">{section.intro}</p>
          </Reveal>
          <div className="mt-10">
            <TechnologyGrid stack={section.stack} />
          </div>
        </section>
      );

    case "solutions":
      return (
        <section aria-label={section.heading}>
          <Reveal>
            <SectionHeader label={section.label} heading={section.heading} />
          </Reveal>
          <div className="grid gap-px overflow-hidden border border-line bg-line md:grid-cols-3">
            {section.blocks.map((block, i) => (
              <Reveal key={block.title} delay={i * 0.08} y={16} className="h-full">
                <div className="flex h-full flex-col bg-ink-2 p-7 transition-colors duration-300 hover:bg-ink-3 md:p-8">
                  <span className="font-mono text-[10px] tracking-[0.24em] text-sage/60">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-5 font-display text-xl font-medium tracking-tight text-bone">
                    {block.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-fog">
                    {block.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      );

    case "outcome":
      return (
        <section aria-label={section.heading}>
          <Reveal>
            <SectionHeader label={section.label} heading={section.heading} />
          </Reveal>
          <Reveal delay={0.08}>
            <p className="body-lg max-w-3xl text-fog">{section.body}</p>
          </Reveal>
          <div className="mt-12">
            <CaseStudyImage image={section.image} />
          </div>
        </section>
      );
  }
}