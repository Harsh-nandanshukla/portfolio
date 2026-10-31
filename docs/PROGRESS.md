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
