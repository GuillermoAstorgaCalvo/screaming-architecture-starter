import { useFetch } from '@core/hooks/fetch/useFetch';
import { renderHook, waitFor } from '@testing-library/react';
import type { MockHttpAdapter } from '@tests/utils/mocks/MockHttpAdapter';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { createTestSetup, runFetch, runReset, type TestApiResponse } from './useFetch.test.utils';

const API_USERS_ENDPOINT = '/api/users';
const API_USER_ENDPOINT_PREFIX = '/api/users/';
const HTTP_GET_METHOD = 'GET';

const johnUser: TestApiResponse['users'][number] = {
	id: '1',
	name: 'John',
	email: 'john@example.com',
};

const janeUser: TestApiResponse['users'][number] = {
	id: '2',
	name: 'Jane',
	email: 'jane@example.com',
};

const singleJohnResponse: TestApiResponse = {
	users: [johnUser],
	total: 1,
};

const singleJaneResponse: TestApiResponse = {
	users: [janeUser],
	total: 1,
};

const johnAndJaneResponse: TestApiResponse = {
	users: [johnUser, janeUser],
	total: 2,
};

let httpAdapter: MockHttpAdapter;
let wrapper: ReturnType<typeof createTestSetup>['wrapper'];

describe('useFetch - refetching, cache, and dependencies', () => {
	beforeEach(() => {
		({ httpAdapter, wrapper } = createTestSetup());
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	describe('refetch functionality', () => {
		it('should refetch data when fetch is called multiple times', refetchesDataOnMultipleCalls);
		it('should allow refetch after reset', refetchesAfterReset);
	});

	describe('cache management', () => {
		it('should memoize http config to prevent unnecessary re-renders', memoizesHttpConfig);
	});

	describe('dependency changes', () => {
		it(
			'should refetch when dependencies change with autoFetch',
			refetchesWhenDependenciesChangeWithAutoFetch
		);
		it('should not refetch when dependencies do not change', doesNotRefetchWhenDependenciesStable);
	});
});

async function refetchesDataOnMultipleCalls(): Promise<void> {
	let callCount = 0;
	httpAdapter.mockResponse(API_USERS_ENDPOINT, HTTP_GET_METHOD, () => {
		callCount++;
		return Promise.resolve({
			data: callCount === 1 ? singleJohnResponse : johnAndJaneResponse,
			status: 200,
			statusText: 'OK',
			headers: new Headers(),
			response: new Response(),
		});
	});

	const { result } = renderHook(() => useFetch<TestApiResponse>(API_USERS_ENDPOINT), {
		wrapper,
	});

	await runFetch(result);

	await waitFor(() => {
		expect(result.current.data).toEqual(singleJohnResponse);
	});

	await runFetch(result);

	await waitFor(() => {
		expect(result.current.data).toEqual(johnAndJaneResponse);
	});

	expect(httpAdapter.requests).toHaveLength(2);
}

async function refetchesAfterReset(): Promise<void> {
	httpAdapter.mockResponse(API_USERS_ENDPOINT, HTTP_GET_METHOD, {
		data: singleJohnResponse,
		status: 200,
		statusText: 'OK',
		headers: new Headers(),
		response: new Response(),
	});

	const { result } = renderHook(() => useFetch<TestApiResponse>(API_USERS_ENDPOINT), {
		wrapper,
	});

	await runFetch(result);

	await waitFor(() => {
		expect(result.current.data).toEqual(singleJohnResponse);
	});

	runReset(result);

	expect(result.current.data).toBeNull();
	expect(result.current.error).toBeNull();
	expect(result.current.loading).toBe(false);

	await runFetch(result);

	await waitFor(() => {
		expect(result.current.data).toEqual(singleJohnResponse);
	});
}

async function memoizesHttpConfig(): Promise<void> {
	httpAdapter.mockResponse(API_USERS_ENDPOINT, HTTP_GET_METHOD, {
		data: singleJohnResponse,
		status: 200,
		statusText: 'OK',
		headers: new Headers(),
		response: new Response(),
	});

	const { result, rerender } = renderHook(
		({ headers }) => useFetch<TestApiResponse>(API_USERS_ENDPOINT, { headers }),
		{
			initialProps: { headers: { 'X-Custom': 'value1' } },
			wrapper,
		}
	);

	await runFetch(result);

	await waitFor(() => {
		expect(result.current.data).toEqual(singleJohnResponse);
	});

	const initialRequestCount = httpAdapter.requests.length;

	rerender({ headers: { 'X-Custom': 'value1' } });
	await new Promise(resolve => {
		setTimeout(resolve, 50);
	});

	expect(httpAdapter.requests.length).toBe(initialRequestCount);

	rerender({ headers: { 'X-Custom': 'value2' } });
	await runFetch(result);

	await waitFor(() => {
		expect(httpAdapter.requests.length).toBeGreaterThan(initialRequestCount);
	});
}

async function refetchesWhenDependenciesChangeWithAutoFetch(): Promise<void> {
	let callCount = 0;
	httpAdapter.mockResponse(
		url => url.startsWith(API_USER_ENDPOINT_PREFIX),
		HTTP_GET_METHOD,
		() => {
			callCount++;
			return Promise.resolve({
				data: callCount === 1 ? singleJohnResponse : singleJaneResponse,
				status: 200,
				statusText: 'OK',
				headers: new Headers(),
				response: new Response(),
			});
		}
	);

	const { result, rerender } = renderHook(
		({ userId }) =>
			useFetch<TestApiResponse>(`${API_USER_ENDPOINT_PREFIX}${userId}`, {
				autoFetch: true,
				dependencies: [userId],
			}),
		{
			initialProps: { userId: '1' },
			wrapper,
		}
	);

	await waitFor(() => {
		expect(result.current.data).toEqual(singleJohnResponse);
	});

	expect(httpAdapter.requests).toHaveLength(1);

	rerender({ userId: '2' });

	await waitFor(() => {
		expect(result.current.data).toEqual(singleJaneResponse);
	});

	expect(httpAdapter.requests).toHaveLength(2);
}

async function doesNotRefetchWhenDependenciesStable(): Promise<void> {
	httpAdapter.mockResponse(`${API_USER_ENDPOINT_PREFIX}1`, HTTP_GET_METHOD, {
		data: singleJohnResponse,
		status: 200,
		statusText: 'OK',
		headers: new Headers(),
		response: new Response(),
	});

	const { result, rerender } = renderHook(
		({ userId }) =>
			useFetch<TestApiResponse>(`${API_USER_ENDPOINT_PREFIX}${userId}`, {
				autoFetch: true,
				dependencies: [userId],
			}),
		{
			initialProps: { userId: '1' },
			wrapper,
		}
	);

	await waitFor(() => {
		expect(result.current.data).toEqual(singleJohnResponse);
	});

	const initialRequestCount = httpAdapter.requests.length;

	rerender({ userId: '1' });

	await new Promise(resolve => {
		setTimeout(resolve, 100);
	});

	expect(httpAdapter.requests.length).toBe(initialRequestCount);
}
