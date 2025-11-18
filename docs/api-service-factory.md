# API Service Factory

The API service factory lives in `src/core/api/*` and standardizes how domains talk to HTTP APIs. It wraps the Fetch-based `HttpPort` implementation, the HTTP error adapter, and the shared `Result` utilities so every service behaves the same way.

## Location & Files

- `src/core/api/createApiService.ts` – main factory
- `src/core/api/createApiService.types.ts` – `ApiService`, `ApiServiceConfig`, `ApiHttpMethod`, mapper contracts
- `src/core/api/createApiService.helpers.ts` – response/error helpers
- `src/core/api/createApiService.request.ts` – request/body/header preparation

See the in-repo reference guide at `src/core/api/README.md` for the full examples that the code ships with.

## What the Factory Gives You

- **Type-safety**: requests/responses are fully typed
- **Result-returning API**: `execute()` resolves to `Result<TResponse, DomainError>`
- **Error normalization**: errors flow through `@core/http/errorAdapter`
- **Schema validation**: optional Zod schemas (strongly recommended)
- **Mapper hooks**: map requests/responses/errors without repeating glue code
- **Default config**: opt into per-service headers, timeouts, retries

## Minimal Usage

```ts
import { createApiService } from '@core/api/createApiService';
import type { ApiService } from '@core/api/createApiService.types';
import type { HttpPort } from '@core/ports/HttpPort';
import { z } from 'zod';

const userSchema = z.object({
	id: z.string(),
	name: z.string(),
	email: z.string().email(),
});

export type User = z.infer<typeof userSchema>;

export function createGetUserService(http: HttpPort): ApiService<{ id: string }, User> {
	return createApiService<{ id: string }, User>(http, {
		endpoint: request => `/api/users/${request.id}`,
		method: 'GET',
		responseSchema: userSchema,
		defaultErrorMessage: 'Failed to load user',
	});
}
```

In React components, instantiate the service via `useHttp()` (from `@core/providers/http/useHttp`) and unwrap the `Result` helpers from `@src-types/result`.

## Domain Placement

Keep service factories inside their domain: `src/domains/<domain>/services/api/<service>.ts`. They should only depend on `HttpPort` (not React, not providers). Each domain exports factory functions so tests can inject mock HTTP adapters easily.

```
domains/
└── landing/
    └── services/
        └── api/
            └── getDemoContentService.ts
```

## Error Handling Pattern

Every service returns `Result`. Prefer `isSuccess`, `unwrapOr`, or `unwrapOrElse` from `@src-types/result`. Domain/UI layers decide how to surface errors (toast, snackbar, inline message).

```ts
const result = await getDemoContent.execute();
const data = unwrapOr(result, null);
if (!data) {
	toast.error(result.error?.message ?? 'Unable to load content');
}
```

## Related References

- `src/core/api/README.md` – canonical, code-adjacent documentation
- [API Integration Guide](./api-integration.md) – end-to-end walkthrough (providers, services, tests, MSW)
- [Error Handling Guide](./error-handling.md) – how Result + adapters work
- [Providers Guide](./providers.md) – where `useHttp()` lives
