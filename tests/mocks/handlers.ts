/**
 * MSW request handlers
 *
 * Defines handlers for mocking API endpoints.
 * Handlers are organized by domain/resource.
 *
 * Note: This file uses MSW's `http` API (v2.x+).
 *
 * To use these handlers:
 * 1. Handlers are automatically set up in tests/setupTests.ts
 * 2. Import and override handlers in your test files as needed
 */

import { buildApiResponse } from '@tests/factories/apiFactories';
import { http, HttpResponse } from 'msw';

/**
 * MSW handlers array
 * Handlers for mocking API endpoints used in the application
 */
export const handlers = [
	// GET /api/demo - Used by UseFetchDemo component
	http.get('/api/demo', () => {
		return HttpResponse.json({ message: 'Hello from MSW!' });
	}),

	// GET /api/slideshow - Example slideshow endpoint with query parameter support
	http.get('/api/slideshow', ({ request }) => {
		const url = new URL(request.url);
		const empty = url.searchParams.get('empty');

		if (empty === 'true') {
			return HttpResponse.json({
				slideshow: {
					author: '',
					date: new Date().toISOString(),
					slides: [],
					title: '',
				},
			});
		}

		return HttpResponse.json(buildApiResponse());
	}),
] as const;

/**
 * Helper to create a handler that returns a 404 Not Found response
 *
 * @param path - API path pattern (string or RegExp)
 * @param method - HTTP method (default: 'get')
 * @returns MSW handler function
 *
 * @example
 * ```ts
 * // Override a handler in a test
 * server.use(createNotFoundHandler('/api/users/123'));
 * ```
 */
export function createNotFoundHandler(
	path: string | RegExp,
	method: 'get' | 'post' | 'put' | 'patch' | 'delete' | 'all' = 'get'
) {
	const handlerMap = {
		get: http.get,
		post: http.post,
		put: http.put,
		patch: http.patch,
		delete: http.delete,
		all: http.all,
	};

	return handlerMap[method](path, () => {
		return HttpResponse.json(
			{ error: { message: 'Not Found', code: 'RESOURCE_NOT_FOUND' } },
			{ status: 404 }
		);
	});
}

/**
 * Helper to create a handler that returns an error response
 *
 * @param path - API path pattern (string or RegExp)
 * @param status - HTTP status code (default: 500)
 * @param message - Error message (default: 'Internal Server Error')
 * @param code - Error code (optional)
 * @param method - HTTP method (default: 'all')
 * @returns MSW handler function
 *
 * @example
 * ```ts
 * // Override a handler to return a 500 error
 * server.use(createErrorHandler('/api/users', 500, 'Server Error', 'INTERNAL_ERROR'));
 *
 * // Override to return a 401 unauthorized
 * server.use(createErrorHandler('/api/protected', 401, 'Unauthorized', 'UNAUTHORIZED'));
 * ```
 */
export function createErrorHandler(
	path: string | RegExp,
	status = 500,
	message = 'Internal Server Error',
	code?: string,
	method: 'get' | 'post' | 'put' | 'patch' | 'delete' | 'all' = 'all'
) {
	const handlerMap = {
		get: http.get,
		post: http.post,
		put: http.put,
		patch: http.patch,
		delete: http.delete,
		all: http.all,
	};

	return handlerMap[method](path, () => {
		return HttpResponse.json(
			{
				error: {
					message,
					...(code && { code }),
				},
			},
			{ status }
		);
	});
}
