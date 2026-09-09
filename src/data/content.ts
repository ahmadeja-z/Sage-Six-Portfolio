import type { Service, ProcessStep, Capability } from "@/types";

export const capabilities: Capability[] = [
  { index: "01", title: "Mobile Applications" },
  { index: "02", title: "Web Platforms" },
  { index: "03", title: "AI & Automation" },
  { index: "04", title: "MVP Development" },
  { index: "05", title: "Backend & APIs" },
  { index: "06", title: "Product Design" },
];

export const services: Service[] = [
  {
    index: "01",
    title: "Mobile App Development",
    anchor: "mobile-app-development",
    intro:
      "Turn customer journeys and business workflows into mobile experiences people can use with confidence. Sage Six develops Flutter applications for iOS and Android, connecting clear interfaces with the backend services and integrations your product needs.",
    scope: [
      "Mobile interface implementation and responsive screen layouts",
      "Account, profile, catalogue and ordering journeys",
      "Payments, maps and notifications when required",
      "Backend API integration and application state management",
      "Testing across agreed devices and release preparation",
    ],
    bestFit:
      "Businesses building a new mobile product, extending an existing app or connecting customers and delivery operations.",
    cta: "Discuss Your Mobile App",
    caseStudy: "speezu",
    insight: "mobile-app-development-cost",
  },
  {
    index: "02",
    title: "Website Design and Development",
    anchor: "website-development",
    intro:
      "Give your business a website that explains what you do and makes the next step clear. We design and develop responsive websites that present services, products and company information through well-structured content and purposeful enquiry journeys.",
    scope: [
      "Business, service and product-focused websites",
      "Responsive interface design and frontend development",
      "Content-management features where required",
      "Product catalogues and structured company information",
      "Enquiry forms, performance improvements and technical SEO foundations",
    ],
    bestFit:
      "Companies launching a new website or improving how their existing website presents the business.",
    cta: "Plan Your Website",
    caseStudy: "durafoam-3d-foam-configurator-shopify",
    insight: "business-website-development-cost",
  },
  {
    index: "03",
    title: "Custom Web Applications and Integrations",
    anchor: "web-applications",
    intro:
      "Build software around the way your organisation works. We develop web platforms that bring users, content and operational tasks together, from member portals and administrative dashboards to the integrations that connect existing systems.",
    scope: [
      "Member portals and account-based experiences",
      "Administrative dashboards and management interfaces",
      "Role-specific workflows and permission requirements",
      "Event, content and membership processes",
      "API and third-party service integrations",
      "Reporting and data presentation defined by the project scope",
    ],
    bestFit:
      "Organisations that need interactive software, shared workflows or connected operational tools.",
    cta: "Scope Your Web Platform",
    caseStudy: "leicester-medical-society",
    insight: "admin-dashboard-development-guide",
  },
  {
    index: "04",
    title: "AI Integration and Workflow Automation",
    anchor: "ai-automation",
    intro:
      "Identify where AI and automation can help your team handle repetitive work. We assess the workflow, connect suitable tools and build practical integrations with clear review points, so people stay responsible for important decisions.",
    scope: [
      "Workflow discovery and suitability assessment",
      "Connecting approved AI services to existing applications",
      "Document, content and enquiry-processing assistance",
      "Connecting business tools and reducing repetitive data entry",
      "Human review, exception handling and evaluation of outputs",
    ],
    bestFit:
      "Businesses exploring a specific automation opportunity or adding AI-assisted features to an existing product.",
    cta: "Discuss an Automation Opportunity",
  },
  {
    index: "05",
    title: "UI/UX Design and MVP Planning",
    anchor: "product-design",
    intro:
      "Give your product a clear direction before committing to the full build. We help define the essential user journeys, organise requirements and design interfaces that make the intended experience easier to review and develop.",
    scope: [
      "Requirements and user-journey mapping",
      "Wireframes and interface design",
      "Interactive prototypes where useful",
      "Feature prioritisation and MVP scope",
      "Reusable interface patterns and development handover",
    ],
    bestFit:
      "Founders and teams turning an idea into a defined product, or improving a complex existing experience.",
    cta: "Shape Your Product",
    insight: "idea-to-mvp-development-guide",
  },
  {
    index: "06",
    title: "Software Maintenance and Technical Support",
    anchor: "technical-support",
    intro:
      "Keep your business software useful as requirements, devices and dependencies change. Sage Six provides technical support for mobile apps, websites and custom platforms, helping teams investigate faults, maintain supported systems and plan practical improvements.",
    supporting:
      "We can assess products built by your current team or a previous supplier. An initial review helps us understand the codebase, integrations, available documentation and current issues before agreeing how support will work.",
    scope: [
      "Reproducing, diagnosing and fixing software issues",
      "Framework, dependency and compatibility updates",
      "Investigating performance and stability problems",
      "Troubleshooting existing APIs and integrations",
      "Agreed enhancements and interface improvements",
      "Release assistance, technical documentation and handover",
      "Maintenance priorities and progress updates under the agreed arrangement",
    ],
    bestFit:
      "Companies that already have an application or website and need a dependable technical point of contact for agreed software work.",
    cta: "Discuss Technical Support",
    insight: "app-website-maintenance-checklist",
  },
  {
    index: "07",
    title: "Dedicated Developers and Team Extension",
    anchor: "team-extension",
    intro:
      "Bring additional development expertise into the team you already have. Sage Six offers project-based developer support that can fit into your backlog, communication channels and review process, with clear responsibilities and an agreed scope of involvement.",
    supporting:
      "Whether you need Flutter expertise for a mobile application, help delivering web features or additional support for a defined workstream, we start by matching the required skills and availability to the work.",
    howItWorks: [
      "Discuss the required skills, responsibilities and expected duration",
      "Agree availability, collaboration hours and reporting arrangements",
      "Establish access, onboarding and review responsibilities",
      "Work through the agreed backlog using the client's delivery process",
      "Review progress and adjust the arrangement when requirements change",
    ],
    bestFit:
      "Product teams and development agencies that need additional delivery capacity for a defined project or period.",
    cta: "Discuss Developer Support",
  },
];

