import { useDebouncedCallback } from '@core/hooks/debounce/useDebounce';
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

const describeUseDebouncedCallbackSection = (title: string, suite: () => void) => {
	describe(`useDebouncedCallback - ${title}`, () => {
		setupFakeTimerLifecycle();
		suite();
	});
};

describeUseDebouncedCallbackSection('basic debouncing', () => {
	it('should debounce callback execution', () => {
		const callback = vi.fn();
		const { result } = renderHook(() => useDebouncedCallback(callback, DEFAULT_DELAY));

		result.current();
		result.current();
		result.current();

		expect(callback).not.toHaveBeenCalled();

		act(() => {
			advanceTime(DEFAULT_DELAY);
		});

		expect(callback).toHaveBeenCalledTimes(1);
	});

	it('should only execute the last call after delay', () => {
		const callback = vi.fn((value: number) => value) as (value: number) => number;
		const { result } = renderHook(() =>
			useDebouncedCallback(callback as (...args: unknown[]) => unknown, DEFAULT_DELAY)
		);

		result.current(1);
		result.current(2);
		result.current(3);

		act(() => {
			advanceTime(DEFAULT_DELAY);
		});

		expect(callback).toHaveBeenCalledTimes(1);
		expect(callback).toHaveBeenCalledWith(3);
	});
});

describeUseDebouncedCallbackSection('cancel method', () => {
	it('should cancel pending execution', () => {
		const callback = vi.fn();
		const { result } = renderHook(() => useDebouncedCallback(callback, DEFAULT_DELAY));

		result.current();
		result.current.cancel();

		act(() => {
			advanceTime(DEFAULT_DELAY);
		});

		expect(callback).not.toHaveBeenCalled();
	});

	it('should allow new calls after cancel', () => {
		const callback = vi.fn();
		const { result } = renderHook(() => useDebouncedCallback(callback, DEFAULT_DELAY));

		result.current();
		result.current.cancel();
		result.current();

		act(() => {
			advanceTime(DEFAULT_DELAY);
		});

		expect(callback).toHaveBeenCalledTimes(1);
	});
});

describeUseDebouncedCallbackSection('flush method', () => {
	it('should immediately execute pending callback', () => {
		const callback = vi.fn((value: string) => value) as (value: string) => string;
		const { result } = renderHook(() =>
			useDebouncedCallback(callback as (...args: unknown[]) => unknown, DEFAULT_DELAY)
		);

		result.current('test');
		const returnValue = result.current.flush();

		expect(callback).toHaveBeenCalledTimes(1);
		expect(callback).toHaveBeenCalledWith('test');
		expect(returnValue).toBe('test');
	});

	it('should return undefined if no pending call', () => {
		const callback = vi.fn();
		const { result } = renderHook(() => useDebouncedCallback(callback, DEFAULT_DELAY));

		const returnValue = result.current.flush();

		expect(callback).not.toHaveBeenCalled();
		expect(returnValue).toBeUndefined();
	});

	it('should not execute again after flush when delay passes', () => {
		const callback = vi.fn();
		const { result } = renderHook(() => useDebouncedCallback(callback, DEFAULT_DELAY));

		result.current();
		result.current.flush();

		act(() => {
			advanceTime(DEFAULT_DELAY);
		});

		expect(callback).toHaveBeenCalledTimes(1);
	});
});

describeUseDebouncedCallbackSection('callback changes', () => {
	it('should update when callback changes', () => {
		const callback1 = vi.fn();
		const callback2 = vi.fn();
		const { result, rerender } = renderHook(
			({ callback, delay }) => useDebouncedCallback(callback, delay),
			{
				initialProps: { callback: callback1, delay: DEFAULT_DELAY },
			}
		);

		result.current();
		rerender({ callback: callback2, delay: DEFAULT_DELAY });
		result.current();

		act(() => {
			advanceTime(DEFAULT_DELAY);
		});

		expect(callback1).not.toHaveBeenCalled();
		expect(callback2).toHaveBeenCalledTimes(1);
	});
});

describeUseDebouncedCallbackSection('delay changes', () => {
	it('should update when delay changes', () => {
		const callback = vi.fn();
		const { result, rerender } = renderHook(
			({ callback, delay }) => useDebouncedCallback(callback, delay),
			{
				initialProps: { callback, delay: LONG_DELAY },
			}
		);

		result.current();
		rerender({ callback, delay: SHORT_DELAY });
		result.current();

		act(() => {
			advanceTime(SHORT_DELAY);
		});

		expect(callback).toHaveBeenCalledTimes(1);
	});
});

describeUseDebouncedCallbackSection('cleanup', () => {
	it('should cancel pending execution on unmount', () => {
		const callback = vi.fn();
		const { result, unmount } = renderHook(() => useDebouncedCallback(callback, DEFAULT_DELAY));

		result.current();
		unmount();

		act(() => {
			advanceTime(DEFAULT_DELAY);
		});

		expect(callback).not.toHaveBeenCalled();
	});

	it('should handle multiple unmounts gracefully', () => {
		const callback = vi.fn();
		const { unmount } = renderHook(() => useDebouncedCallback(callback, DEFAULT_DELAY));

		unmount();
		expect(() => unmount()).not.toThrow();
	});
});

describeUseDebouncedCallbackSection('edge cases', () => {
	it('should handle callback with multiple arguments', () => {
		const callback = vi.fn((a: number, b: string, c: boolean) => ({ a, b, c })) as (
			a: number,
			b: string,
			c: boolean
		) => { a: number; b: string; c: boolean };
		const { result } = renderHook(() =>
			useDebouncedCallback(callback as (...args: unknown[]) => unknown, DEFAULT_DELAY)
		);

		result.current(1, 'test', true);

		act(() => {
			advanceTime(DEFAULT_DELAY);
		});

		expect(callback).toHaveBeenCalledWith(1, 'test', true);
	});

	it('should handle callback that returns undefined', () => {
		const callback = vi.fn(() => undefined);
		const { result } = renderHook(() => useDebouncedCallback(callback, DEFAULT_DELAY));

		const returnValue = result.current();
		result.current.flush();

		expect(returnValue).toBeUndefined();
		expect(callback).toHaveBeenCalled();
	});

	it('should maintain same debounced function reference when dependencies do not change', () => {
		const callback = vi.fn();
		const { result, rerender } = renderHook(
			({ callback, delay }) => useDebouncedCallback(callback, delay),
			{
				initialProps: { callback, delay: DEFAULT_DELAY },
			}
		);

		const firstRef = result.current;
		rerender({ callback, delay: DEFAULT_DELAY });
		const secondRef = result.current;

		// Should be the same reference when dependencies don't change
		expect(firstRef).toBe(secondRef);
	});
});
