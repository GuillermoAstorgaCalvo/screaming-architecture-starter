import { createApiService } from '@core/api/createApiService';
import { beforeEach, describe, expect, it } from 'vitest';

import {
	API_ENDPOINT,
	createMockHttpAdapter,
	createMockHttpResponse,
} from './createApiService.test-utils';

const TEST_USER_PATH = '/api/users/123';

function setupTest() {
	const http = createMockHttpAdapter();
	return { http };
}

describe('createApiService - Request Preparation - Body Handling', () => {
	let http: ReturnType<typeof createMockHttpAdapter>;

	beforeEach(() => {
		({ http } = setupTest());
	});

	it('should include body in request when provided', async () => {
		const service = createApiService<{ name: string }>(http, {
			endpoint: API_ENDPOINT,
			method: 'POST',
			requestMapper: ({ request }) => ({
				body: { name: request.name },
			}),
		});

		http.mockResponse(API_ENDPOINT, 'POST', createMockHttpResponse({ success: true }));

		await service.execute({ name: 'Test' });

		expect(http.requests).toHaveLength(1);
		expect(http.requests[0]?.body).toEqual({ name: 'Test' });
		expect(http.requests[0]?.config?.method).toBe('POST');
	});

	it('should handle body with different types', async () => {
		const service = createApiService(http, {
			endpoint: API_ENDPOINT,
			method: 'POST',
			requestMapper: () => ({
				body: { string: 'test', number: 123, boolean: true, array: [1, 2, 3] },
			}),
		});

		http.mockResponse(API_ENDPOINT, 'POST', createMockHttpResponse({}));

		await service.execute({});

		expect(http.requests).toHaveLength(1);
		expect(http.requests[0]?.body).toEqual({
			string: 'test',
			number: 123,
			boolean: true,
			array: [1, 2, 3],
		});
	});

	it('should not include body when undefined', async () => {
		const service = createApiService(http, {
			endpoint: API_ENDPOINT,
			method: 'GET',
			requestMapper: () => ({}),
		});

		http.mockResponse(API_ENDPOINT, 'GET', createMockHttpResponse({}));

		await service.execute({});

		expect(http.requests).toHaveLength(1);
		expect(http.requests[0]?.body).toBeUndefined();
	});
});

describe('createApiService - Request Preparation - Path Override', () => {
	let http: ReturnType<typeof createMockHttpAdapter>;

	beforeEach(() => {
		({ http } = setupTest());
	});

	it('should use path override from requestMapper', async () => {
		const service = createApiService<{ id: string }>(http, {
			endpoint: API_ENDPOINT,
			requestMapper: ({ request }) => ({
				path: `/api/users/${request.id}`,
			}),
		});

		http.mockResponse(TEST_USER_PATH, 'GET', createMockHttpResponse({}));

		await service.execute({ id: '123' });

		expect(http.requests).toHaveLength(1);
		expect(http.requests[0]?.url).toBe(TEST_USER_PATH);
	});

	it('should prioritize path override over endpoint function', async () => {
		const service = createApiService<{ id: string }>(http, {
			endpoint: request => `/api/items/${request.id}`,
			requestMapper: () => ({
				path: TEST_USER_PATH,
			}),
		});

		http.mockResponse(TEST_USER_PATH, 'GET', createMockHttpResponse({}));

		await service.execute({ id: '456' });

		expect(http.requests).toHaveLength(1);
		expect(http.requests[0]?.url).toBe(TEST_USER_PATH);
	});
});

describe('createApiService - Request Preparation - Headers Merging - defaultConfig and options', () => {
	let http: ReturnType<typeof createMockHttpAdapter>;

	beforeEach(() => {
		({ http } = setupTest());
	});

	it('should merge headers from defaultConfig and options', async () => {
		const service = createApiService(http, {
			endpoint: API_ENDPOINT,
			defaultConfig: {
				headers: { 'X-Default': 'default', 'X-Shared': 'default-value' },
			},
		});

		http.mockResponse(API_ENDPOINT, 'GET', createMockHttpResponse({}));

		await service.execute(
			{},
			{
				httpConfig: {
					headers: { 'X-Custom': 'custom', 'X-Shared': 'custom-value' },
				},
			}
		);

		expect(http.requests).toHaveLength(1);
		expect(http.requests[0]?.config?.headers).toEqual({
			'X-Default': 'default',
			'X-Shared': 'custom-value', // options should override
			'X-Custom': 'custom',
		});
	});
});

describe('createApiService - Request Preparation - Headers Merging - requestMapper config', () => {
	let http: ReturnType<typeof createMockHttpAdapter>;

	beforeEach(() => {
		({ http } = setupTest());
	});

	it('should merge headers from requestMapper config', async () => {
		const service = createApiService(http, {
			endpoint: API_ENDPOINT,
			defaultConfig: {
				headers: { 'X-Default': 'default' },
			},
			requestMapper: () => ({
				config: {
					headers: { 'X-Mapper': 'mapper' },
				},
			}),
		});

		http.mockResponse(API_ENDPOINT, 'GET', createMockHttpResponse({}));

		await service.execute({});

		expect(http.requests).toHaveLength(1);
		expect(http.requests[0]?.config?.headers).toEqual({
			'X-Default': 'default',
			'X-Mapper': 'mapper',
		});
	});
});

