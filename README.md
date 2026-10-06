# EquiStaff — website rebuild

Front-end for the EquiStaff website and job board rebuild.
Built by **Saddle Pass Inc.** for **EquiStaff** (Ocala, Florida).

---

## Status

Design-stage prototype. This repo currently holds the **design system** and a
**working static prototype** of the public site, used to prove the layouts,
motion and component behaviour before the application build starts.

It is deliberately framework-free right now so the stack decision stays open.
`src/tokens.css` is the piece that carries forward unchanged.

| | |
|---|---|
| Launch target | 2 November 2026 (outside date 6 November) |
| Package | B — full rebuild: agency site + job board + application experience |
| Design file | Figma — EquiStaff |
| Engineering | TBC |
| Design | Carrington Smurl, Saddle Pass |

---

## Run it

**Easiest:** double-click `serve.command`. It starts the server and opens the
site in your browser. Close the Terminal window to stop it.

**Or from a terminal:**

```bash
cd equistaff-website
python3 -m http.server 4321
```

Then open **http://127.0.0.1:4321**

No build step, no dependencies, nothing to install.

| Page | Mode | What it is |
|---|---|---|
| `index.html` | Light | **Landing option A — Editorial.** Video-ready hero, two doors, process, roles, conversion comparison, SEO block |
| `landing-b.html` | Light | **Landing option B — Split decision.** The two doors *are* the hero; employer side weighted |
| `landing-c.html` | Light | **Landing option C — The gradient dive.** Video hero, gradient bands descending the depth ramp |
| `jobs.html` | Light | Job board — filters, scannable listings, recruiter-managed treatment |
| `job-detail.html` | Light | Single role, with JobPosting schema and apply |
| `signin.html` | Both | The threshold — light on one side, deep on the other |
| `onboarding.html` | Light | Apply-triggered sign-up (3 steps) + the gated employer path |
| `profile.html` | **Deep** | Job-seeker profile and portal |
| `employer.html` | **Deep** | Employer portal — searches, shortlist, job posts |

### Video

`index.html` and `landing-c.html` both reference `media/hero.mp4`. Drop the
file in and it plays; until then the poster image carries it. See
[`media/README.md`](media/README.md) for shoot guidance.

`profile.html` is the reference implementation for Deep mode: it sets
`data-mode="deep"` on `<html>` and reuses the same components as the public
site with no component-level overrides.

---

## The design system

**`src/tokens.css` is the single source of truth for design.** It mirrors the
Figma variable collection and should be imported by whatever framework we land
on, rather than re-declared.

### The dive

The site reads as depth. White and open at the surface where anyone can browse;
progressively deeper as someone moves into jobs and then into the signed-in
portal. One ramp, eight steps:

| Token | Value | Where |
|---|---|---|
| `--depth-00` | `#FFFFFF` | Hero, anonymous browsing |
| `--depth-01` | `#F4FAFE` | Proof strip, secondary bands |
| `--depth-02` | `#E3F1FB` | Featured roles |
| `--depth-03` | `#BDE3FF` | Job listings, filters |
| `--depth-04` | `#5E9DC8` | Job detail, apply |
| `--depth-05` | `#2C6591` | Sign-in, the crossing |
| `--depth-06` | `#16395C` | Portal chrome |
| `--depth-07` | `#0B2545` | Portal ground |

### Two modes

`:root` is the public site. `[data-mode="deep"]` is the signed-in area.
Components are written once against semantic tokens and reskin by mode.

Note the deliberate inversion: `--action-primary` is `#007AB8` on light and
`#BDE3FF` on deep, because the brand blue fails contrast on navy (2.6:1). The
token name never changes, so no component needs to know which end it sits on.

### ⚠️ The ink crossover — measured, not assumed

```
white on --depth-04 (#5E9DC8) = 2.9:1   FAILS AA
navy  on --depth-04           = 5.2:1   passes
white on --depth-05 (#2C6591) = 6.1:1   passes — first band where white wins
```

**Depth 00–04 take navy ink. Depth 05–07 take white ink.**
Never let a block of text straddle that boundary. Gradients belong in the gaps
between text, never behind it.

### Type

| Role | Family | Notes |
|---|---|---|
| Display / headings | Lora | Pending final sign-off; swap `--font-display` in one place |
| Body / UI | Lato | Never below 17px for prose — the live site sets 13px, which was an audit finding |
| Metadata | Roboto Mono | Salary, IDs, dates. Replaced IBM Plex Mono, whose dotted zero the client rejected |

---

## Client requirements reflected in the build

From the client inspiration document and the 2 October feedback:

- **Two doors on the first screen**, employer path with visual priority — that is where revenue comes from
- **Request Talent is the primary employer action**; posting a job is secondary. Employer inquiries are gated and reviewed before routing
- **Motion** — Ken Burns on the hero (standing in for a video header until footage exists), diagonal section cuts, live-scrolling opportunities ticker
- **Imagery per role category** — every category gets its own photograph
- **Proof throughout** — trust bar, stats, testimonials, recruiter-managed badges. The client reports that good listings are often mistaken for scams, so credibility signals matter
- **Short forms** — Request Talent is five fields, three required. Screening happens on the discovery call
- **Job board must be scannable** — pay, location, housing and commitment visible before the click

---

## What this is *not*

This does not merge with the existing equistaff.com codebase. That site is an
Angular SPA on a Metronic admin template and is being **replaced**, not
extended. The legacy system matters for three things only:

1. **Data** — listings, employer accounts, candidate profiles, applications.
   This is the part that must survive, and it is the real risk in the handover.
2. **URL inventory** — so redirects preserve search ranking.
3. **Content** to migrate.

---

## Accessibility baseline

Non-negotiable, and all of it traces to findings in the audit:

- WCAG 2.2 AA contrast on every text/background pair, **in both modes**
- Minimum 44px touch targets
- Real labels on every field — never placeholder-as-label
- `prefers-reduced-motion` honoured; nothing required is revealed only on scroll
- One `<h1>` per page (the live site currently has two)
- Jobs are public and indexable — no login wall in front of browsing
- Zoom not disabled (the live site ships `user-scalable=no`)

---

## Ownership

Per the Scope of Work, all rights in the deliverables — including site code —
assign to EquiStaff on receipt of final payment. This repo is kept separate
from Saddle Pass work precisely so that transfer is clean.

Until final payment, EquiStaff holds a licence to use everything delivered.

---

## Credits

Placeholder photography from Pexels under the Pexels licence — see
[`img/CREDITS.md`](img/CREDITS.md). **These are placeholders.** The approved
brief is explicit: *"Warmth comes from real people and real barns, not stock
horses."* Client-supplied photography replaces all of it before launch.
