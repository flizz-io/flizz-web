/**
 * Vercel entry — used only while the API is hosted on Vercel (temporary; see
 * docs/guides/deployment.md). Vercel runs this file as one serverless
 * function and `vercel.json` routes every request to it; an Express app is
 * already a `(req, res)` handler, so the compiled app is exported as-is.
 *
 * On our own server none of this is used: `pnpm --filter api build` then
 * `pnpm --filter api start` runs `dist/index.js`, which calls `listen()`.
 */
export { app as default } from '../dist/app.js';
