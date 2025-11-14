# Error Handling Guide

This guide explains how to handle errors consistently throughout the application using the Result type pattern and error adapters.

## Overview

The application uses a functional error handling approach with:

- **Result Type**: `Result<T, E>` for explicit success/failure handling
- **Error Adapters**: Normalize errors from different sources (HTTP, API, network)
- **Domain Errors**: Structured error types for consistent error handling

## Result Type Pattern

The `Result<T, E>` type represents either success or failure, similar to Rust's `Result` or functional programming's `Either` type.

### Basic Usage

```tsx
import { ok, err, isSuccess, isFailure } from '@src-types/result';

// Create results
const success = ok({ id: '123', name: 'John' });
const failure = err(new Error('Not found'));

// Check result
if (isSuccess(success)) {
	console.log(success.data); // { id: '123', name: 'John' }
}

if (isFailure(failure)) {
	console.error(failure.error); // Error: Not found
}
```

### Result Utilities

```tsx
import {
	ok,
	err,
	isSuccess,
	isFailure,
	unwrap,
	unwrapOr,
	unwrapOrElse,
	mapResult,
	mapError,
	flatMap,
	toResult,
	combineResults,
} from '@src-types/result';

// Unwrap with default
const value = unwrapOr(result, defaultValue);

// Unwrap with fallback function
const value = unwrapOrElse(result, error => {
	console.error(error);
	return defaultValue;
});

// Map success value
const doubled = mapResult(result, n => n * 2);

// Map error value
const mappedError = mapError(result, err => new CustomError(err.message));

// Chain operations
const chained = flatMap(result, data => {
	return processData(data);
});

// Convert Promise to Result
const result = await toResult(fetch('/api/users'));

// Combine multiple results
const results = [result1, result2, result3];
const combined = combineResults(results); // Returns first failure or array of values
```

## API Service Error Handling

The `createApiService` factory automatically returns `Result<TResponse, DomainError>`:

```tsx
import { createApiService } from '@core/api/createApiService';
import { useHttp } from '@core/providers/http/useHttp';
import { unwrapOr } from '@src-types/result';

const getUserService = http =>
	createApiService(http, {
		endpoint: req => `/api/users/${req.id}`,
		method: 'GET',
		defaultErrorMessage: 'Failed to load user',
	});

function UserProfile({ userId }: { userId: string }) {
	const http = useHttp();
	const service = getUserService(http);
	const [user, setUser] = useState(null);
	const [error, setError] = useState(null);

	useEffect(() => {
		const loadUser = async () => {
			const result = await service.execute({ id: userId });

			if (isSuccess(result)) {
				setUser(result.data);
				setError(null);
			} else {
				setError(result.error);
				// result.error is a DomainError with structured information
				console.error('Error type:', result.error.type);
				console.error('Error message:', result.error.message);
				console.error('HTTP status:', result.error.status);
			}
		};

		loadUser();
	}, [userId]);

	if (error) {
		return <div>Error: {error.message}</div>;
	}

	return <div>{user?.name}</div>;
}
```

## Domain Error Types

Domain errors are structured with type information:

```tsx
interface DomainError {
	type: DomainErrorType;
	message: string;
	status?: number;
	code?: string;
	originalError?: HttpClientError;
	apiError?: ApiErrorResponse;
	validationErrors?: Array<{ field: string; message: string }>;
}
```

**Error Types**:

- `'NETWORK_ERROR'`: Network connectivity issues
- `'HTTP_ERROR'`: HTTP errors (4xx, 5xx)
- `'VALIDATION_ERROR'`: Request/response validation failures
- `'UNAUTHORIZED'`: Authentication required
- `'FORBIDDEN'`: Insufficient permissions
- `'NOT_FOUND'`: Resource not found
- `'SERVER_ERROR'`: Server-side errors (5xx)
- `'UNKNOWN_ERROR'`: Unexpected errors

## Error Handling Patterns

### Pattern 1: Early Return with Result

```tsx
async function processUser(userId: string): Promise<Result<User, DomainError>> {
	// Step 1: Fetch user
	const userResult = await getUserService.execute({ id: userId });
	if (isFailure(userResult)) {
		return userResult; // Early return on failure
	}

	// Step 2: Validate user
	if (!userResult.data.isActive) {
		return err({
			type: 'VALIDATION_ERROR',
			message: 'User is not active',
		});
	}

	// Step 3: Process user
	const processed = await processUserData(userResult.data);
	return ok(processed);
}
```

### Pattern 2: Using flatMap for Chaining

```tsx
async function processUser(userId: string): Promise<Result<User, DomainError>> {
	const result = await getUserService.execute({ id: userId });

	return flatMap(result, async user => {
		if (!user.isActive) {
			return err({
				type: 'VALIDATION_ERROR',
				message: 'User is not active',
			});
		}
		return ok(await processUserData(user));
	});
}
```

### Pattern 3: Error Handling in Components

