# Changelog

Every change to the prototype, newest first. One line per merged pull request;
the PR holds the full notes, screenshots and how it was checked. Kaitlin sees
the same changes on each screen through its "Revised" pill.

Preview: https://saddlepassadmin.github.io/equistaff-website/

## Unreleased

- Branch rule from 9 Nov: admin portal design gets its own branch, `admin-2026-11-09`; new admin screens land there and come across to main only when Carrington says so. Noted in HANDOFF.md §0, §1 and §6 so Uraiz sees it.
- Branch rule from 6 Nov: `main` is the engineer's baseline and is frozen for site design; further design work goes on `design-2026-11-06` and comes across only when Carrington says so. Recorded at the top of HANDOFF.md so Uraiz sees it before anything else. The site pauses here while the admin screens are designed.
- Kaitlin's review now has a living record at `docs/kaitlin-review.md`: every note she left, grouped by screen, with a status against each (approved / shipped / waiting on her / open). The changelog stays the log of what shipped; that file is the backlog. It is refreshed twice a day from the Figma comments so the two never drift.
- Kaitlin's V2 notes, first batch (no decision needed): the featured job-board month rounds from $69.99 to $70 everywhere it appears; "Days off" is "Days off per week" on job posts and job detail; and Request a call now offers her three call levels rather than one length for everyone — an hour if you're hiring, 45 minutes if you're looking, 15 for a general question, each labelled on the card before you pick.
- Kaitlin's V2 review round logged (3 Nov, 60 comment threads on Figma Dev Ready: 49 from Kaitlin, 10 from Brittany). Triaged and mapped to the exact screen each pin sits on. 9 screens carry a clean approval and are badged DEV READY in Figma; 7 more have an approval alongside an open request; 16 have open requests only; 28 drew no comment either way. Also restored A2, A3 and A4 (the two alternate landings and the prototype menu), which had been lost from the Figma page during a layout rebuild — all 60 screens are present again.
- HANDOFF.md: admin row points at the admin design prototype (`admin/`, #55), still design in progress.
- Admin V1 design prototype at admin/ (light theme, 27 screens, fake data). Clickable: buttons route to the other admin screens and to the matching EquiStaff pages. Not linked from start.html until Kaitlin's Friday review.
- HANDOFF.md: V1 build notes from Kaitlin's review (what not to build yet, plain-text interview availability, state filter, sign-up and settings changes, admin review Friday); four open decisions resolved.
- Figma Dev Ready rebuilt from the live build (2 Nov): 60 screens in nine journey sections A–I, each opening with its own PRD, each screen captioned with its filename, revision date and latest change. Includes Evie's twelve live widget states (`?chatdemo=`) and both sides of the confidentiality rule (B2 managed vs B8 direct). Captures are 2x; pages taller than ~4,000px are split into labelled tiles because Figma will not render a single image above that. Three screens were missing and are now in: the employer inbox (`messages.html?as=employer`), a second shortlisted candidate (`candidate.html?id=`), and the seeker profile — which had been captured without an `?id` and was an empty shell.
- Engineering handoff rewritten for Uraiz (`HANDOFF.md`, `docs/chatbot-spec.md`): current screens, prices, rules, data, Stripe and admin direction, Kaitlin's decisions and open questions. Replaces the 29 Oct draft (#15).
- Advertising package reads $500 everywhere (home, Post a job, Evie's price card); pricing no longer says seekers can apply without an account.
- V3 leftovers from Kaitlin's doc: sign-up asks for a phone number (required); seekers are no longer asked for references (verify page, Evie's profile nudge); landing-b no longer promises four candidates; "farm" not "yard" in Evie's sample jobs.
- Brittany's notes: the footer horse moves to its own space under the brand column so nothing covers it; dropdowns get a chevron set 16px in from the edge (light and dark); the footer credit line wraps on phones instead of running off-screen.
- Final logo from Brittany (Figma, 30 Oct): "staff" set in Larken, upright, replacing the italic. Light and dark versions; every page picks it up automatically.
- Chat assistant, per Kaitlin's FigJam note ("no foothold in the true estate market"): the sample Estate Manager job is now a Show Manager role with an international show jumping team, and "Private estate" in the discipline list is now "Private Country Club" from her list.
- Pricing matches Kaitlin's list everywhere (landing, pricing, billing, chat, prototype menu): $50 / 1 month / 3 posts · $140 / 3 months / 3 posts · $460 / 1 year / 5 posts.
- Visas (Kaitlin's FigJam ask): every job post now shows "International applicants" with "EquiStaff can't sponsor visas"; Evie's answer about a specific job says the same. The chat no longer asks employers for a horse count (dropped 26 Oct).
- Find work by state (landing page): each open-roles count sits right next to its state name, so the number reads as part of the state instead of floating at the far edge of the column.
- QA fixes before the final round: the resume builder's employer fields work again (three functions had gone missing on 23 Oct); the resume preview no longer covers its Download and Email buttons; Download opens a real Save-as-PDF of the resume, and Email confirms; jobs Search filters the list; profile Save changes confirms; Upload a logo opens a file picker and previews it. The checker now flags any button that calls a function that doesn't exist.
- No notes in the product UI: the Revised pill, test-accounts box, chat prototype bar, "Kaitlin to confirm" and rule tags, and the placeholder-quotes line are gone from screens. Internal review mode via `?review=1`. Test logins work in the normal sign-in form and are shared in Slack.
- Sign-in and sign-up: a decorative glow was covering the forms and swallowing every click. Fixed, the two halves of sign-in now line up, a jump link at the top leads to the test accounts, and the checker flags any overlay that could block clicks again.
- Test accounts on the sign-in page (prototype only): job seeker, employer through Kaitlin, self-serve employer, plus Start fresh. Evie now always matches the portal you're in.
- Phone layout: Menu button in the public header, portal tabs inside the header, 20px side margins, 44px tap targets, 15px notes ([#14](https://github.com/SaddlePassAdmin/equistaff-website/pull/14))
- Pricing FAQ had no side margin on any screen size: a stray closing tag ended its container early. Fixed, and the checker now counts tags so it can't happen again ([#14](https://github.com/SaddlePassAdmin/equistaff-website/pull/14))
- Automatic site checks on every pull request, a PR template, this changelog, and the working notes in README.

## 2026-10-29

- Evie uses Kaitlin's words from her Figma comments ([#18](https://github.com/SaddlePassAdmin/equistaff-website/pull/18))
- Give the employer screens a commercial example ([#17](https://github.com/SaddlePassAdmin/equistaff-website/pull/17))
- A working chat on every page, with a Design drawer to play with it ([#16](https://github.com/SaddlePassAdmin/equistaff-website/pull/16))
- One share control, not five ([#13](https://github.com/SaddlePassAdmin/equistaff-website/pull/13))
- From the barn to the boardroom ([#12](https://github.com/SaddlePassAdmin/equistaff-website/pull/12))

## 2026-10-28

- Stop announcing the confidentiality rule ([#11](https://github.com/SaddlePassAdmin/equistaff-website/pull/11))
- Nav CTA gets its own space, and the chat launcher gets the horseshoe ([#10](https://github.com/SaddlePassAdmin/equistaff-website/pull/10))
- No light blue on light grounds — WCAG AA across all 35 pages ([#9](https://github.com/SaddlePassAdmin/equistaff-website/pull/9))

## 2026-10-27

- Clear the Apple login and the horse-count question ([#8](https://github.com/SaddlePassAdmin/equistaff-website/pull/8))
- Tier-gated messaging, a private employer note, and real faces ([#7](https://github.com/SaddlePassAdmin/equistaff-website/pull/7))
- Brittany's horseshoes replace the stars ([#6](https://github.com/SaddlePassAdmin/equistaff-website/pull/6))
- Brittany's hammers — and the CSS bug behind "floater text" ([#5](https://github.com/SaddlePassAdmin/equistaff-website/pull/5))

## 2026-10-23

- Kaitlin's feedback, applied — with a revision marker on every changed screen ([#4](https://github.com/SaddlePassAdmin/equistaff-website/pull/4))
- Brighten the portal again — lighter, bluer, three distinct steps ([#3](https://github.com/SaddlePassAdmin/equistaff-website/pull/3))

## 2026-10-22

- The prototype menu, rebuilt around the three journeys ([#2](https://github.com/SaddlePassAdmin/equistaff-website/pull/2))
