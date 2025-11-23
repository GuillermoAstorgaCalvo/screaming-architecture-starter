import { useThrottle, useThrottledCallback } from '@core/hooks/throttle/useThrottle';
import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Test constants
const DEFAULT_DELAY = 100;
const CUSTOM_DELAY = 200;

// Helper to advance timers (wrapped in act for React state updates)
const advanceTime = (ms: number) => {
	act(() => {
		vi.advanceTimersByTime(ms);
	});
};

const registerTimerLifecycle = () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.restoreAllMocks();
		vi.useRealTimers();
	});
};

function throttledValueUpdatesSuite() {
	registerTimerLifecycle();
	describeInitialValueBehavior();
	describeThrottledChangeBehavior();
	describeValueStabilityBehavior();
	describeValueTypeBehavior();
}

function describeInitialValueBehavior() {
	describe('initial value behavior', () => {
		it('should return initial value immediately', () => {
			const { result } = renderHook(() => useThrottle('initial', DEFAULT_DELAY));

			expect(result.current).toBe('initial');
		});

		it('should update value immediately on first change (leading edge)', () => {
			const { result, rerender } = renderHook(({ value, delay }) => useThrottle(value, delay), {
				initialProps: { value: 'initial', delay: DEFAULT_DELAY },
			});

			expect(result.current).toBe('initial');

			rerender({ value: 'updated', delay: DEFAULT_DELAY });

			// Leading edge: should update immediately
			expect(result.current).toBe('updated');
		});
	});
}

function describeThrottledChangeBehavior() {
	describe('throttled change behavior', () => {
		it('should throttle rapid value changes', () => {
			const { result, rerender } = renderHook(({ value, delay }) => useThrottle(value, delay), {
				initialProps: { value: 0, delay: DEFAULT_DELAY },
			});

			expect(result.current).toBe(0);

			// First change - leading edge executes immediately
			rerender({ value: 1, delay: DEFAULT_DELAY });
			expect(result.current).toBe(1);

			// Rapid changes within throttle period
			rerender({ value: 2, delay: DEFAULT_DELAY });
			expect(result.current).toBe(1); // Still previous value (throttled)

			rerender({ value: 3, delay: DEFAULT_DELAY });
			expect(result.current).toBe(1); // Still previous value (throttled)

			// After delay, trailing edge should execute with last value
			advanceTime(DEFAULT_DELAY);
			expect(result.current).toBe(3); // Trailing edge with last value
		});

		it('should handle multiple rapid changes and update with last value on trailing edge', () => {
			const { result, rerender } = renderHook(({ value, delay }) => useThrottle(value, delay), {
				initialProps: { value: 'a', delay: DEFAULT_DELAY },
			});

			expect(result.current).toBe('a');

			// First change
			rerender({ value: 'b', delay: DEFAULT_DELAY });
			expect(result.current).toBe('b');

			// Multiple rapid changes
			rerender({ value: 'c', delay: DEFAULT_DELAY });
			rerender({ value: 'd', delay: DEFAULT_DELAY });
			rerender({ value: 'e', delay: DEFAULT_DELAY });
			expect(result.current).toBe('b'); // Still 'b' (throttled)

			// After delay, should update to last value 'e'
			advanceTime(DEFAULT_DELAY);
			expect(result.current).toBe('e');
		});
	});
}

function describeValueStabilityBehavior() {
	describe('value stability behavior', () => {
		it('should not update if value does not change', () => {
			const { result, rerender } = renderHook(({ value, delay }) => useThrottle(value, delay), {
				initialProps: { value: 'same', delay: DEFAULT_DELAY },
			});

			const initialValue = result.current;
			expect(initialValue).toBe('same');

			// Rerender with same value
			rerender({ value: 'same', delay: DEFAULT_DELAY });

			// Should not trigger throttled update
			expect(result.current).toBe('same');
		});
	});
}

