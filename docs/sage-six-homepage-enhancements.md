# Sage Six homepage enhancements

Implemented 13 September 2026, continuing the existing light homepage. Local only; no deployment.

## Visitor journey

The homepage now follows the requested sequence: header → retained hero → capability/company strip → editorial Selected Work → approved reviews (currently hidden) → studio introduction → services → technologies → AI and automation → six-step process → Insights → new closing CTA → footer.

Added:
- Studio introduction and four principles in a spacious grid with a drawn divider.
- Six numbered service rows with visible descriptions and links to the existing Services page.
- Static, wrapping technology strip.
- Interactive SVG AI constellation and four selectable capabilities.
- Four real published Insights links.

Updated/consolidated:
- DURAFOAM is the wide featured project; SPEEZU and Leicester Medical Society form the supporting pair. Projects stack on tablet and phone.
- The old four-step homepage process is replaced by Discover, Define, Design, Build, Launch and Improve. Its unused homepage data was removed.
- Final CTA now says “Put your next idea to work.” with the supplied supporting copy.
- Existing review component now supports manual previous/next navigation and stable height. No duplicate review section or placeholder content was added.
- Hero identity, artwork, functionality and existing routes remain intact. Internal pages were not redesigned.

## Files

- `src/components/home/HomeEditorial.tsx`: studio, service rows, technology strip, scroll-linked process and Insights.
- `src/components/home/HomeAI.tsx`: original lightweight coded AI widget.
- `src/components/home/project-image-loader.ts` and `public/images/case-studies/optimized/`: five responsive WebP variants per approved thumbnail, served through Next Image.
- `src/components/home/HomePageContent.tsx`: section order, editorial projects, hexagon refinements, manual review presentation and closing CTA.
- `src/components/home/motion.tsx`: shared timing tokens, rise/scale/image/divider reveal modes, live reduced-motion preference subscription.
- `src/components/home/HomeHeader.tsx`: uses the same live reduced-motion preference.
- `src/data/home-editorial.ts`: typed supplied editorial content and technology provenance.
- `src/data/home.ts`: compact project data; obsolete four-step process removed; company verification date updated.
- `src/app/page.tsx`: selects published Insights on the server and passes only title, category and slug.
- `src/app/home.css`: responsive editorial layouts, AI, timeline, review stage and CTA refinements.
- `src/components/home/reviews.test.ts`: publication gate checks.
- `src/data/home-content.test.ts`: case-study destinations, artwork existence and published article checks.
- `docs/verification/enhanced-*`: browser evidence and screenshots.

Unrelated working-tree changes and original imagery are preserved. No new package was installed in the project.

## Motion and interaction

All new animation imports use `motion/react`.

Shared tokens: instant .15s, fast .22s, normal .45s, expressive .7s; distances 8/20/32px; stagger .05/.09/.14s; standard easing [.22,1,.36,1], gentle [.16,1,.3,1]. Mobile reveals use 12px and .45s. Content is server-rendered visibly, with no splash or blocking loader.

- Hero panels assemble with opacity, translation and .96→1 scale; live copy follows. Last copy reveal completes around 1.7s on desktop.
- Adjacent hero artwork drifts in opposite directions by 3px over 7s. Outer links stay stable. Hover/focus moves the image 4px and scales to 1.035; touch has a pressed state and cancellation reset.
- Projects use a restrained overflow mask and 1.025→1 image reveal; hover affects only the inner image and CTA arrow.
- Principles use a drawn divider and reading-order stagger.
- Service and Insight rows keep their bounds stable, with small number/arrow movement and pale background or underline feedback.
- Technology names reveal once and wrap; no marquee.
- Process uses Motion `useScroll`/`useTransform` for a vertical progress line and gentle active-step highlight. Normal page scrolling stays native.
- CTA lines reveal in sequence, with a non-looping cyan line detail and gentle button feedback.
- Reviews change only through manual controls. Inactive quotes are inert and hidden from assistive technology. Overlaid grid cells reserve the tallest quote's height.

## AI widget

Six SVG nodes surround a small six-sided structure. Fine connecting paths draw on entry; nodes fade in sequence. The four capability buttons update the selected label and highlighted connections. Buttons work with keyboard, touch and pointer, use `aria-pressed`, and changes are announced politely. The artwork is decorative to screen readers; all meaningful copy remains HTML.

Only selected node rings pulse slowly. Pulse activity depends on visibility, document visibility, reduced-motion preference and the Pause/Resume control. Desktop pointer movement is limited to ±4px, disabled for touch, paused mode and reduced motion. No particles, heavy rendering library or scroll interception.

Hero drift also stops offscreen, in hidden tabs, on hover/focus and for reduced motion. A `useSyncExternalStore` media-query subscription handles preferences changed during a visit as well as preferences present on page load.

## Sources and credibility

