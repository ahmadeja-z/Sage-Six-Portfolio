# Shared Sage Six navigation

Implemented 13 September 2026.

## Cause and changes

`SiteChrome.tsx` previously selected HomeHeader only for `/`, and the legacy dark Navigation for every other route. SiteHeader now always renders the same persistent Navigation. HomeHeader is a compatibility re-export, so there is no second implementation to diverge.

Changed files in this task:
- `src/components/layout/SiteChrome.tsx`: remove the route-dependent header switch; preserve footer and page effects.
- `src/components/layout/Navigation.tsx`: shared light header, exact approved SVG, route-aware links, Motion interactions, accessible native mobile dialog.
- `src/components/layout/Navigation.module.css`: scoped navigation presentation, branded active indicator, solid white surface, responsive menu and reduced-motion overrides.
- `src/components/home/HomeHeader.tsx`: compatibility export.

Work maps to `/work` (including case studies), Expertise to `/services`, Company to `/about`, Insights to `/insights` (including articles), and Discuss your project to `/contact`. The logo returns to `/`; the mobile menu also has a Home link. Active matching respects path segment boundaries. Every active destination exposes `aria-current="page"`.

The full `/images/sagesix-logo.svg` keeps its 171:70 aspect ratio. The active bar/focus blue (#0F75BD) comes from the actual SVG. Existing approved navy, white and typography tokens are reused. Header remains above legacy page transition overlays without changing those sections. Scroll state adds only a soft shadow, with no size or positioning jump.

## Motion and accessibility

All navigation animation uses `motion/react`, with reusable easing and timings: 180ms hover/exit, 320ms first entrance, 340ms shared-layout active indicator, 360ms panel reveal, 45ms item stagger. No spring/bounce or continuous animation.

First entrance starts from visible content and occurs only at layout mount, not on route changes. One underline moves between desktop destinations. Links and logo lift slightly on hover/focus; CTA has a directional arrow and press feedback. Mobile uses a native modal dialog, panel entrance/exit, staggered links and morphing menu icon. Native modality prevents underlying interaction; explicit Tab wrapping keeps focus inside. Escape/close returns focus to the trigger; navigation proceeds immediately and closing completion focuses main content. Closed menu links are unmounted. Body scroll is restored on close or desktop breakpoint changes; menu scroll is isolated from Lenis. Reduced motion removes decorative movement and retains focus and active cues. No dropdowns were needed for the real route structure.

## Verification

- `npm run lint`: pass.
- `npm run build`: pass, 32 generated pages.
- Chrome production browser testing: direct loads and refreshes for Home, Work, all three case studies, Services, About, Insights, an Insights article, Contact.
- Client navigation across all top-level links and back to Home: correct active states; same header DOM retained.
- Widths 320, 375, 768, 1024 and 1440px: no header overflow; mobile menu keyboard wrap and Escape tested.
- Mobile selection closes the panel, restores scroll, and focuses main content.
- Touch emulation: Work → menu → Expertise navigates and closes correctly.
- Reduced-motion menu opens/closes without transform animation.
- Additional checks: sticky header height, landscape menu, reverse Tab, background scroll lock, desktop breakpoint cleanup and shared 404 header.
- No JavaScript page errors in the main route/interaction matrix.
- Desktop and mobile screenshots visually inspected; exact logo intact and white surface readable over dark hero.

Evidence: `docs/verification/navigation/checks.json`, `desktop.png`, `mobile.png`.

Limitations: browser checks use desktop Chrome and mobile/touch emulation, not physical devices or Safari/Firefox. Existing internal-page content, footer, integrations and page effects were preserved; no messages or contact forms were submitted. No deployment performed. Preview is on port 3012 because ports 3000 and 3001 already had running servers.

## Reference research

Reviewed 21st.dev navigation patterns, including its [Motion Navigation Menu discussion](https://21st.dev/blog/unlumen-ui-components). Implemented original code with the project's existing Motion and Lucide dependencies; no third-party component source was integrated, no package added and no component license notices required. UI UX Pro Max's focused modal/focus guidance informed the keyboard checks; approved Sage Six branding overrides skill defaults.