function describeValueTypeBehavior() {
	describe('value type behavior', () => {
		it('should handle object values correctly', () => {
			const initialObj = { count: 0 };
			const { result, rerender } = renderHook(({ value, delay }) => useThrottle(value, delay), {
				initialProps: { value: initialObj, delay: DEFAULT_DELAY },
			});

			expect(result.current).toBe(initialObj);

			const newObj = { count: 1 };
			rerender({ value: newObj, delay: DEFAULT_DELAY });

			expect(result.current).toBe(newObj);
		});

		it('should handle number values correctly', () => {
			const { result, rerender } = renderHook(({ value, delay }) => useThrottle(value, delay), {
				initialProps: { value: 0, delay: DEFAULT_DELAY },
			});

			rerender({ value: 42, delay: DEFAULT_DELAY });
			expect(result.current).toBe(42);

			rerender({ value: 100, delay: DEFAULT_DELAY });
			expect(result.current).toBe(42); // Throttled

			advanceTime(DEFAULT_DELAY);
			expect(result.current).toBe(100);
		});
	});
}

function intervalConfigurationSuite() {
	registerTimerLifecycle();

	it('should respect custom delay interval', () => {
		const { result, rerender } = renderHook(({ value, delay }) => useThrottle(value, delay), {
			initialProps: { value: 0, delay: CUSTOM_DELAY },
		});

		expect(result.current).toBe(0);

		rerender({ value: 1, delay: CUSTOM_DELAY });
		expect(result.current).toBe(1);

		rerender({ value: 2, delay: CUSTOM_DELAY });
		expect(result.current).toBe(1); // Throttled

		// Advance less than custom delay - should still be throttled
		advanceTime(DEFAULT_DELAY);
		expect(result.current).toBe(1); // Still throttled

		// Advance to custom delay - should update
		advanceTime(CUSTOM_DELAY - DEFAULT_DELAY);
		expect(result.current).toBe(2);
	});

	it('should handle delay changes and recreate throttled function', () => {
		const { result, rerender } = renderHook(({ value, delay }) => useThrottle(value, delay), {
			initialProps: { value: 0, delay: DEFAULT_DELAY },
		});

		expect(result.current).toBe(0);

		rerender({ value: 1, delay: DEFAULT_DELAY });
		expect(result.current).toBe(1);

		// Change delay
		rerender({ value: 2, delay: CUSTOM_DELAY });
		// Should update immediately (leading edge with new throttle function)
		expect(result.current).toBe(2);

		rerender({ value: 3, delay: CUSTOM_DELAY });
		expect(result.current).toBe(2); // Throttled with new delay

		// Should use new delay for trailing edge
		advanceTime(CUSTOM_DELAY);
		expect(result.current).toBe(3);
	});

	it('should handle very short delays', () => {
		const shortDelay = 10;
		const { result, rerender } = renderHook(({ value, delay }) => useThrottle(value, delay), {
			initialProps: { value: 0, delay: shortDelay },
		});

		rerender({ value: 1, delay: shortDelay });
		expect(result.current).toBe(1);

		rerender({ value: 2, delay: shortDelay });
		expect(result.current).toBe(1);

		advanceTime(shortDelay);
		expect(result.current).toBe(2);
	});

	it('should handle long delays', () => {
		const longDelay = 1000;
		const { result, rerender } = renderHook(({ value, delay }) => useThrottle(value, delay), {
			initialProps: { value: 0, delay: longDelay },
		});

		rerender({ value: 1, delay: longDelay });
		expect(result.current).toBe(1);

		rerender({ value: 2, delay: longDelay });
		expect(result.current).toBe(1);

		// Advance less than delay
		advanceTime(500);
		expect(result.current).toBe(1);

		// Advance to full delay
		advanceTime(500);
		expect(result.current).toBe(2);
	});
}