describe('createApiService - Request Preparation - Headers Merging - options.headers', () => {
	let http: ReturnType<typeof createMockHttpAdapter>;

	beforeEach(() => {
		({ http } = setupTest());
	});

	it('should merge headers from options.headers', async () => {
		const service = createApiService(http, {
			endpoint: API_ENDPOINT,
			defaultConfig: {
				headers: { 'X-Default': 'default' },
			},
		});

		http.mockResponse(API_ENDPOINT, 'GET', createMockHttpResponse({}));

		await service.execute(
			{},
			{
				headers: { 'X-Options': 'options' },
			}
		);

		expect(http.requests).toHaveLength(1);
		expect(http.requests[0]?.config?.headers).toEqual({
			'X-Default': 'default',
			'X-Options': 'options',
		});
	});
});

describe('createApiService - Request Preparation - Headers Merging - empty headers', () => {
	let http: ReturnType<typeof createMockHttpAdapter>;

	beforeEach(() => {
		({ http } = setupTest());
	});

	it('should remove empty headers object', async () => {
		const service = createApiService(http, {
			endpoint: API_ENDPOINT,
			requestMapper: () => ({
				config: {
					headers: {},
				},
			}),
		});

		http.mockResponse(API_ENDPOINT, 'GET', createMockHttpResponse({}));

		await service.execute({});

		expect(http.requests).toHaveLength(1);
		expect(http.requests[0]?.config?.headers).toBeUndefined();
	});
});

describe('createApiService - Request Preparation - Timeout and Signal', () => {
	let http: ReturnType<typeof createMockHttpAdapter>;

	beforeEach(() => {
		({ http } = setupTest());
	});

	it('should include timeout from options', async () => {
		const service = createApiService(http, {
			endpoint: API_ENDPOINT,
		});

		http.mockResponse(API_ENDPOINT, 'GET', createMockHttpResponse({}));

		await service.execute(
			{},
			{
				timeout: 5000,
			}
		);

		expect(http.requests).toHaveLength(1);
		expect(http.requests[0]?.config?.timeout).toBe(5000);
	});

	it('should include signal from options', async () => {
		const service = createApiService(http, {
			endpoint: API_ENDPOINT,
		});

		const controller = new AbortController();
		http.mockResponse(API_ENDPOINT, 'GET', createMockHttpResponse({}));

		await service.execute(
			{},
			{
				signal: controller.signal,
			}
		);

		expect(http.requests).toHaveLength(1);
		expect(http.requests[0]?.config?.signal).toBe(controller.signal);
	});

	it('should include both timeout and signal', async () => {
		const service = createApiService(http, {
			endpoint: API_ENDPOINT,
		});

		const controller = new AbortController();
		http.mockResponse(API_ENDPOINT, 'GET', createMockHttpResponse({}));

		await service.execute(
			{},
			{
				timeout: 10000,
				signal: controller.signal,
			}
		);

		expect(http.requests).toHaveLength(1);
		expect(http.requests[0]?.config?.timeout).toBe(10000);
		expect(http.requests[0]?.config?.signal).toBe(controller.signal);
	});
});

describe('createApiService - Request Preparation - Config Merging - multiple config sources', () => {
	let http: ReturnType<typeof createMockHttpAdapter>;

	beforeEach(() => {
		({ http } = setupTest());
	});

	it('should merge multiple config sources in correct order', async () => {
		const service = createApiService(http, {
			endpoint: API_ENDPOINT,
			defaultConfig: {
				headers: { 'X-Default': 'default' },
				timeout: 1000,
			},
			requestMapper: () => ({
				config: {
					headers: { 'X-Mapper': 'mapper' },
					timeout: 2000,
				},
			}),
		});

		http.mockResponse(API_ENDPOINT, 'GET', createMockHttpResponse({}));

		await service.execute(
			{},
			{
				httpConfig: {
					headers: { 'X-Options': 'options' },
					timeout: 3000,
				},
				headers: { 'X-Direct': 'direct' },
				timeout: 4000,
			}
		);

		expect(http.requests).toHaveLength(1);
		// Later configs should override earlier ones
		expect(http.requests[0]?.config?.timeout).toBe(4000);
		expect(http.requests[0]?.config?.headers).toEqual({
			'X-Default': 'default',
			'X-Mapper': 'mapper',
			'X-Options': 'options',
			'X-Direct': 'direct',
		});
	});
});

describe('createApiService - Request Preparation - Config Merging - undefined configs', () => {
	let http: ReturnType<typeof createMockHttpAdapter>;

	beforeEach(() => {
		({ http } = setupTest());
	});

	it('should handle undefined configs gracefully', async () => {
		const service = createApiService(http, {
			endpoint: API_ENDPOINT,
		});

		http.mockResponse(API_ENDPOINT, 'GET', createMockHttpResponse({}));

		await service.execute({});

		expect(http.requests).toHaveLength(1);
		expect(http.requests[0]?.config).toBeDefined();
	});
});

describe('createApiService - Request Preparation - Config Merging - non-header config properties', () => {
	let http: ReturnType<typeof createMockHttpAdapter>;

	beforeEach(() => {
		({ http } = setupTest());
	});

	it('should preserve non-header config properties', async () => {
		const service = createApiService(http, {
			endpoint: API_ENDPOINT,
			defaultConfig: {
				headers: { 'X-Test': 'test' },
			},
		});

		http.mockResponse(API_ENDPOINT, 'GET', createMockHttpResponse({}));

		await service.execute({});

		expect(http.requests).toHaveLength(1);
		expect(http.requests[0]?.config?.method).toBe('GET');
		expect(http.requests[0]?.config?.headers).toEqual({ 'X-Test': 'test' });
	});
});
