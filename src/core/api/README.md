# API Service Factory

This module provides a type-safe factory for creating consistent API service implementations with built-in error handling, request/response mapping, and validation.

## Purpose

The `createApiService` factory standardizes API service creation across domains, providing:

- **Type Safety**: Full TypeScript support for requests and responses
- **Error Handling**: Consistent error normalization using the HTTP error adapter
- **Response Mapping**: Transform raw API responses to domain models
- **Validation**: Optional Zod schema validation for responses
- **Result Pattern**: Returns `Result<TResponse, DomainError>` for functional error handling

## Structure

- `createApiService.ts` - Main factory function
- `createApiService.types.ts` - Type definitions (ApiService, ApiServiceConfig, etc.)
- `createApiService.helpers.ts` - Internal helper functions
- `createApiService.request.ts` - Request preparation utilities

## Basic Usage

### Simple GET Request

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

### Using the Service

```ts
import { useHttp } from '@core/providers/http/useHttp';
import { unwrapOr } from '@src-types/result';

function UserProfile({ userId }: { userId: string }) {
	const http = useHttp();
	const getUserService = useMemo(() => createGetUserService(http), [http]);
	const [user, setUser] = useState<User | null>(null);

	useEffect(() => {
		const loadUser = async () => {
			const result = await getUserService.execute({ id: userId });
			const loadedUser = unwrapOr(result, null);
			setUser(loadedUser);
		};

		loadUser();
	}, [getUserService, userId]);

	if (!user) return <div>Loading...</div>;

	return <div>{user.name}</div>;
}
```

## Advanced Usage

### POST Request with Request Body

```ts
const createUserSchema = z.object({
	name: z.string().min(1),
	email: z.string().email(),
});

const userResponseSchema = z.object({
	id: z.string(),
	name: z.string(),
	email: z.string().email(),
	createdAt: z.string(),
});

export type CreateUserRequest = z.infer<typeof createUserSchema>;
export type CreateUserResponse = z.infer<typeof userResponseSchema>;

export function createCreateUserService(
	http: HttpPort
): ApiService<CreateUserRequest, CreateUserResponse> {
	return createApiService<CreateUserRequest, CreateUserResponse>(http, {
		endpoint: '/api/users',
		method: 'POST',
		requestMapper: ({ request }) => ({
			body: request,
		}),
		responseSchema: userResponseSchema,
		defaultErrorMessage: 'Failed to create user',
	});
}
```

### Custom Response Mapping

```ts
interface RawApiResponse {
	data: {
		user: {
			id: string;
			full_name: string;
			email_address: string;
		};
	};
	meta: {
		timestamp: string;
	};
}

interface User {
	id: string;
	name: string;
	email: string;
}

export function createGetUserService(
	http: HttpPort
): ApiService<{ id: string }, User, RawApiResponse> {
	return createApiService<{ id: string }, User, RawApiResponse>(http, {
		endpoint: request => `/api/users/${request.id}`,
		method: 'GET',
		responseMapper: (rawResponse: RawApiResponse) => ({
			id: rawResponse.data.user.id,
			name: rawResponse.data.user.full_name,
			email: rawResponse.data.user.email_address,
		}),
		defaultErrorMessage: 'Failed to load user',
	});
}
```

### Custom Error Handling

```ts
import type { DomainError } from '@core/http/errorAdapter.types';

export function createGetUserService(http: HttpPort): ApiService<{ id: string }, User> {
	return createApiService<{ id: string }, User>(http, {
		endpoint: request => `/api/users/${request.id}`,
		method: 'GET',
		responseSchema: userSchema,
		defaultErrorMessage: 'Failed to load user',
		errorMapper: (error: DomainError, context) => {
			// Custom error transformation
			if (error.type === 'NOT_FOUND') {
				return {
					...error,
					message: `User with ID ${context.request.id} not found`,
				};
			}
			return error;
		},
	});
}
```

### Dynamic Endpoints

```ts
export function createSearchUsersService(
	http: HttpPort
): ApiService<{ query: string; page?: number }, User[]> {
	return createApiService<{ query: string; page?: number }, User[]>(http, {
		endpoint: request => {
			const params = new URLSearchParams({ q: request.query });
			if (request.page) {
				params.set('page', request.page.toString());
			}
			return `/api/users/search?${params.toString()}`;
		},
		method: 'GET',
		responseSchema: z.array(userSchema),
		defaultErrorMessage: 'Failed to search users',
	});
}
```