export const homeServices = [
  {
    title: "Mobile app development",
    description: "Apps for iOS and Android, with connected services and practical user journeys.",
  },
  {
    title: "Website development",
    description: "Business websites and web experiences that make your offering clear.",
  },
  {
    title: "Custom software & integrations",
    description: "Portals, dashboards and integrations shaped around your operations.",
  },
  {
    title: "UI/UX design & MVP planning",
    description: "Define the essential features and design the first product experience.",
  },
  {
    title: "AI integration & automation",
    description: "Integrate suitable AI tools and automate selected business workflows.",
  },
  {
    title: "Technical support & team extension",
    description: "Maintain existing software or add development expertise to your team.",
  },
];

export const engagementOptions = [
  {
    title: "Project delivery",
    suitable: "You have a new product, website or defined improvement to deliver.",
    working: "Agree scope, milestones, responsibilities and acceptance criteria for the work.",
  },
  {
    title: "Ongoing software support",
    suitable: "You need maintenance, issue resolution and planned improvements for an existing product.",
    working: "Review the system, agree coverage and priorities, then manage the support backlog.",
  },
  {
    title: "Team extension",
    suitable: "Your team needs additional development expertise or capacity.",
    working: "Agree skills, availability and responsibilities, then work within your team's process.",
  },
];

export const serviceDeliverySteps = [
  { title: "Understand", text: "Discuss the business goal, users, current systems and constraints." },
  { title: "Define", text: "Agree scope, priorities, deliverables and review points." },
  { title: "Design and build", text: "Create the agreed experience and integrations." },
  { title: "Review and test", text: "Check the workflows and resolve issues against the acceptance criteria." },
  { title: "Release or continue", text: "Prepare handover and agree any ongoing support or next phase." },
];

export const serviceFaqs = [
  {
    q: "Can you support an application built by another company?",
    a: "Yes. We begin by reviewing the available source code, documentation, access and current issues. That review helps us agree what can be supported and whether stabilisation work is needed first.",
  },
  {
    q: "Can your developers work with our existing team?",
    a: "We can discuss a team-extension arrangement around the skills, availability and work required. Responsibilities, communication and review processes are agreed before onboarding.",
  },
  {
    q: "Do you provide support after launch?",
    a: "Maintenance and ongoing improvements can be included in an agreed support arrangement. Coverage, included work and response targets are defined for the product.",
  },
  {
    q: "Can we begin with a smaller scope?",
    a: "Yes. We can start with discovery, a focused feature, a product review or an MVP scope, then agree further work around priorities.",
  },
  {
    q: "How do you estimate a project?",
    a: "We review the requirements, user roles, integrations, design needs and delivery constraints before preparing an estimate. Existing software may require an initial technical assessment.",
  },
  {
    q: "What should we share when enquiring?",
    a: "Share the business goal, required service, current product or website, known constraints and any useful brief or design material. Sensitive credentials should be provided later through an agreed secure channel.",
  },
];

export const process: ProcessStep[] = [
  {
    index: "01",
    title: "Discover",
    description: "Understand the business, users and goals.",
  },
  {
    index: "02",
    title: "Define",
    description: "Translate requirements into a clear product strategy.",
  },
  {
    index: "03",
    title: "Design",
    description: "Create intuitive experiences and scalable architecture.",
  },
  {
    index: "04",
    title: "Build",
    description: "Engineer, test and iterate.",
  },
  {
    index: "05",
    title: "Launch",
    description: "Deploy and monitor the product.",
  },
  {
    index: "06",
    title: "Scale",
    description: "Improve, automate and grow.",
  },
];

export const aiAreas = [
  {
    title: "AI Products",
    description: "Build intelligent applications and experiences.",
  },
  {
    title: "AI Automation",
    description: "Automate repetitive business operations.",
  },
  {
    title: "AI Agents",
    description: "Create systems that can reason, act and execute workflows.",
  },
  {
    title: "AI-Powered Development",
    description: "Accelerate engineering without sacrificing quality.",
  },
];

export const technologies = [
  "Flutter",
  "React",
  "Next.js",
  "Node.js",
  "Laravel",
  "Supabase",
  "Firebase",
  "PostgreSQL",
  "AI",
  "Claude",
  "OpenAI",
  "AWS",
  "Vercel",
];



export const aboutBlocks = [
  {
    label: "Mission",
    text: "We turn complex ideas into products people can use. Reliable software, honest engineering and AI applied where it actually helps.",
  },
  {
    label: "Vision",
    text: "A world where every ambitious business can build software as good as the biggest technology companies — without the overhead.",
  },
  {
    label: "Values",
    text: "Clarity over jargon. Progress over perfection. Systems that scale. Humans at the centre of everything we automate.",
  },
  {
    label: "Technology philosophy",
    text: "We choose boring, dependable technology where it matters and exciting technology where it creates advantage. Small, fast, reliable — and AI-native where it genuinely helps.",
  },
];