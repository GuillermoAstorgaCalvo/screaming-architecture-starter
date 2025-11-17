import { describe, expect, it, vi } from 'vitest';

import {
	abortCheckAsyncFn,
	act,
	CANCELLED_VALUE,
	createWrapper,
	delayedAsyncFn,
	renderHook,
	useAsync,
	waitFor,
} from './useAsync.test.shared';

export function describeCancellation() {
	describe('cancellation', () => {
		it('cancels execution on unmount', testCancelsExecutionOnUnmount);
		it('cancels execution using cancel function', testCancelsExecutionUsingCancel);
		it('does not update state if execution is aborted', testDoesNotUpdateAfterAbort);
		it('uses provided AbortSignal from options', testUsesProvidedAbortSignal);
	});
}

async function testCancelsExecutionOnUnmount() {
	const { wrapper } = createWrapper();
	let resolvePromise: ((value: string) => void) | undefined;
	const promise = new Promise<string>(resolve => {
		resolvePromise = resolve;
	});
	const asyncFn = vi.fn(() => promise);

	const { result, unmount } = renderHook(() => useAsync(asyncFn), {
		wrapper,
	});

	result.current.execute();
	unmount();
	resolvePromise?.(CANCELLED_VALUE);

	await new Promise<void>(resolve => {
		setTimeout(resolve, 10);
	});

	expect(asyncFn).toHaveBeenCalledTimes(1);
}

async function testCancelsExecutionUsingCancel() {
	const { wrapper } = createWrapper();
	let resolvePromise: ((value: string) => void) | undefined;
	const promise = new Promise<string>(resolve => {
		resolvePromise = resolve;
	});
	const asyncFn = vi.fn((signal?: AbortSignal) => {
		if (signal?.aborted) {
			return Promise.reject(new DOMException('Aborted', 'AbortError'));
		}
		return promise;
	});

	const { result } = renderHook(() => useAsync(asyncFn), { wrapper });

	const executePromise = result.current.execute();

	result.current.cancel();
	resolvePromise?.(CANCELLED_VALUE);

	await executePromise.catch(() => {
		// Expected
	});

	await waitFor(() => {
		expect(result.current.loading).toBe(false);
	});
}

async function testDoesNotUpdateAfterAbort() {
	const { wrapper } = createWrapper();
	const asyncFn = vi.fn(delayedAsyncFn);

	const { result } = renderHook(() => useAsync(asyncFn), { wrapper });

	const executePromise = result.current.execute();
	result.current.cancel();

	await executePromise.catch(() => {
		// Expected
	});

	expect(result.current.data).toBe(null);
}

async function testUsesProvidedAbortSignal() {
	const { wrapper } = createWrapper();
	const controller = new AbortController();
	const asyncFn = vi.fn(abortCheckAsyncFn);

	const { result } = renderHook(() => useAsync(asyncFn, { signal: controller.signal }), {
		wrapper,
	});

	const executePromise = result.current.execute();
	controller.abort();

	await executePromise.catch(() => {
		// Expected
	});

	expect(result.current.data).toBe(null);
}

export function describeDependencyChanges() {
	describe('dependency changes', () => {
		it('re-executes when dependencies change', testReExecutesOnDependencyChange);
		it('does not re-execute when dependencies do not change', testDoesNotReExecuteWhenDepsStable);
	});
}

async function testReExecutesOnDependencyChange() {
	const { wrapper } = createWrapper();
	const asyncFn = vi.fn((_signal?: AbortSignal) => Promise.resolve('result'));

	const { result, rerender } = renderHook(
		({ deps }: { deps: unknown[] }) => useAsync(asyncFn, { immediate: true, dependencies: deps }),
		{
			wrapper,
			initialProps: { deps: [1] },
		}
	);

	await waitFor(() => {
		expect(result.current.data).toBe('result');
	});

	expect(asyncFn).toHaveBeenCalledTimes(1);
	rerender({ deps: [2] });

	await waitFor(() => {
		expect(asyncFn).toHaveBeenCalledTimes(2);
	});
}

async function testDoesNotReExecuteWhenDepsStable() {
	const { wrapper } = createWrapper();
	const asyncFn = vi.fn((_signal?: AbortSignal) => Promise.resolve('result'));

	const { result, rerender } = renderHook(
		({ deps }: { deps: unknown[] }) => useAsync(asyncFn, { immediate: true, dependencies: deps }),
		{
			wrapper,
			initialProps: { deps: [1] },
		}
	);

	await waitFor(() => {
		expect(result.current.data).toBe('result');
	});

	expect(asyncFn).toHaveBeenCalledTimes(1);
	rerender({ deps: [1] });

	await new Promise<void>(resolve => {
		setTimeout(resolve, 50);
	});

	expect(asyncFn).toHaveBeenCalledTimes(1);
}

export function describeResetFunctionality() {
	describe('reset functionality', () => {
		it('resets data and error', testResetsDataAndError);
		it('resets and cancels pending operations', testResetsAndCancelsPending);
	});
}

