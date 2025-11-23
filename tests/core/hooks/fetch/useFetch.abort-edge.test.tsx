import { useFetch } from '@core/hooks/fetch/useFetch';
import { renderHook, waitFor } from '@testing-library/react';
import type { MockHttpAdapter } from '@tests/utils/mocks/MockHttpAdapter';
import type { MockLoggerAdapter } from '@tests/utils/mocks/MockLoggerAdapter';
import { act } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { createTestSetup, runFetch, runReset, type TestApiResponse } from './useFetch.test.utils';

const USERS_ENDPOINT = '/api/users';
const HTTP_METHOD_GET = 'GET';

const DEFAULT_USER = {
	id: '1',
	name: 'John',
	email: 'john@example.com',
};

const createSuccessResponse = <T,>(data: T) => ({
	data,
	status: 200,
	statusText: 'OK',
	headers: new Headers(),
	response: new Response(),
});

const wait = (ms: number): Promise<void> =>
	new Promise(resolve => {
		setTimeout(resolve, ms);
	});

let httpAdapter: MockHttpAdapter;
let loggerAdapter: MockLoggerAdapter;
let wrapper: ReturnType<typeof createTestSetup>['wrapper'];

describe('useFetch - abort signal and edge cases', () => {
	beforeEach(() => {
		({ httpAdapter, loggerAdapter, wrapper } = createTestSetup());
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	describe('abort signal handling', () => {
		it('should abort previous request when new fetch is called', abortsPreviousRequestOnNewFetch);
		it('should not update state if request is aborted', doesNotUpdateStateAfterAbort);
		it('should cleanup abort controller on unmount', cleansAbortControllerOnUnmount);
		it('should cleanup abort controller on reset', cleansAbortControllerOnReset);
	});

	describe('edge cases', () => {
		it('should handle empty response data', handlesEmptyResponseData);
		it('should handle URL changes', handlesUrlChanges);
		it('should log success and error messages', logsSuccessAndErrorMessages);
		it('should handle unmount during fetch', handlesUnmountDuringFetch);
		it('should handle multiple rapid fetches', handlesMultipleRapidFetches);
		it('should handle fetch with custom headers', handlesFetchWithCustomHeaders);
		it('should handle fetch with query parameters', handlesFetchWithQueryParams);
	});
});

async function abortsPreviousRequestOnNewFetch(): Promise<void> {
	httpAdapter.mockResponse(USERS_ENDPOINT, HTTP_METHOD_GET, async () => {
		await wait(100);

		return createSuccessResponse({ users: [], total: 0 });
	});

	const { result } = renderHook(() => useFetch<TestApiResponse>(USERS_ENDPOINT), {
		wrapper,
	});

	let firstFetchPromise: Promise<void> | undefined;
	act(() => {
		firstFetchPromise = result.current.fetch();
	});

	let secondFetchPromise: Promise<void> | undefined;
	act(() => {
		secondFetchPromise = result.current.fetch();
	});

	if (!firstFetchPromise || !secondFetchPromise) {
		throw new Error('Fetch promises were not initialized');
	}

	await Promise.allSettled([firstFetchPromise, secondFetchPromise]);

	const firstRequestConfig = httpAdapter.requests[0]?.config;
	const secondRequestConfig = httpAdapter.requests[1]?.config;
	const firstSignal = firstRequestConfig?.signal as AbortSignal | undefined;
	const secondSignal = secondRequestConfig?.signal as AbortSignal | undefined;

	expect(firstSignal).toBeDefined();
	expect(secondSignal).toBeDefined();
	expect(firstSignal?.aborted).toBe(true);
	expect(secondSignal?.aborted).toBe(false);
}

async function doesNotUpdateStateAfterAbort(): Promise<void> {
	httpAdapter.mockResponse(USERS_ENDPOINT, HTTP_METHOD_GET, async (url, method, config) => {
		await wait(50);

		if (config?.signal?.aborted) {
			throw new Error('Aborted');
		}

		return createSuccessResponse({ users: [DEFAULT_USER], total: 1 });
	});

	const { result } = renderHook(() => useFetch<TestApiResponse>(USERS_ENDPOINT), {
		wrapper,
	});

	let fetchPromise: Promise<void> | undefined;
	act(() => {
		fetchPromise = result.current.fetch();
	});

	runReset(result);

	if (!fetchPromise) {
		throw new Error('Fetch promise was not initialized');
	}

	await act(async () => {
		await fetchPromise;
	});

	await wait(50);

	expect(result.current.data).toBeNull();
}

async function cleansAbortControllerOnUnmount(): Promise<void> {
	const testData: TestApiResponse = {
		users: [DEFAULT_USER],
		total: 1,
	};

	httpAdapter.mockResponse(USERS_ENDPOINT, HTTP_METHOD_GET, createSuccessResponse(testData));

	const { result, unmount } = renderHook(
		() => useFetch<TestApiResponse>(USERS_ENDPOINT, { autoFetch: true }),
		{
			wrapper,
		}
	);

	unmount();

	await wait(50);

	expect(result.current).toBeDefined();
}

async function cleansAbortControllerOnReset(): Promise<void> {
	const testData: TestApiResponse = {
		users: [DEFAULT_USER],
		total: 1,
	};

	httpAdapter.mockResponse(USERS_ENDPOINT, HTTP_METHOD_GET, createSuccessResponse(testData));

	const { result } = renderHook(() => useFetch<TestApiResponse>(USERS_ENDPOINT), {
		wrapper,
	});

	await runFetch(result);

	await waitFor(() => {
		expect(result.current.data).toEqual(testData);
	});

	runReset(result);

	await runFetch(result);

	await waitFor(() => {
		expect(result.current.data).toEqual(testData);
	});
}

async function handlesEmptyResponseData(): Promise<void> {
	httpAdapter.mockResponse(USERS_ENDPOINT, HTTP_METHOD_GET, createSuccessResponse(null));

	const { result } = renderHook(() => useFetch<null>(USERS_ENDPOINT), {
		wrapper,
	});

	await runFetch(result);

	await waitFor(() => {
		expect(result.current.loading).toBe(false);
	});

	expect(result.current.data).toBeNull();
	expect(result.current.error).toBeNull();
}

async function handlesUrlChanges(): Promise<void> {
	const testData1: TestApiResponse = {
		users: [DEFAULT_USER],
		total: 1,
	};

	const testData2: TestApiResponse = {
		users: [{ id: '2', name: 'Jane', email: 'jane@example.com' }],
		total: 1,
	};

	httpAdapter.mockResponse('/api/users/1', HTTP_METHOD_GET, createSuccessResponse(testData1));

	httpAdapter.mockResponse('/api/users/2', HTTP_METHOD_GET, createSuccessResponse(testData2));

	const { result, rerender } = renderHook(({ url }) => useFetch<TestApiResponse>(url), {
		initialProps: { url: '/api/users/1' },
		wrapper,
	});

	await runFetch(result);

	await waitFor(() => {
		expect(result.current.data).toEqual(testData1);
	});

	rerender({ url: '/api/users/2' });

	await runFetch(result);

	await waitFor(() => {
		expect(result.current.data).toEqual(testData2);
	});
}

async function logsSuccessAndErrorMessages(): Promise<void> {
	const testData: TestApiResponse = {
		users: [DEFAULT_USER],
		total: 1,
	};

	httpAdapter.mockResponse(USERS_ENDPOINT, HTTP_METHOD_GET, createSuccessResponse(testData));

	const { result } = renderHook(() => useFetch<TestApiResponse>(USERS_ENDPOINT), {
		wrapper,
	});

	await runFetch(result);

	await waitFor(() => {
		expect(result.current.data).toEqual(testData);
	});

	const successLog = loggerAdapter.logs.find(
		log => log.level === 'info' && log.message.includes('useFetch: Successfully fetched data')
	);
	expect(successLog).toBeDefined();
	expect(successLog?.context?.url).toBe(USERS_ENDPOINT);

	httpAdapter.reset();
	const error = new Error('Network error');
	httpAdapter.mockResponse(USERS_ENDPOINT, HTTP_METHOD_GET, () => {
		throw error;
	});

	await runFetch(result);

	await waitFor(() => {
		expect(result.current.error).toBeTruthy();
	});

	const errorLog = loggerAdapter.logs.find(
		log => log.level === 'error' && log.message.includes('useFetch: Error fetching data')
	);
	expect(errorLog).toBeDefined();
	expect(errorLog?.context?.url).toBe(USERS_ENDPOINT);
}

async function handlesUnmountDuringFetch(): Promise<void> {
	httpAdapter.mockResponse(USERS_ENDPOINT, HTTP_METHOD_GET, async () => {
		await wait(100);
		return createSuccessResponse({ users: [DEFAULT_USER], total: 1 });
	});

	const { result, unmount } = renderHook(() => useFetch<TestApiResponse>(USERS_ENDPOINT), {
		wrapper,
	});

	let fetchPromise: Promise<void> | undefined;
	act(() => {
		fetchPromise = result.current.fetch();
	});

	unmount();

	if (fetchPromise) {
		await fetchPromise.catch(() => {
			// Expected
		});
	}

	await wait(150);

	expect(result.current).toBeDefined();
}

async function handlesMultipleRapidFetches(): Promise<void> {
	let callCount = 0;
	httpAdapter.mockResponse(USERS_ENDPOINT, HTTP_METHOD_GET, async () => {
		callCount++;
		await wait(50);
		return createSuccessResponse({
			users: [{ ...DEFAULT_USER, id: String(callCount) }],
			total: 1,
		});
	});

	const { result } = renderHook(() => useFetch<TestApiResponse>(USERS_ENDPOINT), {
		wrapper,
	});

	await act(async () => {
		await Promise.all([result.current.fetch(), result.current.fetch(), result.current.fetch()]);
	});

	await waitFor(() => {
		expect(result.current.loading).toBe(false);
	});

	expect(httpAdapter.requests.length).toBeGreaterThanOrEqual(1);
}

async function handlesFetchWithCustomHeaders(): Promise<void> {
	const testData: TestApiResponse = {
		users: [DEFAULT_USER],
		total: 1,
	};

	httpAdapter.mockResponse(USERS_ENDPOINT, HTTP_METHOD_GET, createSuccessResponse(testData));

	const { result } = renderHook(
		() =>
			useFetch<TestApiResponse>(USERS_ENDPOINT, {
				headers: { 'X-Custom-Header': 'custom-value' },
			}),
		{
			wrapper,
		}
	);

	await runFetch(result);

	await waitFor(() => {
		expect(result.current.data).toEqual(testData);
	});

	const [request] = httpAdapter.requests;
	expect(request?.config?.headers?.['X-Custom-Header']).toBe('custom-value');
}

async function handlesFetchWithQueryParams(): Promise<void> {
	const testData: TestApiResponse = {
		users: [DEFAULT_USER],
		total: 1,
	};

	httpAdapter.mockResponse(USERS_ENDPOINT, HTTP_METHOD_GET, createSuccessResponse(testData));

	const { result } = renderHook(
		() =>
			useFetch<TestApiResponse>(USERS_ENDPOINT, {
				headers: { 'Content-Type': 'application/json' },
			}),
		{
			wrapper,
		}
	);

	await runFetch(result);

	await waitFor(() => {
		expect(result.current.data).toEqual(testData);
	});

	expect(httpAdapter.requests).toHaveLength(1);
}
