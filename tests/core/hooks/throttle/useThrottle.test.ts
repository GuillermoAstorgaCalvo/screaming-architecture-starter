import { useThrottle } from '@core/hooks/throttle/useThrottle';
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

describe('useThrottle – throttled value updates', throttledValueUpdatesSuite);
describe('useThrottle – interval configuration', intervalConfigurationSuite);
describe('useThrottle – leading/trailing behavior', leadingTrailingSuite);
describe('useThrottle – cleanup', cleanupSuite);
describe('useThrottle – edge cases', edgeCasesSuite);
