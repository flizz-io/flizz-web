# @workspace/api-services

Everything the apps need to talk to `apps/api`: one fetcher, the request and
response types, the API's enums, and a function per endpoint.

| Folder         | Holds                                                         |
| -------------- | ------------------------------------------------------------- |
| `src/services` | `apiService` (the common fetcher), `ApiError`, endpoint calls |
| `src/models`   | Payloads, responses and query types                           |
| `src/enums`    | API enums — same keys and values as the database              |

Source-only: apps consume it through Next's `transpilePackages`.

## Calling from the browser vs a server

Every service takes an optional `ApiContext` last. In the browser the default
is right — the app's own `/api` rewrite, cookies included:

```ts
const projects = await getProjectsService({ sector: ProjectSector.RETAIL });
```

A server component passes the API's origin and the visitor's cookie (the
dashboard wraps this in `utils/server-api.ts`), or caching hints for the
public site:

```ts
await getPublicProjectsService({
	baseUrl: process.env.API_URL,
	init: { next: { revalidate: 300 } }
});
```

Failures throw `ApiError` with the API's `code`, `message` and per-field
`fieldErrors`; status `0` means the server couldn't be reached.