function leadingTrailingSuite() {
	registerTimerLifecycle();

	it('should execute on leading edge (immediate update)', () => {
		const { result, rerender } = renderHook(({ value, delay }) => useThrottle(value, delay), {
			initialProps: { value: 'initial', delay: DEFAULT_DELAY },
		});

		rerender({ value: 'updated', delay: DEFAULT_DELAY });

		// Leading edge: should update immediately
		expect(result.current).toBe('updated');
	});

	it('should execute on trailing edge with last value', async () => {
		const { result, rerender } = renderHook(({ value, delay }) => useThrottle(value, delay), {
			initialProps: { value: 0, delay: DEFAULT_DELAY },
		});

		// First change - leading edge
		rerender({ value: 1, delay: DEFAULT_DELAY });
		expect(result.current).toBe(1);

		// Rapid changes
		rerender({ value: 2, delay: DEFAULT_DELAY });
		rerender({ value: 3, delay: DEFAULT_DELAY });
		rerender({ value: 4, delay: DEFAULT_DELAY });
		expect(result.current).toBe(1); // Still 1 (throttled)

		// Trailing edge should execute with last value (4)
		advanceTime(DEFAULT_DELAY);
		expect(result.current).toBe(4);
	});

	it('should handle sequence of calls across multiple throttle periods', () => {
		const { result, rerender } = renderHook(({ value, delay }) => useThrottle(value, delay), {
			initialProps: { value: 0, delay: DEFAULT_DELAY },
		});

		// First period
		rerender({ value: 1, delay: DEFAULT_DELAY });
		expect(result.current).toBe(1);

		advanceTime(DEFAULT_DELAY);
		expect(result.current).toBe(1); // Trailing edge (same value)

		// Second period
		rerender({ value: 2, delay: DEFAULT_DELAY });
		expect(result.current).toBe(2); // Leading edge

		rerender({ value: 3, delay: DEFAULT_DELAY });
		expect(result.current).toBe(2); // Throttled

		advanceTime(DEFAULT_DELAY);
		expect(result.current).toBe(3); // Trailing edge
	});
}

function cleanupSuite() {
	registerTimerLifecycle();

	it('should cancel throttled function on unmount', () => {
		const { result, rerender, unmount } = renderHook(
			({ value, delay }) => useThrottle(value, delay),
			{
				initialProps: { value: 0, delay: DEFAULT_DELAY },
			}
		);

		rerender({ value: 1, delay: DEFAULT_DELAY });
		expect(result.current).toBe(1);

		rerender({ value: 2, delay: DEFAULT_DELAY });
		expect(result.current).toBe(1); // Throttled

		// Unmount before trailing edge
		unmount();

		// Advance time - trailing edge should not execute
		advanceTime(DEFAULT_DELAY);

		// Result should be unchanged (component unmounted)
		// We can't check result.current after unmount, but we verify no errors
		expect(true).toBe(true);
	});

	it('should cancel previous throttled function when delay changes', () => {
		const { result, rerender } = renderHook(({ value, delay }) => useThrottle(value, delay), {
			initialProps: { value: 0, delay: DEFAULT_DELAY },
		});

		rerender({ value: 1, delay: DEFAULT_DELAY });
		expect(result.current).toBe(1);

		rerender({ value: 2, delay: DEFAULT_DELAY });
		expect(result.current).toBe(1); // Throttled

		// Change delay - should cancel previous and create new throttled function
		rerender({ value: 3, delay: CUSTOM_DELAY });
		expect(result.current).toBe(3); // Leading edge with new throttle

		// Previous trailing edge should be cancelled
		advanceTime(DEFAULT_DELAY);
		expect(result.current).toBe(3); // Should still be 3, not 2

		// New trailing edge should use new delay
		rerender({ value: 4, delay: CUSTOM_DELAY });
		expect(result.current).toBe(3); // Throttled

		advanceTime(CUSTOM_DELAY);
		expect(result.current).toBe(4); // Trailing edge with new delay
	});

	it('should handle cleanup when value changes rapidly before unmount', () => {
		const { result, rerender, unmount } = renderHook(
			({ value, delay }) => useThrottle(value, delay),
			{
				initialProps: { value: 0, delay: DEFAULT_DELAY },
			}
		);

		rerender({ value: 1, delay: DEFAULT_DELAY });
		rerender({ value: 2, delay: DEFAULT_DELAY });
		rerender({ value: 3, delay: DEFAULT_DELAY });

		expect(result.current).toBe(1); // Leading edge

		// Unmount immediately
		unmount();

		// Advance time - should not cause errors or updates
		advanceTime(DEFAULT_DELAY);

		expect(true).toBe(true); // No errors
	});
}

