# Admin portal — parked for phase 2

Things Kaitlin has asked for that are **deliberately not in the current build**.

This file exists so nothing gets quietly lost between now and the next phase, and
so nobody builds one of these by accident. If an item below shows up in a PR, that
PR is out of scope — check before merging it.

The current build is scoped to what the portal needs to run the business on day
one. Everything here is real and wanted; it is a question of sequence, not of
whether.

**Scope only.** No dates, no estimates, no commercial terms in this file.

Source: admin portal check-in with Kaitlin, 9 November 2026, plus her Figma notes of 11 November.
Last reviewed: 12 November 2026.

---

## 1. Full ATS-style job description editing

Editing an employer's job description inside the admin portal the way an applicant
tracking system would — structured fields, formatting, version history — rather
than the approve / edit-before-publish / send-back-with-a-reason flow that exists
today.

**Her words:** ideal now, acceptable as phase 2 if needed.

**Why parked:** the current approval queue already covers the day-one need. She can
approve, edit before publishing, or send it back with a reason, and the employer is
told when we change their description. A full editor is a bigger surface than that
flow needs.

---

## 2. Adding a candidate from a job seeker profile

Today a candidate is added to a search from a resume upload. The second route —
pulling someone in directly from their existing job seeker profile, with a toggle
between the two — is not built.

**Her words:** the profile toggle can be phase 2.

**Why parked:** the resume route covers how she works now. She currently moves data
across from the EquiStaff site into SmartSearch by hand, so the profile route is an
improvement on a workflow that is already changing.

---

## 3. Candidate workflow stages

A proper pipeline on each candidate in a search:

```
applied → phone screened → references done → ready to submit → submitted
```

**Her words:** for a future ATS.

**Why parked:** the shortlist, feedback, credits and fee-protection flow is approved
and covers the current process. Stages touch every candidate surface in the portal
and are the natural spine of a later ATS phase rather than a bolt-on now.

**Related:** the per-search submittal summary *is* in the current build. Stages are
the part that is not.

---

## 4. Admin permissions and roles

Limited access for team members — an intern and a contract recruiter — so they can
work in the portal without full edit rights.

**Her words:** scope into the end-of-project phase.

**Why parked:** she is the only admin today. The people this is for do not start
until early next year, and the shape of the permissions depends on what they
actually end up doing.

---

## 5. Audit trail

A record against each change of who made it — "Kaitlin made this change" — so that
when more than one person is in the portal it is clear who did what.

**Her words:** needed when multiple admins exist.

**Why parked:** it has no meaning with a single admin. It is the companion to
item 4 and should land with it, not before.

**Note:** this is the reason the package tag must stay Stripe-driven rather than a
manual toggle, which the current design already does.

---

## 6. Coupon group targeting

Issuing a coupon to a defined group rather than named employers — for example,
every employer in Florida.

**Her words:** useful later when the user base grows.

**Why parked:** the coupon builder in the current build already handles code,
internal name, discount, which plans it applies to, who can use it, start and end
dates, and a usage cap. Group targeting only earns its keep once there are enough
employers for a group to be a meaningful unit.

---

## 7. Candidate self-registration by email or SMS

Sending a candidate a link that invites them to register themselves, instead of
Kaitlin entering their details by hand.

**Her words:** a goal, not immediate.

**Why parked:** it depends on the candidate-facing account flow and on how
candidates arrive, both of which are still settling. Named as a direction to aim
at rather than something to build now.

---

## 8. Interview tracking

A view of who is moving to interview and when — today, tomorrow, the day after —
so the week ahead is visible at a glance rather than reconstructed from each search.

**Her words:** future design feature. (Figma, 11 November, pinned to the dashboard
header.)

**Why parked:** she named it as future herself. It also leans on the candidate
workflow stages in item 3 — there is no "moving to interview" state to count until
those exist, so this lands with them rather than before.

---

## 9. Direct-hire jobs, full version

The current build has a rough version on each direct-hire search: post to the job
board, edit the description, days live / views / applicants, and an applicant list
where each person can be added to the shortlist or rejected with a reason. What is
**not** built is the fuller version: a separate recruiter login, applicant stages and
history, and reporting across all direct-hire jobs.

**Her words:** manage Direct Hire jobs through the admin portal; whether through the
main portal or a recruiter login "is open to ease of engineering".

**Why parked:** the rough version covers the day-one need, and the fuller version
leans on candidate stages (item 3) and roles (item 4).

---

## 10. Smaller asks from the 9–11 November Figma notes

Each is real and wanted; none blocks launch.

- **Lead package upgrade through Stripe**: show a lead's current package and let the
  admin trigger an upgrade that runs through Stripe (never a hand-set tag; see item 5).
- **Post a job description for a lead on the $500 package**: most of these leads will
  upgrade to it, so the admin writes and posts the job for them.
- **Jobs filters**: by date posted, type and role.
- **"Please review our changes" email**: when a job goes back and forth with the
  client, an email template asking them to review.
- **Replace-résumé hint** on the candidate page, so it is obvious where to do it.

---

## Not yet placed — open questions from 11 November

Kaitlin left these on the Admin V1 frame. They are questions, not parked scope, and
they need an answer before they can be sized. Recorded here so they do not get lost
between the Figma thread and the next call.

- **Direct Hire jobs managed through the admin portal** — posting and managing the
  job description to the EquiStaff job board, viewing and rejecting applicants, job
  stats. She says this was discussed on Monday's call and is reiterating it, and is
  relaxed about whether it lives in the main portal or a separate recruiter login.
  **Update 12 Nov:** a rough version is now in the build (see item 9); the full
  version is parked.
- **Skill tags** — is the list finite or will it grow to every tag? Are they
  recruiter tags or seeker-provided? *(The current design already shows both, split
  into "From her profile" and "Added by the recruiting team", so part of this is
  answerable now; who governs the master list is not.)*
- **Tagging a candidate against specific Direct Hire jobs or job titles**, and who
  controls that tag list.
- **Leads** — should the grid capture which product a lead is interested in (Direct
  Hire / Advertising / Job Board) as well as what they have bought?
- **Recruiting team notes on a lead** — where do they save to? A data question for
  engineering rather than a design one.
- **A 1:1 sample site covering both the front end and the admin portal**, to walk
  before final approval. The AWS staging server is the answer to this; worth telling
  her so explicitly.

---

## Not parked — in the current build

Listed here because they came up in the same conversation and it is worth being
able to say plainly that they are covered.

Already built and checked against the code:

- **Replace resume** button, showing the current filename so nothing gets
  re-uploaded by mistake
- Jobs approval queue: approve and publish, edit before publishing, or send back
  with a reason
- Coupon builder: code, internal name, discount, plan applicability, eligibility,
  dates, usage cap
- Photo and video queue: approve, or reject with a reason that is emailed
- Package status is Stripe-driven, not a manual toggle — the only manual switch is
  "Featured employer", which is correct
- Navigation and the four dashboard metrics, as she confirmed them

In scope for the current build, in progress:

- Package status shown inline on Leads across all four states
- Per-search candidate submittal summary, client-facing, with save-draft
- A candidate summary on the job seeker page that only Kaitlin writes (never automatic). Each search starts from it and she tailors it per client; the dashboard shows who is waiting on one
- Direct-hire job posting on each search (rough version, item 9)
- Job seekers has one view (cards); the table version was dropped on 12 Nov
- The employer is notified when we edit their job description