```tsx
import { useToast } from '@core/providers/toast/useToast';
import { isSuccess, isFailure } from '@src-types/result';

function UserForm() {
	const toast = useToast();
	const http = useHttp();
	const service = createUserService(http);

	const handleSubmit = async (data: UserData) => {
		const result = await service.execute(data);

		if (isSuccess(result)) {
			toast.success('User created successfully');
			// Handle success
		} else {
			// Handle different error types
			switch (result.error.type) {
				case 'VALIDATION_ERROR':
					toast.error('Please check your input', {
						description: result.error.validationErrors
							?.map(e => `${e.field}: ${e.message}`)
							.join(', '),
					});
					break;
				case 'NETWORK_ERROR':
					toast.error('Network error', {
						description: 'Please check your connection',
					});
					break;
				default:
					toast.error(result.error.message || 'An error occurred');
			}
		}
	};

	return <form onSubmit={handleSubmit}>...</form>;
}
```

### Pattern 4: Error Handling with React Query

```tsx
import { useMutation } from '@tanstack/react-query';
import { isSuccess } from '@src-types/result';

function UserForm() {
	const http = useHttp();
	const service = createUserService(http);
	const toast = useToast();

	const mutation = useMutation({
		mutationFn: async (data: UserData) => {
			const result = await service.execute(data);
			if (isSuccess(result)) {
				return result.data;
			}
			throw result.error; // React Query expects thrown errors
		},
		onSuccess: () => {
			toast.success('User created successfully');
		},
		onError: (error: DomainError) => {
			toast.error(error.message || 'Failed to create user');
		},
	});

	return <form onSubmit={data => mutation.mutate(data)}>...</form>;
}
```

## Error Adapter

The HTTP error adapter normalizes errors from different sources:

```tsx
import { httpErrorAdapter } from '@core/http/errorAdapter';

try {
	await http.get('/api/users');
} catch (error) {
	// Normalize any error to DomainError
	const domainError = httpErrorAdapter.adapt(error);

	// Check error type
	if (httpErrorAdapter.isClientError(domainError)) {
		// 4xx errors
	} else if (httpErrorAdapter.isServerError(domainError)) {
		// 5xx errors
	} else if (httpErrorAdapter.isRetryable(domainError)) {
		// Can retry this error
	}
}
```

**Error Adapter Methods**:

- `adapt(error, options?)`: Convert any error to DomainError
- `isType(error, type)`: Check if error is specific type
- `isClientError(error)`: Check if 4xx error
- `isServerError(error)`: Check if 5xx error
- `isRetryable(error)`: Check if error can be retried

## Best Practices

### 1. Always Handle Results

```tsx
// ✅ Good - explicit error handling
const result = await service.execute(data);
if (isFailure(result)) {
	handleError(result.error);
	return;
}
useSuccess(result.data);

// ❌ Bad - ignoring errors
const result = await service.execute(data);
useSuccess(result.data); // What if it failed?
```

### 2. Use Type Guards

```tsx
// ✅ Good - type-safe
if (isSuccess(result)) {
	// TypeScript knows result.data exists
	console.log(result.data);
}

// ❌ Bad - unsafe
console.log(result.data); // Might not exist!
```

### 3. Provide User-Friendly Messages

```tsx
// ✅ Good - user-friendly
toast.error('Failed to save changes', {
	description: 'Please try again or contact support',
});

// ❌ Bad - technical
toast.error('HTTP 500: Internal Server Error');
```

### 4. Log Errors for Debugging

```tsx
import { useLogger } from '@core/providers/logger/useLogger';

const logger = useLogger();

const result = await service.execute(data);
if (isFailure(result)) {
	logger.error('Failed to execute service', {
		error: result.error,
		context: { userId, action: 'update' },
	});
	toast.error('Operation failed');
}
```

### 5. Handle Different Error Types Appropriately

```tsx
if (isFailure(result)) {
	switch (result.error.type) {
		case 'VALIDATION_ERROR':
			// Show field-level errors
			showValidationErrors(result.error.validationErrors);
			break;
		case 'UNAUTHORIZED':
			// Redirect to login
			redirectToLogin();
			break;
		case 'NETWORK_ERROR':
			// Show retry option
			showRetryButton();
			break;
		default:
			// Generic error handling
			showGenericError(result.error.message);
	}
}
```

## Common Error Scenarios

### Network Errors

```tsx
const result = await service.execute(data);
if (isFailure(result) && result.error.type === 'NETWORK_ERROR') {
	toast.error('Connection error', {
		description: 'Please check your internet connection',
		action: {
			label: 'Retry',
			onClick: () => retry(),
		},
	});
}
```

### Validation Errors

```tsx
const result = await service.execute(data);
if (isFailure(result) && result.error.type === 'VALIDATION_ERROR') {
	// Display field-level errors
	result.error.validationErrors?.forEach(({ field, message }) => {
		setFieldError(field, message);
	});
}
```

### Authentication Errors

```tsx
const result = await service.execute(data);
if (isFailure(result) && result.error.type === 'UNAUTHORIZED') {
	// Clear auth state and redirect
	auth.logout();
	navigate('/login');
}
```

## Related Documentation

- [API Service Factory Guide](./api-service-factory.md) - How services return Results
- [Providers Guide](./providers.md) - Logger and Toast providers
- [Result Type Source](../src/types/result.ts) - Full Result type implementation
