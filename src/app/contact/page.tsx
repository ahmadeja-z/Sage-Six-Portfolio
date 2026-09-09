import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/lib/site";
import { services } from "@/data/content";
import { getProject } from "@/data/projects";
import { ContactForm } from "@/components/forms/ContactForm";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";

type ContactPageProps = { searchParams: Promise<{ service?: string | string[] }> };

export const metadata: Metadata = {
  title: { absolute: "Contact Sage Six | App, Web & Software Development" },
  description:
    "Contact Sage Six to discuss mobile apps, website development, custom software, technical support or developer team extension. Tell us what your business needs.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact Sage Six | App, Web & Software Development",
    description:
      "Tell us what your business needs — mobile apps, websites, custom software, technical support or developer team extension.",
    url: `${siteConfig.url}/contact`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Sage Six",
    description:
      "Mobile apps, website development, custom software, technical support or developer team extension.",
  },
};

const nextSteps = [
  {
    title: "We review the context.",
    text: "We look at your goals, existing product and the kind of help you need.",
  },
  {
    title: "We clarify the requirements.",
    text: "We follow up with useful questions and, where appropriate, arrange a conversation.",
  },
  {
    title: "We agree the next step.",
    text: "That may be a scoped project, an initial review, a support arrangement or developer assistance.",
  },
];

const faqs = [
  {
    q: "Do I need a complete brief before contacting you?",
    a: "No. A short description of the problem, intended users and your priorities is enough to begin.",
  },
  {
    q: "Can you help with software built by another team?",
    a: "We can discuss an initial review of the product, codebase and available documentation before agreeing a support scope.",
  },
  {
    q: "Can you provide developers to work with our team?",
    a: "We can discuss the expertise, availability and responsibilities required for a team-extension arrangement.",
  },
  {
    q: "What if I am unsure about budget or timing?",
    a: "You can leave those details open. We can clarify scope and constraints before discussing an estimate.",
  },
];

const workProjects = ["speezu", "leicester-medical-society", "durafoam-3d-foam-configurator-shopify"]
  .map((slug) => getProject(slug))
  .filter(Boolean) as NonNullable<ReturnType<typeof getProject>>[];

