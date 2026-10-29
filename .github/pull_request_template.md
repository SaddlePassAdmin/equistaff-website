## What changed (plain English)
<!-- Bullets a non-engineer can read. Lead with what someone will SEE. -->
-

## Why
<!-- Link the source: a Figma comment, Kaitlin's feedback doc, the audit, a Slack thread. -->
-

## How it was checked
- [ ] `node scripts/check.mjs` passes (also runs automatically on this PR)
- [ ] Clicked through the changed screens at desktop **and** phone width (390px)
- [ ] Desktop layout unchanged where it wasn't meant to change
- [ ] No notes, tags or "prototype" text visible on product screens (only in `?review=1`)
- [ ] Each changed page has a `REVISED('<date>', [...])` note (review mode only), and the round's change notes are posted to Slack

## Screenshots
<!-- Before / after for anything visual. -->

## Merge
Squash-merge once Carrington approves. Add a line to CHANGELOG.md in the same PR.
