import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { homeProjects, homeServices } from "./home";
import { projects } from "./projects";
import { getPublishedInsights } from "./insights";

describe("homepage published content", () => {
  it("uses real case studies and available artwork", () => {
    for (const project of homeProjects) {
      expect(projects.some((item) => item.slug === project.slug)).toBe(true);
      expect(existsSync(`public/images/case-studies/${project.image}`)).toBe(
        true,
      );
      for (const width of [480, 768, 1080, 1440, 1672])
        expect(
          existsSync(
            `public/images/case-studies/optimized/${project.image.replace(/\.png$/, "")}-${width}.webp`,
          ),
        ).toBe(true);
    }
    for (const service of homeServices)
      expect(existsSync(`public/images/hero/${service.image}`)).toBe(true);
  });
  it("has published content for the requested insights", () => {
    for (const slug of [
      "admin-dashboard-development-guide",
      "flutter-for-business-apps",
      "app-website-maintenance-checklist",
      "flutter-vs-react-native",
    ]) {
      expect(
        getPublishedInsights().find((article) => article.slug === slug)?.content
          .length,
      ).toBeGreaterThan(0);
    }
  });
});