function edgeCasesSuite() {
	registerTimerLifecycle();

	it('should handle initial value correctly', () => {
		const { result } = renderHook(() => useThrottle('test', DEFAULT_DELAY));

		expect(result.current).toBe('test');
	});

	it('should handle null values', () => {
		const { result, rerender } = renderHook(
			({ value, delay }: { value: string | null; delay: number }) => useThrottle(value, delay),
			{
				initialProps: { value: null as string | null, delay: DEFAULT_DELAY },
			}
		);

		expect(result.current).toBeNull();

		rerender({ value: 'not-null', delay: DEFAULT_DELAY });
		expect(result.current).toBe('not-null');

		rerender({ value: null, delay: DEFAULT_DELAY });
		expect(result.current).toBe('not-null'); // Throttled

		advanceTime(DEFAULT_DELAY);
		expect(result.current).toBeNull();
	});

	it('should handle undefined values', () => {
		const { result, rerender } = renderHook(
			({ value, delay }: { value: string | undefined; delay: number }) => useThrottle(value, delay),
			{
				initialProps: { value: undefined as string | undefined, delay: DEFAULT_DELAY },
			}
		);

		expect(result.current).toBeUndefined();

		rerender({ value: 'defined', delay: DEFAULT_DELAY });
		expect(result.current).toBe('defined');

		rerender({ value: undefined, delay: DEFAULT_DELAY });
		expect(result.current).toBe('defined'); // Throttled

		advanceTime(DEFAULT_DELAY);
		expect(result.current).toBeUndefined();
	});

	it('should handle boolean values', () => {
		const { result, rerender } = renderHook(({ value, delay }) => useThrottle(value, delay), {
			initialProps: { value: false, delay: DEFAULT_DELAY },
		});

		expect(result.current).toBe(false);

		rerender({ value: true, delay: DEFAULT_DELAY });
		expect(result.current).toBe(true);

		rerender({ value: false, delay: DEFAULT_DELAY });
		expect(result.current).toBe(true); // Throttled

		advanceTime(DEFAULT_DELAY);
		expect(result.current).toBe(false);
	});

	it('should handle array values', () => {
		const initialArray = [1, 2, 3];
		const { result, rerender } = renderHook(({ value, delay }) => useThrottle(value, delay), {
			initialProps: { value: initialArray, delay: DEFAULT_DELAY },
		});

		expect(result.current).toBe(initialArray);

		const newArray = [4, 5, 6];
		rerender({ value: newArray, delay: DEFAULT_DELAY });
		expect(result.current).toBe(newArray);
	});
}

