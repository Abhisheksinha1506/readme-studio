# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Developers and project maintainers who need a README, usually when starting a new project or improving documentation for an existing one. They want something better than a blank file or a hand-copied template, without writing one from scratch.

## Product Purpose

makeread.me (readme-studio) turns picking a community README template into a generated README.md. Select a template (othneildrew's Best-README-Template, purplebooth's, pottekkat's awesome-readme, fernanda-kipper's, plus minimal/portfolio/api-docs variants), fill in fields in a live-previewed editor, copy or download the result. Success means a correct, well-formatted README produced faster than writing one by hand or manually editing a template file.

## Positioning

Composes a README from independent blocks (Header, Installation, License, etc.), each backed by a Nunjucks macro, rather than offering one fixed template per style. Blocks are mixable across templates ("Create Your Own"), and rendering is server-side with a live, debounced preview — a neighboring "pick one template and fill it in" generator can't recompose blocks this way.

## Operating Context

A developer lands on the site, browses or searches templates by tag/description in `/select-template`, opens one in `/generator/[id]`, edits fields in a sidebar-driven block editor while watching a live markdown preview, then copies or downloads the README. Templates and their default content are real, committed product content (`backend/public/<folder>/blocks.ts` + `macros/*.njk`), not placeholders.

## Capabilities and Constraints

- Backend (Express/Mongo) seeds templates from committed files at boot; templates don't change at runtime.
- Rendering is server-side (`POST /v1/template/compile`), resolving blocks against the database — client-supplied template source is never trusted (fixed RCE risk from an earlier change).
- Frontend is Next.js 13 (pages/app router mixed usage), React 18, Tailwind, shadcn/ui-style components, react-query for data fetching.
- Variable types: input, textArea, checkBox, list, object, select, radio — the editor's field widgets must keep covering all of these.
- Must preserve: select-template → generator (edit + live preview) → copy/download workflow; the existing template catalog as real content; the backend API contract.

## Brand Commitments

Name: makeread.me. Logo exists at `images/logo.png`. License: MPL-2.0 (must stay credited). Original project by ShaanCoding — credit preserved per existing convention.

## Evidence on Hand

8 real templates with real default content (see `backend/public/*/blocks.ts`). No testimonials, case studies, or usage metrics exist — future work must not invent them.

## Product Principles

- The block/macro composition model is the product's real differentiator — redesign must not collapse it into "pick one static template."
- Free and open-source; nothing in the redesign should imply a paywall or gated tier that doesn't exist.
- The live preview is the trust mechanism (what you see is what you get) — any editor redesign must keep edit and preview visually and temporally tight.
- Templates are community-contributed in spirit; crediting original authors (already in each template's `author` field) is a product value, not decoration.
