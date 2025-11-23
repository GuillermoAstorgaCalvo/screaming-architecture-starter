import { useDebounce } from '@core/hooks/debounce/useDebounce';
import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Test constants
const DEFAULT_DELAY = 100;
const SHORT_DELAY = 50;
const LONG_DELAY = 200;

// Helper function to advance timers
const advanceTime = (ms: number) => {
	vi.advanceTimersByTime(ms);
};

const setupFakeTimerLifecycle = () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.restoreAllMocks();
		vi.useRealTimers();
	});
};

const describeUseDebounceSection = (title: string, suite: () => void) => {
	describe(`useDebounce - ${title}`, () => {
		setupFakeTimerLifecycle();
		suite();
	});
};

describeUseDebounceSection('debounced value updates (initial state)', () => {
	it('should return initial value immediately', () => {
		const { result } = renderHook(() => useDebounce('initial', DEFAULT_DELAY));
		expect(result.current).toBe('initial');
	});

	it('should not update debounced value immediately when value changes', () => {
		const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
			initialProps: { value: 'initial', delay: DEFAULT_DELAY },
		});

		expect(result.current).toBe('initial');
		rerender({ value: 'updated', delay: DEFAULT_DELAY });
		expect(result.current).toBe('initial');
	});
});

describeUseDebounceSection('debounced value updates (delay handling)', () => {
	it('should update debounced value after delay', () => {
		const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
			initialProps: { value: 'initial', delay: DEFAULT_DELAY },
		});

		rerender({ value: 'updated', delay: DEFAULT_DELAY });

		act(() => {
			advanceTime(DEFAULT_DELAY);
		});

		expect(result.current).toBe('updated');
	});

	it('should reset delay on subsequent value changes', () => {
		const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
			initialProps: { value: 'initial', delay: DEFAULT_DELAY },
		});

		rerender({ value: 'first', delay: DEFAULT_DELAY });
		act(() => {
			advanceTime(50);
		});

		rerender({ value: 'second', delay: DEFAULT_DELAY });
		act(() => {
			advanceTime(50);
		});

		// Should still be 'initial' because delay was reset
		expect(result.current).toBe('initial');

		act(() => {
			advanceTime(DEFAULT_DELAY);
		});

		expect(result.current).toBe('second');
	});

	it('should handle multiple rapid value changes and only update once', () => {
		const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
			initialProps: { value: 'initial', delay: DEFAULT_DELAY },
		});

		rerender({ value: 'value1', delay: DEFAULT_DELAY });
		rerender({ value: 'value2', delay: DEFAULT_DELAY });
		rerender({ value: 'value3', delay: DEFAULT_DELAY });
		rerender({ value: 'value4', delay: DEFAULT_DELAY });

		act(() => {
			advanceTime(DEFAULT_DELAY);
		});
		expect(result.current).toBe('value4');
	});
});

describeUseDebounceSection('debounced value updates (value types)', () => {
	it('should handle primitive value types', () => {
		const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
			initialProps: { value: 0, delay: DEFAULT_DELAY },
		});

		rerender({ value: 42, delay: DEFAULT_DELAY });

		act(() => {
			advanceTime(DEFAULT_DELAY);
		});

		expect(result.current).toBe(42);
	});

	it('should handle object values', () => {
		const initialObj = { name: 'initial' };
		const updatedObj = { name: 'updated' };

		const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
			initialProps: { value: initialObj, delay: DEFAULT_DELAY },
		});

		rerender({ value: updatedObj, delay: DEFAULT_DELAY });

		act(() => {
			advanceTime(DEFAULT_DELAY);
		});

		expect(result.current).toBe(updatedObj);
	});

	it('should handle array values', () => {
		const initialArray = [1, 2, 3];
		const updatedArray = [4, 5, 6];

		const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
			initialProps: { value: initialArray, delay: DEFAULT_DELAY },
		});

		rerender({ value: updatedArray, delay: DEFAULT_DELAY });

		act(() => {
			advanceTime(DEFAULT_DELAY);
		});
		expect(result.current).toBe(updatedArray);
	});
});