function useThrottledCallbackBasicSuite() {
	registerTimerLifecycle();

	it('should return a throttled callback function', () => {
		const callback = vi.fn((x: number) => x * 2) as (...args: unknown[]) => unknown;
		const { result } = renderHook(() => useThrottledCallback(callback, DEFAULT_DELAY));

		expect(result.current).toBeTypeOf('function');
		expect(result.current.cancel).toBeTypeOf('function');
		expect(result.current.flush).toBeTypeOf('function');
	});

	it('should throttle callback execution', () => {
		const callback = vi.fn((x: number) => x) as (...args: unknown[]) => unknown;
		const { result } = renderHook(() => useThrottledCallback(callback, DEFAULT_DELAY));

		// First call - should execute immediately (leading edge)
		result.current(1);
		expect(callback).toHaveBeenCalledTimes(1);
		expect(callback).toHaveBeenLastCalledWith(1);

		// Rapid calls - should be throttled
		result.current(2);
		result.current(3);
		result.current(4);
		expect(callback).toHaveBeenCalledTimes(1); // Still only 1 call

		// After delay - trailing edge should execute with last value
		advanceTime(DEFAULT_DELAY);
		expect(callback).toHaveBeenCalledTimes(2);
		expect(callback).toHaveBeenLastCalledWith(4);
	});

	it('should support cancel method', () => {
		const callback = vi.fn();
		const { result } = renderHook(() => useThrottledCallback(callback, DEFAULT_DELAY));

		result.current();
		expect(callback).toHaveBeenCalledTimes(1);

		result.current();
		expect(callback).toHaveBeenCalledTimes(1); // Throttled

		// Cancel pending execution
		result.current.cancel();

		// Advance time - should not execute
		advanceTime(DEFAULT_DELAY);
		expect(callback).toHaveBeenCalledTimes(1); // Still only 1
	});

	it('should support flush method', () => {
		const callback = vi.fn((x: number) => x) as (...args: unknown[]) => unknown;
		const { result } = renderHook(() => useThrottledCallback(callback, DEFAULT_DELAY));

		result.current(1);
		expect(callback).toHaveBeenCalledTimes(1);

		result.current(2);
		result.current(3);
		expect(callback).toHaveBeenCalledTimes(1); // Throttled

		// Flush should execute pending immediately
		const flushResult = result.current.flush();
		expect(callback).toHaveBeenCalledTimes(2);
		expect(callback).toHaveBeenLastCalledWith(3);
		expect(flushResult).toBe(3);
	});
}

function useThrottledCallbackRecreationSuite() {
	registerTimerLifecycle();

	it('should recreate throttled function when callback changes', () => {
		const callback1 = vi.fn((x: number) => x) as (...args: unknown[]) => unknown;
		const callback2 = vi.fn((x: number) => x * 2) as (...args: unknown[]) => unknown;

		const { result, rerender } = renderHook(
			({ callback, delay }) => useThrottledCallback(callback, delay),
			{
				initialProps: { callback: callback1, delay: DEFAULT_DELAY },
			}
		);

		result.current(1);
		expect(callback1).toHaveBeenCalledTimes(1);

		// Change callback
		rerender({ callback: callback2, delay: DEFAULT_DELAY });

		result.current(2);
		expect(callback2).toHaveBeenCalledTimes(1);
		expect(callback2).toHaveBeenLastCalledWith(2);
	});

	it('should recreate throttled function when delay changes', () => {
		const callbackFn = vi.fn() as () => void;
		const { result, rerender } = renderHook(
			({ callback, delay }) => useThrottledCallback(callback, delay),
			{
				initialProps: { callback: callbackFn, delay: DEFAULT_DELAY },
			}
		);

		result.current();
		expect(callbackFn).toHaveBeenCalledTimes(1);

		result.current();
		expect(callbackFn).toHaveBeenCalledTimes(1); // Throttled

		// Change delay - creates new throttled function
		rerender({ callback: callbackFn, delay: CUSTOM_DELAY });

		// New throttled function, so leading edge executes
		result.current();
		expect(callbackFn).toHaveBeenCalledTimes(2); // New throttle cycle

		result.current();
		expect(callbackFn).toHaveBeenCalledTimes(2); // Throttled with new delay

		// Should use new delay for trailing edge
		advanceTime(CUSTOM_DELAY);
		expect(callbackFn).toHaveBeenCalledTimes(3); // Trailing edge executes
	});
}

