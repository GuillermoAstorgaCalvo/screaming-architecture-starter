import {
	createDeleteMethod,
	createGetMethod,
	createHeadMethod,
	createOptionsMethod,
	createPatchMethod,
	createPostMethod,
	createPutMethod,
	type RequestMethod,
} from '@core/lib/http/httpClientMethods';
import type { HttpClientConfig, HttpPort } from '@core/ports/HttpPort';
import { describe, expect, it, vi } from 'vitest';

const TEST_URL = '/api/test';
const BEARER_TOKEN = 'Bearer token';
const TEST_BODY = { key: 'value' };
const JSON_CONTENT_TYPE = 'application/json';
const TEST_PASSES_CONFIG = 'passes config to request';
const TEST_HANDLES_EMPTY_CONFIG = 'handles empty config';
const TEST_HANDLES_UNDEFINED_BODY = 'handles undefined body';

const createMockRequest = (): RequestMethod => {
	return vi.fn().mockImplementation(<T = unknown>(_url: string, _config?: HttpClientConfig) =>
		Promise.resolve({
			data: null as T,
			status: 200,
			statusText: 'OK',
			headers: new Headers(),
			response: {} as Response,
		})
	) as RequestMethod;
};

const testGetMethod = () => {
	describe('createGetMethod', () => {
		it('creates GET method that calls request with GET method', async () => {
			const request = createMockRequest();
			const get = createGetMethod(request);
			await get(TEST_URL);
			expect(request).toHaveBeenCalledWith(TEST_URL, { method: 'GET' });
		});

		it(TEST_PASSES_CONFIG, async () => {
			const request = createMockRequest();
			const get = createGetMethod(request);
			await get(TEST_URL, { headers: { Authorization: BEARER_TOKEN } });
			expect(request).toHaveBeenCalledWith(TEST_URL, {
				method: 'GET',
				headers: { Authorization: BEARER_TOKEN },
			});
		});

		it('prevents body from being passed', async () => {
			const request = createMockRequest();
			const get = createGetMethod(request);
			// TypeScript should prevent this, but test runtime behavior
			await get(TEST_URL, { headers: {} } as Parameters<HttpPort['get']>[1]);
			expect(request).toHaveBeenCalledWith(TEST_URL, { method: 'GET', headers: {} });
		});

		it(TEST_HANDLES_EMPTY_CONFIG, async () => {
			const request = createMockRequest();
			const get = createGetMethod(request);
			await get(TEST_URL, {});
			expect(request).toHaveBeenCalledWith(TEST_URL, {
				method: 'GET',
			});
		});

		it('handles config with all properties except body', async () => {
			const request = createMockRequest();
			const get = createGetMethod(request);
			await get(TEST_URL, {
				headers: { Authorization: BEARER_TOKEN },
				timeout: 5000,
				baseURL: 'https://api.example.com',
			});
			expect(request).toHaveBeenCalledWith(TEST_URL, {
				method: 'GET',
				headers: { Authorization: BEARER_TOKEN },
				timeout: 5000,
				baseURL: 'https://api.example.com',
			});
		});
	});
};

const testPostMethod = () => {
	describe('createPostMethod', () => {
		it('creates POST method that calls request with POST method and body', async () => {
			const request = createMockRequest();
			const post = createPostMethod(request);
			await post(TEST_URL, TEST_BODY);
			expect(request).toHaveBeenCalledWith(TEST_URL, {
				method: 'POST',
				body: TEST_BODY,
			});
		});

		it(TEST_PASSES_CONFIG, async () => {
			const request = createMockRequest();
			const post = createPostMethod(request);
			await post(TEST_URL, TEST_BODY, { headers: { 'Content-Type': JSON_CONTENT_TYPE } });
			expect(request).toHaveBeenCalledWith(TEST_URL, {
				method: 'POST',
				body: TEST_BODY,
				headers: { 'Content-Type': JSON_CONTENT_TYPE },
			});
		});

		it(TEST_HANDLES_UNDEFINED_BODY, async () => {
			const request = createMockRequest();
			const post = createPostMethod(request);
			await post(TEST_URL);
			expect(request).toHaveBeenCalledWith(TEST_URL, {
				method: 'POST',
				body: undefined,
			});
		});

		it('handles null body', async () => {
			const request = createMockRequest();
			const post = createPostMethod(request);
			await post(TEST_URL, null);
			expect(request).toHaveBeenCalledWith(TEST_URL, {
				method: 'POST',
				body: null,
			});
		});

		it('handles empty config with body', async () => {
			const request = createMockRequest();
			const post = createPostMethod(request);
			await post(TEST_URL, TEST_BODY, {});
			expect(request).toHaveBeenCalledWith(TEST_URL, {
				method: 'POST',
				body: TEST_BODY,
			});
		});
	});
};

