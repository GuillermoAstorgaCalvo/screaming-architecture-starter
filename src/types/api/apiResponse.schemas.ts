import { z } from 'zod';

/**
 * Schema for API metadata that may accompany responses.
 */
export const apiMetadataSchema = z.record(z.string(), z.unknown());

const httpResponseShape = {
	status: z.number(),
	statusText: z.string(),
	headers: z.unknown(),
	response: z.unknown(),
} as const;

const apiMetaShape = {
	apiMeta: z
		.object({
			version: z.string().optional(),
			requestId: z.string().optional(),
			timestamp: z.string().optional(),
		})
		.optional(),
} as const;

/**
 * Factory for standard API response schema.
 *
 * @param dataSchema - Schema describing the response `data` payload.
 */
export function createApiResponseSchema<T extends z.ZodType>(dataSchema: T) {
	return z
		.object({
			data: dataSchema,
			message: z.string().optional(),
			metadata: apiMetadataSchema.optional(),
		})
		.strict();
}

/**
 * Factory for API response schema with HTTP metadata returned by the HTTP client.
 *
 * @param dataSchema - Schema describing the response `data` payload.
 */
export function createApiResponseWithMetaSchema<T extends z.ZodType>(dataSchema: T) {
	return z
		.object({
			data: dataSchema,
			...httpResponseShape,
			...apiMetaShape,
		})
		.strict();
}

/**
 * Helper to compose the standard API response schema with HTTP metadata.
 *
 * Useful when the API wraps data using `ApiResponse` and the HTTP client attaches its own metadata.
 */
export function createComposedApiResponseSchema<T extends z.ZodType>(dataSchema: T) {
	return createApiResponseSchema(dataSchema).extend({
		...httpResponseShape,
		...apiMetaShape,
	});
}
