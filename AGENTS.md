<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Sage Six design and development workflow

- Setup only is currently authorised. Wait for the user's design brief, visual references, and explicit implementation instruction before changing the interface. Ignore previously pasted component code.
- Read `docs/sage-six-design-direction.md` before future design work. Approved branding, the exact logo, and selected visual references take priority over skill defaults or component examples. Confirm the approved reference files before implementation.
- Preserve website content, functionality, integrations, URLs, and SEO. Preserve existing instructions and unrelated working-tree changes.
- Use npm and keep `package-lock.json` in sync. Check existing dependencies before adding packages; install individual dependencies only when actually needed.
- Use `motion/react` for future React animation: hero entrances, scroll reveals, hover feedback, menus, and transitions. Keep motion smooth, responsive, purposeful, and accessible; respect reduced-motion preferences and preserve keyboard focus and mobile interaction equivalents. Existing Framer Motion, GSAP, and Lenis remain in place; migrate only as part of authorised work.
- Read and use `.agents/skills/ui-ux-pro-max/SKILL.md` during future design, implementation, and review. Apply its relevant web/Next.js guidance to layout, typography, spacing, responsiveness, accessibility, and visual consistency. Its default palettes, fonts, icons, and animation-library suggestions do not override approved branding or the Motion requirement.
- UI UX Pro Max upstream installation instructions: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill . Project installation uses `npx --yes ui-ux-pro-max-cli init --ai codex`; Python 3 is required for its local search scripts. Do not regenerate a design system during setup alone.
- During future development, research interface components and animation ideas at https://21st.dev/ . Adapt selected references to the approved portfolio theme. Inspect each candidate's source code, dependencies, and license before integration; record source and licensing requirements and retain required notices. Do not bulk-install component dependencies.
- Before delivering implementation, verify relevant pages and interactions across mobile, tablet, and desktop, including reduced motion, keyboard navigation, contrast, image integrity, and existing functionality.

## Codebase discovery

Prefer codebase-memory-mcp graph tools for code discovery: `search_graph`, `trace_path`, `get_code_snippet`, `query_graph`, then `get_architecture`. Fall back to text/file search for string literals, configuration, non-code files, or insufficient/unavailable graph results.
