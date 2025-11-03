/**
 * MSW request handlers
 *
 * Defines handlers for mocking API endpoints.
 * Handlers are organized by domain/resource.
 *
 * Note: This file uses MSW's `http` API (v2.x+). If using MSW v1.x,
 * use `rest` instead of `http`.
 *
 * To use these handlers:
 * 1. Install MSW: `pnpm add -D msw`
 * 2. Set up server in tests/setupTests.ts
 * 3. Import and use handlers in your test files
 */

/**
 * MSW handlers array
 * Add handlers for your API endpoints here
 *
 * @example
 * ```ts
 * import { http, HttpResponse } from 'msw';
 * import { buildApiResponse } from '@tests/factories/apiFactories';
 *
 * export const handlers = [
 *   // GET /api/slideshow
 *   http.get('/api/slideshow', () => {
 *     return HttpResponse.json(buildApiResponse());
 *   }),
 *
 *   // POST /api/users
 *   http.post('/api/users', async ({ request }) => {
 *     const body = await request.json();
 *     return HttpResponse.json({ id: '1', ...body }, { status: 201 });
 *   }),
 * ];
 * ```
 *
 * Currently empty - add handlers as needed for your API endpoints.
 */
export const handlers: unknown[] = [];

/**
 * Helper to create a handler that returns a 404 Not Found response
 *
 * @deprecated This is a placeholder function. When MSW is installed, implement this properly:
 * ```ts
 * import { http, HttpResponse } from 'msw';
 *
 * export function createNotFoundHandler(path: string | RegExp) {
 *   if (typeof path === 'string') {
 *     return http.get(path, () => {
 *       return HttpResponse.json(null, { status: 404 });
 *     });
 *   }
 *   return http.get(path, () => {
 *     return HttpResponse.json(null, { status: 404 });
 *   });
 * }
 * ```
 *
 * @param _path - API path pattern (unused, kept for API compatibility)
 * @returns MSW handler function (returns never since MSW is not installed)
 */
export function createNotFoundHandler(_path: string | RegExp): never {
	throw new Error(
		'createNotFoundHandler is not implemented. Install MSW and implement this function, or use MSW handlers directly.'
	);
}

/**
 * Helper to create a handler that returns a 500 Internal Server Error
 *
 * @deprecated This is a placeholder function. When MSW is installed, implement this properly:
 * ```ts
 * import { http, HttpResponse } from 'msw';
 *
 * export function createErrorHandler(path: string | RegExp, message?: string) {
 *   return http.all(path, () => {
 *     return HttpResponse.json(
 *       { error: { message: message ?? 'Internal Server Error' } },
 *       { status: 500 }
 *     );
 *   });
 * }
 * ```
 *
 * @param _path - API path pattern (unused, kept for API compatibility)
 * @param _message - Optional error message (unused, kept for API compatibility)
 * @returns MSW handler function (returns never since MSW is not installed)
 */
export function createErrorHandler(_path: string | RegExp, _message?: string): never {
	throw new Error(
		'createErrorHandler is not implemented. Install MSW and implement this function, or use MSW handlers directly.'
	);
}
