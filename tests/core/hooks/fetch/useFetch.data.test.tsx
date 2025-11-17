import { useFetch } from '@core/hooks/fetch/useFetch';
import type { HttpClientResponse } from '@core/ports/HttpPort';
import { renderHook, waitFor } from '@testing-library/react';
import type { MockHttpAdapter } from '@tests/utils/mocks/MockHttpAdapter';
import type { MockLoggerAdapter } from '@tests/utils/mocks/MockLoggerAdapter';
import { act } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { createTestSetup, runFetch, type TestApiResponse } from './useFetch.test.utils';

const USERS_ENDPOINT = '/api/users';
const NETWORK_ERROR_MESSAGE = 'Network error';
const DEFAULT_TEST_DATA: TestApiResponse = {
	users: [{ id: '1', name: 'John', email: 'john@example.com' }],
	total: 1,
};

function createDefaultTestData(): TestApiResponse {
	return {
		users: DEFAULT_TEST_DATA.users.map(user => ({ ...user })),
		total: DEFAULT_TEST_DATA.total,
	};
}

let httpAdapter: MockHttpAdapter;
let loggerAdapter: MockLoggerAdapter;
let wrapper: ReturnType<typeof createTestSetup>['wrapper'];

describe('useFetch - data, loading, and error scenarios', () => {
	registerLifecycleHooks();
	registerDataFetchingTests();
	registerLoadingStateTests();
	registerErrorHandlingTests();
});

function registerLifecycleHooks(): void {
	beforeEach(() => {
		({ httpAdapter, loggerAdapter, wrapper } = createTestSetup());
	});

	afterEach(() => {
		vi.clearAllMocks();
	});
}

function registerDataFetchingTests(): void {
	describe('data fetching', () => {
		it('should fetch data manually when fetch is called', fetchesDataManually);
		it('should auto-fetch data when autoFetch is true', autoFetchesDataWhenEnabled);
		it('should not auto-fetch when autoFetch is false', doesNotAutoFetchWhenDisabled);
	});
}

function registerLoadingStateTests(): void {
	describe('loading states', () => {
		it('should set loading to true during fetch', setsLoadingTrueDuringFetch);
		it('should set loading to false after successful fetch', setsLoadingFalseAfterSuccess);
		it('should set loading to false after error', setsLoadingFalseAfterError);
	});
}

function registerErrorHandlingTests(): void {
	describe('error handling', () => {
		it('should handle Error instances', handlesErrorInstances);
		it('should handle string errors', handlesStringErrors);
		it('should handle unknown error types', handlesUnknownErrorTypes);
		it('should clear error on successful fetch after error', clearsErrorAfterSuccessfulFetch);
	});
}

async function fetchesDataManually(): Promise<void> {
	const testData = createDefaultTestData();

	httpAdapter.mockResponse(USERS_ENDPOINT, 'GET', {
		data: testData,
		status: 200,
		statusText: 'OK',
		headers: new Headers(),
		response: new Response(),
	});

	const { result } = renderHook(() => useFetch<TestApiResponse>(USERS_ENDPOINT), {
		wrapper,
	});

	expect(result.current.data).toBeNull();
	expect(result.current.loading).toBe(false);
	expect(result.current.error).toBeNull();

	await runFetch(result);

	await waitFor(() => {
		expect(result.current.loading).toBe(false);
	});

	expect(result.current.data).toEqual(testData);
	expect(result.current.error).toBeNull();
	expect(httpAdapter.requests).toHaveLength(1);
	expect(httpAdapter.requests[0]?.url).toBe(USERS_ENDPOINT);
	expect(httpAdapter.requests[0]?.method).toBe('GET');
}

async function autoFetchesDataWhenEnabled(): Promise<void> {
	const testData = createDefaultTestData();

	httpAdapter.mockResponse(USERS_ENDPOINT, 'GET', {
		data: testData,
		status: 200,
		statusText: 'OK',
		headers: new Headers(),
		response: new Response(),
	});

	const { result } = renderHook(
		() => useFetch<TestApiResponse>(USERS_ENDPOINT, { autoFetch: true }),
		{
			wrapper,
		}
	);

	await waitFor(() => {
		expect(result.current.loading).toBe(false);
	});

	expect(result.current.data).toEqual(testData);
	expect(result.current.error).toBeNull();
	expect(httpAdapter.requests).toHaveLength(1);
}

async function doesNotAutoFetchWhenDisabled(): Promise<void> {
	httpAdapter.mockResponse(USERS_ENDPOINT, 'GET', {
		data: { users: [], total: 0 },
		status: 200,
		statusText: 'OK',
		headers: new Headers(),
		response: new Response(),
	});

	const { result } = renderHook(
		() => useFetch<TestApiResponse>(USERS_ENDPOINT, { autoFetch: false }),
		{
			wrapper,
		}
	);

	await new Promise(resolve => {
		setTimeout(resolve, 100);
	});

	expect(result.current.data).toBeNull();
	expect(result.current.loading).toBe(false);
	expect(httpAdapter.requests).toHaveLength(0);
}

