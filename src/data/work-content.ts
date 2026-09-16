// Work-page-only content. Sector descriptions and capability highlights are
// written from already-verified project facts in `projects.ts` (industry,
// category, tags, platform) — nothing here introduces a metric, quote or
// outcome that isn't already established elsewhere in the portfolio data.

export type WorkCapabilityStep = {
  title: string;
  body: string;
};

export const workCapabilitySteps: WorkCapabilityStep[] = [
  { title: "Discover", body: "Understand the business, users and constraints before proposing a direction." },
  { title: "Design", body: "Shape the interface and experience around real workflows." },
  { title: "Engineer", body: "Build the product with maintainable, production-grade code." },
  { title: "Integrate", body: "Connect the systems, data and services the product depends on." },
  { title: "Launch", body: "Release with the testing and handover the product needs." },
  { title: "Support", body: "Stay available for improvements after launch." },
];

export type WorkProjectPositioning = {
  supportingLine: string;
  capabilities: string[];
};

export const workProjectPositioning: Record<string, WorkProjectPositioning> = {
  speezu: {
    supportingLine:
      "A connected commerce platform bringing customer ordering, store operations, delivery workflows and administration into one coordinated system.",
    capabilities: [
      "Customer mobile application",
      "Multi-category marketplace",
      "Store operations",
      "Delivery-rider workflow",
      "Order processing",
      "Checkout and payments",
      "Live order tracking",
      "Administration and reporting",
    ],
  },
  "durafoam-3d-foam-configurator-shopify": {
    supportingLine:
      "A custom Shopify commerce experience that helps customers configure specialist foam products through an interactive, visual buying journey.",
    capabilities: [
      "Shopify Hydrogen storefront",
      "Custom foam-product journey",
      "Interactive 3D configuration",
      "Multiple foam shapes",
      "Product catalogue",
      "Cart and checkout",
      "Shopify integration",
      "Responsive commerce experience",
    ],
  },
  "leicester-medical-society": {
    supportingLine:
      "A connected digital platform supporting public engagement, professional learning, membership services and day-to-day Society administration.",
    capabilities: [
      "Public website",
      "Event discovery and registration",
      "Member dashboard",
      "Membership renewal",
      "Digital learning",
      "CPD tracking",
      "Administration dashboard",
      "Content management",
      "Resources, gallery and sponsorship",
    ],
  },
};

export type WorkSector = {
  slug: string;
  label: string;
  challenge: string;
  users: string;
  response: string;
};

export const workSectors: WorkSector[] = [
  {
    slug: "speezu",
    label: "Commerce and delivery",
    challenge:
      "Coordinating customers, stores, riders and platform administration around one live order lifecycle.",
    users: "Customers, store owners, delivery riders and platform administrators.",
    response: "Four purpose-built interfaces sharing one connected commerce and delivery system.",
  },
  {
    slug: "durafoam-3d-foam-configurator-shopify",
    label: "Manufacturing and custom products",
    challenge:
      "Making a technically complex, made-to-measure product understandable without endless back-and-forth.",
    users: "Retail customers configuring bespoke foam alongside standard product buyers.",
    response: "An interactive 3D configurator built into a standard Shopify Hydrogen storefront.",
  },
  {
    slug: "leicester-medical-society",
    label: "Healthcare and professional communities",
    challenge:
      "Bringing public information, member services, learning and administration into one coherent platform.",
    users: "Public visitors, Society members and administrators.",
    response: "A connected website, member portal and administration platform sharing one content system.",
  },
];

export type WorkArchitectureLayer = {
  title: string;
  body: string;
};

export const workArchitectureLayers: WorkArchitectureLayer[] = [
  { title: "Customer experience", body: "The interface people use — mobile apps, storefronts and member-facing tools." },
  { title: "Business operations", body: "The dashboards and workflows staff use to run the day-to-day product." },
  { title: "Integrations and data", body: "Payments, maps, notifications and the data that connects each role." },
  { title: "Support and continuous improvement", body: "Monitoring, fixes and the next stage of product growth after launch." },
];

export type WorkRelationshipPrinciple = {
  title: string;
  body: string;
};

export const workRelationshipPrinciples: WorkRelationshipPrinciple[] = [
  {
    title: "Direct communication",
    body: "Clear conversations, visible progress and straightforward decisions throughout the project.",
  },
  {
    title: "Shared understanding",
    body: "We align product goals, user needs and technical requirements before unnecessary complexity is introduced.",
  },
  {
    title: "Responsible delivery",
    body: "Every stage is reviewed for usability, maintainability, responsiveness and production readiness.",
  },
  {
    title: "Support beyond launch",
    body: "We remain available for improvements, technical support and the next stage of product growth.",
  },
];
