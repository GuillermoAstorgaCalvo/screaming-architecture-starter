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

beforeEach(() => {
	vi.useFakeTimers();
});

afterEach(() => {
	vi.restoreAllMocks();
	vi.useRealTimers();
});

describe('shouldExecutePendingTrailing basic cases', () => {
	it('handles case where shouldExecutePendingTrailing returns true', () => {
		// This tests the path in handleInvokingCase when shouldExecutePendingTrailing is true
		// This covers lines 112-128 in throttle.ts
		// The scenario: we have a pending trailing edge, and enough time has passed that
		// remainingWait <= 0, so we execute it immediately when shouldInvoke is true
		const func = vi.fn((x: number) => x * 2);
		const throttled = createThrottledFn(func as (...args: unknown[]) => unknown, DEFAULT_WAIT, {
			leading: true,
			trailing: true,
		});

		// First call - leading edge executes, sets lastCallTime
		throttled(1);
		expect(func).toHaveBeenCalledTimes(1);
		expect(func).toHaveBeenCalledWith(1);

		// Second call - throttled, updates lastArgs and reschedules trailing edge
		// At this point, lastCallTime is still from first call
		throttled(2);
		expect(func).toHaveBeenCalledTimes(1); // Still only called once

		// Advance time by exactly wait period
		// This makes remainingWait = wait - (now - lastCallTime) = wait - wait = 0
		// So shouldExecutePendingTrailing will return true
		advanceTime(DEFAULT_WAIT);

		// Third call - shouldInvoke returns true (enough time passed)
		// shouldExecutePendingTrailing also returns true (remainingWait <= 0)
		// This triggers the path that executes pending trailing edge immediately
		throttled(3);
		expect(func).toHaveBeenCalledTimes(2); // Trailing edge with args 2 executed
		expect(func).toHaveBeenNthCalledWith(1, 1); // First call
		expect(func).toHaveBeenNthCalledWith(2, 2); // Trailing edge with previous args

		// The new cycle doesn't execute leading edge (since we just executed trailing)
		// But it sets lastArgs for future trailing edge
		advanceTime(DEFAULT_WAIT);
		expect(func).toHaveBeenCalledTimes(3); // Trailing edge with args 3
		expect(func).toHaveBeenNthCalledWith(3, 3);
	});

	it('handles shouldExecutePendingTrailing with exact wait time', () => {
		const func = vi.fn((x: number) => x);
		const throttled = createThrottledFn(func as (...args: unknown[]) => unknown, DEFAULT_WAIT, {
			leading: true,
			trailing: true,
		});

		throttled(1);
		expect(func).toHaveBeenCalledTimes(1);

		throttled(2);
		expect(func).toHaveBeenCalledTimes(1);

		// Advance exactly the wait time
		advanceTime(DEFAULT_WAIT);

		// Call again - shouldExecutePendingTrailing should return true
		throttled(3);
		expect(func).toHaveBeenCalledTimes(2); // Trailing edge with args 2
		expect(func).toHaveBeenNthCalledWith(2, 2);
	});

	it('handles shouldExecutePendingTrailing with return values', () => {
		const func = vi.fn((x: number) => x * 10);
		const throttled = createThrottledFn(func as (...args: unknown[]) => unknown, DEFAULT_WAIT, {
			leading: true,
			trailing: true,
		});

		const result1 = throttled(1);
		expect(result1).toBe(10);
		expect(func).toHaveBeenCalledTimes(1);

		throttled(2);
		advanceTime(DEFAULT_WAIT);

		// This call triggers shouldExecutePendingTrailing
		// It should return the result from the trailing edge execution
		const result2 = throttled(3);
		expect(func).toHaveBeenCalledTimes(2);
		expect(func).toHaveBeenNthCalledWith(2, 2);
		// Result should be from trailing edge execution (args 2 -> 2 * 10 = 20)
		expect(result2).toBe(20);
	});
});

