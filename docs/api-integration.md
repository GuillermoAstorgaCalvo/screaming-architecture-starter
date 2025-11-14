# API Integration Guide

This guide provides step-by-step instructions for integrating APIs using `createApiService`, including error handling patterns, request/response patterns, and mocking strategies for development and testing.

## Table of Contents

1. [Step-by-Step API Integration](#step-by-step-api-integration)
2. [Error Handling Patterns](#error-handling-patterns)
3. [Request/Response Patterns](#requestresponse-patterns)
4. [Mocking APIs for Development](#mocking-apis-for-development)

---

## Step-by-Step API Integration

### Step 1: Define Your Types and Schemas

Start by defining TypeScript types and Zod schemas for your API request and response:

```typescript
// domains/users/services/api/userService.types.ts
import { z } from 'zod';

// Response schema with validation
export const userSchema = z.object({
	id: z.string(),
	name: z.string(),
	email: z.string().email(),
	createdAt: z.string(),
	updatedAt: z.string().optional(),
});

// Request type (no validation needed, but type safety is useful)
export interface GetUserRequest {
	id: string;
}

// Response type inferred from schema
export type User = z.infer<typeof userSchema>;
```

### Step 2: Create the API Service Factory

Create a factory function that uses `createApiService`:

```typescript
// domains/users/services/api/userService.ts
import { createApiService } from '@core/api/createApiService';
import type { ApiService } from '@core/api/createApiService.types';
import type { HttpPort } from '@core/ports/HttpPort';
import { userSchema, type GetUserRequest, type User } from './userService.types';

export function createGetUserService(http: HttpPort): ApiService<GetUserRequest, User> {
	return createApiService<GetUserRequest, User>(http, {
		endpoint: request => `/api/users/${request.id}`,
		method: 'GET',
		responseSchema: userSchema,
		defaultErrorMessage: 'Failed to load user',
	});
}
```

### Step 3: Use the Service in Components

#### Option A: Using React Query (Recommended)

```typescript
// domains/users/components/UserProfile.tsx
import { useQuery } from '@tanstack/react-query';
import { useHttp } from '@core/providers/http/useHttp';
import { createGetUserService } from '../services/api/userService';
import { isSuccess } from '@src-types/result';
import { useMemo } from 'react';

export function UserProfile({ userId }: { userId: string }) {
	const http = useHttp();
	const getUserService = useMemo(() => createGetUserService(http), [http]);

	const { data: user, isLoading, error } = useQuery({
		queryKey: ['user', userId],
		queryFn: async () => {
			const result = await getUserService.execute({ id: userId });
			if (!isSuccess(result)) {
				throw result.error; // React Query expects thrown errors
			}
			return result.data;
		},
		enabled: !!userId,
	});

	if (isLoading) return <div>Loading...</div>;
	if (error) return <div>Error: {error.message}</div>;
	if (!user) return null;

	return (
		<div>
			<h1>{user.name}</h1>
			<p>{user.email}</p>
		</div>
	);
}
```

#### Option B: Using useAsync Hook

```typescript
// domains/users/components/UserProfile.tsx
import { useAsync } from '@core/hooks/async/useAsync';
import { useHttp } from '@core/providers/http/useHttp';
import { createGetUserService } from '../services/api/userService';
import { unwrapOr } from '@src-types/result';

export function UserProfile({ userId }: { userId: string }) {
	const http = useHttp();
	const getUserService = useMemo(() => createGetUserService(http), [http]);

	const { data: user, loading, error } = useAsync(
		async () => {
			const result = await getUserService.execute({ id: userId });
			return unwrapOr(result, null);
		},
		{ dependencies: [userId] }
	);

	if (loading) return <div>Loading...</div>;
	if (error) return <div>Error: {error.message}</div>;
	if (!user) return null;

	return (
		<div>
			<h1>{user.name}</h1>
			<p>{user.email}</p>
		</div>
	);
}
```

### Step 4: Handle Mutations (POST, PUT, DELETE)

For mutations, use React Query's `useMutation`:

```typescript
// domains/users/services/api/userService.ts
export interface CreateUserRequest {
	name: string;
	email: string;
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

```typescript
// domains/users/components/CreateUserForm.tsx
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useHttp } from '@core/providers/http/useHttp';
import { useToast } from '@core/providers/toast/useToast';
import { createCreateUserService } from '../services/api/userService';
import { isSuccess } from '@src-types/result';
import { useMemo } from 'react';

export function CreateUserForm() {
	const http = useHttp();
	const queryClient = useQueryClient();
	const toast = useToast();
	const createUserService = useMemo(() => createCreateUserService(http), [http]);

	const mutation = useMutation({
		mutationFn: async (userData: CreateUserRequest) => {
			const result = await createUserService.execute(userData);
			if (!isSuccess(result)) {
				throw result.error;
			}
			return result.data;
		},
		onSuccess: (user) => {
			// Invalidate and refetch user list
			queryClient.invalidateQueries({ queryKey: ['users'] });
			toast.success(`User ${user.name} created successfully`);
		},
		onError: (error) => {
			toast.error(error.message || 'Failed to create user');
		},
	});

	const handleSubmit = (data: CreateUserRequest) => {
		mutation.mutate(data);
	};

	return (
		<form onSubmit={handleSubmit}>
			{/* form fields */}
			<button type="submit" disabled={mutation.isPending}>
				{mutation.isPending ? 'Creating...' : 'Create User'}
			</button>
		</form>
	);
}
```

---

## Error Handling Patterns

### Understanding Domain Errors

All API services return `Result<TResponse, DomainError>`. Domain errors are structured with:

```typescript
interface DomainError {
	type: DomainErrorType; // 'network' | 'timeout' | 'clientError' | 'serverError' | etc.
	message: string;
	status?: number; // HTTP status code
	code?: string; // API error code
	originalError?: HttpClientError; // Original HTTP error
	apiError?: ApiErrorResponse; // API error response details
	validationErrors?: Array<{ field: string; message: string }>; // Field-level errors
}
```

### Pattern 1: Basic Error Handling with Result Pattern

```typescript
import { isSuccess, unwrapOr, unwrapOrElse } from '@src-types/result';

const result = await getUserService.execute({ id: userId });

// Option A: Provide default value
const user = unwrapOr(result, null);

// Option B: Provide fallback function
const user = unwrapOrElse(result, error => {
	console.error('Failed to load user:', error);
	// Log to error tracking service
	return null;
});

// Option C: Explicit checking
if (isSuccess(result)) {
	const user = result.data;
	// Use user
} else {
	const error = result.error;
	// Handle error based on type
	if (error.type === 'NOT_FOUND') {
		// Handle not found
	} else if (error.type === 'NETWORK_ERROR') {
		// Handle network error
	}
}
```

### Pattern 2: Error Handling in React Query

React Query expects thrown errors, so unwrap the Result:

```typescript
const { data, error, isLoading } = useQuery({
	queryKey: ['user', userId],
	queryFn: async () => {
		const result = await getUserService.execute({ id: userId });
		if (!isSuccess(result)) {
			throw result.error; // React Query handles thrown errors
		}
		return result.data;
	},
});

// React Query provides error handling
if (error) {
	// error is a DomainError
	if (error.type === 'NOT_FOUND') {
		return <div>User not found</div>;
	}
	return <div>Error: {error.message}</div>;
}
```

### Pattern 3: Custom Error Mapping

Transform errors at the service level:

```typescript
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
			// Add context-specific information
			if (error.type === 'NETWORK_ERROR') {
				return {
					...error,
					message: 'Unable to connect to server. Please check your internet connection.',
				};
			}
			return error;
		},
	});
}
```

### Pattern 4: Handling Validation Errors

For forms with field-level validation errors:

```typescript
const result = await createUserService.execute(userData);

