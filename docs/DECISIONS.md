# DECISIONS.md — Decision Log

Choices made, so they don't get reopened every session. Add new ones at the bottom.

| # | Decision | Why | Date |
|---|---|---|---|
| 1 | Next.js App Router + TypeScript + Tailwind | Best supported by Aceternity / Magic UI and by Claude Code; free Vercel hosting | 2026-10-31 |
| 2 | Frontend only; reuse the existing HarshGPT API for chat | No new backend to build or host | 2026-10-31 |
| 3 | "Dark Bento + Live AI" design (see DESIGN.md) | Stands out more than the widely copied sidebar-portfolio layout and fits an AI/ML profile | 2026-10-31 |
| 4 | Single page with anchor sections, no separate project pages | Recruiters skim; fits the one-day timeline | 2026-10-31 |
| 5 | Prebuilt Aceternity / Magic UI components over custom animation | Premium motion without writing animation code from scratch | 2026-10-31 |
| 6 | Custom canvas for the hero neural network | Unique signature visual; Background Beams kept as fallback | 2026-10-31 |
| 7 | Dark theme only, no light mode toggle | Halves design and testing work; the design is built around dark | 2026-10-31 |
| 8 | All content in `src/data/content.ts` | Edit text in one place without touching components | 2026-10-31 |
| 9 | Phone number not shown on the site | Privacy; email and LinkedIn are enough | 2026-10-31 |
| 10 | Deploy on Vercel | Free, built for Next.js, auto-deploys on every push | 2026-10-31 |
| 11 | Installed versions: next 16.4.3, react 19.3.0, tailwindcss 4.3.3, motion 14.9.0 (also shadcn 4.23.0, radix-ui 1.8.1) | Recorded at Phase 0 so later sessions know the exact baseline | 2026-10-31 |
| 12 | shadcn/ui with Radix primitives (`radix-nova` preset, neutral base) | Most Aceternity / Magic UI examples assume Radix | 2026-10-31 |
| 13 | Design tokens live in `globals.css` `@theme inline` (Tailwind v4 has no tailwind.config); shadcn's dark colors point at the design tokens; one shared `--border` | Single source for colors; shadcn components match the design | 2026-10-31 |
| 14 | Keep shadcn's generated `cn()` (re-exports the official `cn` package) instead of hand-writing clsx + tailwind-merge | It is shadcn's own drop-in replacement; same API | 2026-10-31 |
| 15 | Hero name "cyclone assemble" intro with 3D extrusion + spark sweep | Memorable first impression; constrained to ≤2.5s, skippable, once per session, reduced-motion safe so recruiters aren't blocked | 2026-11-01 |
## Template
| # | Decision | Why | Date |
