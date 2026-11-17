# Backend

Express + MongoDB (via Mongoose) + Zod API for makeread.me. Serves the template catalog, resolves and renders README blocks server-side, and publishes a typed OpenAPI spec the frontend's client is generated from.

## Stack

- [Express](https://expressjs.com/) 4 + [TypeScript](https://www.typescriptlang.org/)
- [Mongoose](https://mongoosejs.com/) against MongoDB; `mongodb-memory-server` provides an in-memory database automatically outside `NODE_ENV=production`
- [Zod](https://zod.dev/) for request/response validation, paired with [`@asteasolutions/zod-to-openapi`](https://github.com/asteasolutions/zod-to-openapi) to generate the OpenAPI spec straight from the same schemas
- [Nunjucks](https://mozilla.github.io/nunjucks/) — the render engine behind every block (`src/common/utils/compileTemplate.ts`)
- [tsup](https://tsup.egoist.dev/) for the production build, [tsx](https://github.com/privatenumber/tsx) for dev/test execution
- [Vitest-free](https://nodejs.org/api/test.html)-style testing via Node's built-in test runner (`tsx --test`)

## Environment

Create a `.env` file in this directory:

```
NODE_ENV=development
PORT=8080
```

| Variable | Required | Notes |
|---|---|---|
| `NODE_ENV` | always | `development`/`dev` or `production`/`prod` |
| `PORT` | always | The port Express listens on |
| `MONGO_PRIVATE_URL` | production only | A real MongoDB connection string. Development always uses an in-memory database seeded fresh on boot — never set this for local dev. |

## Scripts

| Command | Purpose |
|---|---|
| `yarn dev` | Runs the API with hot reload (`tsx watch`), seeding every template under `public/` into the database |
| `yarn build` | Production build (`rimraf dist && tsup`) |
| `yarn start` | Runs the built output (`node dist/index.js`) |
| `yarn test` | Runs the full test suite |
| `yarn generate` | Regenerates every template's `blocks.json`/`macros.json` from its `blocks.ts` + `macros/*.njk` source (see below) |
| `yarn lint` / `yarn lint:fix` | ESLint |
| `yarn swagger` | Regenerates the Swagger spec file |

## How a template is authored

Each directory under `public/<folder>/` is one template:

- **`blocks.ts`** — the template's metadata (title, author, tags, `pageType`, `startupBlocks`) and every block ("function"), each with its variables (label, type, default value). Function and variable *names* here are human-readable (e.g. `headerMacro`, `headerTitle`).
- **`macros/<name>.njk`** — one Nunjucks macro per block, named to match its `function` field.
- **`preview.md`** — the static preview shown in the template picker, served as-is by `GET /v1/template/template/:id/preview`.

Running `yarn generate` (`script/generate.ts`):

1. Hashes every function and variable name into a deterministic id (`uuidv5`, seeded by `folder:function[:variable]`) — this is what makes the public API's ids stable across regenerations, and what lets the frontend reference a block without knowing its human-readable name.
2. Writes the hashed result to `blocks.json`.
3. Rewrites every `.njk` macro's references to the same hashed ids, concatenating them into `macros.json`.
4. **Fails loudly** (`assertUniqueNames`) if two functions, or two variables within one function, share a name — a collision there would make both ids identical and silently clobber one block's rendered value with the other's.

`db.ts`'s `initTemplates` reads every template's `blocks.json`/`macros.json` at boot and upserts them into MongoDB by folder (and macro by folder+name), pruning anything no longer on disk. Templates never change at runtime outside of a redeploy.

## Rendering: why it's resolved server-side

`POST /v1/template/compile` takes `{ blocks: [{ folder, function }], variables }` — **not** raw macro text or arbitrary function/variable names. The controller resolves every `(folder, function)` pair against `FullTemplateModel`/`MacroModel`, rejecting anything that doesn't match a real, committed block, before handing the result to `compileString`. Variable *values* are passed as the Nunjucks render context, never interpolated into template source.

This matters: Nunjucks has no sandbox, so template source is effectively arbitrary code. Earlier in this project's history, an endpoint took macro text and block/variable names directly from the request body — that's server-side template injection, and it was caught and fixed (see `src/common/utils/compileTemplate.ts`'s doc comment for the full explanation). Any change to this endpoint should preserve the rule: only database-sourced identifiers ever reach `compileString`; only values come from the client.

## Testing

```sh
yarn test
```

Covers, among other things:

- Every documented endpoint
- `assertUniqueNames`'s duplicate-name guard
- A render-snapshot test per template, comparing `compileString`'s output against a committed snapshot — this is the same function the `/compile` endpoint calls, so a passing snapshot means the backend's render pipeline and the live API produce identical output
- `yarn generate` idempotence (running it twice leaves a clean `git diff`)
- That no internal (hashed) identifier ever appears in a macro's rendered prose
- `cacheFor`'s `Cache-Control` middleware only marking successful (2xx) responses cacheable, never an error response

## API docs

Swagger UI is served at the application root (`/`) when the server is running; the raw OpenAPI spec is at `/swagger.json`. The frontend's typed client (`frontend/openAPI/generated`) is generated directly from this spec — see [`../frontend/README.md`](../frontend/README.md).