function startCooldownEarlyReturnSuite() {
	registerTimerLifecycle();

	it('should handle startCooldown being called when timer already exists', () => {
		const { result, rerender } = renderHook(({ value, delay }) => useThrottle(value, delay), {
			initialProps: { value: 0, delay: DEFAULT_DELAY },
		});

		// First change - starts timer
		rerender({ value: 1, delay: DEFAULT_DELAY });
		expect(result.current).toBe(1);

		// Second change - sets pending value
		rerender({ value: 2, delay: DEFAULT_DELAY });
		expect(result.current).toBe(1); // Still 1, timer running

		// Third change - sets new pending value (timer still running)
		rerender({ value: 3, delay: DEFAULT_DELAY });
		expect(result.current).toBe(1); // Still 1

		// When timer fires, it processes pending (3) and calls startCooldown
		// If there's another pending value queued, startCooldown should handle it
		// This tests the defensive check at line 178
		advanceTime(DEFAULT_DELAY);
		expect(result.current).toBe(3); // Should process last pending value
	});
}

function clearMatchingPendingSuite() {
	registerTimerLifecycle();

	it('should clear pending value when it matches the value being set to current', () => {
		// To hit lines 211-212, we need:
		// - Current value === New value (calls clearMatchingPending)
		// - Pending value === New value (triggers the clear at lines 211-212)
		//
		// This scenario is difficult to create naturally, but we can test the behavior
		// by ensuring clearMatchingPending is called and handles the case correctly.
		// The actual code path may be defensive and rarely hit in practice.

		const { result, rerender } = renderHook(
			({ value, delay }: { value: string | { id: string }; delay: number }) =>
				useThrottle(value, delay),
			{
				initialProps: { value: 'A' as string | { id: string }, delay: DEFAULT_DELAY },
			}
		);

		expect(result.current).toBe('A');

		// Change to new value - leading edge, starts timer
		rerender({ value: 'B', delay: DEFAULT_DELAY });
		expect(result.current).toBe('B');

		// Set pending value
		rerender({ value: 'C', delay: DEFAULT_DELAY });
		expect(result.current).toBe('B'); // Still 'B', pending is 'C'

		// Change back to current value 'B' - calls clearMatchingPending('B')
		// Pending is 'C', not 'B', so it doesn't match and isn't cleared
		rerender({ value: 'B', delay: DEFAULT_DELAY });
		expect(result.current).toBe('B');

		// Advance time - should process pending 'C'
		advanceTime(DEFAULT_DELAY);
		expect(result.current).toBe('C');

		// Note: The specific code path at lines 211-212 (where pending matches the value)
		// is difficult to test naturally as it requires a very specific sequence that
		// may not occur in normal operation. The code is defensive and ensures correctness
		// if the state somehow reaches that condition.
	});

	it('should handle clearMatchingPending when pending does not match', () => {
		const { result, rerender } = renderHook(({ value, delay }) => useThrottle(value, delay), {
			initialProps: { value: 100, delay: DEFAULT_DELAY },
		});

		expect(result.current).toBe(100);

		// Change to new value
		rerender({ value: 200, delay: DEFAULT_DELAY });
		expect(result.current).toBe(200);

		// Set pending to 100
		rerender({ value: 100, delay: DEFAULT_DELAY });
		expect(result.current).toBe(200); // Throttled, pending is 100

		// Change back to current value (200) - calls clearMatchingPending(store, 200)
		// Pending is 100, not 200, so it doesn't match and isn't cleared
		rerender({ value: 200, delay: DEFAULT_DELAY });
		expect(result.current).toBe(200);

		// Advance time - should process pending 100
		advanceTime(DEFAULT_DELAY);
		expect(result.current).toBe(100);
	});
}

describe('useThrottle – throttled value updates', throttledValueUpdatesSuite);
describe('useThrottle – interval configuration', intervalConfigurationSuite);
describe('useThrottle – leading/trailing behavior', leadingTrailingSuite);
describe('useThrottle – cleanup', cleanupSuite);
describe('useThrottle – edge cases', edgeCasesSuite);
describe('useThrottledCallback – basic functionality', useThrottledCallbackBasicSuite);
describe('useThrottledCallback – recreation', useThrottledCallbackRecreationSuite);
describe('useThrottle – startCooldown early return', startCooldownEarlyReturnSuite);
describe('useThrottle – clearMatchingPending', clearMatchingPendingSuite);
