import { createApiService } from '@core/api/createApiService';
import { beforeEach, describe, expect, it } from 'vitest';

import {
	API_ENDPOINT,
	createMockHttpAdapter,
	createMockHttpResponse,
} from './createApiService.test-utils';

function setupTest() {
	const http = createMockHttpAdapter();
	return { http };
}

describe('createApiService - Request Preparation - Error Handling', () => {
	let http: ReturnType<typeof createMockHttpAdapter>;

	beforeEach(() => {
		({ http } = setupTest());
	});

	describe('Request Error Handling', () => {
		it('handles request mapper errors gracefully', async () => {
			const service = createApiService(http, {
				endpoint: API_ENDPOINT,
				requestMapper: () => {
					throw new Error('Request mapper error');
				},
			});

			// The error should propagate to the execute call
			await expect(service.execute({})).rejects.toThrow('Request mapper error');
		});

		it('handles invalid endpoint function', async () => {
			const service = createApiService<{ id: string }>(http, {
				endpoint: () => {
					throw new Error('Invalid endpoint');
				},
			});

			http.mockResponse(API_ENDPOINT, 'GET', createMockHttpResponse({}));
			// The error should propagate
			await expect(service.execute({ id: '1' })).rejects.toThrow('Invalid endpoint');
		});
	});
});
