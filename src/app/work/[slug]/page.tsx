import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProject, projects } from "@/data/projects";
import { siteConfig } from "@/lib/site";
import { CaseStudyHero } from "@/components/projects/CaseStudyHero";
import { CaseStudySection } from "@/components/projects/CaseStudySection";
import { ProjectCTA } from "@/components/projects/ProjectCTA";
import { NextProjectNavigation } from "@/components/projects/NextProjectNavigation";
import { CaseStudyLight } from "@/components/projects/light/CaseStudyLight";

// Case studies migrated to the new light Sage Six theme. Add a slug here
// once its presentation has been redesigned (see SiteChrome's LIGHT_THEME_ROUTES,
// which must be kept in sync for the header/footer to match).
const LIGHT_THEME_PROJECTS = new Set([
  "speezu",
  "durafoam-3d-foam-configurator-shopify",
  "leicester-medical-society",
]);

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Project not found" };

  const url = `${siteConfig.url}/work/${project.slug}`;
  return {
    title: { absolute: project.seo.title },
    description: project.seo.description,
    keywords: project.seo.keywords,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      title: project.seo.title,
      description: project.seo.description,
      url,
      type: "article",
      images: [
        {
          url: `${siteConfig.url}${project.coverImage.src}`,
          width: project.coverImage.width,
          height: project.coverImage.height,
          alt: project.coverImage.alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: project.seo.title,
      description: project.seo.description,
      images: [`${siteConfig.url}${project.coverImage.src}`],
    },
  };
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${siteConfig.url}/` },
        { "@type": "ListItem", position: 2, name: "Work", item: `${siteConfig.url}/work` },
        { "@type": "ListItem", position: 3, name: project.title },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      name: project.title,
      description: project.seo.description,
      url: `${siteConfig.url}/work/${project.slug}`,
      author: { "@type": "Organization", name: "SageSix", url: siteConfig.url },
    },
    ...(project.apps ?? []).map((app) => ({
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: app.name,
      operatingSystem: "Android",
      applicationCategory: "MobileApplication",
      url: app.url,
      author: { "@type": "Organization", name: "SageSix", url: siteConfig.url },
    })),
  ];

  if (LIGHT_THEME_PROJECTS.has(project.slug)) {
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <CaseStudyLight project={project} />
      </>
    );
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <CaseStudyHero project={project} />

      <div className="container-x space-y-20 pb-24 md:space-y-28 md:pb-32">
        {project.sections.map((section) => (
          <CaseStudySection key={section.label} section={section} />
        ))}
      </div>

      <NextProjectNavigation current={project} />
      <ProjectCTA apps={project.apps} cta={project.cta} />
    </>
  );
}