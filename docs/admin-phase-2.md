# Admin portal — parked for phase 2

Things Kaitlin has asked for that are **deliberately not in the current build**.

This file exists so nothing gets quietly lost between now and the next phase, and
so nobody builds one of these by accident. If an item below shows up in a PR, that
PR is out of scope — check before merging it.

The current build is scoped to what the portal needs to run the business on day
one. Everything here is real and wanted; it is a question of sequence, not of
whether.

**Scope only.** No dates, no estimates, no commercial terms in this file.

Source: admin portal check-in with Kaitlin, 9 November 2026.
Last reviewed: 9 November 2026.

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
- The employer is notified when we edit their job description
