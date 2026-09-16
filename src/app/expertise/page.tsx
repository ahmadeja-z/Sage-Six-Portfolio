import type { Metadata } from "next";
import {
  services,
  engagementOptions,
  serviceDeliverySteps,
  serviceFaqs,
} from "@/data/content";
import { getProject } from "@/data/projects";
import { getInsight } from "@/data/insights";
import { siteConfig } from "@/lib/site";
import {
  ExpertisePageContent,
  type ResolvedService,
} from "@/components/services/ExpertisePageContent";

// Page identity is "Expertise" (matches the Expertise nav label and the new
// homepage theme). Title/description keep "services" wording — that's what
// people search for — while on-page copy leads with "Expertise".
export const metadata: Metadata = {
  title: {
    absolute: "Our Expertise — Software, Design & Technical Support Services | Sage Six",
  },
  description:
    "Explore Sage Six's expertise across mobile apps, websites, custom software, AI integration, technical support and development team extension.",
  alternates: { canonical: "/expertise" },
  openGraph: {
    title: "Our Expertise — Software, Design & Technical Support Services | Sage Six",
    description:
      "Mobile apps, websites, custom software, AI integration, technical support and development team extension from Sage Six.",
    url: `${siteConfig.url}/expertise`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Expertise — Software, Design & Technical Support Services | Sage Six",
    description:
      "Mobile apps, websites, custom software, AI integration and development team extension.",
  },
};

const practiceProjects = [
  "speezu",
  "leicester-medical-society",
  "durafoam-3d-foam-configurator-shopify",
]
  .map((slug) => getProject(slug))
  .filter(Boolean)
  .map((project) => ({
    slug: project!.slug,
    title: project!.title,
    shortDescription: project!.shortDescription,
    coverImage: project!.coverImage,
  }));

// Resolved server-side so the client bundle doesn't need the full
// projects/insights registries — only the few fields each card displays.
const resolvedServices: ResolvedService[] = services.map((service) => {
  const caseStudy = service.caseStudy ? getProject(service.caseStudy) : undefined;
  const insight = service.insight ? getInsight(service.insight) : undefined;
  return {
    ...service,
    caseStudyInfo: caseStudy
      ? { slug: caseStudy.slug, title: caseStudy.title }
      : undefined,
    insightInfo:
      insight && insight.published
        ? { slug: insight.slug, title: insight.title }
        : undefined,
  };
});

const serviceJsonLd = services.map((service) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  name: service.title,
  serviceType: service.title,
  description: service.intro,
  provider: { "@id": `${siteConfig.url}/#organization` },
  url: `${siteConfig.url}/expertise#${service.anchor}`,
}));

export default function ExpertisePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <ExpertisePageContent
        services={resolvedServices}
        engagementOptions={engagementOptions}
        deliverySteps={serviceDeliverySteps}
        faqs={serviceFaqs}
        practiceProjects={practiceProjects}
      />
    </>
  );
}
