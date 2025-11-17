import { describe, expect, it, vi } from 'vitest';

import { createWrapper, renderHook, useAsync, waitFor } from './useAsync.test.shared';

class StringLikeObject {
	toString(): string {
		return 'string error';
	}
}

export function describeAsyncOperationExecution() {
	describe('async operation execution', () => {
		it('executes async function', testExecutesAsyncFunction);
		it(
			'executes async function with immediate option',
			testExecutesAsyncFunctionWithImmediateOption
		);
		it('passes AbortSignal to async function when provided', testPassesAbortSignalToAsyncFunction);
	});
}

async function testExecutesAsyncFunction() {
	const { wrapper } = createWrapper();
	const asyncFn = vi.fn(() => Promise.resolve('success'));

	const { result } = renderHook(() => useAsync(asyncFn), { wrapper });

	expect(result.current.loading).toBe(false);
	expect(result.current.data).toBe(null);
	expect(result.current.error).toBe(null);

	await result.current.execute();

	await waitFor(() => {
		expect(result.current.data).toBe('success');
		expect(result.current.loading).toBe(false);
		expect(result.current.error).toBe(null);
	});

	expect(asyncFn).toHaveBeenCalledTimes(1);
}

async function testExecutesAsyncFunctionWithImmediateOption() {
	const { wrapper } = createWrapper();
	const asyncFn = vi.fn(() => Promise.resolve('immediate'));

	const { result } = renderHook(() => useAsync(asyncFn, { immediate: true }), { wrapper });

	await waitFor(() => {
		expect(result.current.data).toBe('immediate');
		expect(result.current.loading).toBe(false);
	});

	expect(asyncFn).toHaveBeenCalledTimes(1);
}

async function testPassesAbortSignalToAsyncFunction() {
	const { wrapper } = createWrapper();
	const asyncFn = vi.fn((signal?: AbortSignal) => {
		expect(signal).toBeInstanceOf(AbortSignal);
		return Promise.resolve('with-signal');
	});

	const { result } = renderHook(() => useAsync(asyncFn), { wrapper });

	await result.current.execute();

	await waitFor(() => {
		expect(result.current.data).toBe('with-signal');
	});

	expect(asyncFn).toHaveBeenCalledTimes(1);
}

export function describeLoadingStates() {
	describe('loading states', () => {
		it('sets loading to true during execution', testSetsLoadingTrueDuringExecution);
		it('sets loading to false after error', testSetsLoadingFalseAfterError);
	});
}

async function testSetsLoadingTrueDuringExecution() {
	const { wrapper } = createWrapper();
	let resolvePromise: ((value: string) => void) | undefined;
	const promise = new Promise<string>(resolve => {
		resolvePromise = resolve;
	});
	const asyncFn = vi.fn(() => promise);

	const { result } = renderHook(() => useAsync(asyncFn), { wrapper });

	const executePromise = result.current.execute();

	await waitFor(
		() => {
			expect(result.current.loading).toBe(true);
		},
		{ timeout: 1000 }
	);

	resolvePromise?.('done');
	await executePromise;

	await waitFor(
		() => {
			expect(result.current.loading).toBe(false);
		},
		{ timeout: 1000 }
	);
}

async function testSetsLoadingFalseAfterError() {
	const { wrapper } = createWrapper();
	const asyncFn = vi.fn(() => Promise.reject(new Error('failed')));

	const { result } = renderHook(() => useAsync(asyncFn), { wrapper });

	await result.current.execute();

	await waitFor(() => {
		expect(result.current.loading).toBe(false);
		expect(result.current.error).toBeTruthy();
	});
}

export function describeSuccessStates() {
	describe('success states', () => {
		it('handles successful execution', testHandlesSuccessfulExecution);
		it('calls onSuccess callback when provided', testCallsOnSuccessCallback);
		it('calls onComplete callback after success', testCallsOnCompleteAfterSuccess);
	});
}

async function testHandlesSuccessfulExecution() {
	const { wrapper } = createWrapper();
	const asyncFn = vi.fn(() => Promise.resolve({ id: 1, name: 'test' }));

	const { result } = renderHook(() => useAsync(asyncFn), { wrapper });

	await result.current.execute();

	await waitFor(() => {
		expect(result.current.data).toEqual({ id: 1, name: 'test' });
		expect(result.current.error).toBe(null);
		expect(result.current.loading).toBe(false);
	});
}

async function testCallsOnSuccessCallback() {
	const { wrapper } = createWrapper();
	const asyncFn = vi.fn(() => Promise.resolve('success'));
	const onSuccess = vi.fn();

	const { result } = renderHook(() => useAsync(asyncFn, { onSuccess }), { wrapper });

	await result.current.execute();

	await waitFor(() => {
		expect(onSuccess).toHaveBeenCalledWith('success');
	});
	expect(onSuccess).toHaveBeenCalledTimes(1);
}

async function testCallsOnCompleteAfterSuccess() {
	const { wrapper } = createWrapper();
	const asyncFn = vi.fn(() => Promise.resolve('success'));
	const onComplete = vi.fn();

	const { result } = renderHook(() => useAsync(asyncFn, { onComplete }), { wrapper });

	await result.current.execute();

	await waitFor(() => {
		expect(onComplete).toHaveBeenCalledTimes(1);
	});
}

export function describeErrorStates() {
	describe('error states', () => {
		it('handles errors', testHandlesErrors);
		it('normalizes non-Error values to Error', testNormalizesNonErrorValues);
		it('calls onError callback when provided', testCallsOnErrorCallback);
		it('calls onComplete callback after error', testCallsOnCompleteAfterError);
	});
}

async function testHandlesErrors() {
	const { wrapper } = createWrapper();
	const error = new Error('failed');
	const asyncFn = vi.fn(() => Promise.reject(error));

	const { result } = renderHook(() => useAsync(asyncFn), { wrapper });

	await result.current.execute();

	await waitFor(() => {
		expect(result.current.error).toBeTruthy();
		expect(result.current.error?.message).toBe('failed');
		expect(result.current.data).toBe(null);
		expect(result.current.loading).toBe(false);
	});
}

async function testNormalizesNonErrorValues() {
	const { wrapper } = createWrapper();

	const asyncFn = vi.fn(async () => {
		// Throw a non-Error object to ensure normalization.
		throw new StringLikeObject();
	});

	const { result } = renderHook(() => useAsync(asyncFn), { wrapper });

	await result.current.execute();

	await waitFor(() => {
		expect(result.current.error).toBeInstanceOf(Error);
		expect(result.current.error?.message).toBe('string error');
	});
}

async function testCallsOnErrorCallback() {
	const { wrapper } = createWrapper();
	const error = new Error('failed');
	const asyncFn = vi.fn(() => Promise.reject(error));
	const onError = vi.fn();

	const { result } = renderHook(() => useAsync(asyncFn, { onError }), { wrapper });

	await result.current.execute();

	await waitFor(() => {
		expect(onError).toHaveBeenCalledWith(expect.any(Error));
	});
	expect(onError).toHaveBeenCalledTimes(1);
}

async function testCallsOnCompleteAfterError() {
	const { wrapper } = createWrapper();
	const asyncFn = vi.fn(() => Promise.reject(new Error('failed')));
	const onComplete = vi.fn();

	const { result } = renderHook(() => useAsync(asyncFn, { onComplete }), { wrapper });

	await result.current.execute();

	await waitFor(() => {
		expect(onComplete).toHaveBeenCalledTimes(1);
	});
}
