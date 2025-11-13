import { type ApiServiceSuccess, createApiService } from '@core/api/createApiService';
import type { DomainError } from '@core/http/errorAdapter.types';
import { MockHttpAdapter } from '@tests/utils/mocks/MockHttpAdapter';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';

describe('createApiService', () => {
	registerNormalizationTest();
	registerValidationFailureTest();
	registerErrorMapperTest();
});

function registerNormalizationTest() {
	it('returns ok result with normalized envelope data', async () => {
		const http = new MockHttpAdapter();

		const envelope = {
			data: { id: 'widget-1', name: 'Test Widget' },
			message: 'Fetched successfully',
			metadata: { page: 1 },
			apiMeta: { requestId: 'req-1', version: '1.2.3' },
		};

		http.mockResponse(
			url => url.startsWith('/api/widgets'),
			'GET',
			async () => ({
				data: envelope,
				status: 200,
				statusText: 'OK',
				headers: new Headers({ 'content-type': 'application/json' }),
				response: new Response(JSON.stringify(envelope)),
			})
		);

		const service = createApiService<{ id: string }, typeof envelope, { id: string; name: string }>(
			http,
			{
				endpoint: '/api/widgets',
				method: 'GET',
				requestMapper: ({ request }: { request: { id: string } }) => ({
					path: `/api/widgets/${request.id}`,
					query: { locale: 'en', preview: false, skip: undefined },
				}),
				responseSchema: z.object({
					id: z.string(),
					name: z.string(),
				}),
			}
		);

		const result = await service.execute({ id: 'widget-1' });

		expect(result.success).toBe(true);

		if (result.success) {
			const payload: ApiServiceSuccess<{ id: string; name: string }, typeof envelope> = result.data;
			expect(payload.data).toEqual({ id: 'widget-1', name: 'Test Widget' });
			expect(payload.message).toBe('Fetched successfully');
			expect(payload.metadata).toEqual({ page: 1 });
			expect(payload.apiMeta).toEqual({ requestId: 'req-1', version: '1.2.3' });
			expect(payload.rawData).toEqual(envelope);
			expect(payload.status).toBe(200);
		}

		expect(http.requests.at(-1)).toMatchObject({
			method: 'GET',
			url: '/api/widgets/widget-1?locale=en&preview=false',
		});
	});
}

function registerValidationFailureTest() {
	it('returns err result when response schema validation fails', async () => {
		const http = new MockHttpAdapter();

		http.mockResponse('/api/invalid', 'GET', async () => ({
			data: { id: 42 },
			status: 200,
			statusText: 'OK',
			headers: new Headers(),
			response: new Response(),
		}));

		const service = createApiService<void, { id: number }, { id: string }>(http, {
			endpoint: '/api/invalid',
			method: 'GET',
			responseSchema: z.object({
				id: z.string(),
			}),
			defaultErrorMessage: 'Custom validation message',
		});

		const result = await service.execute(undefined);

		expect(result.success).toBe(false);

		if (!result.success) {
			const { error } = result;
			expect(error.type).toBe('validation');
			expect(error.message).toBe('Custom validation message');
			expect(error.validationErrors).toEqual([
				expect.objectContaining({
					field: 'id',
					message: expect.stringContaining('expected string'),
				}),
			]);
			expect(error.code).toBe('INVALID_RESPONSE');
		}
	});
}

function registerErrorMapperTest() {
	it('applies error mapper to adapted errors', async () => {
		const http = new MockHttpAdapter();

		http.mockResponse('/api/error', 'GET', async () => {
			throw new Error('Boom');
		});

		const service = createApiService<void, unknown>(http, {
			endpoint: '/api/error',
			method: 'GET',
			defaultErrorMessage: 'Base message',
			errorMapper: (error: DomainError) => ({
				...error,
				code: 'OVERRIDDEN_ERROR',
			}),
		});

		const result = await service.execute(undefined);

		expect(result.success).toBe(false);

		if (!result.success) {
			expect(result.error.message).toBe('Base message');
			expect(result.error.code).toBe('OVERRIDDEN_ERROR');
		}
	});
}