if (!isSuccess(result)) {
	const error = result.error;

	// Check for validation errors
	if (error.validationErrors && error.validationErrors.length > 0) {
		// Map validation errors to form fields
		const fieldErrors = error.validationErrors.reduce(
			(acc, err) => {
				acc[err.field] = err.message;
				return acc;
			},
			{} as Record<string, string>
		);

		// Set form errors
		setFormErrors(fieldErrors);
		return;
	}

	// Handle other error types
	toast.error(error.message);
}
```

### Pattern 5: Error Type Checking Utilities

Use error adapter utilities for type checking:

```typescript
import { errorAdapter } from '@core/http/errorAdapter';

const result = await getUserService.execute({ id: userId });

if (!isSuccess(result)) {
	const error = result.error;

	// Check error types
	if (errorAdapter.isClientError(error)) {
		// 4xx errors
		console.log('Client error:', error.status);
	}

	if (errorAdapter.isServerError(error)) {
		// 5xx errors
		console.log('Server error:', error.status);
	}

	if (errorAdapter.isRetryable(error)) {
		// Can retry this error
		console.log('Retryable error');
	}

	if (errorAdapter.isType(error, 'NOT_FOUND')) {
		// Specific error type
		console.log('Resource not found');
	}
}
```

### Pattern 6: Global Error Handling with React Query

Configure global error handling in your QueryProvider:

```typescript
// app/providers/QueryProvider.tsx
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			// ... other options
			onError: (error: DomainError) => {
				// Global error logging
				if (error.type === 'NETWORK_ERROR') {
					// Show network error notification
				} else if (error.type === 'SERVER_ERROR') {
					// Log to error tracking service
				}
			},
		},
		mutations: {
			onError: (error: DomainError) => {
				// Global mutation error handling
			},
		},
	},
});
```

---

## Request/Response Patterns

### Pattern 1: Simple GET Request

```typescript
export function createGetUserService(http: HttpPort): ApiService<{ id: string }, User> {
	return createApiService<{ id: string }, User>(http, {
		endpoint: request => `/api/users/${request.id}`,
		method: 'GET',
		responseSchema: userSchema,
		defaultErrorMessage: 'Failed to load user',
	});
}
```

### Pattern 2: GET with Query Parameters

```typescript
export interface SearchUsersRequest {
	query: string;
	page?: number;
	limit?: number;
}

