# Video

## What's here

| File | Length | Size | What it is |
|---|---|---|---|
| `hero.mp4` | 10s | ~2 MB | **In use.** A woman grooming a chestnut horse in a barn aisle. Warm, people-at-work — matches the approved brief. |
| `hero-alt.mp4` | 13s | ~2 MB | Alternate: slow tracking shot down a barn aisle. Calmer left third, so type sits more cleanly. Swap the `<source>` to use it. |

Both are **placeholder stock** from Pexels — see `../img/CREDITS.md`. They are
here to prove the hero works with motion, not to ship.

## How it's wired

`index.html` and `landing-c.html` both contain:

```html
<video autoplay muted loop playsinline poster="img/hero.jpg">
  <source src="media/hero.mp4" type="video/mp4">
</video>
```

`muted` + `playsinline` are what let it autoplay on iOS. The poster image
carries the first paint and shows if the video fails or the connection is slow.

To swap in the alternate, change the `src` to `media/hero-alt.mp4`.

## When EquiStaff shoot their own

Replace `hero.mp4` with the same filename and nothing else needs to change.

**Specs:** 1920×1080, H.264, no audio track, 8–15 seconds, under ~4 MB.

**Direction for the shoot:**
- Slow movement only — a horse being led down the aisle, hands tacking up,
  light through a doorway. No fast cuts, no whip pans.
- **Keep the left third of frame calm.** The headline and both buttons sit
  there. Busy detail behind type is the one thing that will wreck it.
- Golden hour or open shade. Avoid hard midday sun in the aisle.
- Shoot a few seconds longer than you need at each end so the loop can be
  trimmed to a clean cut.
- Faces away from camera unless the person has signed off on being used.