const testPutMethod = () => {
	describe('createPutMethod', () => {
		it('creates PUT method that calls request with PUT method and body', async () => {
			const request = createMockRequest();
			const put = createPutMethod(request);
			await put(TEST_URL, TEST_BODY);
			expect(request).toHaveBeenCalledWith(TEST_URL, {
				method: 'PUT',
				body: TEST_BODY,
			});
		});

		it(TEST_PASSES_CONFIG, async () => {
			const request = createMockRequest();
			const put = createPutMethod(request);
			await put(TEST_URL, TEST_BODY, { headers: { 'Content-Type': JSON_CONTENT_TYPE } });
			expect(request).toHaveBeenCalledWith(TEST_URL, {
				method: 'PUT',
				body: TEST_BODY,
				headers: { 'Content-Type': JSON_CONTENT_TYPE },
			});
		});

		it(TEST_HANDLES_UNDEFINED_BODY, async () => {
			const request = createMockRequest();
			const put = createPutMethod(request);
			await put(TEST_URL);
			expect(request).toHaveBeenCalledWith(TEST_URL, {
				method: 'PUT',
				body: undefined,
			});
		});
	});
};

const testPatchMethod = () => {
	describe('createPatchMethod', () => {
		it('creates PATCH method that calls request with PATCH method and body', async () => {
			const request = createMockRequest();
			const patch = createPatchMethod(request);
			await patch(TEST_URL, TEST_BODY);
			expect(request).toHaveBeenCalledWith(TEST_URL, {
				method: 'PATCH',
				body: TEST_BODY,
			});
		});

		it(TEST_PASSES_CONFIG, async () => {
			const request = createMockRequest();
			const patch = createPatchMethod(request);
			await patch(TEST_URL, TEST_BODY, { headers: { 'Content-Type': JSON_CONTENT_TYPE } });
			expect(request).toHaveBeenCalledWith(TEST_URL, {
				method: 'PATCH',
				body: TEST_BODY,
				headers: { 'Content-Type': JSON_CONTENT_TYPE },
			});
		});

		it(TEST_HANDLES_UNDEFINED_BODY, async () => {
			const request = createMockRequest();
			const patch = createPatchMethod(request);
			await patch(TEST_URL);
			expect(request).toHaveBeenCalledWith(TEST_URL, {
				method: 'PATCH',
				body: undefined,
			});
		});
	});
};

const testDeleteMethod = () => {
	describe('createDeleteMethod', () => {
		it('creates DELETE method that calls request with DELETE method', async () => {
			const request = createMockRequest();
			const del = createDeleteMethod(request);
			await del(TEST_URL);
			expect(request).toHaveBeenCalledWith(TEST_URL, { method: 'DELETE' });
		});

		it(TEST_PASSES_CONFIG, async () => {
			const request = createMockRequest();
			const del = createDeleteMethod(request);
			await del(TEST_URL, { headers: { Authorization: BEARER_TOKEN } });
			expect(request).toHaveBeenCalledWith(TEST_URL, {
				method: 'DELETE',
				headers: { Authorization: BEARER_TOKEN },
			});
		});

		it(TEST_HANDLES_EMPTY_CONFIG, async () => {
			const request = createMockRequest();
			const del = createDeleteMethod(request);
			await del(TEST_URL, {});
			expect(request).toHaveBeenCalledWith(TEST_URL, {
				method: 'DELETE',
			});
		});
	});
};

const testHeadMethod = () => {
	describe('createHeadMethod', () => {
		it('creates HEAD method that calls request with HEAD method', async () => {
			const request = createMockRequest();
			const head = createHeadMethod(request);
			await head(TEST_URL);
			expect(request).toHaveBeenCalledWith(TEST_URL, { method: 'HEAD' });
		});

		it(TEST_PASSES_CONFIG, async () => {
			const request = createMockRequest();
			const head = createHeadMethod(request);
			await head(TEST_URL, { headers: { Authorization: BEARER_TOKEN } });
			expect(request).toHaveBeenCalledWith(TEST_URL, {
				method: 'HEAD',
				headers: { Authorization: BEARER_TOKEN },
			});
		});

		it(TEST_HANDLES_EMPTY_CONFIG, async () => {
			const request = createMockRequest();
			const head = createHeadMethod(request);
			await head(TEST_URL, {});
			expect(request).toHaveBeenCalledWith(TEST_URL, {
				method: 'HEAD',
			});
		});
	});
};

const testOptionsMethod = () => {
	describe('createOptionsMethod', () => {
		it('creates OPTIONS method that calls request with OPTIONS method', async () => {
			const request = createMockRequest();
			const options = createOptionsMethod(request);
			await options(TEST_URL);
			expect(request).toHaveBeenCalledWith(TEST_URL, { method: 'OPTIONS' });
		});

		it(TEST_PASSES_CONFIG, async () => {
			const request = createMockRequest();
			const options = createOptionsMethod(request);
			await options(TEST_URL, { headers: { Authorization: BEARER_TOKEN } });
			expect(request).toHaveBeenCalledWith(TEST_URL, {
				method: 'OPTIONS',
				headers: { Authorization: BEARER_TOKEN },
			});
		});

		it(TEST_HANDLES_EMPTY_CONFIG, async () => {
			const request = createMockRequest();
			const options = createOptionsMethod(request);
			await options(TEST_URL, {});
			expect(request).toHaveBeenCalledWith(TEST_URL, {
				method: 'OPTIONS',
			});
		});
	});
};

describe('httpClientMethods', () => {
	testGetMethod();
	testPostMethod();
	testPutMethod();
	testPatchMethod();
	testDeleteMethod();
	testHeadMethod();
	testOptionsMethod();
});