async function testResetsDataAndError() {
	const { wrapper } = createWrapper();
	const asyncFn = vi.fn(() => Promise.resolve('success'));

	const { result } = renderHook(() => useAsync(asyncFn), { wrapper });

	await result.current.execute();

	await waitFor(() => {
		expect(result.current.data).toBe('success');
		expect(result.current.loading).toBe(false);
	});

	act(() => {
		result.current.reset();
	});

	expect(result.current.data).toBe(null);
	expect(result.current.error).toBe(null);
	expect(result.current.loading).toBe(false);
}

async function testResetsAndCancelsPending() {
	const { wrapper } = createWrapper();
	let resolvePromise: ((value: string) => void) | undefined;
	const promise = new Promise<string>(resolve => {
		resolvePromise = resolve;
	});
	const asyncFn = vi.fn(() => promise);

	const { result } = renderHook(() => useAsync(asyncFn), { wrapper });

	const executePromise = result.current.execute();

	act(() => {
		result.current.reset();
	});

	resolvePromise?.(CANCELLED_VALUE);

	await executePromise.catch(() => {
		// Expected
	});

	expect(result.current.data).toBe(null);
	expect(result.current.error).toBe(null);
	expect(result.current.loading).toBe(false);
}

export function describeMultipleExecutions() {
	describe('multiple executions', () => {
		it('handles sequential executions', testHandlesSequentialExecutions);
		it('clears previous error on new execution', testClearsErrorOnNewExecution);
	});
}

async function testHandlesSequentialExecutions() {
	const { wrapper } = createWrapper();
	const asyncFn = vi.fn((_signal?: AbortSignal) => Promise.resolve('result'));

	const { result } = renderHook(() => useAsync(asyncFn), { wrapper });

	await result.current.execute();
	await waitFor(() => {
		expect(result.current.data).toBe('result');
	});

	await result.current.execute();
	await waitFor(() => {
		expect(result.current.data).toBe('result');
	});

	expect(asyncFn).toHaveBeenCalledTimes(2);
}

async function testClearsErrorOnNewExecution() {
	const { wrapper } = createWrapper();
	let shouldFail = true;
	const asyncFn = vi.fn(() => {
		if (shouldFail) {
			shouldFail = false;
			return Promise.reject(new Error('first error'));
		}
		return Promise.resolve('success');
	});

	const { result } = renderHook(() => useAsync(asyncFn), { wrapper });

	await result.current.execute();
	await waitFor(() => {
		expect(result.current.error).toBeTruthy();
	});

	await result.current.execute();
	await waitFor(() => {
		expect(result.current.error).toBe(null);
		expect(result.current.data).toBe('success');
	});
}

export function describeEdgeCases() {
	describe('edge cases', () => {
		it('handles null return value', testHandlesNullReturnValue);
		it('handles undefined return value', testHandlesUndefinedReturnValue);
		it('does not execute if already aborted', testDoesNotExecuteIfAlreadyAborted);
		it('handles immediate execution with dependencies', testHandlesImmediateWithDependencies);
	});
}

async function testHandlesNullReturnValue() {
	const { wrapper } = createWrapper();
	const asyncFn = vi.fn(() => Promise.resolve(null));

	const { result } = renderHook(() => useAsync(asyncFn), { wrapper });

	await result.current.execute();

	await waitFor(() => {
		expect(result.current.data).toBe(null);
		expect(result.current.error).toBe(null);
	});
}

async function testHandlesUndefinedReturnValue() {
	const { wrapper } = createWrapper();
	const asyncFn = vi.fn(() => Promise.resolve(undefined));

	const { result } = renderHook(() => useAsync(asyncFn), { wrapper });

	await result.current.execute();

	await waitFor(() => {
		expect(result.current.data).toBe(undefined);
		expect(result.current.error).toBe(null);
	});
}

async function testDoesNotExecuteIfAlreadyAborted() {
	const { wrapper } = createWrapper();
	const controller = new AbortController();
	controller.abort();

	const asyncFn = vi.fn(() => Promise.resolve('success'));

	const { result } = renderHook(() => useAsync(asyncFn, { signal: controller.signal }), {
		wrapper,
	});

	await result.current.execute();

	await waitFor(() => {
		expect(result.current.loading).toBe(false);
	});

	expect(result.current.data).toBe(null);
}

async function testHandlesImmediateWithDependencies() {
	const { wrapper } = createWrapper();
	const asyncFn = vi.fn(() => Promise.resolve('immediate'));

	const { result } = renderHook(
		() =>
			useAsync(asyncFn, {
				immediate: true,
				dependencies: [1, 2, 3],
			}),
		{ wrapper }
	);

	await waitFor(() => {
		expect(result.current.data).toBe('immediate');
	});

	expect(asyncFn).toHaveBeenCalledTimes(1);
}