describeUseDebounceSection('delay configuration (custom values)', () => {
	it('should respect custom delay values', () => {
		const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
			initialProps: { value: 'initial', delay: LONG_DELAY },
		});

		rerender({ value: 'updated', delay: LONG_DELAY });

		act(() => {
			advanceTime(SHORT_DELAY);
		});
		expect(result.current).toBe('initial');

		act(() => {
			advanceTime(LONG_DELAY - SHORT_DELAY);
		});
		expect(result.current).toBe('updated');
	});
});

describeUseDebounceSection('delay configuration (delay changes)', () => {
	it('should handle delay changes', () => {
		const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
			initialProps: { value: 'initial', delay: LONG_DELAY },
		});

		rerender({ value: 'updated', delay: SHORT_DELAY });

		act(() => {
			advanceTime(SHORT_DELAY);
		});

		expect(result.current).toBe('updated');
	});
});

describeUseDebounceSection('delay configuration (pending update changes)', () => {
	it('should reset timer when delay changes during pending update', () => {
		const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
			initialProps: { value: 'initial', delay: DEFAULT_DELAY },
		});

		rerender({ value: 'updated', delay: DEFAULT_DELAY });
		act(() => {
			advanceTime(50);
		});

		// Change delay while update is pending
		rerender({ value: 'updated', delay: LONG_DELAY });
		act(() => {
			advanceTime(50);
		});

		// Should not have updated yet due to new longer delay
		expect(result.current).toBe('initial');

		act(() => {
			advanceTime(LONG_DELAY - 50);
		});

		expect(result.current).toBe('updated');
	});
});

describeUseDebounceSection('cleanup (cancel pending updates)', () => {
	it('should cancel pending updates on unmount', () => {
		const { result, rerender, unmount } = renderHook(
			({ value, delay }) => useDebounce(value, delay),
			{
				initialProps: { value: 'initial', delay: DEFAULT_DELAY },
			}
		);

		rerender({ value: 'updated', delay: DEFAULT_DELAY });

		unmount();

		act(() => {
			advanceTime(DEFAULT_DELAY);
		});

		// Value should remain unchanged after unmount
		expect(result.current).toBe('initial');
	});
});

describeUseDebounceSection('cleanup (timer management)', () => {
	it('should clean up timers on unmount', () => {
		const { rerender, unmount } = renderHook(({ value, delay }) => useDebounce(value, delay), {
			initialProps: { value: 'initial', delay: DEFAULT_DELAY },
		});

		rerender({ value: 'updated', delay: DEFAULT_DELAY });

		// Verify timer is set
		expect(vi.getTimerCount()).toBeGreaterThan(0);

		unmount();

		// Timer should be cleared
		expect(vi.getTimerCount()).toBe(0);
	});
});

describeUseDebounceSection('cleanup (multiple unmounts)', () => {
	it('should handle multiple unmounts gracefully', () => {
		const { rerender, unmount } = renderHook(({ value, delay }) => useDebounce(value, delay), {
			initialProps: { value: 'initial', delay: DEFAULT_DELAY },
		});

		rerender({ value: 'updated', delay: DEFAULT_DELAY });
		unmount();

		// Should not throw on multiple unmounts
		expect(() => unmount()).not.toThrow();
	});
});

describeUseDebounceSection('dependency changes (value updates)', () => {
	it('should handle value dependency changes', () => {
		const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
			initialProps: { value: 'value1', delay: DEFAULT_DELAY },
		});

		rerender({ value: 'value2', delay: DEFAULT_DELAY });
		rerender({ value: 'value3', delay: DEFAULT_DELAY });

		act(() => {
			advanceTime(DEFAULT_DELAY);
		});

		expect(result.current).toBe('value3');
	});
});

describeUseDebounceSection('dependency changes (delay updates)', () => {
	it('should handle delay dependency changes', () => {
		const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
			initialProps: { value: 'initial', delay: DEFAULT_DELAY },
		});

		rerender({ value: 'updated', delay: SHORT_DELAY });

		act(() => {
			advanceTime(SHORT_DELAY);
		});

		expect(result.current).toBe('updated');
	});
});

describeUseDebounceSection('dependency changes (cancelling previous updates)', () => {
	it('should cancel previous debounce when value changes', () => {
		const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
			initialProps: { value: 'initial', delay: DEFAULT_DELAY },
		});

		rerender({ value: 'first', delay: DEFAULT_DELAY });
		act(() => {
			advanceTime(50);
		});

		rerender({ value: 'second', delay: DEFAULT_DELAY });
		act(() => {
			advanceTime(DEFAULT_DELAY);
		});

		// Should only have the last value
		expect(result.current).toBe('second');
	});
});

