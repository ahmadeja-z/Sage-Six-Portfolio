import type { Metadata } from "next";
import { getWorkProjects } from "@/data/projects";
import { PageHeader } from "@/components/layout/PageHeader";
import { WorkProjectSection } from "@/components/projects/WorkProjectSection";
import { Reveal } from "@/components/ui/Reveal";
import { ProjectCTA } from "@/components/projects/ProjectCTA";
import { siteConfig } from "@/lib/site";

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
  const projects = getWorkProjects();

  return (
    <>
      <PageHeader
        eyebrow="Case Studies"
        lines={["Selected Products and", "Digital Experiences"]}
        description="Explore Sage Six case studies across healthcare, commerce, delivery and manufacturing — including the challenges, product decisions and systems behind each experience."
      />

      {projects.length > 0 ? (
        projects.map((project, i) => (
          <WorkProjectSection key={project.slug} project={project} index={i} />
        ))
      ) : (
        <div className="container-x">
          <Reveal>
            <p className="max-w-xl py-16 text-fog">
              Case studies are being published. New projects will appear here as
              they are documented.
            </p>
          </Reveal>
        </div>
      )}

      <ProjectCTA />
    </>
  );
}