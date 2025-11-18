import i18n from '@core/i18n/i18n';
import { HttpClient } from '@core/lib/http/httpClient';
import type { HttpClientResponse } from '@core/ports/HttpPort';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

function createJsonResponse(data: unknown, init: ResponseInit = {}): Response {
	const headers = new Headers(init.headers);
	if (!headers.has('content-type')) {
		headers.set('content-type', 'application/json');
	}
	return new Response(JSON.stringify(data), {
		...init,
		headers,
	});
}

function getLastFetchCall(
	fetchSpy: ReturnType<typeof vi.spyOn>
): [string, RequestInit | undefined] {
	const lastCall = fetchSpy.mock.calls.at(-1);
	if (!lastCall) {
		throw new Error('No fetch calls were made');
	}
	return [lastCall[0] as string, lastCall[1]];
}

function createRequestInterceptor(headerValue: string) {
	return vi.fn(async config => {
		return {
			...config,
			headers: {
				...config.headers,
				'X-Intercepted': headerValue,
			},
		};
	});
}

function createChainedRequestInterceptor(prefix: string) {
	return vi.fn(config => {
		return {
			...config,
			headers: {
				...config.headers,
				'X-Intercepted': `${config.headers['X-Intercepted']}-${prefix}`,
			},
		};
	});
}

function createCountIncrementResponseInterceptor() {
	return async <T>(response: HttpClientResponse<T>) => {
		const data = response.data as { count: number };
		return {
			...response,
			data: { ...data, count: data.count + 1 } as T,
		};
	};
}

function createEnrichmentResponseInterceptor() {
	return <T>(response: HttpClientResponse<T>) => {
		const data = response.data as { count: number };
		return {
			...response,
			data: { ...data, enriched: true } as T,
		};
	};
}

const API_ITEMS_PATH = '/api/items/1';

function setupHttpClient(): { client: HttpClient; fetchSpy: ReturnType<typeof vi.spyOn> } {
	const client = new HttpClient();
	const fetchSpy = vi
		.spyOn(globalThis, 'fetch')
		.mockResolvedValue(createJsonResponse({ default: true }));
	return { client, fetchSpy };
}

function setupRequestInterceptorsTest(
	client: HttpClient,
	firstInterceptor: ReturnType<typeof createRequestInterceptor>,
	secondInterceptor: ReturnType<typeof createChainedRequestInterceptor>
) {
	const removedInterceptor = vi.fn(config => config);
	client.addRequestInterceptor(firstInterceptor);
	client.addRequestInterceptor(removedInterceptor);
	client.addRequestInterceptor(secondInterceptor);
	client.removeRequestInterceptor(removedInterceptor);
	return removedInterceptor;
}

function setupErrorInterceptorTest(client: HttpClient) {
	const transformedError = new Error('transformed');
	client.addErrorInterceptor(() => {
		throw transformedError;
	});
	return transformedError;
}

function assertGetRequest(fetchSpy: ReturnType<typeof vi.spyOn>, url: string) {
	expect(fetchSpy).toHaveBeenCalledWith(url, expect.objectContaining({ method: 'GET' }));
}

function assertPostRequest(
	fetchSpy: ReturnType<typeof vi.spyOn>,
	payload: unknown,
	expectedHeader: string
) {
	const [, config] = getLastFetchCall(fetchSpy);
	expect(config?.method).toBe('POST');
	expect(config?.body).toBe(JSON.stringify(payload));
	const headers = config?.headers as Headers;
	expect(headers.get('X-Test')).toBe(expectedHeader);
}

function assertDefaultConfig(fetchSpy: ReturnType<typeof vi.spyOn>, expectedUrl: string) {
	const [url, config] = getLastFetchCall(fetchSpy);
	expect(url).toBe(expectedUrl);
	expect(config?.signal).toBeInstanceOf(AbortSignal);
	const headers = config?.headers as Headers;
	expect(headers.get('Authorization')).toBe('Bearer token');
	expect(headers.get('X-Request')).toBe('trace');
}

function setupTimeoutErrorTest(fetchSpy: ReturnType<typeof vi.spyOn>) {
	const abortError = new DOMException('aborted', 'AbortError');
	fetchSpy.mockRejectedValueOnce(abortError);
	const expectedMessage = i18n.t('errors.requestTimeout', { ns: 'common' });
	const translateSpy = vi.spyOn(i18n, 't');
	return { expectedMessage, translateSpy };
}

