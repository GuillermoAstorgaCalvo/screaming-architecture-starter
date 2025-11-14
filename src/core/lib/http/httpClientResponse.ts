/**
 * HTTP Client Response Processing
 *
 * Handles response parsing, transformation, and response interceptor execution.
 */

import type { HttpClientResponse } from '@core/ports/HttpPort';
import type { z } from 'zod';

import { createHttpError } from './httpClientErrorCreation';
import { executeResponseInterceptors } from './httpClientInterceptors';
import { parseResponse } from './httpClientResponseParsing';

/**
 * Process response and handle errors
 * Optionally validates response data with Zod schema if provided
 */
export async function processHttpResponse<T>(
	response: Response,
	responseInterceptors: Parameters<typeof executeResponseInterceptors>[0],
	schema?: z.ZodType<T>
): Promise<HttpClientResponse<T>> {
	const data = await parseResponse<T>(response, schema);
	const httpResponse: HttpClientResponse<T> = {
		data,
		status: response.status,
		statusText: response.statusText,
		headers: response.headers,
		response,
	};

	if (response.ok) {
		return executeResponseInterceptors(responseInterceptors, httpResponse);
	}

	throw createHttpError(response, data);
}
