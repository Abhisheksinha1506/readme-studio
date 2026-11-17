# Direction contract — makeread.me full redesign

Recorded manually: the `impeccable` CLI launcher is broken in this environment
(CRLF line endings — `/bin/sh^M: no such file or directory`), so the scripted
`concept-seed` dice-roll, `build-phase` gates, and `serve-question` decision
page could not run. This file stands in for the surface-brief mechanism;
the creative exercise (name the mechanism, list seven candidate worlds from
the audience's cultural home, pick the most resonant, weigh it against
alternates) was done directly in conversation and locked by the user.

## THESIS

This is a composing room for READMEs, not a form with fields. The product's
real mechanism — independently swappable blocks, each a macro, rendered live
— maps almost literally onto movable type: interchangeable pieces, composed
into a page, proofed before it's pulled. The surface refuses both category
ruts: the terminal/hacker-black cliché every dev tool reaches for, and the
generic SaaS gradient-dashboard opposite.

## OWN-WORLD

- **Grounds:** warm, slightly textured paper off-white (`#F3EEE4`-family) for
  content surfaces; deep ink-black (`#17140F`-family, not pure `#000`) for
  chrome, the editor's own frame, and dark-mode parity. Color strategy:
  Committed — one accent, stop-press red (`#B1402F`-family, a true letterpress
  ink red, not a SaaS red), carries 30–60% of each surface's accent weight
  (CTAs, active states, the registration-mark motif), never scattered as
  decoration.
- **Type:** a real serif display face with character for headlines
  (Fraunces or Newsreader — pick one, use it everywhere a headline appears,
  no mixing), a workhorse monospace (IBM Plex Mono or Space Mono) for
  anything code-, variable-, or data-shaped: field labels, the Raw view,
  badges, the template's `folder` id. Body copy in a plain humanist sans
  (DM Sans or Inter) — this is an Operate-heavy product, body text must stay
  legible, not decorative.
- **Motif:** registration-mark crosshairs (printer's register marks, ⌖-style)
  as a recurring small UI element — section corners, the active-block
  indicator, loading state. Thin hairline rules (1px, ink-colored, not gray)
  standing in for a composed page's column guides. Subtle paper-grain texture
  on large content panes (a tiled, low-contrast noise/fiber texture, not a
  gradient).
- **Components:** buttons read as stamped/impressed (a soft inset shadow on
  press, not a bouncy scale), cards for templates read as **type specimen
  sheets** (the template's name set in its own display treatment, tags as
  small stamped labels, not pill badges).

## STORY

A visitor understands, within the first viewport, that they're assembling a
document from well-made, interchangeable pieces — not filling in a form.
They pick blocks (type), arrange them, watch the **proof** (the live
preview — the printer's own term, used literally in copy: "Proof" not
"Preview" where it reads naturally), then **pull** it (download/copy).

## FIRST VIEWPORT

**Home:** a large type-specimen hero: an actual composed README fragment
rendered as "type on a press" — real product content (an actual template's
header, not lorem ipsum), set in the display serif, paper ground, one
registration mark in a corner. Single clear CTA ("Start Composing" /
equivalent), stamped-button treatment, no secondary CTA competing for
attention. Headline states the product's real mechanism in one line, not a
generic "Generate READMEs fast."

**Generator (Operate surface, the core tool):** the editor frame reads as a
composing room: sidebar block list as a type case (literally evokes a
printer's type case — compartmentalized, orderly), the live markdown output
labeled **Proof**, not Preview, inside a sheet-of-paper panel with a visible
registration mark. Task clarity outranks expression here: block editing,
field inputs, and the proof panel must stay instantly scannable — the
letterpress motif lives in chrome, borders, and labels, never in the form
controls themselves, which stay plain and fast to use.

**Select-template (Persuade-adjacent browse surface):** template cards as
type specimen sheets in a grid, each showing its own real rendered content
as the "specimen," tags as stamped labels, search as a simple hairline-framed
input, no card-hover gradient or glow — a subtle "lift" (shadow deepens
slightly, as if the sheet is being picked up).

## SIGNATURE INTERACTION

Reordering/adding blocks has a settle motion, not a bounce: when a block is
dropped or the proof updates, content eases in with a slight downward
settle (evoking a press coming down), never an elastic overshoot. Debounced
proof updates (already backend-driven per the render-endpoint work) get a
brief ink-impression flash on the registration mark while compiling, not a
spinner.

## FORM

Letterpress / composing-room direction, chosen over two alternates (RFC/
technical-document austere; cut-and-paste zine/photocopy punk) in direct
conversation with the user — no seed key; the randomized dealing mechanism
was unavailable.

## FINISH

Unreviewed and undocumented is unfinished; this build ends with the finish
review, the verdict, DESIGN.md, and every shipping raster carrying its
provenance.
