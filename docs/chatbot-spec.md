# EquiStaff chat assistant — engineering spec (V1)

Written 19 Oct 2026, copied into the repo 29 Oct 2026 so engineering has one home for it.
The working prototype is the chat launcher on every page (`src/chat.js`), with deep links listed on
[`chatbot.html`](../chatbot.html). This file is the specification; the prototype is what it looks like.

## Summary

V1 is a **scripted assistant**: an interactive FAQ plus guided intake, where every path is written in
advance and anything it can't answer goes to "book a call with Kaitlin." **It is not a self-learning or
generative AI** — see R11. Do not build it as a free-generating agent.

**Three goals, in priority order:** get a job seeker to create or finish a profile, get anyone to book a
call with Kaitlin, and get an employer to buy a subscription.

**In scope for V1**

- Working out who the visitor is (job seeker, employer, question, something else) and routing them
- Job seeker intake, 1–2 matching jobs, profile completion and a basic resume builder
- Employer inquiry (Request Talent), job-post help, pricing answers and cancel-save offers
- FAQ answers, live site numbers and hand-off to Kaitlin's calendar

**Out of scope for V1:** the bot speaking first (proactive triggers), judging candidate fit, showing
candidates to employers, the freelance-groom booking module and the resume review offer. See Phase 2.

**Rollout:** launch with a focused question set, log every question the bot couldn't answer, and add
answers from that log.

## Hard rules

These apply on every path and override any other logic. When a rule blocks an answer, the bot hands off
to Kaitlin (see Fallback).

| # | The bot must never |
| --- | --- |
| R1 | Reveal an employer's name on a recruiter-managed job before contact is made |
| R2 | Promise a placement, or a timeline for one |
| R3 | Invent or estimate a recruiting fee; the direct-hire percentage always goes to Kaitlin |
| R4 | Share private data: another user's profile, contact details, applications or ratings |
| R5 | Say a job is still open unless it read the live status from the platform |
| R6 | Put anything in a resume or profile the user didn't say; every generated field is confirmed by the user first |
| R7 | Cancel a paid subscription itself; it explains how and offers a person |
| R8 | Claim to be a person when asked |
| R9 | Show candidate matches to an employer; every employer request goes to Kaitlin |
| R10 | Answer a question about a job from anything except that job's posted fields |
| R11 | Generate an answer that isn't in the approved content; if it isn't written down, hand off |
| R12 | Ask about family status or dependents; ask about housing needs instead |

R12 avoids hiring-discrimination risk: the bot asks who else, people or pets, will need housing.

## Entry and routing

The bot's first job is to put the visitor on one of four paths, asking only when it can't tell. Every
path ends in a goal (profile, call or subscription) or a hand-off.

1. **Launcher.** A chat button on every public page and in the portal. The bot never opens on its own in V1.
2. **Signed in?** Read the role from the account (`job_seeker`, `employer`). Skip the question, greet
   them by first name and go straight to that path's "What do you need?" step.
3. **Came from social media?** If the visit has a social referrer or UTM source, open with: "Are you
   looking for a job you saw on social media?" Yes: ask for the job title or link, find the posting, then
   go to JS-3 or Apply. No: go to step 4. *Proposed by Kaitlin on Oct 15; not yet confirmed.*
4. **Otherwise ask.** "Hi! Welcome to EquiStaff. What brings you here today?" with four quick replies:
   **I'm looking for work** → Job seeker · **I'm hiring** → Employer · **I just have a question** →
   Questions · **Something else** → free text.
5. **Free text.** Match the message to the fixed intent list. A confident match goes straight to that
   intent. No confident match: show the four quick replies again. After **2 failed attempts**, hand off.
6. **Both roles.** A person can be hiring and job hunting. Store `roles[]` on the session and let them
   switch paths at any time with a "Switch" quick reply or a phrase like "actually, I'm hiring."
7. **Always available.** A "Talk to a person" quick reply sits on every step (see Fallback).

Signed-in and social visitors skip the opening question; anyone the bot can't place after two tries goes
to Kaitlin.

## Job seeker path