export function createSearchUsersService(http: HttpPort): ApiService<SearchUsersRequest, User[]> {
	return createApiService<SearchUsersRequest, User[]>(http, {
		endpoint: request => {
			const params = new URLSearchParams({ q: request.query });
			if (request.page) params.set('page', request.page.toString());
			if (request.limit) params.set('limit', request.limit.toString());
			return `/api/users/search?${params.toString()}`;
		},
		method: 'GET',
		responseSchema: z.array(userSchema),
		defaultErrorMessage: 'Failed to search users',
	});
}
```

### Pattern 3: POST with Request Body

```typescript
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

### Pattern 4: PUT/PATCH for Updates

```typescript
export interface UpdateUserRequest {
	id: string;
	name?: string;
	email?: string;
}

export function createUpdateUserService(http: HttpPort): ApiService<UpdateUserRequest, User> {
	return createApiService<UpdateUserRequest, User>(http, {
		endpoint: request => `/api/users/${request.id}`,
		method: 'PATCH',
		requestMapper: ({ request }) => {
			const { id, ...updateData } = request;
			return {
				body: updateData,
			};
		},
		responseSchema: userSchema,
		defaultErrorMessage: 'Failed to update user',
	});
}
```

### Pattern 5: DELETE Request

```typescript
export function createDeleteUserService(http: HttpPort): ApiService<{ id: string }, void> {
	return createApiService<{ id: string }, void>(http, {
		endpoint: request => `/api/users/${request.id}`,
		method: 'DELETE',
		defaultErrorMessage: 'Failed to delete user',
	});
}
```