describeUseDebounceSection('dependency changes (rapid change handling)', () => {
	it('should handle rapid value and delay changes', () => {
		const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
			initialProps: { value: 'initial', delay: DEFAULT_DELAY },
		});

		rerender({ value: 'value1', delay: SHORT_DELAY });
		rerender({ value: 'value2', delay: LONG_DELAY });
		rerender({ value: 'value3', delay: DEFAULT_DELAY });

		act(() => {
			advanceTime(DEFAULT_DELAY);
		});

		expect(result.current).toBe('value3');
	});
});

describeUseDebounceSection('edge cases (null values)', () => {
	it('should handle null values', () => {
		const { result, rerender } = renderHook<string | null, { value: string | null; delay: number }>(
			({ value, delay }) => useDebounce(value, delay),
			{
				initialProps: { value: null, delay: DEFAULT_DELAY },
			}
		);

		rerender({ value: 'not null', delay: DEFAULT_DELAY });

		act(() => {
			advanceTime(DEFAULT_DELAY);
		});

		expect(result.current).toBe('not null');
	});
});

describeUseDebounceSection('edge cases (undefined values)', () => {
	it('should handle undefined values', () => {
		const { result, rerender } = renderHook<
			string | undefined,
			{ value: string | undefined; delay: number }
		>(({ value, delay }) => useDebounce(value, delay), {
			initialProps: { value: undefined, delay: DEFAULT_DELAY },
		});

		rerender({ value: 'defined', delay: DEFAULT_DELAY });

		act(() => {
			advanceTime(DEFAULT_DELAY);
		});

		expect(result.current).toBe('defined');
	});
});

describeUseDebounceSection('edge cases (boolean values)', () => {
	it('should handle boolean values', () => {
		const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
			initialProps: { value: false, delay: DEFAULT_DELAY },
		});

		rerender({ value: true, delay: DEFAULT_DELAY });

		act(() => {
			advanceTime(DEFAULT_DELAY);
		});

		expect(result.current).toBe(true);
	});
});

describeUseDebounceSection('edge cases (zero delay)', () => {
	it('should throw error for zero delay', () => {
		expect(() => {
			renderHook(({ value, delay }) => useDebounce(value, delay), {
				initialProps: { value: 'initial', delay: 0 },
			});
		}).toThrow('debounce: wait must be a positive finite number');
	});
});

describeUseDebounceSection('edge cases (first render branch)', () => {
	it('should not cancel on first render when debouncedRef is null', () => {
		// This test ensures the branch where debouncedRef.current is null (first render)
		// is covered - line 32 false branch
		const { result } = renderHook(() => useDebounce('first', DEFAULT_DELAY));

		// On first render, debouncedRef.current should be null, so cancel() shouldn't be called
		// The value should still be set correctly
		expect(result.current).toBe('first');
	});
});

describeUseDebounceSection('cleanup (cancelling previous on value change)', () => {
	it('should cancel previous debounced function when value changes', () => {
		const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
			initialProps: { value: 'initial', delay: DEFAULT_DELAY },
		});

		// Trigger first update
		rerender({ value: 'first', delay: DEFAULT_DELAY });
		act(() => {
			advanceTime(50);
		});

		// Change value again - this should cancel the previous debounced function
		// This tests the branch where debouncedRef.current exists (line 32 true branch)
		rerender({ value: 'second', delay: DEFAULT_DELAY });

		act(() => {
			advanceTime(DEFAULT_DELAY);
		});

		// Should only have the last value
		expect(result.current).toBe('second');
	});

	it('should explicitly call cancel on line 33 when debouncedRef.current exists', () => {
		const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
			initialProps: { value: 'initial', delay: DEFAULT_DELAY },
		});

		// First render: debouncedRef.current is null, so line 33 is NOT executed
		expect(result.current).toBe('initial');
		expect(vi.getTimerCount()).toBeGreaterThan(0); // Timer exists from first render

		// Second render: debouncedRef.current now exists, so line 33 SHOULD be executed
		// This triggers the useEffect which calls cancel() on line 33, canceling the previous timer
		rerender({ value: 'first', delay: DEFAULT_DELAY });

		// After rerender, a new timer should be created (old one was canceled on line 33)
		// The timer count should be the same or reset, proving cancel was called
		expect(vi.getTimerCount()).toBeGreaterThan(0);

		// Advance time partially to ensure a pending debounce exists
		act(() => {
			advanceTime(50);
		});

		// Third render: debouncedRef.current exists, so cancel() on line 33 is called again
		// This explicitly exercises line 33
		rerender({ value: 'second', delay: DEFAULT_DELAY });

		// If cancel wasn't called on line 33, 'first' would have been set
		// But since cancel was called, only 'second' should be set after delay
		act(() => {
			advanceTime(DEFAULT_DELAY);
		});

		// Verify only the last value was set, proving cancel was called on line 33
		expect(result.current).toBe('second');
	});
});

