import type { Testimonial } from "./home";

// Fictional placeholder content — used ONLY to preview the testimonials
// section (card layout, spacing, marquee animation) while no approved
// reviews exist yet. None of this is real customer feedback: names, roles,
// companies, and quotes are all invented, and no portraits, logos, social
// links, or statistics are attached.
//
// Wiring (see HomePageContent.tsx): shown only when `NODE_ENV !== "production"`
// AND the real `testimonials` array in `home.ts` is still empty. To go live
// with real reviews, add approved entries to `testimonials` in `home.ts` —
// this file is then ignored automatically, in both development and
// production, and can be deleted.
export const sampleTestimonials: Testimonial[] = [
  {
    quote:
      "They took the time to understand the problem before jumping into a solution — that mattered more than we expected.",
    clientName: "Sample Client 01",
    role: "Founder",
    company: "Early-Stage Startup",
    approved: true,
  },
  {
    quote:
      "Communication was consistent throughout the project — we never had to chase updates.",
    clientName: "Sample Client 02",
    role: "Operations Lead",
    company: "Retail Business",
    approved: true,
  },
  {
    quote:
      "The design felt considered rather than generic. It matched how our team actually works.",
    clientName: "Sample Client 03",
    role: "Product Manager",
    company: "SaaS Company",
    approved: true,
  },
  {
    quote:
      "Delivery stayed on track even as our requirements shifted midway through.",
    clientName: "Sample Client 04",
    role: "Marketing Lead",
    company: "Professional Services Firm",
    approved: true,
  },
  {
    quote:
      "Short feedback loops meant issues were caught early instead of at the end.",
    clientName: "Sample Client 05",
    role: "IT Manager",
    company: "Healthcare Provider",
    approved: true,
  },
  {
    quote:
      "The final product was simple enough that our whole team adopted it right away.",
    clientName: "Sample Client 06",
    role: "Founder",
    company: "Consumer App",
    approved: true,
  },
];