### Pattern 6: Custom Request Headers

```typescript
export function createUploadFileService(http: HttpPort): ApiService<FormData, { fileId: string }> {
	return createApiService<FormData, { fileId: string }>(http, {
		endpoint: '/api/files/upload',
		method: 'POST',
		defaultConfig: {
			timeout: 60000, // 60 seconds for file uploads
			// Don't set Content-Type for FormData - browser sets it with boundary
		},
		requestMapper: ({ request }) => ({
			body: request,
		}),
		responseSchema: z.object({ fileId: z.string() }),
		defaultErrorMessage: 'Failed to upload file',
	});
}
```

### Pattern 7: Response Mapping (Raw API to Domain Model)

When the API response structure differs from your domain model:

```typescript
// Raw API response structure
interface RawApiUserResponse {
	data: {
		user: {
			id: string;
			full_name: string;
			email_address: string;
			created_at: string;
		};
	};
	meta: {
		timestamp: string;
	};
}

// Domain model
interface User {
	id: string;
	name: string;
	email: string;
	createdAt: string;
}

export function createGetUserService(
	http: HttpPort
): ApiService<{ id: string }, User, RawApiUserResponse> {
	return createApiService<{ id: string }, User, RawApiUserResponse>(http, {
		endpoint: request => `/api/users/${request.id}`,
		method: 'GET',
		responseMapper: context => {
			const raw = context.raw;
			return {
				id: raw.data.user.id,
				name: raw.data.user.full_name,
				email: raw.data.user.email_address,
				createdAt: raw.data.user.created_at,
			};
		},
		responseSchema: userSchema, // Validate the mapped response
		defaultErrorMessage: 'Failed to load user',
	});
}
```

### Pattern 8: Paginated Responses

```typescript
const paginatedUserSchema = z.object({
	data: z.array(userSchema),
	pagination: z.object({
		page: z.number(),
		pageSize: z.number(),
		total: z.number(),
		totalPages: z.number(),
	}),
});

export type PaginatedUsers = z.infer<typeof paginatedUserSchema>;

export interface GetUsersRequest {
	page?: number;
	pageSize?: number;
}

export function createGetUsersService(http: HttpPort): ApiService<GetUsersRequest, PaginatedUsers> {
	return createApiService<GetUsersRequest, PaginatedUsers>(http, {
		endpoint: request => {
			const params = new URLSearchParams();
			if (request.page) params.set('page', request.page.toString());
			if (request.pageSize) params.set('pageSize', request.pageSize.toString());
			return `/api/users?${params.toString()}`;
		},
		method: 'GET',
		responseSchema: paginatedUserSchema,
		defaultErrorMessage: 'Failed to load users',
	});
}
```

### Pattern 9: Request Options (AbortSignal, Custom Config)

```typescript
// Using AbortSignal for cancellation
const abortController = new AbortController();

const result = await getUserService.execute(
	{ id: userId },
	{
		signal: abortController.signal,
		httpConfig: {
			timeout: 5000, // 5 second timeout
		},
		errorMessage: 'Custom error message for this request',
	}
);

// Cancel the request
abortController.abort();
```

### Pattern 10: Conditional Request Configuration

```typescript
export function createGetUserService(http: HttpPort): ApiService<{ id: string }, User> {
	return createApiService<{ id: string }, User>(http, {
		endpoint: request => `/api/users/${request.id}`,
		method: 'GET',
		requestMapper: ({ request, options }) => {
			// Add custom headers or config based on request
			return {
				config: {
					headers: {
						'X-Request-ID': generateRequestId(),
					},
				},
			};
		},
		responseSchema: userSchema,
		defaultErrorMessage: 'Failed to load user',
	});
}
```

---

## Mocking APIs for Development

### Overview

