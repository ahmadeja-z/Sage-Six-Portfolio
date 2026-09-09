import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { services, engagementOptions, serviceDeliverySteps, serviceFaqs } from "@/data/content";
import { getProject } from "@/data/projects";
import { getInsight } from "@/data/insights";
import type { Service } from "@/types";
import { siteConfig } from "@/lib/site";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: { absolute: "Software Development & Technical Support Services | Sage Six" },
  description:
    "Explore Sage Six services for mobile apps, websites, custom software, AI integration, technical support and development team extension.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Software Development & Technical Support Services | Sage Six",
    description:
      "Mobile apps, websites, custom software, AI integration, technical support and development team extension from Sage Six.",
    url: `${siteConfig.url}/services`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Software Development & Technical Support Services | Sage Six",
    description:
      "Mobile apps, websites, custom software, AI integration and development team extension.",
  },
};

const practiceProjects = ["speezu", "leicester-medical-society", "durafoam-3d-foam-configurator-shopify"]
  .map((slug) => getProject(slug))
  .filter(Boolean) as NonNullable<ReturnType<typeof getProject>>[];

const serviceJsonLd = services.map((service) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  name: service.title,
  serviceType: service.title,
  description: service.intro,
  provider: { "@id": `${siteConfig.url}/#organization` },
  url: `${siteConfig.url}/services#${service.anchor}`,
}));

