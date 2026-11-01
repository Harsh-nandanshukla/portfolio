# DESIGN.md — "Dark Bento + Live AI"

The source of truth for how the site looks and moves.

## Concept
A dark, premium, AI-native portfolio. A bento-grid project layout (Apple-style tiles),
an interactive neural-network hero, and a live "Ask my AI" chat powered by HarshGPT.
It should feel like a polished product site, not a student template.

## Design tokens

### Colors
| Token | Value | Use |
|---|---|---|
| `--bg` | `#0A0A0F` | Page background |
| `--surface` | `#12121A` | Cards / tiles |
| `--surface-hover` | `#181824` | Card hover |
| `--border` | `rgba(255,255,255,0.08)` | Card borders, dividers |
| `--text` | `#EDEDED` | Primary text |
| `--text-muted` | `#8A8A99` | Secondary text |
| `--accent-1` | `#22D3EE` | Cyan — primary accent |
| `--accent-2` | `#8B5CF6` | Violet — gradient end |
| `--gradient` | `linear-gradient(90deg, #22D3EE, #8B5CF6)` | CTAs, metric numbers, glows |

Use the accent **sparingly**: buttons, metric numbers, glows, and active states only.
Most of the page is near-black and off-white.

### Typography
- **Geist Sans** for headings and body. **JetBrains Mono** for metrics, tags, labels, and dates.
- Scale (desktop / mobile):
  - Hero name: 72px / 44px, weight 600, tight letter-spacing (-0.03em)
  - Section title: 40px / 30px, weight 600
  - Card title: 22px / 20px, weight 600
  - Body: 16px, line-height 1.6, `--text-muted`
  - Labels / tags: 13px mono, uppercase, letter-spacing 0.08em
  - Metric numbers: 36px mono, gradient text

### Layout
- Max content width 1120px, centered. Side padding 24px desktop, 16px mobile.
- Section vertical spacing 128px desktop, 80px mobile.
- Card radius 20px, 1px `--border`, background `--surface`.
- 8px spacing grid.

- All lists (skills, projects, experience, tags) render from data in src/data/content.ts.
  Adding an item = adding one object. Never edit a component to add an item.

### Motion
- Scroll reveal: fade + 16px rise, 0.5s ease-out, children staggered 0.08s. Triggers once.
- Card hover: cursor-following spotlight glow plus a border brighten. No scale jumps over 1.02.
- Number tickers count up once when in view (~1.2s).
- Everything collapses to instant/static under `prefers-reduced-motion`.

## Sections

### 1. Navbar
Floating pill-shaped bar, centered at top, blurred glass (`backdrop-blur`, semi-transparent
surface). Links: Projects · Experience · Skills · Contact, plus a small gradient "Resume" button.
Hidden while scrolling down, shown again while scrolling up. On mobile: name + menu icon.

### 2. Hero (full viewport height)
- Background: a canvas neural network. ~60 slow-drifting nodes, lines between nodes that
  are close, nodes near the cursor brighten and connect to it. Cyan/violet at low opacity.
  A static gradient replaces it on mobile or reduced-motion.
