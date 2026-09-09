export type NavItem = {
  label: string;
  href: string;
};

export const siteConfig = {
  name: "SageSix",
  tagline: "Software. AI. Product. Built to scale.",
  message: "We build digital products that move businesses forward.",
  email: "hello@sagesix.co.uk",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://sagesix.com",
  socials: [
    { label: "GitHub", href: "#", placeholder: true },
    { label: "LinkedIn", href: "#", placeholder: true },
    { label: "X / Twitter", href: "#", placeholder: true },
  ],
  nav: [
    { label: "Work", href: "/work" },
    { label: "Services", href: "/services" },
    { label: "About", href: "/about" },
    { label: "Insights", href: "/insights" },
    { label: "Contact", href: "/contact" },
  ] as NavItem[],
};

export const enquiryTypes = [
  { id: "new-project", label: "New project" },
  { id: "existing-support", label: "Existing product support" },
  { id: "developer-support", label: "Developer or team support" },
  { id: "general", label: "General enquiry" },
] as const;

export const enquiryMessageHelpers: Record<string, string> = {
  "new-project":
    "What would you like to build, who is it for and what should it help them do?",
  "existing-support":
    "Tell us about the current product, the issue or improvement, and how it affects your users. Include steps to reproduce the issue if helpful.",
  "developer-support":
    "Tell us which skills you need, the work involved and the expected duration or availability.",
  general: "Share your question and any context that will help us respond.",
};