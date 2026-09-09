import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { getProject } from "@/data/projects";
import { siteConfig } from "@/lib/site";
import { Reveal } from "@/components/ui/Reveal";
import { TextReveal } from "@/components/ui/TextReveal";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: { absolute: "About Sage Six | App & Website Development Company" },
  description:
    "Meet Sage Six, a software development company with 50+ projects delivered across mobile apps, websites and custom web platforms. Discover how we work.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Sage Six | App & Website Development Company",
    description:
      "Sage Six is a software development company with 50+ projects delivered across mobile apps, websites and custom web platforms.",
    url: `${siteConfig.url}/about`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Sage Six | App & Website Development Company",
    description:
      "A software development company creating mobile apps, websites and custom web platforms.",
  },
};

const proof = [
  { value: "50+", label: "Projects delivered" },
  { value: "Mobile & web", label: "Connected product experiences" },
  { value: "Design to delivery", label: "A considered development process" },
];

const capabilities = [
  {
    title: "Mobile application development",
    text: "Flutter applications for iOS and Android, with clear interfaces and connected journeys across accounts, catalogues, checkout, notifications and delivery workflows.",
  },
  {
    title: "Website design and development",
    text: "Business websites that make services, products and company information easier to understand, with responsive layouts and clear paths to enquire.",
  },
  {
    title: "Custom web application development",
    text: "Member portals, administrative dashboards and business platforms that connect users, content and operational workflows.",
  },
  {
    title: "Product design and development planning",
    text: "User journeys, interface design, feature priorities and practical project scope that give development a clear direction.",
  },
];

const relationship = [
  { title: "Understand before recommending.", text: "We start with your business goals and users so that recommendations have a clear purpose." },
  { title: "Make progress visible.", text: "Milestones, demonstrations and review points give the project a shared direction." },
  { title: "Discuss changes openly.", text: "When priorities change, we explain the effect on scope and delivery before agreeing the next step." },
  { title: "Plan for life after launch.", text: "We discuss handover, maintenance and future improvements so that ongoing responsibilities are clear." },
];

const processSteps = [
  { title: "Understand", text: "Explore the business problem, users, existing systems and intended outcome." },
  { title: "Define", text: "Agree priorities, deliverables, milestones and the criteria for reviewing the work." },
  { title: "Design", text: "Map the important journeys and develop interfaces that make the product easier to use." },
  { title: "Build and review", text: "Develop the agreed features, connect the required systems and review progress against the scope." },
  { title: "Test and prepare", text: "Check key workflows, responsive behaviour and release readiness, then address the issues found." },
  { title: "Launch and look ahead", text: "Prepare deployment and handover, clarify support arrangements and identify useful next steps." },
];

const standards = [
  { title: "Business understanding", text: "Technical decisions should serve the people using the product and the organisation behind it." },
  { title: "Clear responsibility", text: "Agreed deliverables, visible decisions and a considered handover help everyone understand their part." },
  { title: "Care in the details", text: "Navigation, forms, loading states and error messages all contribute to the quality of the experience." },
  { title: "Honest recommendations", text: "We explain the trade-offs and help clients prioritise what is useful for their stage of growth." },
];

