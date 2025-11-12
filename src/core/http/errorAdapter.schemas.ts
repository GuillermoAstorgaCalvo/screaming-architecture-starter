/**
 * Error Adapter Schemas
 *
 * Zod schemas for validating API error responses and related structures.
 */

import { z } from 'zod';

/**
 * Schema for validation error items within API error responses
 */
const validationErrorItemSchema = z.object({
	/** Field name or path */
	field: z.string(),
	/** Error message */
	message: z.string(),
});

/**
 * Schema for API error response structure
 * Validates the standard API error response format
 */
export const apiErrorResponseSchema = z.object({
	/** Error message (required) */
	message: z.string(),
	/** Error code (optional) */
	code: z.string().optional(),
	/** Field-level validation errors (optional) */
	errors: z.array(validationErrorItemSchema).optional(),
	/** Additional error context (optional) */
	context: z.record(z.string(), z.unknown()).optional(),
});

/**
 * Schema for validation error items array
 * Used for extracting validation errors from API error responses
 */
export const validationErrorsSchema = z.array(validationErrorItemSchema);
