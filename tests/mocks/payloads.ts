/**
 * MSW response payloads
 *
 * Pre-defined response payloads for common API endpoints.
 * These payloads can be used directly in handlers or modified
 * in tests for specific scenarios.
 *
 * Note: These payloads are meant to be used with MSW handlers.
 * For test data builders (factories), use @tests/factories instead.
 */

import { type ApiResponse, buildApiResponse } from '@tests/factories/apiFactories';

/**
 * Example API response payloads
 * These match the structure used in ApiDemoSection
 */

/**
 * Default successful slideshow API response
 * Uses the factory function to ensure consistency
 *
 * Note: This is computed lazily to avoid module loading order issues in test environments
 */
export const defaultSlideshowResponse: ApiResponse = buildApiResponse();

/**
 * Empty slideshow response (for testing empty states)
 */
export const emptySlideshowResponse: ApiResponse = {
	slideshow: {
		author: '',
		date: new Date().toISOString(),
		slides: [],
		title: '',
	},
};

/**
 * Error response payloads
 */

/**
 * 404 Not Found error payload
 */
export const notFoundError = {
	status: 404,
	error: {
		message: 'Not Found',
		code: 'RESOURCE_NOT_FOUND',
	},
} as const;

/**
 * 500 Internal Server Error payload
 */
export const internalServerError = {
	status: 500,
	error: {
		message: 'Internal Server Error',
		code: 'INTERNAL_ERROR',
	},
} as const;

/**
 * 401 Unauthorized error payload
 */
export const unauthorizedError = {
	status: 401,
	error: {
		message: 'Unauthorized',
		code: 'UNAUTHORIZED',
	},
} as const;

/**
 * 403 Forbidden error payload
 */
export const forbiddenError = {
	status: 403,
	error: {
		message: 'Forbidden',
		code: 'FORBIDDEN',
	},
} as const;

/**
 * 422 Validation error payload
 */
export const validationError = {
	status: 422,
	error: {
		message: 'Validation Failed',
		code: 'VALIDATION_ERROR',
		details: {
			field: 'name',
			message: 'Name is required',
		},
	},
} as const;