### With Default HTTP Config

```ts
export function createUploadFileService(http: HttpPort): ApiService<FormData, { fileId: string }> {
	return createApiService<FormData, { fileId: string }>(http, {
		endpoint: '/api/files/upload',
		method: 'POST',
		defaultConfig: {
			timeout: 60000, // 60 seconds for file uploads
			headers: {
				// Don't set Content-Type, browser will set it with boundary for FormData
			},
		},
		requestMapper: ({ request }) => ({
			body: request,
		}),
		responseSchema: z.object({ fileId: z.string() }),
		defaultErrorMessage: 'Failed to upload file',
	});
}
```

## Configuration Options

### `ApiServiceConfig<TRequest, TRawResponse, TResponse>`

- **`endpoint`**: `string | ((request: TRequest) => string)` - Endpoint URL or function that generates it
- **`method`**: `ApiHttpMethod` - HTTP method (default: `'GET'`)
- **`requestMapper`**: Optional function to transform request and add HTTP config
- **`responseMapper`**: Optional function to transform raw response to domain model
- **`responseSchema`**: Optional Zod schema for response validation
- **`errorMapper`**: Optional function to transform errors
- **`defaultErrorMessage`**: Error message when no specific error is available
- **`defaultConfig`**: Default HTTP client configuration

## Error Handling

Services return `Result<TResponse, DomainError>` using the Result pattern:

```ts
import { unwrapOr, unwrapOrElse, isSuccess } from '@src-types/result';

const result = await getUserService.execute({ id: '123' });

// Pattern 1: Provide default value
const user = unwrapOr(result, defaultUser);

// Pattern 2: Provide fallback function
const user = unwrapOrElse(result, error => {
	console.error('Failed to load user:', error);
	return defaultUser;
});

// Pattern 3: Check result
if (isSuccess(result)) {
	const user = result.data;
	// Use user
} else {
	const error = result.error;
	// Handle error
}
```

## Best Practices

1. **Co-locate Services with Domains**: Place service factories in `domains/<domain>/services/api/`

2. **Use Zod Schemas**: Always define response schemas for runtime validation

3. **Type Everything**: Use TypeScript types for requests and responses

4. **Handle Errors Gracefully**: Use the Result pattern for error handling

5. **Keep Services Pure**: Services should only depend on `HttpPort`, not React hooks

6. **Use Factories**: Export factory functions that accept `HttpPort` rather than creating services directly

## Example: Complete Service Implementation

```ts
// domains/users/services/api/userService.ts
import { createApiService } from '@core/api/createApiService';
import type { ApiService } from '@core/api/createApiService.types';
import type { HttpPort } from '@core/ports/HttpPort';
import { z } from 'zod';

// Schemas
const userSchema = z.object({
	id: z.string(),
	name: z.string(),
	email: z.string().email(),
	createdAt: z.string(),
});

const createUserSchema = userSchema.omit({ id: true, createdAt: true });

// Types
export type User = z.infer<typeof userSchema>;
export type CreateUserRequest = z.infer<typeof createUserSchema>;

// Service Factories
export function createGetUserService(http: HttpPort): ApiService<{ id: string }, User> {
	return createApiService<{ id: string }, User>(http, {
		endpoint: request => `/api/users/${request.id}`,
		method: 'GET',
		responseSchema: userSchema,
		defaultErrorMessage: 'Failed to load user',
	});
}

export function createCreateUserService(http: HttpPort): ApiService<CreateUserRequest, User> {
	return createApiService<CreateUserRequest, User>(http, {
		endpoint: '/api/users',
		method: 'POST',
		requestMapper: ({ request }) => ({
			body: request,
		}),
		responseSchema: userSchema,
		defaultErrorMessage: 'Failed to create user',
	});
}
```

## See Also

- [API Integration Guide](../../docs/api-integration.md) - Comprehensive step-by-step integration guide with error handling patterns, request/response patterns, and mocking strategies
- `@core/ports/HttpPort` - HTTP client interface
- `@core/http/errorAdapter` - Error normalization utilities
- `@src-types/result` - Result type utilities
- `@src-types/api` - API-related types
