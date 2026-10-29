# Changelog

Every change to the prototype, newest first. One line per merged pull request;
the PR holds the full notes, screenshots and how it was checked. Kaitlin sees
the same changes on each screen through its "Revised" pill.

Preview: https://saddlepassadmin.github.io/equistaff-website/

## Unreleased

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
