<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Commands

```
pnpm dev        # dev server (Turbopack, outputs to .next/dev)
pnpm build      # production build (Turbopack by default)
pnpm lint       # eslint (NOT next lint — that command was removed in Next.js 16)
pnpm tsc --noEmit  # typecheck (no dedicated script)
```

No test framework is installed. No CI workflows exist.

## Next.js 16 breaking changes that affect this repo

- **Async request APIs enforced:** `cookies()`, `headers()`, `draftMode()` must be awaited. `params` and `searchParams` in layouts/pages/routes are now Promises — await them.
- **`next lint` is removed.** Use `eslint` directly (already done in `package.json`).
- **`next build` no longer runs linting.**
- **Turbopack is the default** for both dev and build. Pass `--webpack` to opt out if a custom webpack config is needed (none exists currently).
- **`middleware` file/export renamed to `proxy`.** Edge runtime is not supported in `proxy`.
- **`serverRuntimeConfig`/`publicRuntimeConfig` removed.** Use `process.env`; prefix client-accessible vars with `NEXT_PUBLIC_`.
- **Parallel routes:** all `@slot` folders require explicit `default.js` or the build fails.
- **`process.argv.includes('dev')` no longer works** in `next.config`. Use `process.env.NODE_ENV === 'development'`.
- **`revalidateTag` now requires a second `cacheLife` argument.**
- **`cacheLife`/`cacheTag`:** drop `unstable_` prefix (now stable).
- **`experimental.dynamicIO` renamed to `cacheComponents`** (top-level, not under `experimental`).
- **`images.domains` deprecated** — use `images.remotePatterns`.
- Node.js minimum: **20.9.0**. TypeScript minimum: **5.1.0**.

Full docs: `node_modules/next/dist/docs/`

## Architecture

- **App Router only** — no `pages/` directory.
- `app/` — TypeScript (`.tsx`/`.ts`). `lib/` and `app/api/` — plain JavaScript (no types).
- `app/page.tsx` is `'use client'` and fetches `/api/search?q=...` client-side. Unusual for App Router — prefer Server Components for new data fetching.
- `app/api/search/route.js` — search endpoint backed by an inverted index built from `data/movies.json`.
- Path alias `@/*` → project root (e.g., `@/lib/search`).
- No shared components exist yet (`components/` is empty).

## Tooling quirks

- **Package manager: `pnpm` only.** `pnpm-workspace.yaml` exists but this is not a monorepo.
- **ESLint flat config** (`eslint.config.mjs`, ESLint 9). Legacy `.eslintrc` format is incompatible.
- **Tailwind v4** via `@tailwindcss/postcss`. No `tailwind.config.js` — configuration lives in CSS.
- No environment variables required. The app is self-contained using `data/movies.json`.