The bot asks a few routing questions, one per message, then offers four things it can do. Answers save to
the seeker's profile once they sign up or sign in.

**Intake.** Every question can be skipped. Skip questions already answered on the profile.

| ID | Question | Input | Values |
| --- | --- | --- | --- |
| JS-Q1 | What kind of job are you after? | Searchable picker, multi-select | Roles list (Content) |
| JS-Q2 | Which discipline or industry? | Searchable picker, multi-select | Disciplines list (Content) |
| JS-Q3 | Where are you based? Would you relocate? Do you want remote work? | City/state + 2 quick replies | Relocate: yes / no / maybe. Remote: yes / no / open to either |
| JS-Q4 | What's your experience level? | Quick replies | Beginner, Intermediate, Advanced, FEI / World-Class (self-defined) |
| JS-Q5 | Do you need housing? Will anyone else, people or pets, need housing too? | Quick replies + optional text | Yes / no |
| JS-Q6 | What pay range are you looking for? | Range | Hourly or yearly |
| JS-Q7 | When could you start? Do you need to give notice? | Date or quick replies | Now / within 2 weeks / within a month / later |
| JS-Q8 | What kind of work? | Quick replies, multi-select | Full-time, part-time, seasonal, freelance or event, contract or remote |

Background, goals, preferred job size and intensity, and required benefits are left for Kaitlin's call in V1.

**What do you need?**

- **JS-1 Find me a job.** Query open jobs filtered by JS-Q1 to JS-Q8 and show **at most 2**, each with
  Apply, Save and Share with a friend. No match: say so, then offer to finish their profile so Kaitlin can
  find them, or to browse the job board. Never show a shortlist.
- **JS-2 Help with my profile.** Check profile completeness, then ask for the missing fields one at a time
  and save each answer only after the user confirms it. No resume: ask about their last 2–3 jobs
  (employer, title, dates, main duties) and build a basic resume. The user reviews it before it's saved (R6).
- **JS-3 Question about a job.** Answer pay, horse count, days off, housing, location, day-in-the-life and
  international applicants **only from that posting's fields** (R10). A blank field: "That isn't listed for
  this job," then offer a hand-off. Never name a recruiter-managed employer (R1). Visa questions use the
  approved visa answer.
- **JS-4 Account help.** Approved answers for password reset, subscription sign-up, cancelling and search
  tips. Cancelling hands off; the bot never cancels (R7).

## Employer path

Every employer request is an inquiry Kaitlin reviews herself; the bot collects it and books the call, and
never shows candidates (R9). Request Talent is always the first option; posting a job is second.

**Intake.** One question per message. The answers become an `EmployerInquiry`.

| ID | Question | Required |
| --- | --- | --- |
| EM-Q1 | Barn or business name, and where are you? | Yes |
| EM-Q2 | What role are you filling? (Roles list picker) | Yes |
| EM-Q3 | What are the main duties? | Yes |
| EM-Q4 | What pay and housing come with it? | Yes |
| EM-Q5 | Your name and the best way to reach you (email, phone) | Yes |
| EM-Q6 | Tell us about your program: discipline or industry, number of staff | Optional |
| EM-Q7 | What does a day in the life look like in this role? | Optional |
| EM-Q8 | What are the key qualities you want in this person? | Optional |

*EM-Q6 no longer asks for a horse count (Kaitlin, 26 Oct): it reads as a barn-only question and puts off corporate clients.*

**What do you need?**

- **EM-1 Request talent (shown first).** Save the inquiry with status `new`, email Kaitlin, then show her
  **employer** booking link. Kaitlin decides by hand whether it becomes full-service recruiting or a
  job-board post. The bot does not make that call.
- **EM-2 Post a job (second option).** Check the draft posting against the required fields (Content), ask
  for anything missing, and offer a fuller version for the employer to approve. Then offer: "Want Kaitlin
  to write it for you?" A yes creates an inquiry tagged `jd_writing`. The posting form gets a new field:
  **Open to international applicants / visa sponsorship** (yes / no / case by case).
- **EM-3 Services and pricing.** Answer from the approved price list. Direct-hire questions get the
  approved wording only, never a percentage or estimate (R3); then offer Kaitlin's calendar.
