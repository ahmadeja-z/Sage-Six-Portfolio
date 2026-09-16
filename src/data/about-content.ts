// Company-page-only content. Reorganises copy already published elsewhere on
// the site (the previous /about page, homeServices, workSectors) — nothing
// here introduces a new client name, statistic or claim.

export type AboutPrinciple = {
  title: string;
  body: string;
};

// Same four standards the previous /about page published, carried forward
// verbatim and re-presented as editorial rows instead of a card grid.
export const aboutPrinciples: AboutPrinciple[] = [
  {
    title: "Business understanding",
    body: "Technical decisions should serve the people using the product and the organisation behind it.",
  },
  {
    title: "Clear responsibility",
    body: "Agreed deliverables, visible decisions and a considered handover help everyone understand their part.",
  },
  {
    title: "Care in the details",
    body: "Navigation, forms, loading states and error messages all contribute to the quality of the experience.",
  },
  {
    title: "Honest recommendations",
    body: "We explain the trade-offs and help clients prioritise what is useful for their stage of growth.",
  },
];

export type AboutJourneyStage = {
  title: string;
  body: string;
};

// Carried forward from the previous /about page's "process" section —
// the same six stages, now presented as a connected journey rather than a
// card grid.
export const aboutJourneyStages: AboutJourneyStage[] = [
  { title: "Understand", body: "Explore the business problem, users, existing systems and intended outcome." },
  { title: "Define", body: "Agree priorities, deliverables, milestones and the criteria for reviewing the work." },
  { title: "Design", body: "Map the important journeys and develop interfaces that make the product easier to use." },
  { title: "Build and review", body: "Develop the agreed features, connect the required systems and review progress against the scope." },
  { title: "Test and prepare", body: "Check key workflows, responsive behaviour and release readiness, then address the issues found." },
  { title: "Launch and look ahead", body: "Prepare deployment and handover, clarify support arrangements and identify useful next steps." },
];

export type AboutEvidence = {
  value: string;
  label: string;
};

// The previous page's proof strip (50+ Projects delivered / Mobile & web /
// Design to delivery), reorganised into four items using facts already
// demonstrated elsewhere on this page and the Work page — no new claim.
export const aboutEvidence: AboutEvidence[] = [
  { value: "50+", label: "Projects delivered" },
  { value: "Mobile · Web · Software", label: "Product expertise" },
  { value: "3 sectors", label: "Commerce, manufacturing and healthcare" },
  { value: "Beyond launch", label: "Ongoing technical support" },
];

export type AboutArchitectureLayer = {
  title: string;
  body: string;
  outputs: string[];
};

export const aboutArchitectureLayers: AboutArchitectureLayer[] = [
  {
    title: "Product direction",
    body: "Understanding the business, its users and the outcome the product needs to support.",
    outputs: ["Product strategy", "Scope and requirements"],
  },
  {
    title: "Experience design",
    body: "Shaping journeys and interfaces around real decisions, not decoration.",
    outputs: ["User journeys", "Accessible interface design"],
  },
  {
    title: "Software engineering",
    body: "Building the product and the systems it depends on.",
    outputs: ["Mobile applications", "Web platforms", "Business systems", "APIs and integrations", "AI-enabled workflows"],
  },
  {
    title: "Launch and support",
    body: "Releasing the product and staying available as it evolves.",
    outputs: ["Deployment and handover", "Ongoing technical support"],
  },
];

export type AboutSupportCapability = string;

// Consolidates support-related mentions already present on the previous
// /about page ("Launch and look ahead", "Plan for life after launch") into
// one explicit list of verified support activities.
export const aboutSupportCapabilities: AboutSupportCapability[] = [
  "Product improvements",
  "Bug resolution",
  "Performance reviews",
  "Platform updates",
  "Feature development",
  "Technical guidance",
];
