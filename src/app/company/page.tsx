import type { Metadata } from "next";
import { getProject } from "@/data/projects";
import { siteConfig } from "@/lib/site";
import { CompanyPageContent } from "@/components/company/CompanyPageContent";

export const metadata: Metadata = {
  title: { absolute: "About Sage Six | App & Website Development Company" },
  description:
    "Meet Sage Six, a software development company with 50+ projects delivered across mobile apps, websites and custom web platforms. Discover how we work.",
  alternates: { canonical: "/company" },
  openGraph: {
    title: "About Sage Six | App & Website Development Company",
    description:
      "Sage Six is a software development company with 50+ projects delivered across mobile apps, websites and custom web platforms.",
    url: `${siteConfig.url}/company`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Sage Six | App & Website Development Company",
    description:
      "A software development company creating mobile apps, websites and custom web platforms.",
  },
};

const featuredProjects = ["leicester-medical-society", "speezu", "durafoam-3d-foam-configurator-shopify"]
  .map((slug) => getProject(slug))
  .filter(Boolean) as NonNullable<ReturnType<typeof getProject>>[];

export default function CompanyPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${siteConfig.url}/` },
        { "@type": "ListItem", position: 2, name: "Company", item: `${siteConfig.url}/company` },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      name: "About Sage Six",
      url: `${siteConfig.url}/company`,
      description:
        "Sage Six is a software development company creating mobile applications, business websites and custom web platforms.",
      about: { "@id": `${siteConfig.url}/#organization` },
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CompanyPageContent featuredProjects={featuredProjects} />
    </>
  );
}