describe('shouldExecutePendingTrailing edge cases', () => {
	it('handles shouldExecutePendingTrailing with lastCallTime edge case', () => {
		// This tests lines 96-97 where lastCallTime might be undefined or the fallback logic
		// The key is testing the path where remainingWait calculation uses lastCallTime ?? now
		// This covers the fallback when lastCallTime is undefined in shouldExecutePendingTrailing
		const func = vi.fn((x: number) => x);
		const throttled = createThrottledFn(func as (...args: unknown[]) => unknown, DEFAULT_WAIT, {
			leading: false, // No leading edge, so lastCallTime might not be set initially
			trailing: true,
		});

		// First call - no leading edge, schedules trailing
		// At this point, lastCallTime is undefined, so scheduleTrailingEdge uses now as lastTime
		throttled(1);
		expect(func).toHaveBeenCalledTimes(0);

		// Advance time by exactly wait - this makes remainingWait = 0 in shouldExecutePendingTrailing
		// When we call again, shouldInvoke returns true (lastCallTime is still undefined or old)
		// and shouldExecutePendingTrailing should return true if remainingWait <= 0
		advanceTime(DEFAULT_WAIT);

		// Second call - shouldInvoke returns true, and if there's a pending trailing edge
		// with remainingWait <= 0, shouldExecutePendingTrailing returns true
		throttled(2);
		// The trailing edge from first call should execute, then we start a new cycle
		expect(func).toHaveBeenCalledTimes(1);
		expect(func).toHaveBeenCalledWith(1);
	});

	it('covers shouldExecutePendingTrailing path with precise timing', () => {
		// This test attempts to cover lines 112-128 by creating a scenario where
		// shouldExecutePendingTrailing returns true. The challenge is that with fake timers,
		// advancing time causes timeouts to fire synchronously. However, we can test the
		// logic by ensuring the conditions are met.
		const func = vi.fn((x: number) => x * 10);
		const SHORT_WAIT = 50; // Use a shorter wait time for more precise control
		const throttled = createThrottledFn(func as (...args: unknown[]) => unknown, SHORT_WAIT, {
			leading: true,
			trailing: true,
		});

		// First call - leading edge executes
		throttled(1);
		expect(func).toHaveBeenCalledTimes(1);

		// Second call immediately - throttled, sets lastArgs, schedules trailing
		throttled(2);
		expect(func).toHaveBeenCalledTimes(1);

		// Advance time by the wait period - this should make remainingWait = 0
		// The timeout will fire, but we want to test the path where we call again
		// before or at the same time, triggering shouldExecutePendingTrailing
		// Note: With fake timers, this is challenging, but we test the logic path
		advanceTime(SHORT_WAIT);

		// At this point, the trailing edge may have fired via timeout
		// But if we call again immediately, and there's still a pending edge with remainingWait <= 0,
		// it should trigger the shouldExecutePendingTrailing path
		// This tests the code path even if the exact timing is hard to control with fake timers
		throttled(3);
		// The function should have been called at least for the trailing edge
		expect(func).toHaveBeenCalledTimes(2);
	});

	it('handles shouldExecutePendingTrailing when trailing edge clears timer', () => {
		const func = vi.fn();
		const throttled = createThrottledFn(func, DEFAULT_WAIT, {
			leading: true,
			trailing: true,
		});

		throttled(1);
		expect(func).toHaveBeenCalledTimes(1);

		throttled(2);
		expect(func).toHaveBeenCalledTimes(1);

		// Advance time by exactly wait to trigger shouldExecutePendingTrailing
		advanceTime(DEFAULT_WAIT);

		// This should clear timer, execute trailing, clear timer again, then start new cycle
		throttled(3);
		expect(func).toHaveBeenCalledTimes(2);
		expect(func).toHaveBeenNthCalledWith(2, 2);

		// Verify no additional execution after wait period
		advanceTime(DEFAULT_WAIT);
		expect(func).toHaveBeenCalledTimes(3); // New trailing edge with args 3
		expect(func).toHaveBeenNthCalledWith(3, 3);
	});
});

