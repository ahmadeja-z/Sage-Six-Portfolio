import { getWorkProjects } from "@/data/projects";
import { workProjectPositioning } from "@/data/work-content";
import type { Project, ProjectSection } from "@/types";

export type WorkShowcaseProject = {
  project: Project;
  challenge: string;
  solution: string;
  supportingLine: string;
  capabilities: string[];
};

// Pulls the challenge statement straight out of the case study's own
// section data (the "split" kind stores it as `.challenge`, "prose" and
// other kinds store it as `.body`) so the Work page never duplicates or
// rewrites case-study copy — it just surfaces the section already labelled
// as the challenge.
function findChallenge(sections: ProjectSection[]): string | undefined {
  const match = sections.find((section) => /challenge/i.test(section.label));
  if (!match) return undefined;
  if (match.kind === "split") return match.challenge;
  if ("body" in match) return match.body;
  return undefined;
}

export function getWorkShowcaseProjects(): WorkShowcaseProject[] {
  return getWorkProjects().map((project) => {
    const positioning = workProjectPositioning[project.slug];
    return {
      project,
      challenge: findChallenge(project.sections) ?? project.shortDescription,
      solution: project.fullCardDescription,
      supportingLine: positioning?.supportingLine ?? project.shortDescription,
      capabilities: positioning?.capabilities ?? project.tags,
    };
  });
}
