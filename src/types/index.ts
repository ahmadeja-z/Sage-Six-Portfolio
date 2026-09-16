export type Service = {
  index: string;
  title: string;
  anchor: string;
  intro: string;
  scope?: string[];
  bestFit: string;
  cta: string;
  caseStudy?: string;
  insight?: string;
  supporting?: string;
  howItWorks?: string[];
};

export type ProcessStep = {
  index: string;
  title: string;
  description: string;
};

export type Capability = {
  index: string;
  title: string;
};

export type ContentBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "links"; items: { text: string; href: string; note?: string }[] };

export type Insight = {
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: ContentBlock[];
  author: string;
  publishedAt: string;
  updatedAt?: string;
  readingTime: string;
  seoTitle: string;
  seoDescription: string;
  featured?: boolean;
  published: boolean;
  relatedArticles: string[];
  relatedCaseStudy?: string;
  relatedService?: string;
  tags: string[];
};

export type LeadPayload = {
  name: string;
  email: string;
  company: string;
  enquiryType: string;
  service: string;
  message: string;
  websiteLink: string;
  budget: string;
  timing: string;
  // Off-screen field a real visitor never fills. Optional so existing
  // callers (e.g. the assistant's quick-lead form) keep working unchanged.
  honeypot?: string;
  // Client-generated id reused across retries of the same enquiry so a
  // double-click or network retry can't send two emails. Optional for the
  // same reason as `honeypot`.
  submissionId?: string;
  // Path the enquiry was submitted from (e.g. "/contact"), attached
  // automatically by submitLead() rather than passed by each caller.
  page?: string;
};

export type EnquiryType = "new-project" | "existing-support" | "developer-support" | "general";

export type ProjectImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
};

export type ProjectFact = {
  label: string;
  value: string;
};

export type StoreApp = {
  name: string;
  url: string;
  label: string;
};

export type StoreLink = {
  eyebrow: string;
  title: string;
  url: string;
  ariaLabel: string;
};

export type ProjectSection =
  | {
      kind: "overview";
      label: string;
      heading: string;
      body: string;
      points: { title: string; body: string }[];
    }
  | {
      kind: "prose";
      label: string;
      heading: string;
      body: string;
      steps?: string[];
      features?: string[];
      points?: { title: string; body?: string; items?: string[] }[];
      image?: ProjectImage;
      images?: ProjectImage[];
    }
  | {
      kind: "split";
      label: string;
      challengeHeading: string;
      challenge: string;
      solutionHeading: string;
      solution: string;
      image?: ProjectImage;
    }
  | {
      kind: "feature";
      label: string;
      heading: string;
      body: string;
      features: string[];
      image: ProjectImage;
      storeLink?: StoreLink;
    }
  | {
      kind: "engineering";
      label: string;
      heading: string;
      intro: string;
      stack: { name: string; note: string }[];
    }
  | {
      kind: "solutions";
      label: string;
      heading: string;
      blocks: { title: string; body: string }[];
    }
  | {
      kind: "outcome";
      label: string;
      heading: string;
      body: string;
      image: ProjectImage;
    };

export type ProjectCta = {
  eyebrow?: string;
  title: string;
  body: string;
  secondaryLabel: string;
  secondaryUrl: string;
  secondaryExternal?: boolean;
};

export type Project = {
  slug: string;
  category: string;
  title: string;
  shortDescription: string;
  fullCardDescription: string;
  tags: string[];
  services: string[];
  featured?: boolean;
  featuredOrder?: number;
  workOrder?: number;
  industry: string;
  type: string;
  platform: string;
  products: string;
  role: string;
  accent: string;
  coverImage: ProjectImage;
  heroEyebrow: string;
  heroTitle: string;
  heroLead: string;
  facts: ProjectFact[];
  apps?: StoreApp[];
  liveUrl?: string;
  cta?: ProjectCta;
  sections: ProjectSection[];
  technologies: { name: string; note: string }[];
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
};