Mock Service Worker (MSW) is configured for mocking API endpoints in both tests and development. This allows you to:

- Develop frontend features without a backend
- Test error scenarios
- Simulate slow network conditions
- Test offline behavior

### Setup for Development

MSW is already configured for tests. To use it in development:

1. **Install MSW Browser Worker** (if not already installed):

```bash
pnpm add -D msw
```

2. **Initialize MSW** (if not already done):

```bash
pnpm dlx msw init public/ --save
```

3. **Create Development Handlers**

Create a separate handlers file for development:

```typescript
// tests/mocks/handlers.dev.ts
import { http, HttpResponse } from 'msw';
import { buildApiResponse } from '@tests/factories/apiFactories';

export const devHandlers = [
	// User endpoints
	http.get('/api/users/:id', ({ params }) => {
		const { id } = params;
		return HttpResponse.json({
			id: id as string,
			name: 'John Doe',
			email: 'john@example.com',
			createdAt: new Date().toISOString(),
		});
	}),

	http.get('/api/users', ({ request }) => {
		const url = new URL(request.url);
		const page = parseInt(url.searchParams.get('page') || '1', 10);
		const pageSize = parseInt(url.searchParams.get('pageSize') || '10', 10);

		const users = Array.from({ length: 25 }, (_, i) => ({
			id: `user-${i + 1}`,
			name: `User ${i + 1}`,
			email: `user${i + 1}@example.com`,
			createdAt: new Date().toISOString(),
		}));

		const startIndex = (page - 1) * pageSize;
		const endIndex = startIndex + pageSize;

		return HttpResponse.json({
			data: users.slice(startIndex, endIndex),
			pagination: {
				page,
				pageSize,
				total: users.length,
				totalPages: Math.ceil(users.length / pageSize),
			},
		});
	}),

	http.post('/api/users', async ({ request }) => {
		const body = await request.json();
		return HttpResponse.json(
			{
				id: `user-${Date.now()}`,
				...body,
				createdAt: new Date().toISOString(),
			},
			{ status: 201 }
		);
	}),

	http.patch('/api/users/:id', async ({ params, request }) => {
		const { id } = params;
		const body = await request.json();
		return HttpResponse.json({
			id: id as string,
			...body,
			updatedAt: new Date().toISOString(),
		});
	}),

	http.delete('/api/users/:id', () => {
		return HttpResponse.json({ success: true }, { status: 200 });
	}),
];
```

4. **Enable MSW in Development**

Create a development setup file:

```typescript
// src/mocks/browser.ts
import { setupWorker } from 'msw/browser';
import { devHandlers } from '@tests/mocks/handlers.dev';

export const worker = setupWorker(...devHandlers);
```

5. **Initialize in Development Mode**

```typescript
// src/app/main.tsx or similar entry point
import { worker } from './mocks/browser';

async function enableMocking() {
	if (import.meta.env.DEV) {
		await worker.start({
			onUnhandledRequest: 'bypass', // Don't warn about unhandled requests in dev
		});
	}
}

enableMocking().then(() => {
	// Start your app
});
```

### Mocking Patterns

#### Pattern 1: Simple Success Response

```typescript
http.get('/api/users/:id', ({ params }) => {
	return HttpResponse.json({
		id: params.id,
		name: 'John Doe',
		email: 'john@example.com',
	});
});
```

#### Pattern 2: Error Responses

```typescript
import { createErrorHandler } from '@tests/mocks/handlers';

// Return 404
http.get('/api/users/:id', ({ params }) => {
	return HttpResponse.json(
		{ error: { message: 'User not found', code: 'USER_NOT_FOUND' } },
		{ status: 404 }
	);
});

// Or use helper
server.use(createErrorHandler('/api/users/123', 404, 'User not found', 'USER_NOT_FOUND'));
```

#### Pattern 3: Delayed Responses (Simulate Slow Network)

