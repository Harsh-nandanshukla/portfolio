# TASKS.md — Build Checklist

Work top to bottom. Stop for review at every 🔍.
Status: `[ ]` todo · `[~]` in progress · `[x]` done

## Phase 0 — Setup
- [x] Create the Next.js app in the current folder (TypeScript, Tailwind, ESLint, App Router, `src/` dir)
- [x] Install Framer Motion (`motion`), set up shadcn/ui, add the `cn()` util
- [x] Add Geist + JetBrains Mono via `next/font`
- [x] Put the design tokens from DESIGN.md into `globals.css` and the Tailwind theme
- [x] Create `src/data/content.ts` from CONTENT.md (typed)
- [x] Create `.env.local` with `NEXT_PUBLIC_HARSHGPT_URL=` and add it to `.gitignore`
- [x] `git init`, first commit
- [x] 🔍 Review: blank dark page with the correct fonts running at localhost:3000

## Phase 1 — Skeleton
- [x] Page structure with an empty `<section id>` for every section
- [x] Floating glass navbar with smooth scroll and hide-on-scroll-down
- [x] Reusable `<Reveal>` wrapper (fade-up on scroll, reduced-motion aware)
- [x] 🔍 Review: navbar works and scrolls to each section

## Phase 2 — Hero
- [x] `NeuralBackground.tsx` canvas: drifting nodes, connections, cursor interaction, paused off-screen
- [x] Static gradient fallback for mobile / reduced motion
- [x] Label, name, Text Generate Effect tagline, two CTAs, scroll indicator
- [x] Name intro ("cyclone assemble"): once per session, skippable, no flash, reduced-motion safe
- [x] 🔍 Review on desktop + mobile
- [x] Particle intro revision
- [x] 🔍 Review particle intro

## Phase 3 — Projects (bento)
- [x] Bento Grid layout (featured 2×2 tile, two medium tiles; single column on mobile)
- [x] Card Spotlight hover on all tiles
- [x] Guardrails tile: Border Beam, looping 6-stage pipeline chips, Number Ticker metrics
- [x] Tech tags and Live Demo / API Docs / GitHub buttons
- [x] 🔍 Review

## Phase 4 — Experience
- [x] Tracing Beam timeline with 3 entries and highlight metrics
- [x] Education + certification compact entries at the end of the timeline
- [x] 🔍 Review

## Phase 5 — Skills
- [x] Two opposite-direction logo Marquee rows (pause on hover, faded edges)
- [x] Grouped text skill list below
- [x] 🔍 Review

## Phase 6 — Contact & footer
- [ ] Closing line, copy-to-clipboard email with toast, social icons, footer
- [ ] 🔍 Review

## Phase 7 — Ask my AI
- [ ] Chat card UI: input, suggestion chips, typing indicator
- [ ] Connect to the HarshGPT API (streaming if supported), with an error fallback
- [ ] Confirm CORS on the HarshGPT backend allows the portfolio domain
- [ ] 🔍 Review with real questions

## Phase 8 — Polish & ship
- [ ] Resume PDF in `public/`, favicon, OG image, metadata
- [ ] Full mobile pass at 375px / 768px
- [ ] Reduced-motion pass
- [ ] Lighthouse: performance 90+, accessibility 90+
- [ ] `npm run build` passes with no errors
- [ ] Push to GitHub, deploy on Vercel, add env variable in Vercel
- [ ] Add CORS for the Vercel domain on HarshGPT
- [ ] 🔍 Final review on a real phone
- [ ] Add the site link to resume, LinkedIn, and GitHub profile README