async function setsLoadingTrueDuringFetch(): Promise<void> {
	let resolvePromise: ((value: HttpClientResponse<TestApiResponse>) => void) | undefined;
	const promise = new Promise<HttpClientResponse<TestApiResponse>>(resolve => {
		resolvePromise = resolve;
	});

	httpAdapter.mockResponse(USERS_ENDPOINT, 'GET', () => promise);

	const { result } = renderHook(() => useFetch<TestApiResponse>(USERS_ENDPOINT), {
		wrapper,
	});

	let fetchPromise: Promise<void> | undefined;
	act(() => {
		fetchPromise = result.current.fetch();
	});

	expect(result.current.loading).toBe(true);

	await act(async () => {
		if (!resolvePromise || !fetchPromise) {
			throw new Error('Fetch promise was not initialized');
		}

		resolvePromise({
			data: { users: [], total: 0 },
			status: 200,
			statusText: 'OK',
			headers: new Headers(),
			response: new Response(),
		});

		await fetchPromise;
	});

	await waitFor(() => {
		expect(result.current.loading).toBe(false);
	});
}

async function setsLoadingFalseAfterSuccess(): Promise<void> {
	const testData = createDefaultTestData();

	httpAdapter.mockResponse(USERS_ENDPOINT, 'GET', {
		data: testData,
		status: 200,
		statusText: 'OK',
		headers: new Headers(),
		response: new Response(),
	});

	const { result } = renderHook(() => useFetch<TestApiResponse>(USERS_ENDPOINT), {
		wrapper,
	});

	await runFetch(result);

	await waitFor(() => {
		expect(result.current.loading).toBe(false);
	});

	expect(result.current.loading).toBe(false);
}

async function setsLoadingFalseAfterError(): Promise<void> {
	const error = new Error(NETWORK_ERROR_MESSAGE);
	httpAdapter.mockResponse(USERS_ENDPOINT, 'GET', () => {
		throw error;
	});

	const { result } = renderHook(() => useFetch<TestApiResponse>(USERS_ENDPOINT), {
		wrapper,
	});

	await runFetch(result);

	await waitFor(() => {
		expect(result.current.loading).toBe(false);
	});

	expect(result.current.loading).toBe(false);
	expect(result.current.error).toBeTruthy();
}

async function handlesErrorInstances(): Promise<void> {
	const error = new Error(NETWORK_ERROR_MESSAGE);
	httpAdapter.mockResponse(USERS_ENDPOINT, 'GET', () => {
		throw error;
	});

	const { result } = renderHook(() => useFetch<TestApiResponse>(USERS_ENDPOINT), {
		wrapper,
	});

	await runFetch(result);

	await waitFor(() => {
		expect(result.current.error).toBeTruthy();
	});

	expect(result.current.error).toBe(NETWORK_ERROR_MESSAGE);
	expect(result.current.data).toBeNull();
	expect(loggerAdapter.logs.some(log => log.level === 'error')).toBe(true);
}

async function handlesStringErrors(): Promise<void> {
	httpAdapter.mockResponse(USERS_ENDPOINT, 'GET', () => {
		// eslint-disable-next-line no-throw-literal
		throw 'String error';
	});

	const { result } = renderHook(() => useFetch<TestApiResponse>(USERS_ENDPOINT), {
		wrapper,
	});

	await runFetch(result);

	await waitFor(() => {
		expect(result.current.error).toBeTruthy();
	});

	expect(result.current.error).toBe('String error');
}

async function handlesUnknownErrorTypes(): Promise<void> {
	httpAdapter.mockResponse(USERS_ENDPOINT, 'GET', () => {
		// eslint-disable-next-line no-throw-literal
		throw { some: 'object' };
	});

	const { result } = renderHook(() => useFetch<TestApiResponse>(USERS_ENDPOINT), {
		wrapper,
	});

	await runFetch(result);

	await waitFor(() => {
		expect(result.current.error).toBeTruthy();
	});

	expect(result.current.error).toBe('An unknown error occurred');
}

async function clearsErrorAfterSuccessfulFetch(): Promise<void> {
	httpAdapter.mockResponse(USERS_ENDPOINT, 'GET', () => {
		throw new Error(NETWORK_ERROR_MESSAGE);
	});

	const { result } = renderHook(() => useFetch<TestApiResponse>(USERS_ENDPOINT), {
		wrapper,
	});

	await runFetch(result);

	await waitFor(() => {
		expect(result.current.error).toBeTruthy();
	});

	expect(result.current.error).toBe(NETWORK_ERROR_MESSAGE);

	httpAdapter.reset();
	const testData = createDefaultTestData();

	httpAdapter.mockResponse(USERS_ENDPOINT, 'GET', {
		data: testData,
		status: 200,
		statusText: 'OK',
		headers: new Headers(),
		response: new Response(),
	});

	await runFetch(result);

	await waitFor(() => {
		expect(result.current.error).toBeNull();
	});

	expect(result.current.error).toBeNull();
	expect(result.current.data).toEqual(testData);
}
