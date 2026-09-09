import type { Project, ProjectImage } from "@/types";

const img = (
  base: string,
  file: string,
  alt: string,
  width: number,
  height: number,
): ProjectImage => ({ src: `${base}/${file}`, alt, width, height });

const speezuImg = (file: string, alt: string, width = 1672, height = 941) =>
  img("/images/projects/speezu", file, alt, width, height);

const durafoamImg = (file: string, alt: string, width = 1586, height = 992) =>
  img("/images/case-studies/durafoam", file, alt, width, height);

const leicesterImg = (
  file: string,
  alt: string,
  width = 1536,
  height = 1024,
  caption?: string,
): ProjectImage => ({
  ...img("/images/case-studies/Leicester Medical Society", file, alt, width, height),
  ...(caption ? { caption } : {}),
});

export const projects: Project[] = [

  {
    slug: "leicester-medical-society",
    category: "Healthcare Platform",
    title: "Leicester Medical Society",
    shortDescription:
      "A connected medical society platform combining public events, member learning, membership services and administration.",
    fullCardDescription:
      "Sage Six designed and developed a connected digital platform for Leicester Medical Society — a public website, a member portal and an administration platform unified around medical events, professional learning, membership services and content management.",
    tags: ["Web Platform", "Member Portal", "Events", "Digital Learning"],
    services: ["Product Strategy", "UX/UI Design", "Web Development", "Platform Design"],
    featured: true,
    featuredOrder: 1,
    workOrder: 1,
    industry: "Healthcare and Professional Membership",
    type: "Case Study",
    platform: "Responsive Web Platform",
    products: "Website, Member Portal & Admin Platform",
    role: "Product Strategy, UX/UI Design, Web Development and Platform Design",
    accent: "#0A64AE",
    coverImage: leicesterImg(
      "leicester-medical-society-01-main-header.png",
      "Leicester Medical Society digital platform showing the public website, member portal and administration dashboard designed and developed by Sage Six.",
    ),
    heroEyebrow: "HEALTHCARE PLATFORM · WEBSITE · MEMBER PORTAL · ADMIN SYSTEM",
    heroTitle:
      "Leicester Medical Society — A Connected Digital Platform for Events, Membership and Professional Learning",
    heroLead:
      "Sage Six designed and developed a connected digital platform for Leicester Medical Society, bringing public information, medical events, member services, professional learning, CPD activity and administration into one cohesive experience.",
    facts: [
      { label: "Client", value: "Leicester Medical Society" },
      { label: "Industry", value: "Healthcare and Professional Membership" },
      {
        label: "Services",
        value: "Product Strategy, UX/UI Design, Web Development and Platform Design",
      },
      { label: "Platform", value: "Responsive Web Platform" },
      { label: "Audiences", value: "Public Visitors, Society Members and Administrators" },
      { label: "Location", value: "Leicester, United Kingdom" },
    ],
    cta: {
      eyebrow: "Build with Sage Six",
      title: "Planning a membership platform or professional organisation website?",
      body: "Sage Six designs and develops connected digital products that combine public experiences, member services, content management and operational tools.",
      secondaryLabel: "View More Work",
      secondaryUrl: "/work",
      secondaryExternal: false,
    },
    sections: [
      {
        kind: "prose",
        label: "01 — PROJECT OVERVIEW",
        heading: "More than a medical society website",
        body:
          "Leicester Medical Society required more than a static online presence. Its digital experience needed to support public discovery, educational events, member engagement, professional learning, membership administration and ongoing content management. Sage Six approached the project as a connected platform rather than a collection of disconnected pages. The resulting system brings together a public website, a member portal and an administration platform, with each experience designed around the responsibilities of its audience.",
        image: leicesterImg(
          "leicester-medical-society-02-project-overview.png",
          "Overview of the Leicester Medical Society platform experiences for public visitors, authenticated members and administrators.",
          undefined,
          undefined,
          "A connected ecosystem spanning public, member and administrative experiences.",
        ),
      },
      {
        kind: "prose",
        label: "02 — THE CHALLENGE",
        heading: "Connecting public engagement with member and administrative needs",
        body:
          "The central product challenge was balancing three different experiences without making the platform feel fragmented. Public visitors needed an accessible way to learn about the Society, discover events, explore resources and understand membership opportunities. Authenticated members needed a focused area for events, lectures, CPD activity and membership renewal. Administrators needed structured tools for managing the information and records powering both experiences. The design therefore needed to make complex functionality feel calm, credible and easy to navigate while maintaining the professional character expected from a medical organisation.",
        points: [
          {
            title: "Public discovery",
            body: "Help visitors find events, resources, Society information and membership opportunities.",
          },
          {
            title: "Member engagement",
            body: "Centralise learning, registrations, CPD progress and membership services.",
          },
          {
            title: "Operational control",
            body: "Give administrators consistent tools for publishing content and managing platform records.",
          },
        ],
      },
      {
        kind: "prose",
        label: "03 — USER ROLES",
        heading: "Three audiences, one connected system",
        body:
          "The platform is structured around three connected roles, each with its own responsibilities, tools and journey.",
        points: [
          {
            title: "Public visitors",
            items: [
              "Discover the Society",
              "Browse medical events",
              "Switch between event views",
              "Read news and public resources",
              "Explore membership",
              "View committee and gallery content",
              "Review sponsorship opportunities",
              "Submit enquiries",
              "Create an account or sign in",
            ],
          },
          {
            title: "Society members",
            items: [
              "Access a personalised dashboard",
              "Review membership status",
              "Register for events",
              "View upcoming registrations",
              "Access lectures and course content",
              "Track lesson completion and CPD activity",
              "Use member-only resources",
              "Renew membership",
              "Maintain account settings",
            ],
          },
          {
            title: "Administrators",
            items: [
              "Review platform activity",
              "Create, edit and manage events",
              "Manage members and membership status",
              "Create lecture courses and lessons",
              "Publish and manage news",
              "Maintain committee profiles",
              "Organise resources and gallery content",
              "Review operational data",
              "Manage structured public content",
            ],
          },
        ],
        image: leicesterImg(
          "leicester-medical-society-11-system-architecture.png",
          "Connected role architecture linking Leicester Medical Society visitors, members and administrators.",
          undefined,
          undefined,
          "A role-based product architecture connects every platform experience.",
        ),
      },
      {
        kind: "prose",
        label: "04 — EVENTS",
        heading: "Flexible event discovery and a focused reservation journey",
        body:
          "The events experience supports different browsing behaviours. Grid view provides quick visual comparison, calendar view helps users understand schedules, and timeline view makes chronological exploration straightforward. Each event can lead into a detailed information page and reservation journey. Registration requirements, guest information and confirmation feedback are kept within a clear sequence so users always understand the next action.",
        features: [
          "Search and filtering",
          "Grid view",
          "Calendar view",
          "Timeline view",
          "Event details",
          "Capacity-aware registration",
          "Guest information",
          "Reservation confirmation",
          "Upcoming and archived content",
        ],
        steps: [
          "Discover an event",
          "Review event details",
          "Confirm attendance requirements",
          "Submit the reservation",
          "Receive confirmation",
        ],
        images: [
          leicesterImg(
            "leicester-medical-society-03-events-discovery.png",
            "Leicester Medical Society event discovery interface with grid, calendar and timeline views.",
            undefined,
            undefined,
          "Three event views support different discovery behaviours.",
          ),
          leicesterImg(
            "leicester-medical-society-04-event-reservation-flow.png",
            "Event details, registration form and reservation confirmation flow for the Leicester Medical Society website.",
            undefined,
            undefined,
          "A focused path from event information to confirmed reservation.",
          ),
        ],
      },
      {
        kind: "prose",
        label: "05 — MEMBER PORTAL",
        heading: "A personalised home for membership and professional activity",
        body:
          "The member portal brings the most relevant information into a single dashboard. Membership status, renewal timing, registered events, CPD progress and recent activity are visible without requiring members to navigate across disconnected systems. The interface prioritises current status and next actions, helping members understand what requires attention and what opportunities are available.",
        image: leicesterImg(
          "leicester-medical-society-05-member-dashboard.png",
          "Leicester Medical Society member dashboard showing membership status, upcoming events, CPD progress and recent activity.",
          undefined,
          undefined,
          "Membership, events and CPD progress brought into one dashboard.",
        ),
      },
      {
        kind: "prose",
        label: "06 — DIGITAL LEARNING",
        heading: "Structured lectures designed for continued learning",
        body:
          "The learning area transforms recorded lectures into structured digital courses. Members can browse educational material, open a lecture, navigate multiple video lessons and track completion. This creates a clearer professional-learning experience than a simple archive of video links. Course organisation, lesson duration and progress states help members resume learning and understand what they have completed.",
        image: leicesterImg(
          "leicester-medical-society-06-digital-learning.png",
          "Leicester Medical Society online lecture platform with video lessons, course navigation and learning-progress tracking.",
          undefined,
          undefined,
          "Structured lectures combine video learning with visible progress.",
        ),
      },
      {
        kind: "prose",
        label: "07 — MEMBERSHIP",
        heading: "A clearer membership lifecycle",
        body:
          "Membership information and renewal are treated as a connected lifecycle. Users can understand available membership options, review their current details and move through the renewal journey with visible progress and clear payment handoff states. The experience reduces uncertainty by showing what is being renewed, what the next step involves and when the user is moving into a secure payment environment.",
        steps: [
          "Review options",
          "Confirm details",
          "Prepare payment",
          "Secure checkout",
          "Updated membership",
        ],
        image: leicesterImg(
          "leicester-medical-society-07-membership-renewal.png",
          "Leicester Medical Society membership tiers, renewal review and secure payment transition.",
          undefined,
          undefined,
          "A guided renewal journey with clear payment-transition states.",
        ),
      },
      {
        kind: "prose",
        label: "08 — ADMINISTRATION",
        heading: "Centralised operations for a content-rich membership platform",
        body:
          "A dedicated administration experience supports the teams responsible for maintaining the platform. Rather than relying on developers for routine updates, authorised administrators can work through structured management screens for events, memberships, lectures, news and organisational content. The dashboard provides a high-level operational view, while each management area uses consistent searching, statuses, forms and record actions.",
        features: [
          "Dashboard overview",
          "Event management",
          "Member and membership-status management",
          "Lecture management",
          "News and content administration",
          "Committee management",
          "Reporting and operational visibility",
          "Search, editing and record actions",
          "Role-appropriate administrative navigation",
        ],
        image: leicesterImg(
          "leicester-medical-society-08-admin-operations.png",
          "Leicester Medical Society administration platform with analytics, event management, membership operations and reporting.",
          undefined,
          undefined,
          "Centralised operational tools for content and membership management.",
        ),
      },
      {
        kind: "prose",
        label: "09 — CONTENT MANAGEMENT",
        heading: "Keeping the public experience current",
        body:
          "The platform includes structured publishing workflows for news, educational content, professional resources, committee profiles and gallery collections. Reusable forms and management patterns reduce inconsistency and make routine content updates easier to complete.",
        image: leicesterImg(
          "leicester-medical-society-09-content-management.png",
          "Content-management workflows for Leicester Medical Society news, resources, committee profiles and gallery collections.",
          undefined,
          undefined,
          "Reusable publishing workflows keep the public website current.",
        ),
      },
      {
        kind: "prose",
        label: "10 — COMMUNITY ENGAGEMENT",
        heading: "Extending engagement beyond events",
        body:
          "The public experience gives the Society room to share educational resources, preserve event memories and communicate partnership opportunities. Resource filtering helps users locate relevant materials. Gallery collections provide a visual record of Society activity. Sponsorship pages explain partnership value and guide interested organisations through a dedicated enquiry workflow.",
        features: [
          "Downloadable resources",
          "Search and content filtering",
          "Public and member-only resources",
          "Event photo collections",
          "Sponsorship information",
          "Partner visibility",
          "Sponsorship enquiry form",
          "Successful enquiry feedback",
        ],
        image: leicesterImg(
          "leicester-medical-society-10-community-engagement.png",
          "Leicester Medical Society resources, event gallery, sponsorship information and enquiry workflow.",
          undefined,
          undefined,
          "Resources, galleries and sponsorship expand community engagement.",
        ),
      },
      {
        kind: "prose",
        label: "11 — DESIGN SYSTEM",
        heading: "A calm and credible interface for complex information",
        body:
          "The interface system was designed to make a feature-rich platform feel coherent. Strong typographic hierarchy, restrained colour, clear status indicators and reusable components help users scan information and recognise actions across public, member and administrative environments. The same visual language is adapted to different contexts: editorial discovery on public pages, task-focused navigation in the member portal and denser data presentation in the administration platform.",
        features: [
          "Clear visual hierarchy",
          "Accessible contrast",
          "Restrained clinical accent colour",
          "Consistent actions and states",
          "Reusable cards and content modules",
          "Scannable tables and forms",
          "Visible progress feedback",
          "Responsive layouts",
          "Predictable navigation",
          "Reduced visual noise",
        ],
        image: leicesterImg(
          "leicester-medical-society-12-design-system.png",
          "Leicester Medical Society interface design system showing typography, colours, buttons, badges, navigation, cards, forms and data tables.",
          undefined,
          undefined,
          "Reusable interface patterns create consistency across the system.",
        ),
      },
      {
        kind: "prose",
        label: "12 — ACCESSIBILITY & RESPONSIVENESS",
        heading: "Designed for clarity across screen sizes",
        body:
          "The platform should remain understandable across desktop, tablet and mobile devices. Content order, navigation, controls and data presentation must adapt without hiding essential actions. Semantic structure, visible keyboard focus, meaningful form labels, accessible status communication, descriptive alternative text and sufficient colour contrast should be maintained throughout the implementation.",
      },
      {
        kind: "prose",
        label: "13 — OUTCOME",
        heading: "One connected foundation for the Society's digital experience",
        body:
          "The Leicester Medical Society project demonstrates how a traditional professional organisation can be translated into a connected digital product. The platform unifies public information, medical event discovery, member services, professional learning, membership renewal and administrative management within one consistent experience. It creates a scalable foundation that can grow as the Society's content, membership services and digital programmes evolve.",
        image: leicesterImg(
          "leicester-medical-society-13-final-showcase.png",
          "Complete Leicester Medical Society digital ecosystem combining event discovery, member learning, membership renewal and administration.",
          undefined,
          undefined,
          "One connected digital foundation for Leicester Medical Society.",
        ),
      },
    ],
    technologies: [
      { name: "Responsive Web Platform", note: "Public, member and administrative experiences" },
      { name: "Member Portal", note: "Personalised membership dashboard" },
      { name: "Event Platform", note: "Discovery and reservation workflows" },
      { name: "Digital Learning", note: "Structured lecture and CPD experience" },
      { name: "Administration", note: "Content and membership management" },
    ],
    seo: {
      title: "Leicester Medical Society Website & Member Portal Case Study | Sage Six",
      description:
        "Explore how Sage Six designed and developed the Leicester Medical Society website, member portal, events platform, digital learning experience and administration system.",
      keywords: [
        "Leicester Medical Society website",
        "Leicester Medical Society platform",
        "Leicester Medical Society case study",
        "Medical society website design",
        "Medical membership platform",
        "Medical member portal",
        "Healthcare website development",
        "Medical event management platform",
        "Medical events in Leicester",
        "Medical lectures in Leicester",
        "Professional membership website",
        "CPD learning platform",
        "Online medical lectures",
        "Medical education platform",
        "Membership renewal platform",
        "Healthcare admin dashboard",
        "Medical content management system",
        "Responsive medical website",
        "Leicester healthcare platform",
        "Website design and development Leicester",
        "UK medical society digital platform",
        "Sage Six healthcare website development",
        "Sage Six web development case study",
      ],
    },
  },

  {
    slug: "speezu",
    category: "Commerce & Delivery Ecosystem",
    title: "SPEEZU",
    shortDescription:
      "A multi-application commerce and delivery platform connecting customers, stores and delivery operations.",
    fullCardDescription:
      "SPEEZU is a connected commerce and delivery ecosystem with a customer application, a rider application, store operations and centralized administration — spanning discovery, checkout, payments, delivery and order tracking.",
    tags: ["Flutter", "Mobile Application", "E-commerce", "Delivery"],
    services: ["Product Development", "Mobile Development", "System Integration"],
    featured: true,
    featuredOrder: 2,
    workOrder: 2,
    industry: "E-commerce & On-Demand Delivery",
    type: "Case Study",
    platform: "Android, iOS & Web",
    products: "Customer App, Rider App, Store Panel & Admin Panel",
    role: "Mobile Application Development & System Integration",
    accent: "#2FA49C",
    coverImage: speezuImg(
      "speezu-01-ecosystem-hero.png",
      "SPEEZU ecosystem showing the customer application, store dashboard, and rider delivery application.",
    ),
    heroEyebrow: "CASE STUDY / COMMERCE & DELIVERY",
    heroTitle:
      "SPEEZU — One Connected Ecosystem for Commerce, Stores, and Delivery",
    heroLead:
      "SPEEZU connects customer ordering, store operations, platform administration, and last-mile delivery within one coordinated digital ecosystem. The system combines two mobile applications with dedicated store and administrative web panels, allowing every participant to manage their part of the order journey in real time.",
    facts: [
      { label: "Industry", value: "E-commerce & On-Demand Delivery" },
      { label: "Platforms", value: "Android, iOS & Web" },
      { label: "Products", value: "Customer App, Rider App, Store Panel & Admin Panel" },
      { label: "Role", value: "Mobile Application Development & System Integration" },
    ],
    apps: [
      {
        name: "SPEEZU Customer App",
        url: "https://play.google.com/store/apps/details?id=com.speezu.store",
        label: "View the SPEEZU Customer App on Google Play",
      },
      {
        name: "SPEEZU Rider App",
        url: "https://play.google.com/store/apps/details?id=com.speezu.deliveryapp",
        label: "View the SPEEZU Rider App on Google Play",
      },
    ],
    sections: [
      {
        kind: "overview",
        label: "01 / OVERVIEW",
        heading: "A Unified Platform Built Around the Complete Order Journey",
        body: "SPEEZU was designed as more than a standalone shopping application. Customers can discover products across food, supermarkets, retail stores, and pharmacies; stores can manage catalogues and fulfilment; administrators can oversee platform-wide operations; and riders can handle deliveries from request to completion. Each product serves a focused user role while sharing one connected operational flow.",
        points: [
          {
            title: "Customer commerce",
            body: "Discovery, customisation, cart, checkout and tracking",
          },
          {
            title: "Store operations",
            body: "Products, variations, orders, history and performance",
          },
          {
            title: "Platform control",
            body: "Stores, riders, commissions, orders and payments",
          },
          {
            title: "Delivery execution",
            body: "Requests, pickup, progress and completion",
          },
        ],
      },
      {
        kind: "split",
        label: "02 / THE CHALLENGE",
        challengeHeading:
          "Coordinating Multiple Roles Without Fragmenting the Experience",
        challenge:
          "A delivery marketplace must keep customers, stores, platform operators, and riders aligned while an order changes state. Product options, payments, fulfilment decisions, rider assignment, and delivery confirmation all need to remain consistent across different interfaces. The central challenge was to make this operational complexity feel simple for each user.",
        solutionHeading: "One Workflow, Four Purpose-Built Interfaces",
        solution:
          "The solution separates each role into a focused product while maintaining a shared order lifecycle. Customers receive a streamlined shopping experience, stores gain practical catalogue and order tools, administrators retain platform-level visibility, and riders receive only the controls required to complete deliveries efficiently.",
        image: speezuImg(
          "speezu-06-end-to-end-order-lifecycle.png",
          "End-to-end SPEEZU order lifecycle connecting customer checkout, store processing, admin monitoring, and rider delivery.",
        ),
      },
      {
        kind: "feature",
        label: "03 / CUSTOMER EXPERIENCE",
        heading: "From Product Discovery to Live Order Progress",
        body: "The SPEEZU customer application supports a complete multi-category ordering journey. Customers can browse nearby stores, search products, select variations, add optional extras, manage quantities, apply coupons, choose delivery or pickup, select an address, choose a payment method, and monitor fulfilment through clear order stages.",
        features: [
          "Multi-category discovery for food, supermarkets, retail, and pharmacy",
          "Product variations, sizes, flavours, extras, and related products",
          "Cart management, coupons, delivery or pickup, and checkout",
          "Cash-on-delivery and Paystack-powered online payment flows",
          "Saved addresses and map-based location selection",
          "Order status progression from placed to delivered",
          "Search history, favourites, localisation, and customer order history",
        ],
        storeLink: {
          eyebrow: "Explore the live customer experience",
          title: "View SPEEZU on Google Play",
          url: "https://play.google.com/store/apps/details?id=com.speezu.store",
          ariaLabel: "View the SPEEZU Customer App on Google Play",
        },
        image: speezuImg(
          "speezu-02-customer-shopping-experience.png",
          "SPEEZU customer journey showing product customisation, shopping cart, checkout, and live order status.",
        ),
      },
      {
        kind: "feature",
        label: "04 / STORE PANEL",
        heading: "Practical Tools for Catalogue, Orders, and Fulfilment",
        body: "The store panel gives merchants direct control over their day-to-day SPEEZU operations. Store teams can review performance, publish and update products, configure pricing and discounts, upload multiple product images, manage options and variations, receive incoming orders, inspect order details, and move orders through the fulfilment process.",
        features: [
          "Dashboard with orders, revenue, top products, and recent activity",
          "Searchable product catalogue with availability controls",
          "Add and edit product flows with images, categories, pricing, and discounts",
          "Configurable product options, variations, extras, and delivery availability",
          "Incoming-order review, approval, rejection, and status management",
          "Order details with customer, payment, item, and store-earnings information",
          "Order and customer reporting",
        ],
        image: speezuImg(
          "speezu-03-store-management-workflow.png",
          "SPEEZU store panel showing performance, product management, product editing, and order fulfilment.",
        ),
      },
      {
        kind: "feature",
        label: "05 / ADMIN CONTROL",
        heading: "Platform-Wide Visibility and Operational Control",
        body: "The administrative panel provides a centralized view of the SPEEZU ecosystem. Administrators can manage stores and riders, monitor orders across the platform, configure store commission percentages, review delivery availability, manage coupons, and inspect Paystack transaction activity through date-based reporting.",
        features: [
          "Store directory, activation, delivery controls, and commission configuration",
          "Rider profiles, status, contact information, and management actions",
          "Cross-store order monitoring with customer, rider, status, and totals",
          "SPEEZU platform-share visibility on applicable orders",
          "Coupon and platform request management",
          "Store, customer, rider, and payment reporting",
          "Paystack transaction filters and success, failed, or abandoned statuses",
        ],
        image: speezuImg(
          "speezu-04-admin-control-center.png",
          "SPEEZU admin control center showing stores, riders, ongoing orders, commissions, and payment reporting.",
        ),
      },
      {
        kind: "feature",
        label: "06 / RIDER EXPERIENCE",
        heading: "A Focused Workflow for Last-Mile Delivery",
        body: "The SPEEZU Rider application keeps delivery work direct and actionable. Riders can review new requests, compare pickup and customer locations, accept or decline deliveries, contact relevant parties, progress through pickup and completion states, confirm delivery, and review completed or cancelled order history.",
        features: [
          "New-delivery request feed with store and customer information",
          "Accept and decline controls",
          "Pickup and delivery addresses with contact actions",
          "Active order state from accepted to picked up and completed",
          "Delivery confirmation through the available completion flow",
          "Completed and cancelled order history",
          "Clear offline and notification handling where supported by the application",
        ],
        storeLink: {
          eyebrow: "See the rider workflow in production",
          title: "View SPEEZU Rider on Google Play",
          url: "https://play.google.com/store/apps/details?id=com.speezu.deliveryapp",
          ariaLabel: "View the SPEEZU Rider App on Google Play",
        },
        image: speezuImg(
          "speezu-05-rider-delivery-workflow.png",
          "SPEEZU Rider workflow showing new delivery requests, active delivery, and completed orders.",
        ),
      },
      {
        kind: "engineering",
        label: "07 / ENGINEERING",
        heading: "A Maintainable Foundation for a Multi-Product System",
        intro:
          "The applications were structured around reusable features, predictable state changes, API-driven data, and integrations required by commerce and delivery workflows.",
        stack: [
          { name: "Flutter & Dart", note: "Cross-platform customer and rider applications" },
          { name: "BLoC", note: "Predictable state management and event-driven UI" },
          { name: "Dio & REST APIs", note: "Network communication and backend integration" },
          { name: "Google Maps", note: "Addresses, locations, and delivery-related mapping" },
          { name: "Paystack", note: "Online payment processing" },
          { name: "Firebase Cloud Messaging", note: "Delivery and order notifications" },
          { name: "easy_localization", note: "Multi-language application support" },
          { name: "Web dashboards", note: "Administrative and store operations" },
        ],
      },
      {
        kind: "solutions",
        label: "08 / KEY SOLUTIONS",
        heading: "Turning Operational Complexity Into Predictable Product Flows",
        blocks: [
          {
            title: "Complex product configuration",
            body: "Product variations, optional extras, related items, quantities, and discounts were represented clearly across product details, cart calculations, and final order data.",
          },
          {
            title: "Shared order-state coordination",
            body: "Order stages were surfaced appropriately across customer, store, administrator, and rider interfaces so each role could act on the same operational lifecycle.",
          },
          {
            title: "Payment and fulfilment visibility",
            body: "Online payment reporting, order totals, store earnings, platform commission, rider assignment, and completion states were made visible to the roles responsible for them.",
          },
        ],
      },
      {
        kind: "outcome",
        label: "09 / OUTCOME",
        heading: "One Cohesive System Instead of Disconnected Operational Tools",
        body: "SPEEZU brings customer commerce, merchant operations, centralized administration, and delivery execution into one coordinated product ecosystem. The result is a clear experience for every role and an operational structure capable of supporting the complete journey from product discovery to successful delivery.",
        image: speezuImg(
          "speezu-07-case-study-closing-showcase.png",
          "Closing showcase of the SPEEZU customer app, store product management, admin store control, and rider order history.",
        ),
      },
    ],
    technologies: [
      { name: "Flutter & Dart", note: "Cross-platform customer and rider applications" },
      { name: "BLoC", note: "Predictable state management and event-driven UI" },
      { name: "Dio & REST APIs", note: "Network communication and backend integration" },
      { name: "Google Maps", note: "Addresses, locations, and delivery-related mapping" },
      { name: "Paystack", note: "Online payment processing" },
      { name: "Firebase Cloud Messaging", note: "Delivery and order notifications" },
      { name: "easy_localization", note: "Multi-language application support" },
      { name: "Web dashboards", note: "Administrative and store operations" },
    ],
    seo: {
      title: "SPEEZU Case Study — Multi-Platform Commerce & Delivery Ecosystem | SageSix",
      description:
        "Explore how SageSix developed SPEEZU, a connected commerce and delivery ecosystem with customer and rider apps, store operations, centralized administration, payments, and order tracking.",
      keywords: [
        "Flutter app development",
        "ecommerce app development",
        "delivery app development",
        "rider app",
        "multi-vendor marketplace",
        "store management system",
        "admin dashboard",
        "order tracking",
        "Paystack integration",
        "Google Maps integration",
        "SageSix",
      ],
    },
  },

  {
    slug: "durafoam-3d-foam-configurator-shopify",
    category: "Manufacturing Website",
    title: "DURAFOAM",
    shortDescription:
      "A modern digital presence presenting Durafoam's products, manufacturing capabilities and company information.",
    fullCardDescription:
      "A custom Shopify Hydrogen storefront for Durafoam combining an interactive 3D foam configurator with standard e-commerce — supporting bespoke cut-to-size foam, mattress toppers, pillows and everyday comfort products.",
    tags: ["Corporate Website", "Manufacturing", "Product Catalogue", "Responsive Design"],
    services: ["Product Strategy", "UI/UX Design", "Web Development", "Shopify Integration"],
    featured: true,
    featuredOrder: 3,
    workOrder: 3,
    industry: "Foam Manufacturing & E-Commerce",
    type: "Case Study",
    platform: "Web",
    products: "3D Foam Configurator & Shopify Storefront",
    role: "Product Strategy, Design & Development",
    accent: "#0878E8",
    coverImage: durafoamImg(
      "durafoam-case-study-01-hero.png",
      "DURAFOAM custom 3D foam configurator and Shopify Hydrogen storefront developed by Sage Six",
    ),
    heroEyebrow: "COMMERCE / 3D CONFIGURATION / 2026",
    heroTitle: "Custom foam, configured in 3D.",
    heroLead:
      "Sage Six designed and developed a Shopify Hydrogen storefront for DURAFOAM that combines bespoke 3D foam configuration with familiar standard e-commerce — one platform for made-to-measure foam and everyday comfort products.",
    facts: [
      { label: "Client Location", value: "United Kingdom" },
      { label: "Industry", value: "Foam Manufacturing & E-Commerce" },
      {
        label: "Services",
        value: "Product Strategy, UI/UX, Web Development, 3D Configuration, Shopify Integration",
      },
      { label: "Technology", value: "Shopify, Hydrogen" },
      { label: "Duration", value: "2 months" },
      { label: "Team", value: "2 Developers, 1 Designer" },
      { label: "Status", value: "Launched" },
    ],
    liveUrl: "https://durafoam.co.uk/",
    cta: {
      eyebrow: "Build with Sage Six",
      title: "Building a product that needs more than standard e-commerce?",
      body: "Sage Six designs and engineers custom digital experiences around the way your business actually works.",
      secondaryLabel: "View Live Website",
      secondaryUrl: "https://durafoam.co.uk/",
      secondaryExternal: true,
    },
    sections: [
      {
        kind: "prose",
        label: "01 / THE CHALLENGE",
        heading: "Making custom foam understandable.",
        body: "The previous DURAFOAM website had an outdated interface and relied on conventional custom fields for made-to-measure foam. A technically complex product became difficult to understand, placing too much responsibility on customers to interpret shapes, measurements, materials, and optional finishes without enough visual guidance.",
        image: durafoamImg(
          "durafoam-case-study-02-shape-library.png",
          "DURAFOAM library of 15 configurable bespoke foam shapes",
        ),
      },
      {
        kind: "prose",
        label: "02 / THE SOLUTION",
        heading: "Measure. Visualise. Price.",
        body: "The solution is an interactive 3D Foam Designer built into a modern Shopify Hydrogen storefront. Customers select from 15 configurable shapes, enter shape-specific dimensions in millimetres, centimetres or inches, choose foam type and optional additions, and watch the 3D preview respond while pricing updates dynamically.",
        image: durafoamImg(
          "durafoam-case-study-03-3d-configurator.png",
          "Interactive L-shaped foam configurator with dimensions, material selection and dynamic pricing",
        ),
      },
      {
        kind: "prose",
        label: "03 / FROM FOAM TO FINISH",
        heading: "From foam to finish.",
        body: "Beyond bare foam, customers can choose optional finishes such as stockinette or Dacron with stockinette, then configure custom covers with fabric varieties, colour options, material information and visual swatches — all inside one guided flow instead of disconnected forms or manual quotation requests.",
        image: durafoamImg(
          "durafoam-case-study-04-materials-and-covers.png",
          "DURAFOAM foam materials, optional additions, custom fabrics and cover colours",
        ),
      },
      {
        kind: "prose",
        label: "04 / COMMERCE",
        heading: "Custom when needed. Simple when standard.",
        body: "For standard-sized foam, mattress toppers and pillows, the platform provides conventional Shopify collection and product pages with imagery, model information, starting prices, stock status, predefined dimensions, thickness options and VAT-inclusive pricing. One storefront supports both technical made-to-measure purchasing and quick everyday shopping.",
        image: durafoamImg(
          "durafoam-case-study-05-standard-commerce.png",
          "Standard-sized foam, mattress topper and pillow shopping experience",
        ),
      },
      {
        kind: "prose",
        label: "05 / SHOPIFY INTEGRATION",
        heading: "One cart. Every configuration.",
        body: "Custom foam configurations are converted into Shopify-compatible line items that preserve the selected shape, exact dimensions, foam material, covering option, quantity and calculated price. Bespoke foam and standard products coexist in the same cart, and Shopify manages the unified subtotal and secure checkout.",
        image: durafoamImg(
          "durafoam-case-study-06-shopify-cart-v2.png",
          "Unified Shopify cart containing configured L-shaped foam and standard DURAFOAM products",
        ),
      },
      {
        kind: "prose",
        label: "06 / BUILT FOR EVERY SCREEN",
        heading: "Built for every screen.",
        body: "The redesigned system provides a consistent experience across desktop and mobile. Navigation, product discovery, custom configuration, cart management and contact options adapt to smaller screens while retaining clear hierarchy and accessible actions.",
        steps: ["Discover", "Design", "Customise", "Checkout", "Support"],
        image: durafoamImg(
          "durafoam-case-study-07-responsive-system.png",
          "Responsive DURAFOAM commerce system across desktop and mobile screens",
        ),
      },
      {
        kind: "prose",
        label: "07 / OUTCOME",
        heading: "A clearer path from measurements to checkout.",
        body: "The launched platform replaces an outdated, field-heavy purchasing journey with a clear visual configuration and commerce experience. It was designed to reduce ambiguity and manual clarification, make custom orders easier to understand, and accelerate the path from measurements to checkout.",
      },
    ],
    technologies: [
      { name: "Shopify", note: "Commerce, cart, checkout and operations" },
      { name: "Hydrogen", note: "Modern storefront framework" },
    ],
    seo: {
      title:
        "DURAFOAM Case Study | Custom 3D Foam Configurator & Shopify Hydrogen Development | Sage Six",
      description:
        "See how Sage Six designed and developed DURAFOAM's UK Shopify Hydrogen storefront, featuring a custom 3D foam configurator, dynamic pricing, responsive commerce, and unified checkout.",
      keywords: [
        "custom 3D foam configurator development",
        "Shopify Hydrogen development UK",
        "custom Shopify development UK",
        "bespoke foam e-commerce website",
        "foam cut-to-size online configurator",
        "made-to-measure foam ordering platform",
        "interactive 3D product configurator",
        "dynamic product pricing Shopify",
        "responsive e-commerce website UK",
        "custom product configuration development",
        "Shopify cart and checkout integration",
      ],
    },
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

// Homepage featured projects, ordered by featuredOrder.
export function getFeaturedProjects(): Project[] {
  return projects
    .filter((p) => p.featured)
    .sort((a, b) => (a.featuredOrder ?? 0) - (b.featuredOrder ?? 0));
}

// Work-page archive: every published project, ordered by workOrder.
export function getWorkProjects(): Project[] {
  return [...projects].sort((a, b) => (a.workOrder ?? 0) - (b.workOrder ?? 0));
}

// Future-project readiness:
// Add a new object to the `projects` array above. A future case study must
// provide: slug, category, title, shortDescription, fullCardDescription, tags,
// services, industry, type, platform, products, role, accent, coverImage,
// heroEyebrow, heroTitle, heroLead, facts, sections (ordered case-study
// sections), technologies, and seo. Set `featured`, `featuredOrder` and
// `workOrder` to control homepage and Work-page placement.
// The routes, cards, metadata, and navigation update automatically from this
// data.