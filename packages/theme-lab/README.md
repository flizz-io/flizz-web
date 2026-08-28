# @workspace/theme-lab

**Temporary development tool — delete this package before production.**

A floating panel that lets you retune every theme colour variable live in the
browser. Changes are injected as a `<style>` element and persisted to
`localStorage`; nothing is written back to the codebase.

## Usage

```tsx
import { ThemeLabMount } from '@workspace/theme-lab';

<ThemeLabMount />;
```

`ThemeLabMount` renders nothing unless `NEXT_PUBLIC_ENABLE_THEME_LAB=true`, and
lazy-loads the panel so it stays out of the initial bundle.

## Removing it

1. Delete `packages/theme-lab`.
2. Drop `@workspace/theme-lab` from `apps/web/package.json` and the
   `transpilePackages` array in `apps/web/next.config.ts`.
3. Remove the `ThemeLabMount` usage from `apps/web/app/(marketing)/layout.tsx`.
4. Remove the `@source` line for this package in
   `packages/ui/src/styles/globals.css` and the env var from `.env.example`.