const featuredProjects = ["leicester-medical-society", "speezu", "durafoam-3d-foam-configurator-shopify"]
  .map((slug) => getProject(slug))
  .filter(Boolean) as NonNullable<ReturnType<typeof getProject>>[];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "About Sage Six",
  url: `${siteConfig.url}/about`,
  description:
    "Sage Six is a software development company creating mobile applications, business websites and custom web platforms.",
  about: { "@id": `${siteConfig.url}/#organization` },
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="relative overflow-hidden border-b border-line pb-16 pt-40 md:pb-24 md:pt-52">
        <div
          className="pointer-events-none absolute left-1/2 top-0 h-[60vh] w-[70vw] -translate-x-1/2 rounded-full bg-sage/[0.06] blur-[130px]"
          aria-hidden="true"
        />
        <div className="container-x relative">
          <Reveal>
            <p className="eyebrow mb-8">
              About Sage Six · Software Design &amp; Development
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="display-1 max-w-5xl font-display text-bone">
              We build the software behind your next chapter.
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="body-lg mt-8 max-w-2xl text-fog">
              Sage Six is a software development company creating mobile
              applications, business websites and custom web platforms. With 50+
              projects delivered, we bring together product thinking, design and
              engineering to turn business requirements into useful digital
              experiences.
            </p>
          </Reveal>
          <Reveal delay={0.22}>
            <p className="body-lg mt-6 max-w-2xl text-fog">
              From the first conversation to launch, we focus on understanding
              your priorities, making progress clear and building software that
              supports the way your business works.
            </p>
          </Reveal>
          <Reveal delay={0.28}>
            <div className="mt-10 flex flex-wrap items-center gap-5">
              <Button href="/contact">Start a Project</Button>
              <Button href="/work" variant="outline">
                Explore Our Work
              </Button>
            </div>
          </Reveal>
        </div>
      </header>

      <section className="container-x py-20 md:py-28" aria-label="How Sage Six works">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <TextReveal
              as="h2"
              lines={["Software shaped by the", "business it serves"]}
              className="display-3 font-display text-bone"
              lineClassName="text-bone"
              stagger={0.08}
            />
          </div>
          <div className="lg:col-span-7">
            <Reveal delay={0.1}>
              <p className="body-lg max-w-2xl text-fog">
                Every business has its own customers, challenges and ways of
                working. We take the time to understand that context before
                deciding what to build.
              </p>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="body-lg mt-6 max-w-2xl text-fog">
                Our work brings strategy, interface design and development into
                one connected process. We help clients define the right scope,
                make informed technology decisions and turn complex requirements
                into experiences people can navigate with confidence.
              </p>
            </Reveal>
            <Reveal delay={0.22}>
              <p className="body-lg mt-6 max-w-2xl text-fog">
                Whether the project is a customer-facing app, a company website
                or an internal management platform, our starting point is the
                same: understand the purpose, then build around it.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section
        className="border-t border-line bg-ink-2 py-20 md:py-28"
        aria-label="Experience"
      >
        <div className="container-x grid gap-14 lg:grid-cols-2 lg:items-end">
          <div>
            <TextReveal
              as="h2"
              lines={["50+ projects delivered.", "Experience that informs the next."]}
              className="display-3 font-display text-bone"
              lineClassName="text-bone"
              stagger={0.08}
            />
          </div>
          <Reveal delay={0.1}>
            <p className="body-lg max-w-2xl text-fog">
              Across different projects, we have worked with varied product
              requirements, user journeys and operational needs. That experience
              informs how we approach scope, usability, integrations and
              delivery.
            </p>
          </Reveal>
        </div>
        <div className="container-x mt-14 md:mt-20">
          <div className="grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-3">
            {proof.map((item, i) => (
              <Reveal key={item.label} delay={i * 0.08} y={16} className="h-full">
                <div className="flex h-full flex-col justify-between bg-ink p-8 md:p-10">
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mist">
                    {item.label}
                  </p>
                  <p className="mt-10 font-display text-3xl font-semibold tracking-tight text-bone md:text-4xl">
                    {item.value}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="container-x py-20 md:py-28" aria-label="Capabilities">
        <div className="mb-12 grid gap-4 md:grid-cols-12 md:items-baseline md:mb-16">
          <p className="eyebrow md:col-span-3">Capabilities</p>
          <h2 className="display-3 font-display text-bone md:col-span-9">
            The capabilities behind your product
          </h2>
        </div>
        <div className="grid gap-px overflow-hidden border border-line bg-line md:grid-cols-2">
          {capabilities.map((cap, i) => (
            <Reveal key={cap.title} delay={(i % 2) * 0.08} y={16} className="h-full">
              <div className="flex h-full flex-col bg-ink-2 p-8 transition-colors duration-500 hover:bg-ink-3 md:p-10">
                <h3 className="font-display text-xl font-medium tracking-tight text-bone md:text-2xl">
                  {cap.title}
                </h3>
                <p className="mt-4 flex-1 text-[15px] leading-relaxed text-fog">
                  {cap.text}
                </p>
                <Link
                  href="/services"
                  className="group mt-7 inline-flex w-fit items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-sage transition-colors hover:text-sage-bright"
                >
                  Explore the service
                  <ArrowRight
                    className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                    strokeWidth={1.75}
                  />
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section
        className="border-t border-line bg-ink-2 py-20 md:py-28"
        aria-label="Client relationships"
      >
        <div className="container-x">
          <div className="mb-12 grid gap-4 md:grid-cols-12 md:items-baseline md:mb-16">
            <p className="eyebrow md:col-span-3">How we relate</p>
            <h2 className="display-3 font-display text-bone md:col-span-9">
              Client relationships built on clarity and follow-through
            </h2>
          </div>
          <div className="max-w-3xl">
            <Reveal>
              <p className="body-lg text-fog">
                A software project involves decisions that affect your time,
                budget and business. We believe clients should understand what is
                being built, why it matters and what happens next.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="body-lg mt-6 text-fog">
                We work towards a relationship where questions are welcomed,
                priorities are clear and feedback reaches the people doing the
                work. Trust grows through practical actions: explaining
                trade-offs, sharing progress, raising concerns early and
                following through on agreed responsibilities.
              </p>
            </Reveal>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {relationship.map((item, i) => (
              <Reveal key={item.title} delay={(i % 2) * 0.08} y={16}>
                <div className="border border-line bg-ink p-8">
                  <span className="font-mono text-[10px] tracking-[0.24em] text-sage/60">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-4 font-display text-lg font-medium tracking-tight text-bone">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-fog">
                    {item.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="container-x py-20 md:py-28" aria-label="Delivery process">
        <div className="mb-12 grid gap-4 md:grid-cols-12 md:items-baseline md:mb-16">
          <p className="eyebrow md:col-span-3">Process</p>
          <h2 className="display-3 font-display text-bone md:col-span-9">
            A clear path from first conversation to delivery
          </h2>
        </div>
        <ol className="grid gap-px overflow-hidden border border-line bg-line md:grid-cols-2 lg:grid-cols-3">
          {processSteps.map((step, i) => (
            <li key={step.title} className="h-full">
              <Reveal delay={(i % 3) * 0.08} y={16} className="h-full">
                <div className="flex h-full flex-col bg-ink-2 p-8 transition-colors duration-500 hover:bg-ink-3 md:p-9">
                  <span className="font-mono text-[11px] tracking-[0.24em] text-sage/70">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-6 font-display text-xl font-medium tracking-tight text-bone">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-fog">
                    {step.text}
                  </p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      <section
        className="border-t border-line bg-ink-2 py-20 md:py-28"
        aria-label="Selected project experience"
      >
        <div className="container-x">
          <div className="mb-12 grid gap-4 md:grid-cols-12 md:items-baseline md:mb-16">
            <p className="eyebrow md:col-span-3">Selected work</p>
            <h2 className="display-3 font-display text-bone md:col-span-9">
              Trusted with projects. Focused on partnerships.
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {featuredProjects.map((project, i) => (
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
        </div>
      </section>

      <section className="container-x py-20 md:py-28" aria-label="Working principles">
        <div className="mb-12 grid gap-4 md:grid-cols-12 md:items-baseline md:mb-16">
          <p className="eyebrow md:col-span-3">Principles</p>
          <h2 className="display-3 font-display text-bone md:col-span-9">
            The standards we build around
          </h2>
        </div>
        <div className="grid gap-px overflow-hidden border border-line bg-line md:grid-cols-2">
          {standards.map((item, i) => (
            <Reveal key={item.title} delay={(i % 2) * 0.08} y={16} className="h-full">
              <div className="flex h-full flex-col bg-ink-2 p-8 transition-colors duration-500 hover:bg-ink-3 md:p-10">
                <h3 className="font-display text-lg font-medium tracking-tight text-bone">
                  {item.title}
                </h3>
                <p className="mt-3 flex-1 text-[15px] leading-relaxed text-fog">
                  {item.text}
                </p>
              </div>
            </Reveal>
          ))}
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
              Let&apos;s build the next chapter of your business.
            </h2>
            <p className="body-lg mt-6 max-w-2xl text-fog">
              Whether you need a mobile app, a business website or a custom web
              platform, tell us what you want to achieve. We will help you define
              a practical starting point and the work it will involve.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-10 flex flex-wrap items-center gap-5">
              <Button href="/contact">Start a Project</Button>
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