function testHttpMethod(
	client: HttpClient,
	fetchSpy: ReturnType<typeof vi.spyOn>,
	methodName: keyof HttpClient,
	httpMethod: string,
	args: readonly unknown[]
) {
	fetchSpy.mockResolvedValueOnce(createJsonResponse({ ok: true }));

	const method = client[methodName] as (
		this: HttpClient,
		...requestArgs: unknown[]
	) => Promise<HttpClientResponse<unknown>>;
	return method.call(client, ...args).then(response => {
		const [, config] = getLastFetchCall(fetchSpy);
		expect(config?.method).toBe(httpMethod);
		expect(response.status).toBe(200);
	});
}

function testRequestInterceptors(
	client: HttpClient,
	fetchSpy: ReturnType<typeof vi.spyOn>
): {
	firstInterceptor: ReturnType<typeof createRequestInterceptor>;
	secondInterceptor: ReturnType<typeof createChainedRequestInterceptor>;
	removedInterceptor: ReturnType<typeof vi.fn>;
} {
	const firstInterceptor = createRequestInterceptor('first');
	const secondInterceptor = createChainedRequestInterceptor('second');
	const removedInterceptor = setupRequestInterceptorsTest(
		client,
		firstInterceptor,
		secondInterceptor
	);
	fetchSpy.mockResolvedValueOnce(createJsonResponse({ ok: true }));
	return { firstInterceptor, secondInterceptor, removedInterceptor };
}

function assertRequestInterceptors(
	fetchSpy: ReturnType<typeof vi.spyOn>,
	firstInterceptor: ReturnType<typeof createRequestInterceptor>,
	secondInterceptor: ReturnType<typeof createChainedRequestInterceptor>,
	removedInterceptor: ReturnType<typeof vi.fn>
) {
	expect(firstInterceptor).toHaveBeenCalledTimes(1);
	expect(secondInterceptor).toHaveBeenCalledTimes(1);
	expect(removedInterceptor).not.toHaveBeenCalled();
	const [, config] = getLastFetchCall(fetchSpy);
	const headers = config?.headers as Headers;
	expect(headers.get('X-Intercepted')).toBe('first-second');
}

function testResponseInterceptors(client: HttpClient, fetchSpy: ReturnType<typeof vi.spyOn>) {
	fetchSpy.mockResolvedValueOnce(createJsonResponse({ count: 1 }));
	client.addResponseInterceptor(createCountIncrementResponseInterceptor());
	client.addResponseInterceptor(createEnrichmentResponseInterceptor());
	return client.get<{ count: number; enriched?: boolean }>('/api/response');
}

function testErrorInterceptor(client: HttpClient, fetchSpy: ReturnType<typeof vi.spyOn>) {
	const transformedError = setupErrorInterceptorTest(client);
	fetchSpy.mockResolvedValueOnce(
		createJsonResponse({ error: 'boom' }, { status: 500, statusText: 'Server Error' })
	);
	return { transformedError, promise: client.get('/api/error') };
}

function testNetworkError(client: HttpClient, fetchSpy: ReturnType<typeof vi.spyOn>) {
	const networkError = new Error('network down');
	fetchSpy.mockRejectedValueOnce(networkError);
	return { networkError, promise: client.get('/api/network') };
}

function testTimeoutError(client: HttpClient, fetchSpy: ReturnType<typeof vi.spyOn>) {
	const { expectedMessage, translateSpy } = setupTimeoutErrorTest(fetchSpy);
	return {
		expectedMessage,
		translateSpy,
		promise: client.get('/api/timeout'),
	};
}

function setupDefaultConfigTest(client: HttpClient, fetchSpy: ReturnType<typeof vi.spyOn>) {
	client.setDefaultConfig({
		baseURL: 'https://api.example.com',
		timeout: 1500,
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Bearer token',
		},
	});
	fetchSpy.mockResolvedValueOnce(createJsonResponse({ ok: true }));
	return client.request('/users', { headers: { 'X-Request': 'trace' } });
}

function testGetRequest(
	client: HttpClient,
	fetchSpy: ReturnType<typeof vi.spyOn>,
	payload: unknown
) {
	fetchSpy.mockResolvedValueOnce(createJsonResponse(payload, { status: 200, statusText: 'OK' }));
	return client.get('/api/test').then(response => {
		assertGetRequest(fetchSpy, '/api/test');
		return { response, payload };
	});
}

function testPostRequest(
	client: HttpClient,
	fetchSpy: ReturnType<typeof vi.spyOn>,
	payload: unknown
) {
	fetchSpy.mockResolvedValueOnce(createJsonResponse({ created: true }));
	return client.post('/api/items', payload, { headers: { 'X-Test': '1' } }).then(response => {
		assertPostRequest(fetchSpy, payload, '1');
		return response;
	});
}

