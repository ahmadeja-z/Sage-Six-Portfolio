import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";
import { services } from "@/data/content";
import { getProject } from "@/data/projects";
import { ContactPageContent } from "@/components/contact/ContactPageContent";

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
      <ContactPageContent service={service} enquiryType={enquiryType} workProjects={workProjects} />
    </>
  );
}
