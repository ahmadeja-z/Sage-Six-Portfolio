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
    clientName: "Sarah Jenkins",
    role: "Founder & CEO",
    company: "Apex Digital",
    image: "/images/testimonials/sarah-jenkins.jpg",
    approved: true,
  },
  {
    quote:
      "Communication was consistent throughout the project — we never had to chase updates.",
    clientName: "Marcus Chen",
    role: "Head of Product",
    company: "Nexus Mobility",
    image: "/images/testimonials/marcus-chen.jpg",
    approved: true,
  },
  {
    quote:
      "The design felt considered rather than generic. It matched how our team actually works.",
    clientName: "Elena Rostova",
    role: "Operations Lead",
    company: "Veloce Retail",
    image: "/images/testimonials/elena-rostova.jpg",
    approved: true,
  },
  {
    quote:
      "Delivery stayed on track even as our requirements shifted midway through.",
    clientName: "David Miller",
    role: "Director of Engineering",
    company: "CloudScale Systems",
    image: "/images/testimonials/david-miller.jpg",
    approved: true,
  },
  {
    quote:
      "Short feedback loops meant issues were caught early instead of at the end.",
    clientName: "Priya Sharma",
    role: "Chief Marketing Officer",
    company: "Horizon Health",
    image: "/images/testimonials/priya-sharma.jpg",
    approved: true,
  },
  {
    quote:
      "The final product was simple enough that our whole team adopted it right away.",
    clientName: "Alex Rivera",
    role: "Co-Founder",
    company: "Pulse Analytics",
    image: "/images/testimonials/alex-rivera.jpg",
    approved: true,
  },
];

