import { createApiService } from '@core/api/createApiService';
import type { ApiService } from '@core/api/createApiService.types';
import type { HttpPort } from '@core/ports/HttpPort';
import { z } from 'zod';

const demoContentSchema = z.object({
	message: z.string(),
});

export type DemoContentResponse = z.infer<typeof demoContentSchema>;

/**
 * Factory for landing domain demo content service.
 *
 * Demonstrates how domains can define API services with typed responses,
 * centralized error handling, and runtime validation.
 */
export function createDemoContentService(http: HttpPort): ApiService<void, DemoContentResponse> {
	return createApiService<void, DemoContentResponse>(http, {
		endpoint: '/api/demo',
		method: 'GET',
		responseSchema: demoContentSchema,
		defaultErrorMessage: 'errors.unableToLoadDemoContent',
	});
}
