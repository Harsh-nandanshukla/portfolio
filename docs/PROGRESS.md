# PROGRESS.md — Session Log

Newest entry on top. Claude Code adds an entry at the end of every session or finished task.

## Template
```
### YYYY-MM-DD HH:MM — <short title>
**Done:** what was finished
**Files changed:** main files
**Issues / notes:** anything broken, skipped, or worth knowing
**Next:** the exact next task from TASKS.md
```

---

### 2026-11-01 16:05 — Phase 2 Part B: hero name intro
**Done:** `NameIntro.tsx` with one exported `INTRO_CONFIG` (durations, stagger, spiral turns, start radius/scale/tilt, sweep, extrusion layers/offset/shades, post-intro delays). 17 letters fly in from a big off-screen circle on a shrinking ~1.25-turn spiral, scale 0.2 → 1, 3D tilt settling flat, 60ms stagger (40ms mobile), cubic ease-out, no overshoot. White → cyan spark sweeps left to right in 0.6s (0.45s mobile). Totals: ≈2.41s desktop, ≈1.69s mobile (dev warning if a config change exceeds 2.5s / 1.8s). Then label + tagline, buttons, scroll hint fade in, and the neural canvas / mobile glow start. Once per session (sessionStorage, try/catch); inline `<head>` script sets `data-intro` before first paint; any click/key/wheel/touch/scroll snaps it to the end; navbar usable throughout; h1 aria-label + aria-hidden letters; reduced motion = no intro. Per Harsh: the name stays visibly extruded at rest (9 layers + soft shadow). lint, tsc, build all exit 0.
**Files changed:** src/components/NameIntro.tsx, src/lib/intro.ts, src/components/InlineScript.tsx, src/app/layout.tsx, src/app/globals.css, src/components/sections/Hero.tsx, src/components/HeroBackground.tsx, src/components/NeuralBackground.tsx, src/components/ui/text-generate-effect.tsx, docs/TASKS.md (added the intro line)
**Issues / notes:** First `tsc` run failed (TS2367: `as const` made `layers === 1` a constant comparison); fixed with `layers <= 1`. DESIGN.md still says "kept subtle in the resting state"; DECISIONS #26 records the override (DESIGN.md not edited, per the rules). The no-JS tagline TODO from Part A is fixed. 🔍 review is still open.
**Next:** Harsh reviews Phase 2 on desktop + mobile, then Phase 3 — Projects

