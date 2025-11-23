import { throttle } from '@core/utils/throttle/throttle';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Test constants
const DEFAULT_WAIT = 100;

// Helper functions
const createThrottledFn = <T extends (...args: unknown[]) => unknown>(
	fn: T,
	wait = DEFAULT_WAIT,
	options = {}
) => {
	return throttle(fn, wait, options);
};

const advanceTime = (ms: number) => {
	vi.advanceTimersByTime(ms);
};

// Helper functions for edge case tests
type ThrottledFn = ReturnType<typeof createThrottledFn>;
type MockFn = ReturnType<typeof vi.fn>;

const setupThrottleWithOptions = <T extends (...args: unknown[]) => unknown>(
	fn: T,
	options: { leading?: boolean; trailing?: boolean } = {}
) => {
	return createThrottledFn(fn, DEFAULT_WAIT, {
		leading: true,
		trailing: true,
		...options,
	});
};

const testPendingTrailingEdgeWithInvokingCall = (func: MockFn, throttled: ThrottledFn) => {
	throttled(1);
	expect(func).toHaveBeenCalledTimes(1);
	expect(func).toHaveBeenCalledWith(1);
	throttled(2);
	expect(func).toHaveBeenCalledTimes(1);
};

const assertPendingTrailingExecution = (
	func: MockFn,
	throttled: ThrottledFn,
	invokingArg: number,
	expectedTrailingResult: number
) => {
	advanceTime(DEFAULT_WAIT);
	const result = throttled(invokingArg);
	expect(func).toHaveBeenCalledTimes(2);
	expect(func).toHaveBeenNthCalledWith(1, 1);
	expect(func).toHaveBeenNthCalledWith(2, 2);
	expect(result).toBe(expectedTrailingResult);
};

const assertSubsequentTrailingEdge = (func: MockFn, expectedArg: number) => {
	advanceTime(DEFAULT_WAIT);
	expect(func).toHaveBeenCalledTimes(3);
	expect(func).toHaveBeenNthCalledWith(3, expectedArg);
};

const setupTrailingOnlyThrottle = <T extends (...args: unknown[]) => unknown>(fn: T) => {
	return setupThrottleWithOptions(fn, {
		leading: false,
		trailing: true,
	});
};

const testInitialTrailingEdgeSetup = (func: MockFn, throttled: ThrottledFn) => {
	throttled(1);
	expect(func).toHaveBeenCalledTimes(0);
	advanceTime(DEFAULT_WAIT * 2);
	expect(func).toHaveBeenCalledTimes(1);
	expect(func).toHaveBeenCalledWith(1);
};

const testPendingTrailingWithLastCallTime = (func: MockFn, throttled: ThrottledFn) => {
	throttled(2);
	expect(func).toHaveBeenCalledTimes(1);
	advanceTime(DEFAULT_WAIT + 1);
	throttled(3);
	expect(func).toHaveBeenCalledTimes(2);
	expect(func).toHaveBeenNthCalledWith(2, 2);
};

const testTrailingOnlyMultipleCalls = (func: MockFn, throttled: ThrottledFn) => {
	throttled(1);
	expect(func).toHaveBeenCalledTimes(0);
	throttled(2);
	expect(func).toHaveBeenCalledTimes(0);
};

const assertComplexTrailingExecution = (
	func: MockFn,
	throttled: ThrottledFn,
	invokingArg: number,
	expectedResult: number
) => {
	advanceTime(DEFAULT_WAIT + 1);
	const result = throttled(invokingArg);
	expect(func).toHaveBeenCalledTimes(1);
	expect(func).toHaveBeenCalledWith(2);
	expect(result).toBe(expectedResult);
};

const assertFinalTrailingEdge = (func: MockFn, expectedArg: number) => {
	advanceTime(DEFAULT_WAIT);
	expect(func).toHaveBeenCalledTimes(2);
	expect(func).toHaveBeenNthCalledWith(2, expectedArg);
};