- Small mono label above the name: `AI/ML ENGINEER · IIT JODHPUR`
- Name: "Harsh Nandan Shukla"
#### Name intro animation ("cyclone assemble")
- Plays once per browser session on first load (sessionStorage, wrapped in try/catch). Total ≤ 3.2s desktop, ≤ 2.4s mobile.
- The name is split into letter spans (letters aria-hidden; the h1 keeps aria-label with the full name so screen readers read it normally).
- Start: letters are assigned round-robin to the 4 screen corners and begin off-screen beyond them (small jitter), at scale 0.2, opacity 0.
- Motion: letters travel inward on a shrinking spiral (cyclone path, ~1–1.5 turns around the screen center) while growing from small to full size. Arrival is staggered ~60ms, so they lock into place one after another, left to right. Ease-out, no bounce or overshoot.
- 3D solid look: perspective on the container; letters rotate in Y/X during flight and settle flat. Depth: ~11-layer extrusion offset down-right in mid-greys (mixed toward --bg), a lit face gradient, a soft shadow, and a slight resting tilt. Clearly 3D at rest. Tunable in INTRO_CONFIG (DECISIONS #26, #32).
- Spark: a ~6-letter-wide band sweeps left to right (~900ms), holding letters at full white with a cyan glow, then they return to normal.
- After the spark: the label and the tagline fade in, then the buttons.
- Never blocking: the navbar is visible and usable from the start. Any click, key press, or scroll instantly finishes the animation (letters jump to final position).
- Performance: animate only transform, opacity and filter. The neural background starts after the intro ends.
- prefers-reduced-motion: no intro; the name appears static immediately.
- Tagline via Text Generate Effect: "Building production LLM systems — guardrails, RAG, and agent evaluation."
- Buttons: **View Projects** (gradient, scrolls to projects) and **Download Resume** (outline).
- Subtle scroll-down indicator at the bottom.

### 3. Ask my AI
A wide glass card directly under the hero.
- Heading: "Ask my AI about me"
- Input placeholder: "What has Harsh built with LLMs?"
- 3 suggestion chips: "What's his strongest project?", "Tell me about his research", "What's his tech stack?"
- Answers stream into the card. Show a typing indicator while waiting.
- If the API fails, show a friendly fallback message and link to the resume.

### 4. Projects — Bento Grid
Desktop grid: the featured tile spans 2 columns × 2 rows; the other two tiles sit beside/below it.
Single column on mobile.

- **LLM Guardrails Gateway** — featured tile with a Border Beam.
  - The 6 pipeline stages as chips that light up one after another in a loop.
  - Metric row via Number Ticker: F1 0.97 · 92% cache hit rate · Precision 0.96
- **AgentScope** — medium tile, one headline line and tech tags.
- **HarshGPT** — medium tile, one headline line and tech tags.

Every tile: title, one-line description, mono tech tags, buttons for Live Demo / API Docs / GitHub,
and the Card Spotlight hover effect.

### 5. Experience & Research — Tracing Beam timeline
A vertical line that fills with the gradient as you scroll. Entries:
IIIT Allahabad → Pull Logic → Ganpat University (see CONTENT.md for order and details).
Each entry: role, organization, date (mono), 1–2 lines, and one big highlighted metric where one exists
(e.g. the 6.66% → ~27% recovery).

### 6. Skills — Marquee
Two rows of tech logos with names, scrolling in opposite directions, pausing on hover,
with edges fading to the background.
Below them, a compact grouped list of all skills by category, for accessibility and SEO.

#### Skills must be data-driven
- Every skill is one entry in src/data/content.ts:
  { name: "PyTorch", category: "AI/ML", icon: "pytorch", marquee: true }
- Icons come from a single icon library (react-icons, Simple Icons set) looked up by
  the `icon` key in ONE mapping file: src/lib/skill-icons.ts.
- If a skill has no icon or the key isn't found, render a styled text pill instead.
  Never crash and never show an empty slot.
- `marquee: true` puts the skill in the scrolling rows; every skill always appears
  in the grouped list.
- Categories and their order are generated from the data (order of first appearance),
  so adding a new category needs no component change.

### 7. Contact / Footer
Large closing line: "Let's build something intelligent."
Email as a big copyable link (copies on click and shows a "Copied" toast), plus GitHub and LinkedIn icons.
Footer: "© 2026 Harsh Nandan Shukla · Built with Next.js".

## Component map
| Section | Component |
|---|---|
| Hero background | Custom canvas (`NeuralBackground.tsx`) — fallback: Aceternity Background Beams |
| Hero tagline | Aceternity Text Generate Effect |
| Project grid | Aceternity Bento Grid |
| Tile hover | Aceternity Card Spotlight |
| Featured border | Magic UI Border Beam |
| Metrics | Magic UI Number Ticker |
| Timeline | Aceternity Tracing Beam |
| Skills | Magic UI Marquee |
| Navbar | Custom, Framer Motion |

## References
- Bento layouts: godly.website (search "bento")
- Interaction polish: rauno.me
- Typography restraint: leerob.com