const SERVICE_IDS = new Set(services.map((s) => s.anchor));

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact Sage Six",
  url: `${siteConfig.url}/contact`,
  description:
    "Contact Sage Six about mobile apps, websites, custom software, technical support or developer team extension.",
  mainEntity: { "@id": `${siteConfig.url}/#organization` },
};

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const params = await searchParams;
  const rawService = typeof params.service === "string" ? params.service : "";
  const service = SERVICE_IDS.has(rawService) ? rawService : "";
  let enquiryType = "new-project";
  if (service === "technical-support") enquiryType = "existing-support";
  if (service === "team-extension") enquiryType = "developer-support";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="relative overflow-hidden border-b border-line pb-16 pt-40 md:pb-20 md:pt-52">
        <div
          className="pointer-events-none absolute left-1/2 top-0 h-[60vh] w-[70vw] -translate-x-1/2 rounded-full bg-sage/[0.06] blur-[130px]"
          aria-hidden="true"
        />
        <div className="container-x relative">
          <Reveal>
            <p className="eyebrow mb-8">Contact Sage Six</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="display-2 max-w-4xl font-display text-bone md:display-1">
              Let&apos;s talk about your next project.
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="body-lg mt-8 max-w-2xl text-fog">
              Planning a mobile app, a new website or improvements to an existing
              platform? Tell us what you need. Sage Six can help with product
              development, ongoing software support and additional development
              expertise for your team.
            </p>
          </Reveal>
        </div>
      </header>

      <section className="container-x py-16 md:py-24" aria-label="Contact form">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <Reveal>
              <p className="eyebrow mb-4">Prefer email?</p>
              <a
                href={`mailto:${siteConfig.email}`}
                className="inline-block text-lg text-bone underline-offset-8 transition-colors hover:text-sage hover:underline"
              >
                {siteConfig.email}
              </a>
              <p className="mt-4 text-sm leading-relaxed text-fog">
                Send your project outline or question directly to us.
              </p>
              <div className="mt-10 border-t border-line pt-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-mist">
                  We build with
                </p>
                <ul className="mt-4 space-y-2">
                  {[
                    "Mobile applications in Flutter",
                    "Business websites and custom web platforms",
                    "AI integration and workflow automation",
                    "Technical support and team extension",
                  ].map((item) => (
                    <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-fog">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-sage/70" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-8">
            <Reveal delay={0.1} y={24}>
              <ContactForm initialService={service} initialEnquiryType={enquiryType} />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-ink-2 py-20 md:py-28" aria-label="What happens next">
        <div className="container-x">
          <div className="mb-10 grid gap-4 md:grid-cols-12 md:items-baseline">
            <p className="eyebrow md:col-span-3">Next steps</p>
            <h2 className="display-3 font-display text-bone md:col-span-9">
              A clear next step.
            </h2>
          </div>
          <Reveal>
            <p className="body-lg max-w-3xl text-fog">
              Your enquiry helps us understand the work before recommending an
              approach.
            </p>
          </Reveal>
          <ol className="mt-10 grid gap-px overflow-hidden border border-line bg-line md:grid-cols-3">
            {nextSteps.map((step, i) => (
              <li key={step.title} className="h-full">
                <Reveal delay={i * 0.08} y={16} className="h-full">
                  <div className="flex h-full flex-col bg-ink p-8 transition-colors duration-300 hover:bg-ink-3 md:p-9">
                    <span className="font-mono text-[11px] tracking-[0.24em] text-sage/70">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-5 font-display text-xl font-medium tracking-tight text-bone">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-[15px] leading-relaxed text-fog">{step.text}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="container-x py-20 md:py-28" aria-label="Explore our work">
        <div className="mb-10 grid gap-4 md:grid-cols-12 md:items-baseline">
          <p className="eyebrow md:col-span-3">Explore our work</p>
          <h2 className="display-3 font-display text-bone md:col-span-9">
            Recent projects you can explore
          </h2>
        </div>
        <ul className="space-y-4">
          {workProjects.map((project) => (
            <li key={project.slug}>
              <Link
                href={`/work/${project.slug}`}
                className="group hairline-t flex items-center justify-between gap-6 py-6 transition-colors duration-300 hover:bg-ink-2/50 md:px-4"
                aria-label={`Explore the ${project.title} case study`}
              >
                <div>
                  <h3 className="font-display text-xl font-medium tracking-tight text-bone transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 md:text-2xl">
                    {project.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-fog">{project.category}</p>
                </div>
                <ArrowUpRight
                  className="h-5 w-5 shrink-0 text-fog transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-sage"
                  strokeWidth={1.5}
                />
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-mist">
          50+ projects delivered
        </p>
      </section>

      <section className="border-t border-line bg-ink-2 py-20 md:py-28" aria-label="Contact questions">
        <div className="container-x">
          <div className="mb-10 grid gap-4 md:grid-cols-12 md:items-baseline">
            <p className="eyebrow md:col-span-3">Questions</p>
            <h2 className="display-3 font-display text-bone md:col-span-9">
              Common questions before you enquire
            </h2>
          </div>
          <div className="max-w-3xl">
            {faqs.map((faq) => (
              <details key={faq.q} className="hairline-t group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-left font-display text-lg font-medium tracking-tight text-bone transition-colors hover:text-sage">
                  {faq.q}
                  <span className="shrink-0 font-mono text-lg text-sage/70 transition-transform duration-300 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-fog">{faq.a}</p>
              </details>
            ))}
            <div className="hairline-t h-px bg-line" aria-hidden="true" />
          </div>
        </div>
      </section>

      <section
        className="relative overflow-hidden border-t border-line py-20 md:py-28"
        aria-label="Start a conversation"
      >
        <div className="container-x relative">
          <Reveal>
            <p className="eyebrow mb-6">Start a conversation</p>
            <h2 className="display-3 max-w-3xl font-display text-bone">
              Have a project or question in mind?
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-8">
              <Button href={`mailto:${siteConfig.email}`}>Email Sage Six</Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}