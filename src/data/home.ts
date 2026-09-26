export type HomeService = {
  title: string;
  description: string;
  image: string;
  icon: "mobile" | "web" | "commerce" | "design" | "cloud" | "ai";
  light?: boolean;
};
export const homeServices: HomeService[] = [
  {
    title: "Mobile Apps",
    description: "Engaging experiences on any device.",
    image: "hero-mobile-apps.png",
    icon: "mobile",
  },
  {
    title: "Web Platforms",
    description: "Scalable systems for bigger ambitions.",
    image: "hero-web-platforms.png",
    icon: "web",
  },
  {
    title: "Commerce",
    description: "Digital journeys built to convert.",
    image: "hero-commerce.png",
    icon: "commerce",
  },
  {
    title: "Product Design",
    description: "Human-centred from idea to impact.",
    image: "hero-product-design.png",
    icon: "design",
  },
  {
    title: "Cloud Systems",
    description: "Secure infrastructure built to scale.",
    image: "hero-cloud-systems.png",
    icon: "cloud",
  },
  {
    title: "AI Automation",
    description: "Practical AI for real business value.",
    image: "hero-ai-automation.png",
    icon: "ai",
  },
];
export const homeNavigation = [
  { label: "Work", href: "/work" },
  { label: "Expertise", href: "/expertise" },
  { label: "Company", href: "/company" },
  { label: "Insights", href: "/insights" },
  { label: "Contact", href: "/contact" },
];
export const capabilities = [
  {
    title: "Strategy-led",
    description: "Clear thinking focused on real business goals.",
  },
  {
    title: "Thoughtfully designed",
    description: "Useful products people enjoy using.",
  },
  {
    title: "Carefully engineered",
    description: "Reliable systems built to perform and scale.",
  },
];
const featured = [
  {
    slug: "durafoam-3d-foam-configurator-shopify",
    title: "DURAFOAM",
    category: "E-commerce / 3D configurator",
    description:
      "A custom Shopify Hydrogen experience for configuring and ordering foam products.",
    image: "case-study-durafoam-thumbnail.png",
    alt: "DURAFOAM storefront and custom foam 3D configurator",
    width: 1672,
    height: 941,
  },
  {
    slug: "speezu",
    title: "SPEEZU",
    category: "Commerce / Delivery ecosystem",
    description:
      "Customer, store, administration, and rider experiences working as one system.",
    image: "case-study-speezu-system-thumbnail.png",
    alt: "SPEEZU customer ordering, store management and rider delivery applications",
    width: 1669,
    height: 942,
  },
  {
    slug: "leicester-medical-society",
    title: "Leicester Medical Society",
    category: "Website / Member portal",
    description:
      "A connected public website, member portal, and administration platform.",
    image: "case-study-leicester-medical-society-thumbnail.png",
    alt: "Leicester Medical Society website, member portal and administration platform",
    width: 1672,
    height: 941,
  },
];
// Validated against the case-study registry in home-content.test.ts without shipping full case studies to the homepage.
export const homeProjects = featured;
export type Testimonial = {
  quote: string;
  clientName: string;
  role?: string;
  company?: string;
  project?: string;
  source?: string;
  image?: string;
  approved: boolean;
};
// Below this many approved reviews, CustomerReviews shows the paged carousel
// instead of the marquee — too few cards to loop without feeling repetitive.
export const REVIEW_MARQUEE_THRESHOLD = 4;
export const testimonials: Testimonial[] = [
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
export const companyRecord = {
  name: "Sage Six Ltd",
  number: "17315871",
  url: "https://find-and-update.company-information.service.gov.uk/company/17315871",
  verifiedOn: "2026-09-13",
};
