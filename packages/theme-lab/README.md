# @workspace/theme-lab

**Development tool, switched on and off by an environment variable.**

A floating panel that lets you retune every theme colour variable live in the
browser. Changes are injected as a `<style>` element and persisted to
`localStorage`; nothing is written back to the codebase.

## Showing and hiding it

Set `NEXT_PUBLIC_ENABLE_THEME_LAB` in `apps/web`:

| Value                 | Result                                           |
| --------------------- | ------------------------------------------------ |
| `true`                | The Theme Lab button shows on every landing page |
| unset, `false`, other | Hidden; the panel's code is never downloaded     |

The value is inlined at build time — restart `pnpm dev` or redeploy after
changing it. Keep it off on the Production environment in Vercel; turn it on
for Preview (or locally) when the palette is being tuned.

## Usage

```tsx
import { ThemeLabMount } from '@workspace/theme-lab';

<ThemeLabMount />;
```

Mounted once in `apps/web/components/snippets/marketing-shell/marketing-shell.tsx`,
in the `SmoothScroll` `fixed` slot so its position holds. `ThemeLabMount`
lazy-loads the panel, so it stays out of the initial bundle.
