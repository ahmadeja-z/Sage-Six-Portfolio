# Sage Six homepage implementation

Implemented locally on 12 September 2026. No deployment or publication.

## Scope and files

- `src/app/page.tsx`: replaces homepage composition; preserves its title, descriptions, canonical and social metadata.
- `src/app/home.css`: isolated light theme, responsive grids, component tokens, accessible states, homepage assistant styling.
- `src/components/home/HomePageContent.tsx`: hero, service hexagons, capabilities, selected projects, approved-only customer reviews, process, contact CTA.
- `src/components/home/HomeHeader.tsx`: full SVG logo, desktop links, native modal mobile navigation with Motion entrance/exit.
- `src/components/home/HomeFooter.tsx`: full logo, existing routes, email and verified company link. Existing social entries are placeholders, so none are displayed.
- `src/components/home/motion.tsx`: reusable once-per-visit reveals and shared motion tokens.
- `src/data/home.ts`: typed services, projects and testimonials; existing case-study registry determines links.
- `src/components/layout/SiteChrome.tsx`: homepage header/footer and legacy effects selected by route. Internal designs remain intact.
- `src/components/layout/SmoothScroll.tsx`: native homepage scrolling; retains internal Lenis; forward navigation resets to top, popstate restoration remains available, hashes retained; reduced-motion changes stop Lenis.
- `src/app/template.tsx`: homepage uses its own entrance rather than a duplicate route entrance.
- `src/app/layout.tsx`: connects route-aware chrome; integrates new icon metadata and organization logo; retains assistant and structured data.
- `public/images/sagesix-apple-icon-new.png`: lossless rasterization of exact SVG icon, contained on white with padding for Apple metadata.
- `docs/verification/`: screenshots and browser check results.

Existing changes to AGENTS.md, package files, About.tsx and skill installation were preserved. Existing untracked homepage header/motion/data were completed. No package dependency was added. No internal page was redesigned. Original logo and artwork files were retained.

## Approved assets and design

Confirmed composition reference: `public/images/sage-six-approved-homepage-reference.png`.
Confirmed identity: `public/images/sagesix-logo.svg` (171 × 70) and `public/images/sagesix-icon.svg`.
All six requested hero PNGs and all three requested thumbnail PNGs exist and load.

The exact logo uses its intrinsic aspect ratio in desktop/mobile navigation and footer. SVG icon is the favicon; the Apple raster is derived from that SVG. Obsolete files remain because older routes still use existing identity assets.

Measured SVG colours, exposed in home.css:

| Token | Colour |
| --- | --- |
| logo-navy (wordmark) | #282164 |
| facet-navy | #282264 |
| teal | #14A89D |
| cyan | #24AAE3 |
| blue | #0F75BD |
| indigo | #273990 |
| purple | #662D90 |

Supporting tokens: background/card #FFFFFF; surface #F7F8FC; pale blue #F0F5FB; lavender #F5F2FB; heading/button/CTA navy #17184A; body #454B70; muted #626A83; border #DCE4EF; focus #0F75BD; disabled #E4E7ED with #626A83 text. Saturated cyan/teal remain accents, not normal light-background text. Existing Space Grotesk and Inter font implementation retained.

## Research and motion

UI UX Pro Max installed locally and consulted for focus visibility, modal keyboard behavior, reduced motion, responsive layout, image dimensions and touch targets. Installed Next.js image and Link guides were read before implementation. Codebase graph was unavailable (repository not indexed), so direct discovery was used.

21st.dev references inspected:

- https://21st.dev/@ibelick/components/text-effect — line-level entrance rhythm. MIT; listed dependency framer-motion. Uses a small original Motion reveal instead of copying the component.
- https://21st.dev/@ibelick/components/animated-group — sequential grid and project reveal timing. MIT; listing says framer-motion, current upstream source imports motion/react. Source reviewed at https://raw.githubusercontent.com/ibelick/motion-primitives/main/components/core/animated-group.tsx.
- https://21st.dev/community/components/s/animated-hero — hero composition/motion research.
- https://21st.dev/community/components/s/navigation-menu — navigation and responsive menu research; original native dialog used.
- https://21st.dev/community/components/s/card — stable card framing and image interactions.
- https://21st.dev/community/components/s/testimonials — calm static review layout research.
- https://21st.dev/community/components/s/button — CTA interaction research; original restrained button states.

