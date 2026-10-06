# Brand assets

| File | What it is | Use on |
|---|---|---|
| `logo-lockup.svg` | **Primary mark** — horse head with the hidden magnifier, plus the Equistaff wordmark. Brittany's "Hidden Message" evolution, chosen unanimously 28 Sept. | Light backgrounds |
| `logo-lockup-reversed.svg` | Same lockup, ink to white and brand blue lifted to `#BDE3FF` | Navy / Deep mode |
| `logo-icon.svg` | Mark only — same artwork, cropped viewBox. For favicons, avatars, app icons | Light backgrounds |
| `logo-icon-reversed.svg` | Mark only, reversed | Navy / Deep mode |
| `horses-blue.svg` | **Secondary mark** — three running horses in three blues (`#122443`, `#3478B3`, `#C4E2FC`). From the Ocala/Coastal evolution | Light backgrounds — sign-in |
| `horses-blue-ondark.svg` | Same, darkest horse lifted to `#2E6FA8` so all three read on navy | Footers |
| `logo.svg` | The **current** live-site logo, pulled for reference. Not in use | — |
| `default.svg` | The template placeholder still shipping on the live site, pink `#EF305E`. Kept as audit evidence. Not in use | — |

## ⚠️ Blue mismatch to resolve

The logo artwork uses **`#3478B3`**. The design system's action blue is
**`#007AB8`** — the colour taken from the existing EquiStaff logo and approved
on the 28 September call.

They are close enough to look like a mistake rather than a choice. One of them
needs to move before launch. Either:

- repoint `--blue-600` to `#3478B3` and let the logo set the brand blue, or
- have Brittany re-export the mark at `#007AB8`.

The second is probably right, since `#007AB8` is what was approved and what the
contrast ratios in `tokens.css` were measured against.

## Wordmark weight — A / B

Two lockups, same horse-and-magnifier mark, different wordmark:

| File | Wordmark | Notes |
|---|---|---|
| `logo-lockup.svg` | Lighter serif — "Equistaff" | Brittany's original pairing. More editorial, but the thin strokes start to disappear at header size. |
| `logo-lockup-thick.svg` | **Blocky "EQUI" + italic serif "staff"** | **Currently in use.** Holds up much better at 34px and below. Composed here: her mark plus the heavier wordmark from the same board. |

Each has a `-reversed` variant for Deep mode.

Compare them side by side at `/assets/compare.html`, including at real header
size and reversed on navy.

**To switch back:** find-and-replace `logo-lockup-thick` → `logo-lockup`
across the HTML, and bump the header heights in `styles.css` back up ~4px
(the thick lockup is 777×148, the lighter one 722×148).