21st.dev research:
- [Animated Group](https://21st.dev/@ibelick/components/animated-group): staggered grid rhythm; MIT listing, framer-motion dependency. Source inspected in the earlier implementation; original reusable reveal remains in use.
- [Text Effect](https://21st.dev/@ibelick/components/text-effect): line-by-line headline rhythm; MIT listing, framer-motion dependency. Original line reveals used.
- [Timeline collection](https://21st.dev/community/components/s/timeline): editorial timeline research; implemented an original vertical process with Motion scroll values.
- [Animated Beam collection](https://21st.dev/community/components/s/animated-beam) and [Pulse Beams](https://21st.dev/community/components/aceternity/pulse-beams/default): connected-path visual research. No source copied; original SVG geometry, selection controls and pause logic built for Sage Six. The attempted Magic UI component/source URLs were inaccessible and were not integrated.

No third-party component code or assets were copied, so no new redistribution notice or component dependency was introduced.

UI UX Pro Max applied to responsive hierarchy, focus visibility, reduced motion, touch targets, image layout stability and motion restraint.

Verified technology names:
- Flutter: SPEEZU customer/rider implementation.
- Firebase: SPEEZU Firebase Cloud Messaging.
- Shopify and Hydrogen: DURAFOAM case-study technology registry.
- React, Next.js and Node.js: this site's package/runtime architecture.

Supabase and Vercel were omitted because this audit did not establish their use in the selected projects. No partnership or certification claim is displayed.

Company identity rechecked against [Companies House](https://find-and-update.company-information.service.gov.uk/company/17315871). Only Sage Six Ltd, UK registered software company and company number 17315871 appear. No estimated metrics, address or personal details were added.

No genuine publication-approved testimonials were found. The review section remains disabled with an empty dataset. Test fixtures are explicitly test-only and are never imported into the page.

Published article destinations:
- `/insights/admin-dashboard-development-guide`
- `/insights/flutter-for-business-apps`
- `/insights/app-website-maintenance-checklist`
- `/insights/flutter-vs-react-native`

All four are published in the existing registry and return HTTP 200. No article content is missing. Reading times were omitted rather than repeating values that were not recalculated from article text.

The two old-homepage screenshots were not present in this attachment directory. The supplied detailed descriptions and existing old section source informed the additional content; the approved light reference and exact SVG logo remain the visual source of truth.

## Responsive, accessibility and performance

Projects stack below 1100px. Principle grids move from four to two to one column. Service descriptions reflow under titles, and the service heading/copy stack on phones. AI capabilities become two columns on tablet and one on small phones. The timeline is vertical at all widths, with a sticky editorial heading only on desktop. Technologies wrap statically. Narrow 320px hexagons are taller to keep descriptions clear of clipped edges.

Visible focus indicators, native links/buttons, modal menu keyboard behavior, 44px controls and reduced motion are retained. The skip link stays visually hidden until focused. Normal content is available without hover. Review controls never autoplay. Two navy contrast sections punctuate the otherwise light page.

Next Image and lazy loading remain enabled; all original PNGs remain. The three project artworks have pre-generated WebP variants at 480, 768, 1080, 1440 and up to 1672px, using quality 85 and preserving aspect ratio. A custom Next Image loader selects the nearest appropriate variant, avoiding on-demand conversion for these fixed assets. All 15 variants total approximately 1.1 MB on disk; each device requests only its selected version. Responsive sizes were updated for larger project framing. The homepage no longer imports the complete case-study registry into its client data: tests validate its compact project records instead. Insights are selected on the server, passing only three display fields. SVG uses a small fixed node/path set and no new runtime dependency.

During browser verification, an image request failed with Chromium `net::ERR_NETWORK_IO_SUSPENDED`. Direct optimizer requests succeeded, including the 750px DURAFOAM WebP at HTTP 200 / 28,378 bytes. A later automated request also timed out at a larger size. Responsive static variants were added to remove runtime conversion for these three fixed assets. The local server was restarted in production mode for final checks, which visit each image and wait for decoding.

## Verification

- Application ESLint: passes.
- TypeScript: passes.
- Production build: passes; 32 static pages generated.
- Tests: 5 files / 26 tests pass, including review gating and published content/assets.
- Prettier applied to changed files.
- Full `npm run lint`: still reports 15 existing require-style errors and one unused-variable warning in installed `.agents/skills` scripts. These unrelated vendor files were not modified or excluded.
- Final local production browser checks pass at 320, 375, 430, 768, 1024, 1280 (short 650px height), 1440, 1600 and 1920px. No horizontal overflow or broken images; six service rows, six process steps and four published articles at every width.
- AI selection, Pause/Resume, offscreen stopping, initial reduced motion and live preference changes pass. Mobile menu focus containment and restoration pass. All four article destinations return HTTP 200; no browser errors.
- Layout sweep used reduced motion for stable measurement; normal motion and live switching were checked separately in the AI interaction pass and earlier visual review.
- Browser check details are in `docs/verification/enhanced-checks.json`.

Local production preview (`npm run start -- --port 3000`) remains http://localhost:3000. No deployment, publication, email submission or live customer interaction was performed.
