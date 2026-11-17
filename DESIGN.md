# Design system — makeread.me (letterpress / composing room)

Documented from the shipped build, not written ahead of it. Direction
contract: `.impeccable/direction-contract.md`.

## Identity

This is a composing room for READMEs, not a form with fields. The product's
real mechanism — independently swappable blocks, each a macro, rendered live
— maps onto movable type: interchangeable pieces, composed into a page,
proofed before it's pulled.

## Color

Mode-invariant raw tokens (`--paper`, `--ink`, `--press`) exist alongside the
usual light/dark semantic tokens (`--background`, `--foreground`, etc.).
A type-specimen surface — template cards, the generator's proof panel, the
hero specimen — is always `bg-paper`/`text-ink`, even in dark mode: it's
meant to read as a physical sheet against the surrounding chrome, not as
"the current theme's card color."

| Token | Light | Dark | Use |
|---|---|---|---|
| `--background` / `--foreground` | paper / ink | ink / paper | page chrome |
| `--primary` | press red | press red (lighter) | CTAs, active accents |
| `paper` / `ink` / `press` (fixed) | — | — | specimen surfaces, always |

Color strategy: **Committed** — one accent (press red) carries CTAs and
stamped labels; it is not scattered as decoration elsewhere.

## Type

- **Display** (`font-display`, Fraunces): all headlines, specimen titles.
  Never mixed with another display face.
- **Body** (`font-sans`, DM Sans): paragraph copy, descriptions.
- **Mono** (`font-mono`, IBM Plex Mono): anything code-, variable-, or
  data-shaped — field labels inside the proof panel, badges, kickers
  ("PROOF — minimal-readme"), the "how it works" eyebrow text.

## Motifs

- **Registration mark** (`.register-mark` in `globals.css`): a small ⌖
  crosshair, used at the corner of specimen panels and the CTA section.
  Code-drawn (two pseudo-element lines), not an image.
- **Paper grain** (`bg-grain`, `public/texture/paper-grain.svg`): a
  code-authored SVG fractal-noise texture, very low alpha (0.05/0.02 in the
  `feColorMatrix`). Used sparingly — the hero specimen and the generator's
  proof panel — never as a page-wide background.
- **Stamped buttons**: the default `Button` variant uses a hard offset
  shadow (`shadow-[3px_3px_0_0_hsl(var(--ink))]`) that collapses toward the
  button on hover/press, evoking a letterpress stamp coming down rather than
  a soft Material-style lift. On an ink-colored section, the shadow color
  must be overridden to paper explicitly (see `CallToAction.tsx`) — it does
  not flip automatically with the dark-mode class, since the ink section
  exists on an otherwise-light page.
- **Stamped labels**: `Badge` is a small rectangle (`rounded-[2px]`), mono,
  uppercase — a rubber-stamp impression, not a pill.
- **Type-specimen cards**: `Card` primitive is always paper, always a hard
  offset ink shadow, never theme-flipped.

## Components touched

`Button`, `Badge`, `Card` (+ `CardTitle`, `CardDescription`) are the shared
primitives carrying the identity everywhere they're used — restyling them
once propagated to template cards, feature cards, testimonials, the
generator's editor blocks, and the contributors page without per-surface
rework.

## Copy

The splash headline/CTA were rewritten to state the actual mechanism
("Set your README like type" / "Start Composing") instead of generic
marketing copy ("Empowering Project Documentation" / "Start Generating
ReadMEs Now!"). The generator's Preview tab/panel is labeled **Proof**
throughout (`EditModeOne.PREVIEW`, `EditModeTwo.EDIT_PREVIEW` enum values),
the printer's own term for a live check before final output — this is the
product's real behavior, not renamed decoration. Existing testimonials and
template content were preserved as-is (real product content, not invented).

## Known gaps (disclosed, not silently dropped)

- **`public/Demo.jpg`** (Home's "The proof" section) is a screenshot of the
  pre-redesign dark UI. It should be recaptured against the new generator
  before this ships; left as a known follow-up rather than blocking the
  build.
- **Markdown proof-panel borders** (`h2` underline, `blockquote`, `table`,
  `hr` in `ReactMarkdownStyled.tsx`) use the theme's `--border` token, which
  is very low-contrast against the forced-paper proof panel in dark mode.
  Minor, not fixed in this pass.
- **Finish review was done in-thread**, not via the `impeccable-finish-reviewer`
  subagent with saved screenshot files: the `impeccable` CLI launcher is
  broken in this environment (CRLF line endings — `/bin/sh^M: no such file
  or directory`), so `concept-seed`, `build-phase`, `comp-spec`, and
  `serve-question` could not run, and there was no tool available to save a
  full-page screenshot to disk for the reviewer's input packet. Verification
  instead consisted of: lint/typecheck/production build all clean; manual
  desktop + mobile inspection of every surface (home, select-template,
  generator, contributors, articles) in the built-in browser; a live edit
  round-trip through the backend render endpoint confirmed working; one real
  bug found and fixed in dev (a `.next` cache corruption from running a
  production build alongside the dev server — not a code defect).
- **Articles' `Deploying Next.js Apps` thumbnail** is existing MDX frontmatter
  content from before the redesign (shows the old dark UI in its cover
  image) — left untouched as authored blog-post content, not live chrome.
