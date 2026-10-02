# @workspace/media-library

The one way files enter the system (see `.claude/rules/conventions.md`).

- `StorageProvider` — where files live. `createCloudinaryProvider` (the default, free tier) uploads the processed file and serves it from Cloudinary's CDN; `createLocalDiskProvider` writes to the API server's disk for offline development. Add another provider (S3, R2, …) when needed — callers don't change.
- `processImage(buffer, preset)` — validates an upload by decoding it, resizes to a preset, re-encodes as WebP (stripping metadata).
- `createStorageKey(ext)` — unique, month-grouped keys. The database stores keys, never URLs.

Server-only (Node). Built to `dist/` for the API's runtime; types come from `src/`.
