import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";
import { getWorkShowcaseProjects } from "@/lib/work-projects";
import { WorkPageContent } from "@/components/work/WorkPageContent";

export const metadata: Metadata = {
  title: "Work — Software Development Case Studies",
  description:
    "Explore Sage Six's software development case studies across healthcare, commerce, delivery and manufacturing — mobile apps, websites, member portals and e-commerce platforms built with Flutter, Shopify and modern web stacks.",
  alternates: { canonical: "/work" },
  openGraph: {
    title: "Sage Six — Software Development Case Studies",
    description:
      "Explore Sage Six case studies across healthcare, commerce, delivery and manufacturing — the challenges, product decisions and systems behind each experience.",
    url: `${siteConfig.url}/work`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sage Six — Software Development Case Studies",
    description:
      "Explore Sage Six case studies across healthcare, commerce, delivery and manufacturing.",
  },
};

export default function WorkPage() {
  const showcaseProjects = getWorkShowcaseProjects();

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${siteConfig.url}/` },
        { "@type": "ListItem", position: 2, name: "Work", item: `${siteConfig.url}/work` },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Sage Six — Software Development Case Studies",
      description: metadata.description,
      url: `${siteConfig.url}/work`,
      isPartOf: { "@type": "WebSite", name: "Sage Six", url: siteConfig.url },
      hasPart: showcaseProjects.map(({ project }) => ({
        "@type": "CreativeWork",
        name: project.title,
        url: `${siteConfig.url}/work/${project.slug}`,
      })),
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <WorkPageContent showcaseProjects={showcaseProjects} />
    </>
  );
}