### 2026-11-01 15:53 — Phase 2 Part A: hero layout + neural background
**Done:** Hero rebuilt: full viewport height, centered; mono label, `<h1>` name (72/44px, 600, -0.03em; static until Part B), Aceternity Text Generate Effect tagline, "View Projects" (gradient → #projects) and "Download Resume" (outline, `download`) CTAs, scroll indicator → #ask-ai. Hero strings in `content.hero`. Neural canvas: ~60 drifting nodes (scaled by width, min 36), links < 140px fading with distance, cursor radius 180px (brighten + connect), token colors read at runtime, DPR capped at 2, ResizeObserver, paused off-screen (IntersectionObserver) and on hidden tab, lazy client-only. Static token glow under 768px / reduced motion. Bottom of the background fades out with a mask. lint, tsc, build all exit 0.
**Files changed:** src/components/sections/Hero.tsx, src/components/NeuralBackground.tsx, src/components/HeroBackground.tsx, src/components/ui/text-generate-effect.tsx, src/app/page.tsx, src/app/globals.css, src/data/content.ts, components.json
**Issues / notes:** Removed the stale resume TODO in content.ts (resume.pdf committed in `1bae560`). Without JavaScript the tagline words stay hidden (opacity 0); this gets fixed in Part B with the inline `data-intro` script. The 🔍 review is still open.
**Next:** Harsh reviews Part A in the browser, then Phase 2 Part B — name intro ("cyclone assemble")

### 2026-11-01 11:47 — Phase 1 skeleton
**Done:** Typed `nav` array (4 section links + Resume, labels from DESIGN.md §1), `sections` (anchor ids + names) and `ui` (aria strings) in content.ts. Page with 6 placeholder sections in order (home, ask-ai, projects, experience, skills, contact): max width 1120px (`max-w-content` token), padding 16/24px, spacing 80/128px, `scroll-mt-24`. `<Reveal>` + `<RevealItem>` (fade + 16px rise, 0.5s ease-out, once, 0.08s stagger, instant under reduced motion with a CSS fallback). Floating glass Navbar: hide on scroll down / show on scroll up, always shown near the top, smooth scroll (instant under reduced motion), mobile name + menu panel (closes on link click, outside click, Escape), aria-label / aria-expanded / aria-controls, focus-visible rings. lint, tsc, build all pass.
**Files changed:** src/data/content.ts, src/app/page.tsx, src/app/globals.css, src/components/Navbar.tsx, src/components/ui/Reveal.tsx, src/components/sections/{Hero,AskAI,Projects,Experience,Skills,Contact}.tsx
**Issues / notes:** `public/resume.pdf` still missing (TODO in content.ts); the Resume button 404s until it's added. A stale `next dev` from Phase 0 (crashed Tailwind worker, returning 500) was blocking a new dev server; stopped it with `taskkill` and restarted. The navbar stays visible during a nav-link jump so it doesn't vanish mid-scroll. Sections get `tabIndex={-1}` so keyboard focus moves to the section after a jump.
**Review:** Reviewed and approved by Harsh.
**Next:** Phase 2 — Hero

### 2026-11-01 — Phase 0 review
**Done:** Phase 0 reviewed and approved by Harsh. Project demo + API docs links added and synced. CGPA hidden. Hero intro spec added for Phase 2.
**Files changed:** docs/CONTENT.md, src/data/content.ts, docs/TASKS.md; Harsh's own edits to CLAUDE.md (rule 4), docs/DESIGN.md (Section 2 hero intro), docs/DECISIONS.md (row 15)
**Issues / notes:** GitHub links (all 3 projects), HarshGPT endpoint, OG image, and resume.pdf still TODO.
**Next:** Phase 1 — Skeleton

### 2026-10-31 — Phase 0 setup
**Done:** Scaffolded Next.js 16.4.3 (TS, Tailwind v4, ESLint, App Router, src/) via a temp `_scaffold/portfolio` folder and moved it to the root (no clashes; scaffold had no CLAUDE.md; AGENTS.md moved in). Installed motion, clsx, tailwind-merge, lucide-react. Ran shadcn init (radix-nova preset, neutral, CSS variables). Geist + JetBrains Mono via next/font, `<html class="dark">`. All DESIGN.md color tokens in globals.css and exposed to Tailwind (`bg-bg`, `text-text-muted`, `bg-gradient`, ...), with shadcn's dark colors mapped onto them. Smooth scroll only under `prefers-reduced-motion: no-preference`. SEO title/description from content.ts. Typed `src/data/content.ts` mirroring CONTENT.md. Placeholder page (name + label). `.env.local` created; `.claude/settings.local.json` git-ignored. First commit `4cda0a3`. lint, tsc, build all pass.
**Files changed:** package.json, components.json, next.config.ts, .gitignore, src/app/{layout.tsx,page.tsx,globals.css}, src/data/content.ts, src/lib/utils.ts, src/components/ui/button.tsx
**Issues / notes:** create-next-app rejects folder names starting with `_` and needs the parent folder to exist, hence `_scaffold/portfolio`. shadcn 4.x dropped `--base-color`; used `--defaults -b radix`. shadcn's `cn()` re-exports the official `cn` package (shadcn-ui/cn) instead of clsx+tailwind-merge. `next dev` maintains a managed block in AGENTS.md (never CLAUDE.md). Skills have no `icon`/`marquee` values yet (Phase 5). `public/resume.pdf` not placed yet. These docs updates are not yet committed.
**Next:** Phase 0 🔍 review in the browser, then Phase 1 — page structure with an empty `<section id>` per section

### 2026-10-31 — Project planning
**Done:** Chose the "Dark Bento + Live AI" design. Wrote CLAUDE.md, DESIGN.md, CONTENT.md,
TASKS.md, PROGRESS.md, DECISIONS.md.
**Files changed:** docs only
**Issues / notes:** Project links (live demo / API docs / GitHub) and the HarshGPT endpoint are still TODO in CONTENT.md.
**Next:** Phase 0 — Setup