```typescript
http.get('/api/users/:id', async ({ params }) => {
	await delay(2000); // 2 second delay
	return HttpResponse.json({
		id: params.id,
		name: 'John Doe',
		email: 'john@example.com',
	});
});

function delay(ms: number) {
	return new Promise(resolve => setTimeout(resolve, ms));
}
```

#### Pattern 4: Conditional Responses

```typescript
http.get('/api/users/:id', ({ params, request }) => {
	const url = new URL(request.url);
	const includeEmail = url.searchParams.get('includeEmail') === 'true';

	const user = {
		id: params.id,
		name: 'John Doe',
	};

	if (includeEmail) {
		user.email = 'john@example.com';
	}

	return HttpResponse.json(user);
});
```

#### Pattern 5: Request Body Validation

```typescript
http.post('/api/users', async ({ request }) => {
	const body = await request.json();

	// Validate request
	if (!body.name || !body.email) {
		return HttpResponse.json(
			{
				error: {
					message: 'Validation failed',
					code: 'VALIDATION_ERROR',
					validationErrors: [
						{ field: 'name', message: 'Name is required' },
						{ field: 'email', message: 'Email is required' },
					],
				},
			},
			{ status: 400 }
		);
	}

	return HttpResponse.json(
		{
			id: `user-${Date.now()}`,
			...body,
			createdAt: new Date().toISOString(),
		},
		{ status: 201 }
	);
});
```

#### Pattern 6: Using Factory Functions

```typescript
import { buildApiResponse } from '@tests/factories/apiFactories';

http.get('/api/slideshow', () => {
	return HttpResponse.json(buildApiResponse());
});

// With overrides
http.get('/api/slideshow', () => {
	return HttpResponse.json(
		buildApiResponse({
			slideshow: { title: 'Custom Title' },
		})
	);
});
```

### Testing with MSW

MSW is already configured in `tests/setupTests.ts`. Override handlers in specific tests:

```typescript
import { describe, expect, it } from 'vitest';
import { renderWithProviders, screen, waitFor } from '@tests/utils/testUtils';
import { server } from '@tests/setupTests';
import { http, HttpResponse } from 'msw';
import { UserProfile } from './UserProfile';

describe('UserProfile', () => {
	it('displays user data', async () => {
		// Override default handler for this test
		server.use(
			http.get('/api/users/:id', ({ params }) => {
				return HttpResponse.json({
					id: params.id,
					name: 'Test User',
					email: 'test@example.com',
					createdAt: new Date().toISOString(),
				});
			})
		);

		renderWithProviders(<UserProfile userId="123" />);

		await waitFor(() => {
			expect(screen.getByText('Test User')).toBeInTheDocument();
		});
	});

	it('handles 404 error', async () => {
		server.use(
			http.get('/api/users/:id', () => {
				return HttpResponse.json(
					{ error: { message: 'User not found' } },
					{ status: 404 }
				);
			})
		);

		renderWithProviders(<UserProfile userId="999" />);

		await waitFor(() => {
			expect(screen.getByText(/not found/i)).toBeInTheDocument();
		});
	});
});
```

### Mocking Best Practices

1. **Use Factory Functions**: Create reusable factory functions for consistent test data
2. **Organize by Domain**: Group handlers by domain/resource
3. **Match Real API Structure**: Keep mock responses similar to real API responses
4. **Test Error Scenarios**: Create handlers for various error cases (404, 500, network errors)
5. **Use Helpers**: Leverage helper functions like `createErrorHandler` and `createNotFoundHandler`
6. **Reset Between Tests**: Handlers are automatically reset in `setupTests.ts`

### Development vs Test Handlers

- **Test Handlers** (`tests/mocks/handlers.ts`): Used in unit and integration tests
- **Development Handlers** (`tests/mocks/handlers.dev.ts`): Used when developing without a backend

Both can share factory functions from `tests/factories/` for consistency.

---

## Complete Example: User Service Integration