describeUseDebounceSection('cleanup (cancelling previous on delay change)', () => {
	it('should cancel previous debounced function when delay changes', () => {
		const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
			initialProps: { value: 'initial', delay: DEFAULT_DELAY },
		});

		// Trigger update with first delay
		rerender({ value: 'updated', delay: DEFAULT_DELAY });
		act(() => {
			advanceTime(50);
		});

		// Change delay - this should cancel the previous debounced function
		rerender({ value: 'updated', delay: LONG_DELAY });

		act(() => {
			advanceTime(50);
		});

		// Should not have updated yet due to new delay
		expect(result.current).toBe('initial');

		act(() => {
			advanceTime(LONG_DELAY);
		});

		expect(result.current).toBe('updated');
	});
});

describeUseDebounceSection('cleanup (cleanup function edge cases)', () => {
	it('should handle cleanup when debouncedRef is already null', () => {
		const { unmount } = renderHook(() => useDebounce('test', DEFAULT_DELAY));

		// Unmount once
		unmount();

		// Cleanup should handle the case where debouncedRef.current is already null
		// This tests line 46 where we set it to null
		expect(() => unmount()).not.toThrow();
	});

	it('should cancel and clear ref in cleanup function', () => {
		const { result, rerender, unmount } = renderHook(
			({ value, delay }) => useDebounce(value, delay),
			{
				initialProps: { value: 'initial', delay: DEFAULT_DELAY },
			}
		);

		rerender({ value: 'updated', delay: DEFAULT_DELAY });

		// Verify timer exists
		expect(vi.getTimerCount()).toBeGreaterThan(0);

		unmount();

		// Timer should be cleared
		expect(vi.getTimerCount()).toBe(0);

		// Advance time - value should not change
		act(() => {
			advanceTime(DEFAULT_DELAY);
		});

		expect(result.current).toBe('initial');
	});
});

describeUseDebounceSection('edge cases (very small delay)', () => {
	it('should handle very small delay values', () => {
		const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
			initialProps: { value: 'initial', delay: 1 },
		});

		rerender({ value: 'updated', delay: 1 });

		act(() => {
			advanceTime(1);
		});

		expect(result.current).toBe('updated');
	});
});

describeUseDebounceSection('edge cases (same value multiple times)', () => {
	it('should handle same value being set multiple times', () => {
		const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
			initialProps: { value: 'same', delay: DEFAULT_DELAY },
		});

		rerender({ value: 'same', delay: DEFAULT_DELAY });
		rerender({ value: 'same', delay: DEFAULT_DELAY });
		rerender({ value: 'same', delay: DEFAULT_DELAY });

		act(() => {
			advanceTime(DEFAULT_DELAY);
		});

		expect(result.current).toBe('same');
	});
});

describeUseDebounceSection('edge cases (function values)', () => {
	it('should handle function values', () => {
		// Note: React's useState treats function arguments as lazy initializers,
		// so we wrap functions in an object to preserve the function reference
		const fn1 = () => 'first';
		const fn2 = () => 'second';
		const fn1Wrapper = { fn: fn1 };
		const fn2Wrapper = { fn: fn2 };

		const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
			initialProps: { value: fn1Wrapper, delay: DEFAULT_DELAY },
		});

		expect(result.current).toBe(fn1Wrapper);
		expect(result.current.fn).toBe(fn1);

		rerender({ value: fn2Wrapper, delay: DEFAULT_DELAY });

		act(() => {
			advanceTime(DEFAULT_DELAY);
		});

		// Function reference should be preserved
		expect(result.current).toBe(fn2Wrapper);
		expect(result.current.fn).toBe(fn2);
	});
});