describe('HttpClient - HTTP Methods', () => {
	let client: HttpClient;
	let fetchSpy: ReturnType<typeof vi.spyOn>;

	beforeEach(() => {
		({ client, fetchSpy } = setupHttpClient());
	});

	afterEach(() => {
		fetchSpy.mockRestore();
	});

	it('makes GET requests and returns parsed data', async () => {
		const payload = { data: 'test' };
		const { response } = await testGetRequest(client, fetchSpy, payload);

		expect(response.data).toEqual(payload);
		expect(response.status).toBe(200);
	});

	it('makes POST requests with serialized body', async () => {
		const payload = { foo: 'bar' };
		const response = await testPostRequest(client, fetchSpy, payload);

		expect(response.data).toEqual({ created: true });
	});

	it.each([
		{ methodName: 'put', httpMethod: 'PUT', args: [API_ITEMS_PATH, { value: 1 }] },
		{ methodName: 'patch', httpMethod: 'PATCH', args: [API_ITEMS_PATH, { value: 2 }] },
		{ methodName: 'delete', httpMethod: 'DELETE', args: [API_ITEMS_PATH] },
		{ methodName: 'head', httpMethod: 'HEAD', args: ['/api/items/head'] },
		{ methodName: 'options', httpMethod: 'OPTIONS', args: ['/api/items/options'] },
	] as const)('supports $httpMethod requests', async ({ methodName, httpMethod, args }) => {
		await testHttpMethod(client, fetchSpy, methodName, httpMethod, args);
	});
});

describe('HttpClient - Configuration', () => {
	let client: HttpClient;
	let fetchSpy: ReturnType<typeof vi.spyOn>;

	beforeEach(() => {
		({ client, fetchSpy } = setupHttpClient());
	});

	afterEach(() => {
		fetchSpy.mockRestore();
	});

	it('uses default baseURL, timeout, and headers when configured', async () => {
		await setupDefaultConfigTest(client, fetchSpy);

		assertDefaultConfig(fetchSpy, 'https://api.example.com/users');
	});
});

describe('HttpClient - Request Interceptors', () => {
	let client: HttpClient;
	let fetchSpy: ReturnType<typeof vi.spyOn>;

	beforeEach(() => {
		({ client, fetchSpy } = setupHttpClient());
	});

	afterEach(() => {
		fetchSpy.mockRestore();
	});

	it('executes request interceptors in order and allows removal', async () => {
		const { firstInterceptor, secondInterceptor, removedInterceptor } = testRequestInterceptors(
			client,
			fetchSpy
		);

		await client.get('/api/intercepted');

		assertRequestInterceptors(fetchSpy, firstInterceptor, secondInterceptor, removedInterceptor);
	});
});

describe('HttpClient - Response Interceptors', () => {
	let client: HttpClient;
	let fetchSpy: ReturnType<typeof vi.spyOn>;

	beforeEach(() => {
		({ client, fetchSpy } = setupHttpClient());
	});

	afterEach(() => {
		fetchSpy.mockRestore();
	});

	it('executes response interceptors before resolving', async () => {
		const response = await testResponseInterceptors(client, fetchSpy);

		expect(response.data).toEqual({ count: 2, enriched: true });
	});
});

describe('HttpClient - Error Handling', () => {
	let client: HttpClient;
	let fetchSpy: ReturnType<typeof vi.spyOn>;

	beforeEach(() => {
		({ client, fetchSpy } = setupHttpClient());
	});

	afterEach(() => {
		fetchSpy.mockRestore();
	});

	it('executes error interceptors and surfaces the last thrown error', async () => {
		const { transformedError, promise } = testErrorInterceptor(client, fetchSpy);

		await expect(promise).rejects.toBe(transformedError);
	});

	it('propagates network errors when fetch rejects', async () => {
		const { networkError, promise } = testNetworkError(client, fetchSpy);

		await expect(promise).rejects.toBe(networkError);
	});

	it('transforms AbortError into localized TimeoutError', async () => {
		const { expectedMessage, translateSpy, promise } = testTimeoutError(client, fetchSpy);

		await expect(promise).rejects.toMatchObject({
			name: 'TimeoutError',
			message: expectedMessage,
		});

		expect(translateSpy).toHaveBeenCalledWith('errors.requestTimeout', { ns: 'common' });
		translateSpy.mockRestore();
	});
});