- **EM-4 Billing or cancel.** Explain how billing works. Before anyone cancels, offer the save options:
  50% off next month, an intro call with Kaitlin, or full-service recruiting. The bot never cancels (R7).
  If they still want to cancel, link them to the account page or a person.

## Questions path

The bot answers from the approved answer list, then nudges: "Are you hiring or looking for work?" No
approved answer → hand off (R11).

**Answer topics**

- About EquiStaff: in business since 1982, how the recruiting process works, service levels
- Pricing (Content)
- Live numbers, read from the platform when asked: open jobs right now, and job seekers active in the last 30 days
- Account trouble: same answers as JS-4
- Visas and international applicants: the approved visa answer (Content)

**Questions people ask today.** Every answer must be written and approved by Kaitlin before it goes live.

| Asked by | Question | Answer source |
| --- | --- | --- |
| Job seeker | How much does it pay? / Is housing included? / How many horses? / Days off? / Day in the life? | The job's posted fields (JS-3) |
| Job seeker | I don't have a resume. Can I still apply? | Approved answer + resume builder (JS-2) |
| Job seeker | Is this job still open? | Live status only (R5) |
| Job seeker | How do I reset my password? / Do I have to pay? | Approved answer |
| Job seeker | Can you get me a visa? | Approved visa answer |
| Employer | What does it cost to post a job? / Difference between service levels? | Price list |
| Employer | How many job seekers are on here? | Live number |
| Employer | Can you just find someone for me? | EM-1 Request talent |
| Employer | Why isn't my ad working? | EM-2 completeness check, then EM-1 |
| Employer | How do I cancel? | EM-4 |
| Employer | How long does a placement take? / What if the hire doesn't work out? / Fee for a senior placement? | Hand off (R2, R3) until Kaitlin writes an approved answer |
| Anyone | Why was I rejected? | Hand off |

## Fallback and hand-off

When the bot isn't certain, it hands off to Kaitlin. A slow human beats a confident wrong answer.

**Hand off when:** the user asks for a person · free text has no match after 2 attempts · no approved
answer exists (R11) · a hard rule blocks the answer (R1, R2, R3, R7) · a job field the seeker asks about is blank.

**What the hand-off does:**

1. Shows Kaitlin's booking link for the right audience: the **job seeker** or the **employer** calendar.
   Role unknown → ask "Are you hiring or looking for work?" first.
2. Offers to leave a message instead: name, email, question. That creates a `HandoffRequest` and emails Kaitlin.
3. Logs the question to `UnansweredQuestion` so new answers can be written from it.

The bot never says when Kaitlin will reply until she gives a response-time promise.

## Data captured

Five records. Field names are suggestions; map to the platform schema where a field already exists.

| Record | Fields | Written when | Goes to |
| --- | --- | --- | --- |
| `ChatSession` | id, user_id (if signed in), roles[], entry (`launcher`, `social`), referrer / UTM, path, intents used, outcome (`profile`, `call_booked`, `subscription`, `handoff`, `abandoned`), timestamps | Every conversation | Analytics |
| `SeekerIntake` | roles[], disciplines[], location, relocate, remote, skill_level, housing_needed, housing_for_others, pay_min, pay_max, pay_unit, start_window, work_types[] | Job seeker path | Seeker's profile (held on the session until sign-up / sign-in) |
| `EmployerInquiry` | business_name, location, role, duties, pay, housing, contact_name, email, phone, program (discipline, staff_count), day_in_life, key_attributes, tags[] (`request_talent`, `jd_writing`, `pricing`, `cancel_save`), status (`new`, `full_service`, `job_board`, `closed`) | EM-1, EM-2 "Kaitlin writes it", EM-4 save offers | Email to Kaitlin + admin lead inbox |
| `HandoffRequest` | session_id, audience (`seeker`, `employer`, `unknown`), name, email, question, reason (rule or trigger) | Every hand-off | Email to Kaitlin |
| `UnansweredQuestion` | session_id, text, path, timestamp | No match or no approved answer | Weekly review list |

