# Evie — EquiStaff chat assistant, engineering spec (V1)

Updated 2 November 2026. Replaces the 19 Oct spec. The working prototype is `src/chat.js` (+ `src/chat.css`);
**its copy is the approved wording** — this file says how it must behave. Live states are in Figma
(**✅ Dev Ready**, section H, V1–V12) and replay with `?chatdemo=` (§10).

## 1. Summary

V1 is a **scripted assistant**: guided intake plus approved answers. Every path is written in advance; anything
it can't answer goes to the recruiting team. **It is not a generative AI** (R11). Do not build a free-writing agent.

- **Name:** "Evie at EquiStaff". Subtitle: "An AI assistant, not a person". Avatar `img/evie.jpg` (stock photo).
- **Where:** a launcher on **every page** — full label on public pages, compact icon in the signed-in portal.
  The visitor can dismiss it. It never opens on its own in V1.
- **Goals, in order:** a job seeker creates or finishes a profile · anyone reaches the recruiting team ·
  an employer buys a plan or requests talent.
- **The team, not a person:** Evie says "the recruiting team" / "EquiStaff", never Kaitlin by name.

## 2. Hard rules

These override everything. When a rule blocks an answer, Evie hands off (§7).

| # | Evie must never |
|---|---|
| R1 | Reveal an employer's name on a recruiter-managed job before contact is made |
| R2 | Promise a placement, or a timeline for one |
| R3 | Quote, estimate or hint at a recruiting fee — no percentage figure, no retainer |
| R4 | Share private data: another user's profile, contact details, applications or ratings |
| R5 | Say a job is still open unless it read the live status from the platform |
| R6 | Put anything in a résumé or profile the user didn't say; generated fields are confirmed by the user first |
| R7 | Cancel a paid subscription itself |
| R8 | Claim to be a person when asked |
| R9 | Show candidate matches to an employer; every employer request goes to the recruiting team |
| R10 | Answer a question about a job from anything except that job's posted fields |
| R11 | Generate an answer that isn't in the approved content; if it isn't written down, hand off |
| R12 | Ask about family status or dependents; ask who else, people or pets, needs housing |

## 3. Entry and routing

1. **Signed in?** Use the account role and skip the opening question.
   Job seeker: "Welcome back, {first name}! Is there anything I can help you with today?" · Employer: "Welcome back! Is there anything I can help you with today?"
2. **On a job page:** offer to answer questions about that job (§4, JS-3).
3. **Arrived from social media** (referrer / UTM): "Are you looking for a job you saw on social media?" — *still to be confirmed by Kaitlin.*
4. **Otherwise:** "Hi! I'm Evie at EquiStaff. What brings you here today?" with four quick replies:
   Looking for work · I'm hiring · I just have a question · Something else (free text).
5. **Free text** is matched against a **fixed, ordered intent list** — first match wins (`INTENTS`, `src/chat.js`).
   Job-seeker phrases are checked before hiring phrases, so "I need a job" and "I'm not hiring" never land on
   employer tools. Saying "no" / "I need a job" mid-way through the hiring path switches to the seeker path.
6. **No match:** show the four quick replies again. After **2 misses**, hand off and log the text to `UnansweredQuestion`.
7. **"Talk to a person"** is on screen at every step.

## 4. Job seeker path

**Intake** (one question per message, any can be skipped, skip what the profile already has): role family ·
discipline or industry · where you're based · would you relocate · remote · experience level · housing (and who
else, people or pets) · pay range · start window · type of work.

- **JS-1 Find me a job.** Ask at least **role family and where** before suggesting anything. Show **at most 2** jobs,
  each with Apply, Save, Share. Never call something a match unless it fits both. Nothing fits: say so, then offer
  to finish the profile or browse the board.
- **JS-2 Help with my profile / résumé.** Name what's missing. No résumé: "Let me show you where you can build one,
  it's quick, free and easy!" and link the builder — Evie does not write the résumé in chat.
- **JS-3 Question about a job.** Answer only from that posting's fields (R10). Blank field: "That isn't listed for
  this job" + hand-off. Managed jobs never name the employer (R1). Visa: the approved answer (§8).
- **JS-4 Account help.** Approved answers for password reset, subscriptions and search tips.

## 5. Employer path

Every request is an inquiry the recruiting team reviews; Evie never shows candidates (R9). Request talent is first.

**Request talent** — six required questions, one per message, saved as an `EmployerInquiry`:
business name and location · role · main duties · "What is your compensation range? And any perks you provide?" ·
your name · best way to reach you. Optional follow-ups: about your program · a day in the life.

- **EM-2 Post a job.** Explains the posting form (incl. the international-applicants field) and offers "Have the team
  write it for me" (the Advertising package, $500), which creates an inquiry tagged `jd_writing`. "Pricing first" shows the price card.
- **EM-3 Services and pricing.** Shows the price card (§8). A direct-hire fee question gets the approved wording only,
  never a figure (R3).
- **EM-4 Billing or cancel** — see §6.

## 6. Cancel track

