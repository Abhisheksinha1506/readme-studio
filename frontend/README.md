# Frontend

Next.js 13 (App Router) client for makeread.me — the template browser, the block editor, and the live proof.

## Stack

- [Next.js 13](https://nextjs.org/) + [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/)-style primitives in `components/ui/`, [Radix UI](https://www.radix-ui.com/) underneath them
- [TanStack Query](https://tanstack.com/query) for data fetching/caching against the backend
- [openapi-typescript-codegen](https://github.com/ferdikoomen/openapi-typescript-codegen) — the typed API client in `openAPI/generated/`, generated from the backend's own OpenAPI spec
- [Contentlayer2](https://contentlayer.dev/) — the MDX-powered `/articles` blog
- [react-hook-form](https://react-hook-form.com/) — the block editor's form state
- [Framer Motion](https://www.framer.com/motion/) — page/section entrance animation and the generator's reorder/delete transitions

## Environment

Create a `.env` file in this directory:

```
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
```

Read by `lib/apiWrapper.ts`, which constructs the generated API client with this as its `BASE` URL. The generated client itself (`openAPI/generated/`) is version-controlled and does not need regenerating just to point at a different backend — only when the backend's API surface actually changes (see below).

**Docker note:** `NEXT_PUBLIC_BACKEND_URL` is a Next.js public env var, which means it's baked into the client bundle at **build time**, not read at container start. The frontend `Dockerfile` takes it as a build `ARG`; pass a URL the browser can actually resolve (never a Docker-internal hostname like `host.docker.internal`), and rebuild the image to change it — restarting the container alone won't pick up a new value.

## Scripts

| Command | Purpose |
|---|---|
| `yarn dev` | Dev server |
| `yarn build` | `contentlayer2 build && next build` — production build |
| `yarn start` | Runs the production build |
| `yarn typecheck` | `tsc --noEmit` |
| `yarn lint` / `yarn lint:fix` | `next lint` |
| `yarn generate` | Regenerates `openAPI/generated/` from the backend's **live** `/swagger.json` — the backend must be running first |
| `yarn format:write` / `yarn format:check` | Prettier |

## Regenerating the API client

Whenever the backend's routes, request/response shapes, or Zod schemas change:

```sh
# with the backend running on its usual port
yarn generate
```

This clears `openAPI/generated/` and re-emits it from `openapi-typescript-codegen` against the backend's current OpenAPI spec. Review the diff before committing — it's a generated, version-controlled directory, not build output excluded from git.

## Project layout

```
app/                      Next.js App Router pages
  page.tsx                  Home
  select-template/          Browse/search/filter templates
  generator/[...id]/        The editor: pick blocks, fill fields, watch the proof
  contributors/             Static contributors page
  articles/                 Contentlayer2-powered MDX blog

components/
  GenerateTemplate/          The editor itself (Sidebar = block picker, MainContent = form + proof)
  SelectTemplate/            Template cards, search sidebar, preview modal
  Home/                      Landing page sections
  ui/                        Shared primitives (Button, Card, Badge, ...) — restyling these propagates
                             to every surface that uses them

openAPI/generated/          Generated API client — see "Regenerating the API client" above
lib/apiWrapper.ts           Constructs the API client with NEXT_PUBLIC_BACKEND_URL
```

## How rendering works

The editor sends `{ blocks: [{ folder, function }], variables }` to the backend's `POST /v1/template/compile` and renders whatever markdown comes back. It does **not** compile Nunjucks client-side — that used to be the case (`nunjucks/browser`, now removed), but moving it server-side meant one render implementation instead of two that could drift apart, and dropped a dependency from the client bundle. The 200ms debounce on form edits (`COMPILE_DEBOUNCE_MS` in `MainContent.tsx`) is what keeps a request from firing on every keystroke — same debounce window as before the move, just in front of a network call instead of a local compute.

## Design system

See [`../DESIGN.md`](../DESIGN.md) for the current visual system (tokens, type, the letterpress/composing-room motifs) and [`../PRODUCT.md`](../PRODUCT.md) for the product context it's built from.