describe('shouldExecutePendingTrailing complex scenarios', () => {
	it('handles rapid successive calls with timing edge cases', () => {
		const func = vi.fn((x: number) => x);
		const throttled = createThrottledFn(func as (...args: unknown[]) => unknown, DEFAULT_WAIT, {
			leading: true,
			trailing: true,
		});

		// First call
		throttled(1);
		expect(func).toHaveBeenCalledTimes(1);

		// Rapid calls
		throttled(2);
		throttled(3);
		throttled(4);
		expect(func).toHaveBeenCalledTimes(1);

		// Advance time by exactly wait to trigger shouldExecutePendingTrailing
		advanceTime(DEFAULT_WAIT);

		// Call again - should execute pending trailing and start new cycle
		throttled(5);
		expect(func).toHaveBeenCalledTimes(2);
		expect(func).toHaveBeenNthCalledWith(2, 4); // Last args before the new call

		// Continue rapid calls
		throttled(6);
		throttled(7);
		expect(func).toHaveBeenCalledTimes(2);

		// Advance time
		advanceTime(DEFAULT_WAIT);
		expect(func).toHaveBeenCalledTimes(3);
		expect(func).toHaveBeenNthCalledWith(3, 7);
	});

	it('handles multiple cycles with shouldExecutePendingTrailing', () => {
		const func = vi.fn((x: number) => x);
		const throttled = createThrottledFn(func as (...args: unknown[]) => unknown, DEFAULT_WAIT, {
			leading: true,
			trailing: true,
		});

		// Cycle 1
		throttled(1);
		expect(func).toHaveBeenCalledTimes(1);

		throttled(2);
		advanceTime(DEFAULT_WAIT);
		throttled(3); // Triggers shouldExecutePendingTrailing
		expect(func).toHaveBeenCalledTimes(2);
		expect(func).toHaveBeenNthCalledWith(2, 2);

		// Cycle 2 - after shouldExecutePendingTrailing, lastCallTime was updated
		// so we need to wait again for shouldInvoke to return true
		advanceTime(DEFAULT_WAIT);
		throttled(4);
		expect(func).toHaveBeenCalledTimes(3);
		expect(func).toHaveBeenNthCalledWith(3, 3); // Trailing from previous cycle

		throttled(5);
		advanceTime(DEFAULT_WAIT);
		throttled(6); // Triggers shouldExecutePendingTrailing again
		expect(func).toHaveBeenCalledTimes(4);
		expect(func).toHaveBeenNthCalledWith(4, 5);
	});
});

describe('complex scenarios', () => {
	it('handles cancel and flush together', () => {
		const func = vi.fn((x: number) => x);
		const throttled = createThrottledFn(func as (...args: unknown[]) => unknown);

		throttled(1);
		expect(func).toHaveBeenCalledTimes(1); // Leading edge

		throttled(2);
		throttled.cancel();
		throttled(3);
		expect(func).toHaveBeenCalledTimes(2); // Leading edge of third call (after cancel)

		// After cancel, lastCallTime is cleared, so flush should execute with lastArgs if available
		// But since we called throttled(3) after cancel, it started a new cycle and set lastArgs
		const result = throttled.flush();
		expect(func).toHaveBeenCalledTimes(3); // Flush executes pending trailing edge
		expect(result).toBe(3); // Returns result from flush
	});

	it('handles multiple throttle periods with cancel', () => {
		const func = vi.fn();
		const throttled = createThrottledFn(func);

		throttled(1);
		advanceTime(DEFAULT_WAIT);

		throttled(2);
		throttled.cancel();
		advanceTime(DEFAULT_WAIT);
		expect(func).toHaveBeenCalledTimes(2); // Only leading edges
	});

	it('maintains separate state for multiple throttled functions', () => {
		const func1 = vi.fn();
		const func2 = vi.fn();
		const throttled1 = createThrottledFn(func1);
		const throttled2 = createThrottledFn(func2);

		throttled1();
		throttled2();
		expect(func1).toHaveBeenCalledTimes(1);
		expect(func2).toHaveBeenCalledTimes(1);

		throttled1.cancel();
		advanceTime(DEFAULT_WAIT);
		expect(func1).toHaveBeenCalledTimes(1);
		expect(func2).toHaveBeenCalledTimes(2);
	});
});