No third-party component source, photographs or dependencies were copied into the implementation; no new redistribution notice is required. Existing Motion and Lucide packages were reused.

Hero starts on real content, without splash or loader. Copy enters progressively, followed by six panels in data order (90ms stagger, 700ms reveal), completing around 1.6 seconds. Hexagons use CSS clip-path with square source PNGs, overlays, Lucide SVG icons and live text. Hover/focus/touch shifts and scales only inner images; icons lift 2px. Gentle coordinated 2px artwork drift pauses on hover/focus, offscreen, hidden tab and reduced motion.

Projects reveal once with restrained stagger, followed by text. Inner thumbnails zoom 1.025; CTA arrow shifts 5px; card bounds stay fixed. Process and CTA use shared reveals. No scroll hijacking on the homepage.

## Authenticity

Company identity verified from the official Companies House HTML on 12 September 2026:
https://find-and-update.company-information.service.gov.uk/company/17315871

Confirmed legal name SAGE SIX LTD, company number 17315871, Active, SIC 62012. Homepage displays only Sage Six Ltd, UK registered software company and company number, with the official link. No address, personal data or estimated business metrics displayed.

No traceable approved customer quotations were supplied or found in existing data. CustomerReviews and typed testimonial data are implemented, but render nothing with the empty dataset. Only `approved === true` entries render. Static primary quote plus supporting reviews, no autoplay, ratings or invented identities. Genuine approved content is still required to enable this section. No placeholder testimonials ship.

## Responsive, accessibility and images

Two-column hero above 1099px; stacked hero on tablet; two-column service grid below 600px. Three project columns on desktop, two on tablet, one on mobile. Four-step process becomes two columns. Width capped at 1480px for ultrawide displays.

Native dialog supplies modal focus containment and background inertness. Scroll lock, Escape, close-on-selection, resize closing and trigger focus restoration implemented. Main skip link, semantic headings/landmarks, focus outlines, touch targets and live HTML text provided. Reduced motion removes entrance movement/stagger, zoom and drift. Decorative service artwork has empty alt text; project thumbnails have meaningful alt descriptions.

Next Image provides responsive optimized sources; sizes reflect component breakpoints. Only first hero artwork loads eagerly. Lower images are lazy loaded with stable aspect ratios; project thumbnails use contain so essential image content remains visible. PNG originals retained. SVG logos load at their exact proportions.

## Verification

- `npx eslint src`: passes, no application errors or warnings.
- `npx tsc --noEmit`: passes.
- `npm run build`: passes, all 32 static pages generated.
- `npm test`: passes, 3 files / 22 tests.
- Prettier applied to changed application files.
- `npm run lint`: blocked by 15 existing CommonJS require-style errors and one unused-variable warning in `.agents/skills/brand` and `.agents/skills/design-system`; these vendor scripts were not modified or excluded to hide errors.
- Browser widths: 320, 375, 430, 768, 1024, 1280 (650px short height), 1440, 1600, 1920. No horizontal overflow, six service panels, three project cards, no broken images.
- Keyboard mobile menu: opens, traps focus, locks scroll, Escape closes, focus restores; selecting Expertise reaches Services.
- Selected Work anchor lands correctly. Fresh DURAFOAM navigation opens at scroll 0. Back returns to prior work position.
- Reduced-motion image transform is none. Favicon and unchanged homepage canonical/title verified.
- Header/footer/CTA destinations, internal case studies, contact, services, about, insights and icons return HTTP 200.
- Ask Sage Six opens and closes correctly; no live lead or assistant request was submitted during verification.
- No browser runtime errors in sweep; final console check clean. Development Next.js may recommend eager loading when scrolling makes a below-fold thumbnail the LCP candidate; those thumbnails intentionally remain lazy per brief.

Limitations: no approved review content; live email delivery and external AI service responses were not exercised; browser testing used Chromium, not physical iOS/Android or Safari. No field Core Web Vitals claim is made.

Local preview: http://localhost:3000
