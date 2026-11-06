# Engineering handoff

This is the bridge between the design prototype in this repo and the production build in
`SaddlePassAdmin/EquiStaff-PROD`. If a screen, rule or record isn't here or linked from here, ask design
before building it.

| | |
|---|---|
| Live prototype | https://saddlepassadmin.github.io/equistaff-website/start.html |
| Every screen, in order (Figma) | [**✅ Dev Ready — all 60 screens on one sheet**](https://www.figma.com/design/cC1Nx8Ox10XfkcWlgviV9C/Equistaff-Website?node-id=580-7) (opens zoomed to fit). 9 sections A–I, a one-page spec (PRD) per section, incl. 12 live chat states |
| Screen index | https://claude.ai/code/artifact/80356d71-ddbd-434a-b568-768d46a23612 |
| Production repo | `SaddlePassAdmin/EquiStaff-PROD` (Next.js + FastAPI + Postgres) |
| Engineering | Uraiz Ali |
| Design | Carrington Smurl, Brittany Capps (Saddle Pass) |
| Client | Kaitlin Snyder, EquiStaff (reviews with Kelly) |
| Timeline | Client design notes closed 2 Nov · admin portal design in progress (target 1 Dec) · site testing ~23 Nov → 1 Dec |
| Last updated | 2 November 2026 (build notes added after Kaitlin's review) |

**V1 build notes — read these first.** The prototype still shows some things Kaitlin has deferred. Build V1 like this:

1. **Don't build for V1** (prototype shows them; Kaitlin deferred): the home **state map** (build the state *list*),
   the résumé **Facility/Business switch** (V2), **skill levels per discipline** (later), **auto-recognised skills** (V2).
2. **Do build for V1:** the post-a-job **Facility/Business switch**, **job-description upload**, and the
   **days-in-stage pills** on the shortlist.
3. **Interview availability** is a **plain text box** for the client's available windows — not the slot picker the prototype shows.
4. **Job search filters by `?state=`** — the home page state links land on `/jobs?state=XX`. The prototype doesn't
   filter (known prototype bug); production must, with an empty state.
5. From Kaitlin's notes: **phone** on the main sign-up screen · a new seeker's **first step after sign-in is a résumé
   upload** · **remove the employer-feedback disclaimer** in seeker settings · **direct-hire clients get no candidate
   search unless they also hold a job-board plan** · talent search **drops the Role family filter** (seekers never set one).
6. **The prototype has bugs. Build from the designs and these rules, not from the prototype's JavaScript.**

**Precedence when sources disagree:** this file → `docs/chatbot-spec.md` (chat only) → the prototype's code
→ `src/tokens.css` → Figma. Figma is captured *from* the prototype, so the prototype wins on detail.
When the code and this file disagree, ask design: one of them is out of date.

**How to explore the prototype fast**

- Sign in with any password: `hiring@test.com` → employer hiring through the recruiting team ·
  `posting@test.com` → employer posting their own jobs · any other email → job seeker.
- `start.html` lists every screen by journey. "Reset the demo" there clears saved state.
- Add `?review=1` to any URL to see the per-screen "what changed" notes and the chat's reviewer tags
  (remembered in that browser; `?review=0` turns it off). The normal view shows the product only.
- Chat conversations replay with `?chatdemo=<name>` — see `docs/chatbot-spec.md` §10.

---

## 0. Which branch to build from

`main` is your baseline. As of **6 November 2026** it is frozen for site design — the
screens on it are the ones Kaitlin reviewed and the ones in the Figma Dev Ready page.
Build from `main` and it will not move under you.

Further site design lands on **`design-2026-11-06`**, not on main. When a batch there is
settled, Carrington decides when it comes across. Until then, anything on that branch is
still being argued about and is not yours to build.

The live preview at saddlepassadmin.github.io serves `main`, so what you see there and what
you build from are the same thing.

---

## 1. Screens and status

### The designs

Figma → EquiStaff → **Dev Ready**. 60 screens captured from this build on 2 Nov, in nine
journey sections A–I. Each section opens with a PRD — purpose, users, the rules, what done
looks like. Each screen is captioned with its prototype filename, so a frame maps straight to
a row in the tables below.

Not every screen is a separate file. A filename with a `?` is one page driven by a query
parameter: `job-detail.html?role=…` renders all six listings from `src/jobs.js`;
`candidate.html?id=` and `seeker-profile.html?id=` select a person;
`messages.html?as=employer` switches side; `company.html?type=direct` and
`verify.html?state=expired` switch state. Section H holds Evie's twelve live states, each
reachable on the build with `?chatdemo=`.

**These are mock-ups of the design, not a spec of built behaviour.** Kaitlin approves the
Figma; a row here goes to **Build** only after she has.


**Status:** **Build** — settled, build it · **Build · open** — build it; the open item (§7) may change a
detail · **Later** — designed, but the client wants it after launch · **Not designed** — needs design first.
Change a row's status only through a PR that design signs off.

### Public

| Prototype page | PROD route | Status | Notes |
|---|---|---|---|
| `index.html` | `/` | Build | Final landing. "Find work by state" = the **state list** linking to `/jobs?state=XX`; the interactive map (`src/usmap.js`) is **Later**. Hero video and all photos are placeholders |
| `jobs.html` | `/jobs` | Build | Search filters by role and place; no-match state exists. **Must filter by `?state=`** (prototype doesn't) |
| `job-detail.html` | `/jobs/[slug]` | Build | Rendered from `src/jobs.js` by `?role=<slug>`. Order: About the employer → Job description → Main duties → Requirements → Benefits. Managed roles: no employer name, no photo (R1). Share under Apply / Save. JobPosting JSON-LD |
| `pricing.html` | `/pricing` | Build | Comparison (Job board / Advertising package / Direct hire) at the top, each jumps to its details. Prices are content (§4) |
| `about.html`, `contact.html` | `/about`, `/contact` | Build | Contact submits to the lead inbox |
| `request-talent.html` | `/request-talent` | Build | Upload a job description first (parsed, §5), then the form. Creates an `EmployerInquiry` |
| `book.html` | `/book` | Build · open | "Request a call": the team emails to book an **hour-long** call. One MS Bookings link today (§7) |
| `blog.html`, `blog-post.html` | `/blog`, `/blog/[slug]` | Build | "Advice" in the footer links here. Static content is fine at launch |
| `privacy.html`, `terms.html` | `/privacy`, `/terms` | Build · open | **Draft wording — needs legal review before launch** |
| `404.html` | not-found | Build | |
| `landing-b.html`, `landing-c.html` | — | Don't build | B is a documented alternate, C is retired |

### Accounts

| Prototype page | PROD route | Status | Notes |
|---|---|---|---|
| `signin.html` | `/signin` | Build · open | No error states designed yet (§3). Test-login routing is scaffolding (§8) |
| `signup.html` | `/signup` | Build | Both roles. **Phone is required.** ZIP fills city/state. No Apple sign-in |
| `verify.html` | `/verify` | Build | Includes `?state=expired` |
| `forgot.html` | `/forgot` | Build | Never confirms whether an address has an account |

### Job seeker

| Prototype page | PROD route | Status | Notes |
|---|---|---|---|
| `onboarding.html` | `/jobs/[slug]/apply` | Build | **New seekers: first step after sign-in is a résumé upload.** **Account first** (step 1 creates it) and **a resume is required** — no resume routes to the builder and back. Ends with "add my profile to the public job board?" yes = Open to everyone, no = Looking quietly |
| `profile.html` | `/profile` | Build | Goals and interests. No references for seekers |
| `resume.html` | `/resume` | Build · open | Upload-and-review or build. Sections: Objectives / Experience / Key skills / Achievements & extras. Name, phone, email, location pre-fill. Facility/Business toggle and skill **levels** per discipline are in the prototype but **not V1** |
| `applications.html`, `saved.html` | `/applications`, `/saved` | Build | Managed employers stay unnamed until contact (R1) |
| `messages.html` | `/messages` | Build | Thread is "Recruiting Team", never a person's name. Scrolls like any chat |
| `settings.html` | `/settings` | Build | Phone required. Visibility: **Looking quietly** (recruiting team only) or **Open to everyone**. Remove the employer-feedback disclaimer |

### Employer — hiring through the recruiting team (direct hire)

| Prototype page | PROD route | Status | Notes |
|---|---|---|---|
| `employer.html` | `/employer` | Build · open | Metrics: applied / presented / interviewed. Each shortlisted candidate shows stage + days in stage; **over 3 days turns red**. "Request a call" + "Provide interview availability" = **a plain text box** in V1 (the prototype's slot picker is not V1) |
| `candidate.html` | `/employer/candidates/[id]` | Build | Open/Download résumé first, then the recruiting team's feedback. Decision rail on the right: horseshoe rating optional, **written feedback required**. Activity dates (presented / interview / 2nd interview / offer). References at the bottom. Employer notes go to the recruiting team, never the candidate |
| `direct-hire-flow.html` | — (explainer) | Read it | Six steps, admin side next to client side: clients added by hand, candidates added from a résumé and invited to claim a profile. Defines what the admin portal must do (§6) |

### Employer — job board (posting their own jobs)

| Prototype page | PROD route | Status | Notes |
|---|---|---|---|
| `post-job.html` | `/employer/post-job` | Build | Upload a job description first (parsed). **Facility/Business toggle — client says implement now**: Business swaps Discipline→Industry focus, Horses→Company size, Staff→Direct reports, Days off→Work schedule, Housing→Travel requirements. Housing splits Private / Shared. Pay fields auto-format commas. "Have the recruiting team write it" sits above the preview ($500) |
| `my-jobs.html` | `/employer/jobs` | Build | Close and reopen posts |
| `applicants.html` | `/employer/jobs/[id]/applicants` | Build | Date applied in the list. "Rejected", not "Not for this" |
| `talent-search.html` | `/employer/talent` | Build | Search seekers who chose Open to everyone. **Drop the Role family filter.** Direct-hire clients get **no** search unless they also hold a job-board plan |
| `seeker-profile.html` | `/employer/talent/[id]` | Build | Résumé first, photos/videos under it, contact details in the header (no redaction — employers have paid) |
| `billing.html` | `/employer/billing` | Build · open | Stripe — see §6. Needs declined-card and past-due states (§3) |
| `company.html` | `/employer/company` | Build | Job-board clients fill it. Direct-hire clients have a reduced view (`?type=direct`) and it never appears on managed listings |

### Chat assistant (Evie)

| Prototype | Status | Notes |
|---|---|---|
| Launcher on every page (compact in portals) + `chatbot.html` spec page | Build | **Spec: [`docs/chatbot-spec.md`](docs/chatbot-spec.md).** Scripted, not generative (R11) |

### Not designed yet

| Area | Status |
|---|---|
| **Admin portal V1** | **Design in progress.** Static, light-theme design prototype (27 screens, fake data) at [`admin/`](https://saddlepassadmin.github.io/equistaff-website/admin/dashboard.html) — not linked from `start.html`. Kaitlin reviews it Friday, then Kelly and Nick; Figma screens follow on the **💻 Admin Portal** page. **Don't build ahead of sign-off.** See §6 |
| Role-family SEO landing pages | After launch |

---

## 2. Design system

- **`src/tokens.css` is the single source** of colour, type, spacing and radius. Import it; don't re-declare values.
- Fonts: **Lora** (display), **Lato** (body; prose never under 17px), **Azeret Mono** (salary, IDs, dates).
- Logo: `assets/logo-lockup-thick.svg` and `-reversed.svg` — final lockup, "staff" in **Larken**, outlined
  (no font file needed). Open: the logo blue `#3478B3` vs `--blue-600` `#007AB8` (`assets/README.md`).
- Two modes: `:root` = public site, `[data-mode="deep"]` = signed-in portal. Components are written once
  against semantic tokens.
- **Nothing moves on hover or press.** Feedback is colour, shadow or border only — no `transform`.
- **No light blue on light grounds** (WCAG AA on every page). Depth 00–04 takes navy text, 05–07 white.
- Dropdowns use a custom chevron 16px in from the edge (light variant in the portal).
- Breakpoints: 1040, 900, **760 (header becomes a Menu button)**, **680 (phone layout)**, 620 (chat full screen).
  Tap targets 44px minimum; 20px side gutter on phones.
- **No notes, tags or "prototype" text in the product UI.** Reviewer notes exist only in review mode.

---

## 3. States per flow

✅ designed · ⚠️ partial · ❌ not designed. Until a ❌ is designed, use the shared patterns: field error = red
text under the field + `aria-invalid`; page error = banner with `role="alert"`; loading = button disabled
with a spinner; success = `.esFlash` toast (`role="status"`).

| Flow | Empty | Loading | Field errors | Page error | Success |
|---|---|---|---|---|---|
| Sign in | — | ❌ | ❌ | ❌ wrong password, locked | ✅ |
| Sign up | — | ❌ | ⚠️ native only | ❌ | ✅ → verify |
| Verify / forgot | — | ❌ | ⚠️ | ✅ expired | ✅ |
| Apply | — | ❌ | ⚠️ native only | ❌ | ✅ |
| Upload + review (résumé, job description) | — | ✅ | ⚠️ | ❌ unreadable file | ✅ |
| Job search / talent search | ✅ no match | ❌ | — | ❌ | — |
| Request talent | — | ❌ | ✅ | ❌ | ✅ |
| Post a job | ✅ preview | ❌ | ❌ | ❌ | ✅ |
| Billing | — | ❌ | ❌ | ❌ declined card, past due | ✅ incl. cancel flow |
| Lists (messages, saved, applications, jobs, applicants) | ✅ | ❌ | — | ❌ | — |

---

## 4. Business rules that must survive the build

1. **Prices are editable content, never hard-coded.** Current list (`pricing.html`): job board **$50** / 1 month /
   3 posts · **$69.99** / 1 month featured · **$140** / 3 months · **$460** / 1 year / 5 posts · **Advertising
   package $500** flat · **Direct hire: quoted per role**. Talent Bank exists but is deliberately unpublished.
2. **No direct-hire figure is ever shown** — no percentage, no retainer, not on a page, in the chat or an email.
   (The old "$1,000 up front" is gone everywhere.)
3. **Recruiter-managed roles never name or picture the employer** before contact is made (R1).
4. **Never promise a number of candidates or a timeline.** A shortlist is sized to the role — one or ten.
5. **An account comes first** when applying, and **a résumé is required** to apply.
6. **Never ask about family or dependents** — ask who else, people or pets, needs housing (R12).
7. **Seekers are never asked for references.** Clients see phone-checked references on managed candidates only.
8. **Visibility:** Looking quietly = recruiting team only, never in talent search. Open to everyone = searchable.
9. **Name the team, not a person:** "Recruiting Team" / "EquiStaff" in UI and notifications (Kaitlin won't be solo).
10. Every job page answers international applicants: "Case by case · EquiStaff can't sponsor visas."
11. Brand copy: "since 1982", never a year count. "Farm" or "barn", never "yard".
12. The chat's hard rules R1–R12 (`docs/chatbot-spec.md` §2) apply site-wide where relevant.

---

## 5. Data records

`src/state.js` is browser scaffolding (`ES.*`, localStorage key `equistaff.prototype.v4`), **not a persistence
spec** — but its seed data shows every field the screens use. Field names are suggestions.

| Record | Key fields | Created by |
|---|---|---|
| User | role (`job_seeker` / `employer` / `admin`), email, **phone**, verified, created_at, last_login_at | Sign up, apply |
| SeekerProfile | name, location, role family, disciplines/industries, skills (+ level), availability, housing + who else, **goals**, **visibility** (`open` / `quiet`), urgent flag, photos/videos, completeness %, **source** (`site` / `added_by_recruiter`), **claimed** | Apply, profile, résumé, admin |
| Resume | source (`upload` / `built`), objectives, experience[{employer, location, role, dates, summary}], skills, roleKind (`facility` / `business`), areas[{name, level}], extras, original file, confirmed_at | Résumé builder / upload. Nothing saved until the user confirms (R6) |
| Job | see `src/jobs.js`: title, managed, org (managed/board wording), pay, meta, about, description, duties, requirements, benefits, housing (private/shared/none) or travel, international, status (`draft`→`pending`→`live`→`closed`, reopenable), posted_at | Post a job, admin |
| Application | job, seeker, status, applied_at, disclosed (bool), employer note (private, to recruiting team) | Apply |
| ManagedCandidate | search, seeker, **stage** (Presented / Reviewed / Interviewed / Offered / Hired / Passed), activity dates per stage, contact_released, recruiter feedback, references[{who, said, when}] | Recruiting team (admin) |
| Rating | candidate, employer, horseshoes (1–5, optional), written feedback (**required**), decision | Candidate decision rail |
| InterviewAvailability | search, free text (V1) | Employer portal |
| SavedRole | seeker, job | Save |
| EmployerInquiry | see chat spec | Request talent, contact, chat |
| Subscription | employer, plan, Stripe ids, status, renews_at | Billing |
| Message | thread, sender, body, sent_at | Messages (tier-gated) |
| ChatSession, HandoffRequest, UnansweredQuestion | see chat spec | Chat |

**Upload parsing is simulated in the prototype.** `src/upload.js` waits 1.5s and fills the review screen from
sample data. Production needs a real parser for résumés and job descriptions (PDF/DOCX), always followed by the
user-review screen. Auto-recognising skills from a résumé is V2.

**Legacy data:** 8,000+ applications on the old Azure platform. Migrate what maps, leave new fields blank;
a recapture email asks people to complete their profiles. Field map is an open item (§7).

---

## 6. Integrations and admin

**Stripe.** Stripe currently gets its data from the old site (Kaitlin flagged this). Scope how subscriptions,
customers and webhooks move to the new platform before billing is built; no new prices are needed beyond §4.

**Admin portal V1** (design in progress at `admin/` — don't build ahead of sign-off). Kaitlin's direction from the admin SOW:
- **Highest priority:** direct-hire candidate presentation and search management (add clients and candidates by
  hand, present candidates, move stages) — `direct-hire-flow.html` shows the client side of each step.
- Employers who signed up but haven't subscribed.
- Admin adds skill tags for candidates without a profile (auto-tagging later).
- **Not in V1:** list builders, a skill-approval queue, Marketplace, courtesy accounts. Featured placement only if cheap.

---

## 7. Open decisions

| # | Decision | Blocks | Who |
|---|---|---|---|
| 1 | 90-day replacement guarantee: keep it on pricing and home? | pricing, index | Kaitlin |
| 2 | Featured Jobseeker: price and what it includes | pricing, settings | Kaitlin |
| 3 | Job alerts: built from saved searches (no save-search exists yet) or from the profile? | settings, jobs | Kaitlin |
| 4 | Where the one-line summary under each applicant comes from | applicants | Kaitlin |
| 5 | Job source of truth: SmartSearch sync, admin-posted jobs, or both | jobs API, admin | Uraiz + Kaitlin |
| 6 | Stripe migration (§6) and legacy field map | billing, migration | Uraiz |
| 7 | Hosting owner, staging environment for testing, CI | testing window | Uraiz + Carrington |
| 8 | Booking: one MS Bookings link today; confirm email-to-book for everything else, and the inbox address | book, chat hand-off | Kaitlin |
| 9 | Real photography and hero video (all current images are placeholders, `img/CREDITS.md`) | launch | Kaitlin |
| 10 | Privacy policy and terms legal review | launch | Carrington |
| 11 | Chat open questions | chat | `docs/chatbot-spec.md` §9 |

Small copy leftovers in the prototype (fix in PROD, don't copy): `src/jobs.js` still says "yard" / "lorry" in three
roles; `src/state.js` notice "Request sent to Kaitlin" should name the team.

---

## 8. Prototype scaffolding — don't port

- `src/state.js` demo memory and "Reset the demo"; `ES.download` (invoices download as .txt).
- `src/upload.js` simulated parsing (§5).
- Review mode: `src/revised.js`, every `REVISED(...)` call, `?review=1`.
- Test-login routing in `signin.html` (`esSignIn`).
- URL switches: `?as=employer`, `?listing=board`, `?type=direct`, `?id=`, `?state=expired`, `?chatdemo=`,
  `?chattweaks=` (chat design drawer, `src/chat-tweaks.js`), `?chat=open`.
- `start.html` (prototype menu) and `chatbot.html` (chat spec page).
- `noindex` on every page + `robots.txt` `Disallow: /` — **production must remove both at launch**.
- Repo tooling stays here: `scripts/check.mjs` + `.github/workflows/checks.yml` (link, script, copy-rule checks
  on every PR), the PR template and `CHANGELOG.md`.