Here's a complete example combining all patterns:

```typescript
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
	updatedAt: z.string().optional(),
});

const paginatedUsersSchema = z.object({
	data: z.array(userSchema),
	pagination: z.object({
		page: z.number(),
		pageSize: z.number(),
		total: z.number(),
		totalPages: z.number(),
	}),
});

// Types
export type User = z.infer<typeof userSchema>;
export type PaginatedUsers = z.infer<typeof paginatedUsersSchema>;

export interface GetUserRequest {
	id: string;
}

export interface GetUsersRequest {
	page?: number;
	pageSize?: number;
}

export interface CreateUserRequest {
	name: string;
	email: string;
}

export interface UpdateUserRequest {
	id: string;
	name?: string;
	email?: string;
}

// Service Factories
export function createGetUserService(http: HttpPort): ApiService<GetUserRequest, User> {
	return createApiService<GetUserRequest, User>(http, {
		endpoint: request => `/api/users/${request.id}`,
		method: 'GET',
		responseSchema: userSchema,
		defaultErrorMessage: 'Failed to load user',
		errorMapper: (error, context) => {
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

export function createGetUsersService(http: HttpPort): ApiService<GetUsersRequest, PaginatedUsers> {
	return createApiService<GetUsersRequest, PaginatedUsers>(http, {
		endpoint: request => {
			const params = new URLSearchParams();
			if (request.page) params.set('page', request.page.toString());
			if (request.pageSize) params.set('pageSize', request.pageSize.toString());
			return `/api/users?${params.toString()}`;
		},
		method: 'GET',
		responseSchema: paginatedUsersSchema,
		defaultErrorMessage: 'Failed to load users',
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

export function createUpdateUserService(http: HttpPort): ApiService<UpdateUserRequest, User> {
	return createApiService<UpdateUserRequest, User>(http, {
		endpoint: request => `/api/users/${request.id}`,
		method: 'PATCH',
		requestMapper: ({ request }) => {
			const { id, ...updateData } = request;
			return {
				body: updateData,
			};
		},
		responseSchema: userSchema,
		defaultErrorMessage: 'Failed to update user',
	});
}

export function createDeleteUserService(http: HttpPort): ApiService<{ id: string }, void> {
	return createApiService<{ id: string }, void>(http, {
		endpoint: request => `/api/users/${request.id}`,
		method: 'DELETE',
		defaultErrorMessage: 'Failed to delete user',
	});
}
```

```typescript
// domains/users/components/UserList.tsx
import { useQuery } from '@tanstack/react-query';
import { useHttp } from '@core/providers/http/useHttp';
import { createGetUsersService } from '../services/api/userService';
import { isSuccess } from '@src-types/result';
import { useMemo } from 'react';

export function UserList() {
	const http = useHttp();
	const getUsersService = useMemo(() => createGetUsersService(http), [http]);

	const { data, isLoading, error } = useQuery({
		queryKey: ['users'],
		queryFn: async () => {
			const result = await getUsersService.execute({ page: 1, pageSize: 10 });
			if (!isSuccess(result)) {
				throw result.error;
			}
			return result.data;
		},
	});

	if (isLoading) return <div>Loading users...</div>;
	if (error) return <div>Error: {error.message}</div>;
	if (!data) return null;

	return (
		<div>
			{data.data.map(user => (
				<div key={user.id}>
					<h3>{user.name}</h3>
					<p>{user.email}</p>
				</div>
			))}
			<div>
				Page {data.pagination.page} of {data.pagination.totalPages}
			</div>
		</div>
	);
}
```

---

## See Also

- [API Service Factory README](../src/core/api/README.md) - Detailed API service factory documentation
- [Error Handling Guide](./error-handling.md) - Comprehensive error handling patterns
- [State Management Guide](./state-management.md) - React Query and Zustand usage
- [Testing Guide](./testing.md) - Testing strategies and MSW setup