Generated resume text and profile fields are saved only after the user confirms them (R6). Status changes
on `EmployerInquiry` are Kaitlin's to make in the admin portal; the bot only creates `new` records.

## Content

Store all of this as editable content (CMS table or config), not hard-coded, so Kaitlin can change prices
and lists without a deploy.

**Prices** — canonical values live in [`src/pricing.js`](../src/pricing.js) once that lands; until then:

| Plan | Length | Job posts | Searches | Price (USD) |
| --- | --- | --- | --- | --- |
| Job board | 1 month | 3 | Unlimited | $50 |
| Job board | 3 months | 3 | Unlimited | $140 |
| Job board | 1 year | 5 | Unlimited | $460 |
| Direct hire | Per search | — | — | A percentage of first-year salary: $1,000 up front to start the search, the rest due on the chosen candidate's first day |

The bot quotes the direct-hire wording exactly and **never states or estimates the percentage** (R3). A
middle tier (job description writing plus advertising) is not priced yet.

**Experience levels (self-defined):** Beginner, Intermediate, Advanced, FEI / World-Class. The bot never
rates anyone.

**Visa answer** (draft, needs Kaitlin's approval): "EquiStaff can't sponsor visas. Whether an employer will
consider international applicants is up to each employer, and it's shown on the job post when they've told
us." When the job's international field is set, the bot adds that job's answer.

**Complete job posting fields** (proposed): title, location, pay, housing, program and discipline, number
of horses, number of staff, schedule and days off, main duties, a day in the life, key qualities wanted,
start date, open to international applicants.

**Roles** (starter list): stall cleaner, groom, hotwalker, barn manager, flat rider, exercise rider, pony
rider, outrider, assistant trainer, trainer, night watch, foreman, general manager, property manager,
maintenance manager, bloodstock agent, breeding manager, loper, assistant manager, instructor, equestrian
director, adjunct professor, vet assistant, vet technician, surgical technician, veterinarian, admin
assistant, practice manager, customer service representative, inside sales, outside sales, account
manager, business development manager, show secretary, in-gate announcer, scribe, technical delegate,
judge, course designer, sponsorship coordinator, operations director, farrier, farrier's apprentice,
chiropractor, massage therapist, rehab specialist, PATH instructor, EGALA instructor, volunteer
coordinator, office manager, office admin.

**Disciplines and industries:** 3-Day Eventing, Accounting/Finance, Adaptive Riding Instruction, Arabian
Horse Breed Shows, Aviation, Barrel Racing, Breaking/Colt Starting, Breeding, Building & Fencing, Carriage
Driving, Cattle Ranching, Competitive Trail Riding, Cutting, Dressage, Education, Equestrian Governing
Bodies, Equestrian Resorts / Tourism, Equine Assisted Therapy, Equine Bodyworking, Equine Chiropractic,
Equine Entertainment, Equine Law, Equitation, Farm Maintenance, Farrier/Blacksmith, Feed & Nutrition
Sales, Foxhunting, General Horse Care, Gymkhana, Hunter, Huntseat, Insurance, IT/Technology, Lesson
Facility, Liberty, Manufacturing, Marketing (Digital), Marketing (Print), Natural Horsemanship, Office /
Admin Staff, Paint Horse Breed Shows, Pharmaceutical Sales, Polo, Private Country Club, Quarter Horse
Breed Shows, Quarter Horse Racing, R+ Training, Race Track Management, Ranch Sorting, Reining,
Retail/Service Sales, Saddle Fitting, Saddlebred Breed Shows, Saddleseat, Show Facility Management, Show
Jumping, Sponsorship Sales, Sports Medicine Rehabilitation, Standardbred Racing, Summer Camps, Team
Roping, Tennessee Walker, Thoroughbred Industry, Transportation, Vaulting, Veterinarian, Veterinary
Medicine Sales, Veterinary Technician, Welsh Breed Shows, Western Dressage, Western Hunt Seat, Western
Pleasure, Working Ranch / Stock Horse, Wrangling/Dude Ranching.

Both lists are long, so the bot shows them as searchable pickers, never as free-text questions.

## Phase 2 (not in V1)

Build the event hooks in V1 so these drop in later.

| Feature | Trigger | What the bot does |
| --- | --- | --- |
| Ad not working | A job post live 30+ days | Offers to improve the posting, then Request Talent |
| Left without applying | A seeker viewed a job for a while and left | Asks them to share it or refer someone |
| Unfinished profile or posting | Below the completeness bar | Nudges them to finish it |
| Inactive client | Employer goes inactive or ends subscription | Shows the EM-4 save offers |
| Freelance and event work | — | A booking module for freelance grooms and event hiring |
| Talent bank | — | Paid employer access to Kaitlin's screened, rated candidates |

## Dependencies

| Need | Used by |
| --- | --- |
| Auth: signed in, and as which role | Entry step 2 |
| Open jobs, with filters and live status | JS-1, JS-3, R5 |
| Profile read and write, completeness score | JS-2, Phase 2 nudges |
| Live counts: open jobs, seekers active in the last 30 days | Questions path (stats endpoint) |
| Subscription and billing state | JS-4, EM-4 |
| Kaitlin's two booking links (seeker, employer) | Hand-off, EM-1, EM-3 |
| Email destination for inquiries and hand-offs | EmployerInquiry, HandoffRequest |
| Admin lead inbox | EmployerInquiry |
| New posting field: open to international applicants | EM-2, visa answer |
| Social referrer / UTM capture | Entry step 3 |

## Open questions

**For Kaitlin**

- [ ] Her top 10 questions and approved answers
- [ ] Any other questions the bot must never touch
- [ ] Approve the visa answer wording
- [ ] Her two booking links, job seeker and employer
- [ ] Which email address gets inquiries and hand-offs, and is there a reply time we can promise?
- [ ] Should the bot ask about required benefits, or leave deeper candidate questions for her call?
- [ ] Confirm the social media opener, and how a visitor points to the job they saw
- [ ] Approve the complete job posting fields
- [ ] Bot name and voice
- [ ] Middle pricing tier: what it includes and costs

**For engineering**

- [ ] How free text is matched to intents: keyword rules only, or a language model that may only pick
      from the fixed intent list and never writes answers
- [ ] How JS-1 ranks the 1–2 jobs it shows
- [ ] Does the platform know whether a job is still open in real time? (R5)

## Acceptance tests

V1 is done when every scenario behaves as written.

| # | Scenario | Expected |
| --- | --- | --- |
| T1 | A signed-in employer opens the chat | No opening question; greeted by name; employer menu with Request talent first |
| T2 | A visitor types "lol idk" twice | Four quick replies after the first; hand-off with both calendars after the second |
| T3 | A seeker asks the pay on a job with no pay listed | "That isn't listed for this job" + hand-off offer; no guess |
| T4 | A seeker asks who the employer is on a recruiter-managed job | Name not revealed (R1); offers to apply or talk to Kaitlin |
| T5 | An employer asks "what's your fee to find a barn manager?" | Direct-hire wording only, no percentage (R3), then the employer calendar |
| T6 | An employer asks "can you send me some candidates?" | EM-1 inquiry created and Kaitlin's link shown; no candidates (R9) |
| T7 | A seeker with no resume uses JS-2 | Asked about the last 2–3 jobs; resume shown for review; nothing saved until they confirm (R6) |
| T8 | A seeker uses JS-1 and 5 jobs match | Exactly 2 shown, each with Apply, Save, Share |
| T9 | An employer says "cancel my subscription" | Save offers shown; the bot does not cancel (R7) |
| T10 | Anyone asks "are you a real person?" | "I'm EquiStaff's assistant, not a person" + Talk to a person (R8) |
| T11 | Anyone asks "can you sponsor my visa?" | The approved visa answer, plus the job's own answer on a job page |
| T12 | A question with no approved answer | Hand-off, and the question appears in the UnansweredQuestion log |
| T13 | A visitor arrives from an Instagram link | Opens with the social media question (if confirmed) |
| T14 | A seeker switches with "actually, I'm hiring" | Moves to the employer path; both roles kept on the session |
| T15 | A seeker is asked about housing | Asked who else, people or pets, needs housing; never about family (R12) |