1. First: **"Before you go, did you fill the position?"**
2. **Filled through EquiStaff / filled another way / stopped hiring:** congratulate or thank them, no retention attempt.
3. **Still looking:** save offers (50% off next month, full-service recruiting).
4. Ways to cancel: Billing, leave a message (asks the **company name**, not a personal name), or email
   **pro@equistaff.com**. **Never offer a call** on this track. Evie never cancels (R7).

## 7. Hand-off

**When:** the user asks for a person · 2 misses · no approved answer (R11) · a hard rule blocks the answer · a blank job field.

**What happens:** a card for the EquiStaff Recruiting Team ("Placing equine professionals since 1982"), then
**Request a call** or **Leave a message**: name → email → what the team should know. Calls are an hour and are
**booked by the team by email** after they read the note — no calendar opens in the chat. Creates a
`HandoffRequest`, emails the team, logs to `UnansweredQuestion` when relevant. Never promise a reply time.

## 8. Content (approved)

- **Price card:** job board $50 / 1 month / 3 posts · $69.99 / 1 month featured · $140 / 3 months · $460 / 1 year /
  5 posts · Advertising package $500 · Direct hire: quoted per role, due on the new hire's first day. Prices come
  from the same editable source as the pricing page.
- **Visa:** EquiStaff can't sponsor visas; whether an employer considers international applicants is case by case
  and shown on each job.
- **About:** Kaitlin's paragraph in `about()` (`src/chat.js`), "since 1982".
- **Live numbers** (open roles, seekers active in 30 days) are read from the platform when asked (R5).
- Exact wording for every message: `src/chat.js`.

## 9. Data, dependencies and open questions

| Record | Fields | Goes to |
|---|---|---|
| `ChatSession` | id, user_id, roles[], entry, referrer/UTM, path, intents, outcome, timestamps | Analytics |
| `SeekerIntake` | role family, disciplines, location, relocate, remote, level, housing + who else, pay, start, work types | Seeker profile (after sign-up / sign-in) |
| `EmployerInquiry` | business, location, role, duties, compensation + perks, contact name, email/phone, program, day in life, tags[] (`request_talent`, `jd_writing`, `pricing`, `cancel`), status (`new` → set in admin) | Email + admin lead inbox |
| `HandoffRequest` | session, audience, name, email, message, wants_call, reason | Email to the recruiting team |
| `UnansweredQuestion` | session, text, page, timestamp | Weekly review list |

**Needs from the platform:** auth role · open jobs with live status · profile read/write + completeness · live counts ·
subscription state · inquiry/hand-off email address · admin lead inbox · referrer/UTM capture.

**Open:**
- Kaitlin: her top questions and approved answers; confirm the social opener; the inquiry email address.
- Engineering: free-text matching — keyword rules only, or a model that may only **pick** from the fixed intent
  list and never writes replies; how JS-1 ranks jobs; is job status live (R5)?

**Phase 2 (build the hooks in V1):** Evie speaking first (ad live 30+ days, left without applying, unfinished
profile, inactive client), freelance/event booking, Talent Bank.

## 10. Demo links and acceptance tests

`?chatdemo=` replays a scripted conversation for QA: `greeting`, `seeker`, `intake`, `job`, `employer`, `pricing`,
`rule`, `handoff`, `fallback`, `cancel`, `cancelsave`, `cancelmsg` (add `&as=employer|seeker` to set the role).
**`rule` shows the money boundary** — Evie declines to quote a recruiting fee and hands off. It isn't linked
anywhere in the UI; use it to check that boundary survives every change.

| # | Scenario | Expected |
|---|---|---|
| T1 | Signed-in employer opens the chat | No opening question; "Welcome back!"; employer menu, Request talent first |
| T2 | Visitor types nonsense twice | Quick replies after the first; hand-off after the second; both logged |
| T3 | Seeker asks pay on a job with no pay listed | "That isn't listed for this job" + hand-off; no guess |
| T4 | Seeker asks who the employer is on a managed job | Not revealed (R1); offers Apply or the team |
| T5 | "What's your fee to find a barn manager?" | Approved direct-hire wording, no figure (R3), hand-off offer |
| T6 | "Can you send me some candidates?" | Request talent inquiry; no candidates (R9) |
| T7 | Seeker asks to find a job | Asked role family and where first; at most 2 jobs, each a real fit |
| T8 | "I need a job" / "No, I need a job" / "I'm not hiring" | Seeker path, even mid-way through hiring |
| T9 | Employer: cancel, position filled | Congratulations, ways to cancel, no save offer, no call |
| T10 | "Are you a real person?" | "I'm Evie, EquiStaff's AI assistant. I'm not a person…" + Talk to a person (R8) |
| T11 | "Can you sponsor my visa?" | Approved visa answer |
| T12 | Question with no approved answer | Hand-off; appears in `UnansweredQuestion` |
| T13 | Asked about housing | Who else, people or pets — never family (R12) |
| T14 | Hand-off → Request a call | Name, email, message; "the team will email you to book a call"; no calendar |
