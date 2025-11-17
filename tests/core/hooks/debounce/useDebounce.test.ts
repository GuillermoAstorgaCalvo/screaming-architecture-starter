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
