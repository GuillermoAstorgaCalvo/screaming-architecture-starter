/**
 * HTTP Client Response Parsing Utilities
 *
 * Utilities for parsing HTTP response bodies based on content type.
 */

import type { z } from 'zod';

/**
 * Parse JSON response
 * Returns null for empty strings to avoid type issues with non-nullable types
 * Optionally validates with Zod schema if provided
 */
export async function parseJsonResponse<T>(text: string, schema?: z.ZodType<T>): Promise<T | null> {
	if (!text.trim()) {
		return null;
	}
	try {
		const parsed = JSON.parse(text) as unknown;

		// Validate with schema if provided
		if (schema) {
			const result = schema.safeParse(parsed);
			if (result.success) {
				return result.data;
			}
			// Schema validation failed - throw error with details
			throw new Error(
				`Response validation failed: ${result.error.issues.map((e: { message: string }) => e.message).join(', ')}`
			);
		}

		// No schema provided - use type assertion (backward compatible)
		return parsed as T;
	} catch (error) {
		// If JSON parsing fails or schema validation fails, re-throw
		if (error instanceof Error) {
			throw error;
		}
		// If JSON parsing fails, return text as-is (for non-JSON text responses)
		return text as unknown as T;
	}
}

/**
 * Parse response body based on Content-Type
 * Optionally validates with Zod schema if provided (only for JSON responses)
 */
export async function parseResponse<T>(response: Response, schema?: z.ZodType<T>): Promise<T> {
	const contentType = response.headers.get('content-type') ?? '';
	if (contentType.includes('application/json')) {
		const text = await response.text();
		const parsed = await parseJsonResponse<T>(text, schema);
		// If parseJsonResponse returns null for empty strings, return null as T
		// This preserves backward compatibility while making the null case explicit
		if (parsed === null) {
			return null as unknown as T;
		}
		return parsed;
	}
	if (contentType.includes('text/')) {
		return (await response.text()) as unknown as T;
	}
	const isBinaryContent =
		contentType.startsWith('application/octet-stream') ||
		contentType.includes('image/') ||
		contentType.includes('video/') ||
		contentType.includes('audio/');
	if (isBinaryContent) {
		return (await response.blob()) as unknown as T;
	}
	return (await response.text()) as unknown as T;
}
