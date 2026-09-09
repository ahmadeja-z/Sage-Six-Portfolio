// Server-side verified knowledge base for the Ask Sage Six assistant.
// Reuses authoritative project data so facts are not duplicated.

import { services } from "@/data/content";
import { projects } from "@/data/projects";
import { siteConfig } from "@/lib/site";

const serviceList = services
  .map((s) => `- ${s.title}`)
  .join("\n");

const projectFacts = projects
  .map((p) => `- ${p.title}: ${p.shortDescription}`)
  .join("\n");

export const companyKnowledge = `SAGE SIX — VERIFIED COMPANY FACTS
- Sage Six is a software-development company.
- Services: ${serviceList.replace(/\n/g, ", ")}.
- The owner has stated "50+ projects delivered." This is the delivered-project count; it does not describe the number of clients, employees or years in business, and it is not an independently audited metric.
- Contact email: ${siteConfig.email}.
- Sage Six has no published telephone number and no physical UK office address. Do not invent one.`;

export const caseStudyKnowledge = `VERIFIED CASE STUDIES
${projectFacts}

Notes:
- Case-study images are portfolio presentations; never claim that a payment flow, security control or measured business result is live merely because it appears in an image.
- Verified Speezu Google Play links exist in the Speezu case study content; reuse those exact URLs when asked.`;

export const servicesKnowledge = `SERVICES
Sage Six offers these services (see the Services page for detail):
${serviceList}`;

export const processKnowledge = `PROCESS
Sage Six delivers discovery, scope definition, product design, development, testing, release and ongoing support. Do not invent fixed durations, guaranteed milestones or contractual terms.`;

export const pricingKnowledge = `PRICING AND TIMELINES
- Sage Six does not publish binding quotes or guaranteed delivery dates.
- Cost depends on the platforms, features, integrations, existing assets and delivery scope.
- When asked about cost, explain the factors that influence an estimate and offer to prepare a project enquiry.
- Do not invent price ranges or fixed timelines.`;

export const knowledgeBase = [
  companyKnowledge,
  caseStudyKnowledge,
  servicesKnowledge,
  processKnowledge,
  pricingKnowledge,
].join("\n\n");