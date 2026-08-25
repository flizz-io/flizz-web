# Flizz Web

A pnpm + Turborepo monorepo with a public-facing Next.js app, an
admin/dashboard Next.js app, and an Express + TypeScript API — all sharing one
component library and one set of lint/format/typecheck conventions.

## Stack

- `apps/web` — Next.js (React, App Router, Tailwind CSS v4). Example public
  site / landing app.
- `apps/dashboard` — Next.js, same scaffold as `web`. Example admin/internal
  app.
- `apps/api` — Express + TypeScript backend, with a starter folder structure
  (`controllers`, `services`, `routes`, `middlewares`, `schemas`, `types`,
  etc.) ready to fill in.
- `packages/ui` — Shared component library (shadcn/ui, Radix UI, CVA).
- `packages/typescript-config` — Shared `tsconfig` presets.
- `packages/eslint-config` — Shared ESLint configs.

`web` and `dashboard` are independent apps that happen to start from the same
scaffold and both import from `@workspace/ui` — they are not meant to diverge
into "one canonical app," each can grow its own way.

## Commands

Run from the repo root:

```bash
pnpm install      # install all workspace deps
pnpm dev          # start all apps in dev mode (web on :3300, dashboard on :3400, api on :3500)
pnpm build        # build all packages and apps
pnpm lint         # lint all packages
pnpm typecheck    # type-check all packages
pnpm format       # format staged-scope TS/TSX files per package with Prettier

# Run a command scoped to one workspace
pnpm --filter web dev
pnpm --filter dashboard dev
pnpm --filter @workspace/ui typecheck
```

**Format caveat**: each package's `format` script only runs `prettier --write`
over `**/*.{ts,tsx}`. If you wire up CI, also run the broader check before
pushing:

```bash
pnpm prettier --check "**/*.{ts,tsx,js,jsx,mjs,cjs,css,json,md}"
```

## Adding shadcn/ui components

Run at the repo root, targeting either app (both apps' `components.json`
point shadcn at the shared package, so output location is the same either
way):

```bash
pnpm dlx shadcn@latest add <component> -c apps/web
# or: -c apps/dashboard
```

Import it via:

```tsx
import { Button } from '@workspace/ui/components/button';
```

## Conventions

See [`.claude/rules/conventions.md`](.claude/rules/conventions.md) for
naming, folder structure, import order, code style, and database naming
conventions. See [`CLAUDE.md`](CLAUDE.md) for the full architecture writeup
(this file is read automatically by Claude Code, but it's worth reading by
hand too).

## Git hooks and branch protection

Husky (`pnpm prepare`, run automatically after install) wires up:

- **pre-commit** — blocks commits on `master`/`dev`
  (`scripts/prevent-git-branch.sh`), then runs `lint-staged` (typecheck the
  whole project, lint + Prettier-write staged files).
- **pre-push** — blocks pushes on `master`/`dev`.

Edit the protected-branch list in `scripts/prevent-git-branch.sh` if your
project uses different branch names.

## What to rename for a new project

- `package.json` → `name` at the root and in each `apps/*/package.json`.
- `apps/web/configs/site.ts` → site name, tagline, description, contact email.
- `apps/web/configs/nav.ts` / `configs/footer.ts` → real nav items, footer
  groups, and social links.
- `.github/workflows/ci.yml` → branch names if not `dev`/`stg`/`master`.

Everything else (Turborepo pipeline, ESLint/Prettier/TypeScript configs,
Husky hooks, folder structure) is meant to be used as-is.
