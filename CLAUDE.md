# CLAUDE.md — Portfolio Project Instructions

Read this file first in every session. Then read, in order:
1. `docs/DESIGN.md` — the visual spec (source of truth for look and feel)
2. `docs/CONTENT.md` — all text, links, and metrics (source of truth for content)
3. `docs/TASKS.md` — what to build, in order
4. `docs/PROGRESS.md` — where the last session stopped
5. `docs/DECISIONS.md` — choices already made; don't reopen them without asking

## Project
Personal portfolio for Harsh Nandan Shukla, an AI/ML engineer (B.Tech, IIT Jodhpur).
Single-page, frontend-only site. Goal: look premium, load fast, and get a recruiter
to the live project demos within 10 seconds.

The owner is new to web development. Explain anything non-obvious in one or two
plain sentences, and give exact commands for Windows PowerShell.

## Stack (fixed)
- Next.js (App Router) + TypeScript
- Tailwind CSS
- Framer Motion (`motion` package)
- Aceternity UI + Magic UI components (copy-in components, installed via the shadcn CLI where supported)
- shadcn/ui for base primitives
- Fonts via `next/font`: Orbitron 700 (hero name only, --font-display), Geist (text), JetBrains Mono (metrics/labels)
- Deploy: Vercel

Do not add other UI libraries, CSS frameworks, or state managers without asking.

## Folder layout
```
src/
  app/            layout.tsx, page.tsx, globals.css
  components/
    sections/     Hero.tsx, AskAI.tsx, Projects.tsx, Experience.tsx, Skills.tsx, Contact.tsx
    ui/           Aceternity / Magic UI / shadcn components
  data/           content.ts — ALL site text lives here, typed
  lib/            utils.ts
public/           resume.pdf, project images, og-image.png
docs/             these .md files
```

## Rules
1. **One section at a time.** Build it, run `npm run dev`, then stop and ask me to review
   in the browser before starting the next section.
2. **Content only from `src/data/content.ts`**, which mirrors `docs/CONTENT.md`.
   Never hardcode text inside components. Never invent metrics, dates, or links —
   if something is missing, leave a clearly marked `TODO` and tell me.
3. **Colors and fonts only from the design tokens** in `globals.css` / Tailwind config.
   No random hex values in components.
4. **Motion is subtle.** Fade-up on scroll, glows, count-ups. No bouncing or spinning,
   and no blocking intro animations. One exception: the hero name intro defined in
   DESIGN.md (≤2.5s, skippable, once per session). Respect `prefers-reduced-motion` everywhere.
5. **Mobile matters.** Check every section at 375px width. No horizontal scroll.
6. **Performance:** Lighthouse performance 90+. Lazy-load heavy client components,
   use `next/image`, and keep the hero canvas light (pause it when off-screen).
7. **Secrets:** API endpoints go in `.env.local` (`NEXT_PUBLIC_HARSHGPT_URL`).
   Never commit `.env.local`.
8. **After each finished task:** tick it in `docs/TASKS.md`, add a short entry to
   `docs/PROGRESS.md`, and log any new choice in `docs/DECISIONS.md`.
9. **Commit after each section** with a clear message, e.g. `feat: hero section`.
10. **Lists render from data.** Skills, projects, experience, and tags all come from
    `src/data/content.ts`. Adding an item must never require editing a component.

## Commands
Known issue: on this Windows setup the dev server sometimes stops picking up globals.css changes (stale CSS). Fix: stop the server, delete .next (Remove-Item -Recurse -Force .next), run npm run dev again.