const testLeadingAndTrailingSetup = (func: MockFn, throttled: ThrottledFn) => {
	throttled(1);
	expect(func).toHaveBeenCalledTimes(1);
	throttled(2);
	expect(func).toHaveBeenCalledTimes(1);
};

const assertImmediateTrailingExecution = (
	func: MockFn,
	throttled: ThrottledFn,
	invokingArg: number,
	expectedResult: number
) => {
	advanceTime(DEFAULT_WAIT);
	advanceTime(1);
	const result = throttled(invokingArg);
	expect(func).toHaveBeenCalledTimes(2);
	expect(func).toHaveBeenNthCalledWith(2, 2);
	expect(result).toBe(expectedResult);
};

beforeEach(() => {
	vi.useFakeTimers();
});

afterEach(() => {
	vi.restoreAllMocks();
	vi.useRealTimers();
});

describe('throttle edge cases - uncovered lines', () => {
	it('handles pending trailing edge execution when invoking with enough time passed', () => {
		// This test covers lines 112-128: handleInvokingCase when shouldExecutePendingTrailing is true
		// Scenario: A call comes in that should invoke (enough time passed), but there's also
		// a pending trailing edge that should execute immediately
		const func = vi.fn((x: number) => x * 2);
		const throttled = setupThrottleWithOptions(func as (...args: unknown[]) => unknown);

		testPendingTrailingEdgeWithInvokingCall(func, throttled);
		assertPendingTrailingExecution(func, throttled, 3, 4);
		assertSubsequentTrailingEdge(func, 3);
	});

	it('handles shouldExecutePendingTrailing with undefined lastCallTime', () => {
		// This test covers lines 96-97: shouldExecutePendingTrailing when lastCallTime is undefined
		// The code uses `lastCallTime ?? now` to handle this edge case defensively
		// This can occur when lastCallTime is undefined but we have a pending trailing edge
		const func = vi.fn((x: number) => x);
		const throttled = setupTrailingOnlyThrottle(func as (...args: unknown[]) => unknown);

		testInitialTrailingEdgeSetup(func, throttled);
		testPendingTrailingWithLastCallTime(func, throttled);
	});

	it('handles complex scenario: pending trailing executes during invoking call with trailing-only mode', () => {
		// Test the complex path in handleInvokingCase (lines 112-128) with trailing-only mode
		const func = vi.fn((x: number) => x * 10);
		const throttled = setupTrailingOnlyThrottle(func as (...args: unknown[]) => unknown);

		testTrailingOnlyMultipleCalls(func, throttled);
		assertComplexTrailingExecution(func, throttled, 3, 20);
		assertFinalTrailingEdge(func, 3);
	});

	it('handles edge case where trailing edge executes immediately when wait time has fully elapsed', () => {
		// Test scenario where remainingWait <= 0 in shouldExecutePendingTrailing
		const func = vi.fn((x: number) => x);
		const throttled = setupThrottleWithOptions(func as (...args: unknown[]) => unknown);

		testLeadingAndTrailingSetup(func, throttled);
		assertImmediateTrailingExecution(func, throttled, 3, 2);
		assertSubsequentTrailingEdge(func, 3);
	});

	it('handles leading-only mode for branch coverage', () => {
		const func = vi.fn((x: number) => x);
		const throttled = setupThrottleWithOptions(func as (...args: unknown[]) => unknown, {
			leading: true,
			trailing: false,
		});

		throttled(1);
		expect(func).toHaveBeenCalledTimes(1);
		throttled(2);
		advanceTime(DEFAULT_WAIT);
		expect(func).toHaveBeenCalledTimes(1);
	});

	it('handles trailing-only mode for branch coverage', () => {
		const func = vi.fn((x: number) => x);
		const throttled = setupThrottleWithOptions(func as (...args: unknown[]) => unknown, {
			leading: false,
			trailing: true,
		});

		throttled(1);
		expect(func).toHaveBeenCalledTimes(0);
		advanceTime(DEFAULT_WAIT);
		expect(func).toHaveBeenCalledTimes(1);
	});
});