function ServiceRow({ service }: { service: Service }) {
  const caseStudy = service.caseStudy ? getProject(service.caseStudy) : undefined;
  const insight = service.insight ? getInsight(service.insight) : undefined;

  return (
    <li id={service.anchor} className="scroll-mt-28">
      <Reveal y={16} delay={0.04}>
        <div className="hairline-t grid gap-8 py-14 transition-colors duration-300 hover:bg-ink-2/40 md:grid-cols-12 md:gap-10 md:px-6 md:py-16">
          <span className="font-mono text-[11px] tracking-[0.24em] text-sage/70 md:col-span-1">
            {service.index}
          </span>
          <div className="md:col-span-5">
            <h2 className="font-display text-3xl font-medium tracking-tight text-bone md:text-4xl">
              {service.title}
            </h2>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-fog md:text-base">
              {service.intro}
            </p>
            {service.supporting && (
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-fog">
                {service.supporting}
              </p>
            )}
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-fog">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-mist">
                Best fit
              </span>{" "}
              {service.bestFit}
            </p>
            {service.howItWorks && (
              <div className="mt-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-mist">
                  How it works
                </p>
                <ul className="mt-2 space-y-1.5">
                  {service.howItWorks.map((step) => (
                    <li key={step} className="flex gap-2.5 text-sm leading-relaxed text-fog">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-sage/70" />
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
              <Link
                href={`/contact?service=${service.anchor}`}
                className="group inline-flex items-center gap-2.5 bg-bone px-6 py-3.5 font-mono text-xs uppercase tracking-[0.18em] text-ink transition-colors duration-300 hover:bg-sage-bright"
              >
                {service.cta}
                <ArrowUpRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  strokeWidth={1.75}
                />
              </Link>
              {caseStudy && (
                <Link
                  href={`/work/${caseStudy.slug}`}
                  className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-sage transition-colors hover:text-sage-bright"
                >
                  Relevant work: {caseStudy.title}
                  <ArrowUpRight
                    className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    strokeWidth={1.75}
                  />
                </Link>
              )}
              {insight && insight.published && (
                <Link
                  href={`/insights/${insight.slug}`}
                  className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-mist transition-colors hover:text-sage"
                >
                  Guide: {insight.title}
                  <ArrowRight
                    className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                    strokeWidth={1.75}
                  />
                </Link>
              )}
            </div>
          </div>
          <div className="md:col-span-6">
            {service.scope && service.scope.length > 0 && (
              <div className="border-l border-line pl-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-mist">
                  What an engagement can include
                </p>
                <ul className="mt-4 space-y-2.5">
                  {service.scope.map((item) => (
                    <li key={item} className="flex gap-3 text-[15px] leading-relaxed text-fog">
                      <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-sage/70" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </Reveal>
    </li>
  );
}

export default function ServicesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />

      <header className="relative overflow-hidden border-b border-line pb-16 pt-40 md:pb-24 md:pt-52">
        <div
          className="pointer-events-none absolute left-1/2 top-0 h-[60vh] w-[70vw] -translate-x-1/2 rounded-full bg-sage/[0.06] blur-[130px]"
          aria-hidden="true"
        />
        <div className="container-x relative">
          <Reveal>
            <p className="eyebrow mb-8">
              Services · Design · Development · Technical Support
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="display-2 max-w-5xl font-display text-bone md:display-1">
              Software development services, built around your business.
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="body-lg mt-8 max-w-2xl text-fog">
              Sage Six helps businesses plan, design, build and maintain mobile
              applications, websites and custom software. We also support existing
              products and extend in-house teams with development expertise
              matched to the work.
            </p>
          </Reveal>
          <Reveal delay={0.22}>
            <p className="body-lg mt-6 max-w-2xl text-fog">
              Start with a new idea, improve a product already in use, or bring
              additional technical support into your team.
            </p>
          </Reveal>
          <Reveal delay={0.28}>
            <div className="mt-10 flex flex-wrap items-center gap-5">
              <Button href="/contact">Discuss Your Project</Button>
              <Button href="#services" variant="outline">
                Explore Our Services
              </Button>
            </div>
          </Reveal>
        </div>
      </header>

      <section id="services" className="container-x scroll-mt-28 py-20 md:py-28" aria-label="Services">
        <ol className="list-none p-0">
          {services.map((service) => (
            <ServiceRow key={service.anchor} service={service} />
          ))}
        </ol>
      </section>

      <section
        className="border-t border-line bg-ink-2 py-20 md:py-28"
        aria-label="Engagement options"
      >
        <div className="container-x">
          <div className="mb-10 grid gap-4 md:grid-cols-12 md:items-baseline">
            <p className="eyebrow md:col-span-3">Engagement</p>
            <h2 className="display-3 font-display text-bone md:col-span-9">
              Choose the support your business needs.
            </h2>
          </div>
          <Reveal>
            <p className="body-lg max-w-3xl text-fog">
              We can take responsibility for an agreed project, support software
              already in use or contribute development expertise alongside your
              existing team.
            </p>
          </Reveal>
          <div className="mt-10 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left">
              <thead>
                <tr className="border-b border-line">
                  <th scope="col" className="pb-4 pr-6 font-mono text-[10px] uppercase tracking-[0.18em] text-sage">
                    Engagement
                  </th>
                  <th scope="col" className="pb-4 pr-6 font-mono text-[10px] uppercase tracking-[0.18em] text-mist">
                    Suitable when
                  </th>
                  <th scope="col" className="pb-4 font-mono text-[10px] uppercase tracking-[0.18em] text-mist">
                    Working arrangement
                  </th>
                </tr>
              </thead>
              <tbody>
                {engagementOptions.map((opt) => (
                  <tr key={opt.title} className="border-b border-line align-top">
                    <td className="py-5 pr-6 font-display text-lg font-medium tracking-tight text-bone">
                      {opt.title}
                    </td>
                    <td className="py-5 pr-6 text-[15px] leading-relaxed text-fog">
                      {opt.suitable}
                    </td>
                    <td className="py-5 text-[15px] leading-relaxed text-fog">
                      {opt.working}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="container-x py-20 md:py-28" aria-label="Delivery and quality">
        <div className="mb-10 grid gap-4 md:grid-cols-12 md:items-baseline">
          <p className="eyebrow md:col-span-3">Process</p>
          <h2 className="display-3 font-display text-bone md:col-span-9">
            Clear steps. Shared decisions. Visible progress.
          </h2>
        </div>
        <Reveal>
          <p className="body-lg max-w-3xl text-fog">
            Every engagement starts with understanding the work and agreeing how
            it will be delivered. We define responsibilities, review progress
            against the scope and make room for feedback before the next stage.
          </p>
        </Reveal>
        <ol className="mt-10 grid gap-px overflow-hidden border border-line bg-line md:grid-cols-2 lg:grid-cols-5">
          {serviceDeliverySteps.map((step, i) => (
            <li key={step.title} className="h-full">
              <Reveal delay={(i % 5) * 0.06} y={16} className="h-full">
                <div className="flex h-full flex-col bg-ink p-6 transition-colors duration-300 hover:bg-ink-3 md:p-7">
                  <span className="font-mono text-[10px] tracking-[0.24em] text-sage/60">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-4 font-display text-base font-medium tracking-tight text-bone">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-fog">{step.text}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
        <Reveal delay={0.1}>
          <p className="mt-8 max-w-3xl text-sm leading-relaxed text-fog">
            Testing, code review, documentation and release preparation are
            planned around the product and engagement. We make expectations
            visible so the client understands what has been checked and what
            remains to be addressed.
          </p>
        </Reveal>
      </section>

      <section
        className="border-t border-line bg-ink-2 py-20 md:py-28"
        aria-label="Services in practice"
      >
        <div className="container-x">
          <div className="mb-10 grid gap-4 md:grid-cols-12 md:items-baseline">
            <p className="eyebrow md:col-span-3">In practice</p>
            <h2 className="display-3 font-display text-bone md:col-span-9">
              See the services in practice.
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {practiceProjects.map((project, i) => (
              <Reveal key={project.slug} delay={i * 0.08} y={16} className="h-full">
                <Link
                  href={`/work/${project.slug}`}
                  className="group flex h-full flex-col border border-line bg-ink transition-colors duration-500 hover:border-sage/50 hover:bg-ink-3"
                  aria-label={`Explore the ${project.title} case study`}
                >
                  <div className="relative aspect-[16/10] overflow-hidden border-b border-line-soft bg-ink-3">
                    <Image
                      src={project.coverImage.src}
                      alt={project.coverImage.alt}
                      width={project.coverImage.width}
                      height={project.coverImage.height}
                      sizes="(max-width: 768px) 100vw, 33vw"
                      loading="lazy"
                      className="h-full w-full object-contain transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02]"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-display text-xl font-medium tracking-tight text-bone">
                      {project.title}
                    </h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-fog">
                      {project.shortDescription}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-sage">
                      Explore the {project.title} case study
                      <ArrowUpRight
                        className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        strokeWidth={1.75}
                      />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.1}>
            <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.2em] text-mist">
              50+ projects delivered
            </p>
          </Reveal>
        </div>
      </section>

      <section className="container-x py-20 md:py-28" aria-label="Service questions">
        <div className="mb-10 grid gap-4 md:grid-cols-12 md:items-baseline">
          <p className="eyebrow md:col-span-3">Questions</p>
          <h2 className="display-3 font-display text-bone md:col-span-9">
            Common questions about working with Sage Six
          </h2>
        </div>
        <div className="max-w-3xl">
          {serviceFaqs.map((faq) => (
            <Reveal key={faq.q} y={12} delay={0.04}>
              <details className="hairline-t group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-left font-display text-lg font-medium tracking-tight text-bone transition-colors hover:text-sage">
                  {faq.q}
                  <span className="shrink-0 font-mono text-lg text-sage/70 transition-transform duration-300 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-fog">
                  {faq.a}
                </p>
              </details>
            </Reveal>
          ))}
          <div className="hairline-t h-px bg-line" aria-hidden="true" />
        </div>
      </section>

      <section
        className="relative overflow-hidden border-t border-line py-24 md:py-32"
        aria-label="Start a project"
      >
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[60vh] w-[60vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sage/[0.05] blur-[120px]"
          aria-hidden="true"
        />
        <div className="container-x relative">
          <Reveal>
            <p className="eyebrow mb-6">Start a project</p>
            <h2 className="display-3 max-w-3xl font-display text-bone">
              What does your business need next?
            </h2>
            <p className="body-lg mt-6 max-w-2xl text-fog">
              A new application, a stronger website, support for existing software
              or additional development capacity — tell us where you need help,
              and we will work through the next step with you.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-10 flex flex-wrap items-center gap-5">
              <Button href="/contact">Discuss Your Requirements</Button>
              <Button href="/work" variant="outline">
                Explore Our Work
              </Button>
              <a
                href={`mailto:${siteConfig.email}`}
                className="font-mono text-xs uppercase tracking-[0.2em] text-fog underline-offset-8 transition-colors hover:text-sage hover:underline"
              >
                {siteConfig.email}
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}