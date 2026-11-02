# Engineering handoff

This file is the bridge between the design prototype in this repo and the production build in
`SaddlePassAdmin/EquiStaff-PROD`. If a screen, rule or record isn't here or linked from here, ask design
before building it.

| | |
|---|---|
| Live prototype | https://saddlepassadmin.github.io/equistaff-website/start.html |
| Production repo | `SaddlePassAdmin/EquiStaff-PROD` (Next.js + FastAPI + Postgres) |
| Engineering | Uraiz Ali |
| Design | Carrington Smurl, Brittany (Saddle Pass) |
| Launch target | 9 November 2026 · site testing ~23 Nov → 1 Dec |
| Last updated | 29 October 2026 |

**Precedence when sources disagree:** this file → `src/tokens.css` → the prototype page → Figma.
Figma section `380:2` ("10 · All live screens") is captured *from* this prototype, so the prototype wins.

---

## 1. Screens and status

**How to read Status:**
- **Build** — the design is settled; build it.
- **Build · open item** — build it, but the open item named in the row (§6) may change a detail.
- **Not designed** — don't build it yet; it needs design first.

Design signs off on this table in the PR that changes it. Change a row's status only through a PR.

### Public

| Prototype page | PROD route | Status | Notes |
|---|---|---|---|
| `index.html` | `/` | Build | Landing option A is final (21 Oct). Hero video is a placeholder |
| `jobs.html` | `/jobs` | Build · open item | Needs a "no results" state (§3) |
| `job-detail.html` | `/jobs/[slug]` | Build | JobPosting JSON-LD; one share control (PR #13) |
| `pricing.html` | `/pricing` | Build · open item | Prices are content, not code (§4). Middle tier unpriced |
| `about.html` | `/about` | Build | |
| `contact.html` | `/contact` | Build | Form submits to the lead inbox (§5) |
| `request-talent.html` | `/request-talent` | Build | Fields = chatbot EM-Q1…EM-Q8. Creates an `EmployerInquiry` |
| `book.html` | `/book` (new) | Build · open item | Needs Kaitlin's two booking links |
| `blog.html`, `blog-post.html` | `/blog`, `/blog/[slug]` (new) | Build | Static content is fine for launch |
| `privacy.html`, `terms.html` | `/privacy`, `/terms` | Build · open item | **Copy needs legal review** before launch |
| `404.html` | not-found | Build | |
| `landing-b.html`, `landing-c.html` | — | Don't build | B is the documented alternate; C is retired |

### Accounts

| Prototype page | PROD route | Status | Notes |
|---|---|---|---|
| `signin.html` | `/signin` | Build · open item | Needs wrong-password and locked-account states (§3) |
| `signup.html` | `/signup` | Build | Both roles. **No Apple sign-in** (removed 27 Oct) |
| `verify.html` | `/verify` | Build | Includes `?state=expired` |
| `forgot.html` | `/forgot` | Build | Four states; never confirms whether an address has an account |

### Job seeker

| Prototype page | PROD route | Status | Notes |
|---|---|---|---|
| `onboarding.html` | `/jobs/[slug]/apply` | Build | **Account is offered at the END of applying, never as a gate before it** (Kaitlin, 27 Oct) |
| `profile.html` | `/profile` | Build | Deep mode reference page |
| `applications.html` | `/applications` (new) | Build | Managed employers stay anonymous until contact (R1) |
| `resume.html` | `/resume` | Build · open item | Skill picker uses Kaitlin's 186-skill list (`src/skills.js`). **Not yet in the prototype:** resume upload → parse → pre-fill (engineering parses; design owes the upload screen) |
| `saved.html` | `/saved` (new) | Build | |
| `messages.html` | `/messages` (new) | Build | Messaging is tier-gated (PR #7) |
| `settings.html` | `/settings` | Build | |

### Employer — managed (hiring through Kaitlin)

| Prototype page | PROD route | Status | Notes |
|---|---|---|---|
| `employer.html` | `/employer` | Build | Searches + shortlist |
| `candidate.html` | `/employer/candidates/[id]` (new) | Build · open item | Horseshoe rating replaces stars (PR #6). Reference rule open (§6). Pipeline stages include remote interview, onsite interview, offer |

### Employer — self-serve (posting it yourself)

| Prototype page | PROD route | Status | Notes |
|---|---|---|---|
| `post-job.html` | `/employer/post-job` | Build · open item | Needs validation + submit-error states. Add "open to international applicants" field |
| `my-jobs.html` | `/employer/jobs` (new) | Build | |
| `applicants.html` | `/employer/jobs/[id]/applicants` (new) | Build | |
| `billing.html` | `/employer/billing` (new) | Build · open item | Stripe. Needs declined-card and past-due states. Invoice PDF links are dead in the prototype |
| `company.html` | `/employer/company` (new) | Build | |

### Chat assistant

| Prototype | Status | Notes |
|---|---|---|
| Launcher on every page + `chatbot.html` | Build | **Spec: [`docs/chatbot-spec.md`](docs/chatbot-spec.md).** V1 is scripted, not generative (R11): no free-form answers, no agent framework writing replies |

### Not designed yet

| Area | Why it matters | Owner |
|---|---|---|
| **Admin essentials** (dashboard, jobs approve/edit/close/repost, media moderation, user lookup + support actions incl. cancel subscription, seeker/employer lists with notes + created date + last login, lead inbox) | Agreed scope, due with testing sign-off | Design, next |
| **Employer candidate search** | Every plan says "unlimited candidate searches" but there is no screen | Decision first (§6) |
| Role-family SEO landing pages | Search traffic for "barn manager jobs" etc. | After launch |

---

## 2. Design system

- **`src/tokens.css` is the only source of colour, type, spacing and radius.** Import it; don't re-declare values.
- Fonts: **Lora** (display), **Lato** (body, never under 17px for prose), **Azeret Mono** (salary, IDs,
  dates). IBM Plex Mono and Cutive Mono are retired — the client rejected the dotted zero. `--font-typewriter` is gone.
- Two modes: `:root` = public site, `[data-mode="deep"]` = signed-in portal. Components are written once
  against semantic tokens. `--action-primary` deliberately flips between modes.
- **Ink crossover:** depth 00–04 take navy text, 05–07 take white text. Never let text straddle the boundary.
- **No light blue on light grounds** (PR #9 — WCAG AA across all pages).
- Shared CSS: `src/styles.css` (components), `src/screens.css` (portal screens), `src/chat.css` (assistant).
  Some pages still carry page-scoped `<style>` blocks and inline hex values. Treat the token, not the hex, as intent.
- Navigation is defined once in `src/nav.js`.

---

## 3. States per flow

✅ designed in the prototype · ⚠️ partial · ❌ not designed yet. Every ❌ will be designed before testing starts.
Until then, use the shared patterns: field error = red text under the field + `aria-invalid`; page error = a banner with
`role="alert"`; loading = button disabled with a spinner; success = `.esFlash` toast (`role="status"`).

| Flow | Empty | Loading | Field errors | Page error | Success |
|---|---|---|---|---|---|
| Sign in | — | ❌ | ❌ | ❌ wrong password, locked | ✅ |
| Sign up | — | ❌ | ⚠️ native only | ❌ | ✅ → verify |
| Verify email | — | — | — | ✅ expired | ✅ |
| Forgot password | — | ❌ | ⚠️ | ✅ | ✅ |
| Apply (onboarding) | — | ❌ | ⚠️ native only | ❌ | ✅ |
| Job search | ❌ no results | ❌ | — | ❌ | — |
| Request talent | — | ❌ | ✅ | ❌ | ✅ |
| Post a job | ✅ preview | ❌ | ❌ | ❌ | ✅ |
| Billing | — | ❌ | ❌ | ❌ declined card, past due | ✅ incl. cancel-save offer |
| Messages / saved / applications / my jobs / applicants | ✅ | ❌ | — | ❌ | — |

---

## 4. Business rules that must survive the build

1. **Prices are editable content, never hard-coded.** Approved: job board **$50** / 1 month / 3 posts ·
   **$140** / 3 months / 3 posts · **$460** / 1 year / 5 posts. Direct hire = **$1,000 up front**, balance a
   percentage of first-year salary due on the hire's first day.
2. **The direct-hire percentage is never shown anywhere** — not on a page, not in the chat, not in an email.
3. **Managed (recruiter-run) roles never name the employer** before contact is made.
4. **No placement promises or timelines.**
5. **Account creation comes after the application,** with the email carried over.
6. **Never ask about family or dependents** — ask who else, people or pets, needs housing.
7. The chat assistant's 12 hard rules (R1–R12) in [`docs/chatbot-spec.md`](docs/chatbot-spec.md) apply site-wide where relevant.
8. Brand copy: "since 1982". Never a year count.

---

## 5. Data records

The prototype's `src/state.js` is browser scaffolding, **not a persistence spec**. These are the
records the screens imply; field names are suggestions.

| Record | Key fields | Created by |
|---|---|---|
| User | role (`job_seeker` / `employer` / `admin`), email, verified, created_at, last_login_at | Sign up, apply |
| SeekerProfile | name, location, role(s), discipline(s), availability, relocation targets (≤5), skills (≤5), photos (1 + gallery), videos, completeness % | Apply, profile, resume, chat (`SeekerIntake`) |
| Resume | source (`upload` / `built`), parsed fields, confirmed_at | Resume builder (R6: nothing saved unconfirmed) |
| Job | title, location, pay, housing, program, horse/staff counts, schedule, duties, day in the life, qualities, start date, international (yes/no/case by case), managed (bool), status (`draft` → `pending` → `live` → `closed`), posted_at | Post a job, admin |
| Application | job, seeker, status (being reviewed / shortlisted / sent to barn / remote interview / onsite interview / offer / closed), disclosed (bool), employer note (private) | Apply |
| SavedRole | seeker, job | Save |
| Rating | candidate, employer/admin, horseshoes (1–5), note | Closing out a candidate (required) |
| EmployerInquiry | see chat spec | Request talent, contact, chat |
| Subscription | employer, plan, Stripe ids, status, renews_at | Billing (Stripe holds cards, charges, refunds) |
| Message | thread, sender, body, sent_at | Messages (tier-gated) |
| ChatSession, HandoffRequest, UnansweredQuestion | see chat spec | Chat |

**Legacy data:** 8,000+ applications on the old Azure platform. Migrate what maps, leave new fields
blank. A recapture email asks people to complete their profiles afterwards. Field mapping is an open item (§6).

---

## 6. Open decisions

| # | Decision | Blocks | Who |
|---|---|---|---|
| 1 | "Unlimited candidate searches" on plans: build a candidate search screen, or change the plan copy? | Pricing, billing, employer portal | Carrington + Kaitlin |
| 2 | Middle pricing tier (job description writing + advertising): what's in it, what it costs | Pricing page, chat EM-3 | Kaitlin |
| 3 | References: all 3 mandatory, or 1 required + 2 optional | Candidate profile, apply | Kaitlin |
| 4 | Job source of truth: SmartSearch sync vs. jobs posted and approved in admin, or both | Jobs API, admin | Uraiz + Kaitlin |
| 5 | Legacy field map + which records become accounts | Migration | Uraiz |
| 6 | Hosting owner, staging environment for testing, CI | Testing window | Uraiz + Carrington |
| 7 | Kaitlin's two booking links; inquiry email address | Book a call, chat hand-off | Kaitlin |
| 8 | Real photography and hero video (all current images are Pexels placeholders, see `img/CREDITS.md`) | Launch | Kaitlin |
| 9 | Privacy policy and terms legal review | Launch | Carrington |
| 10 | Chat open questions | Chat | See `docs/chatbot-spec.md` |

---

## 7. Prototype scaffolding — don't port

- `src/state.js` — localStorage demo memory (`ES.*`), "Reset the demo" button.
- `src/revised.js` and the `REVISED(...)` calls — the "what changed" review pills. Removed before handoff closes.
- `start.html` — the prototype menu.
- `?chatdemo=` deep links and the "Try as" switch in the chat widget.
- `noindex` meta + `robots.txt` disallow — **production must remove both at launch** (PROD's layout has the same flag).
