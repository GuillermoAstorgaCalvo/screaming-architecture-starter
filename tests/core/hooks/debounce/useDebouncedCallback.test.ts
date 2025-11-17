import { useDebouncedCallback } from '@core/hooks/debounce/useDebounce';
import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const DEFAULT_DELAY = 100;
const SHORT_DELAY = 50;
const LONG_DELAY = 200;

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

const describeUseDebouncedCallback = (title: string, suite: () => void) => {
	describe(`useDebouncedCallback - ${title}`, () => {
		setupFakeTimerLifecycle();
		suite();
	});
};

describeUseDebouncedCallback('callback API', () => {
	it('should return a debounced callback function', () => {
		const callback = vi.fn();
		const { result } = renderHook(() => useDebouncedCallback(callback, DEFAULT_DELAY));

		expect(typeof result.current).toBe('function');
		expect(typeof result.current.cancel).toBe('function');
		expect(typeof result.current.flush).toBe('function');
	});
});

describeUseDebouncedCallback('debounce execution', () => {
	it('should debounce callback execution', () => {
		const callback = vi.fn();
		const { result } = renderHook(() => useDebouncedCallback(callback, DEFAULT_DELAY));

		act(() => {
			result.current();
		});

		expect(callback).not.toHaveBeenCalled();

		act(() => {
			advanceTime(DEFAULT_DELAY);
		});

		expect(callback).toHaveBeenCalledTimes(1);
	});
});

describeUseDebouncedCallback('argument forwarding', () => {
	it('should pass arguments to callback', () => {
		const callback = vi.fn();
		const { result } = renderHook(() => useDebouncedCallback(callback, DEFAULT_DELAY));

		act(() => {
			result.current('arg1', 'arg2');
		});

		act(() => {
			advanceTime(DEFAULT_DELAY);
		});

		expect(callback).toHaveBeenCalledWith('arg1', 'arg2');
	});
});

describeUseDebouncedCallback('last call wins', () => {
	it('should use last arguments when called multiple times', () => {
		const callback = vi.fn();
		const { result } = renderHook(() => useDebouncedCallback(callback, DEFAULT_DELAY));

		act(() => {
			result.current('first');
			result.current('second');
			result.current('third');
		});

		act(() => {
			advanceTime(DEFAULT_DELAY);
		});

		expect(callback).toHaveBeenCalledTimes(1);
		expect(callback).toHaveBeenCalledWith('third');
	});
});

describeUseDebouncedCallback('delay resets', () => {
	it('should reset delay on subsequent calls', () => {
		const callback = vi.fn();
		const { result } = renderHook(() => useDebouncedCallback(callback, DEFAULT_DELAY));

		act(() => {
			result.current();
			advanceTime(50);
			result.current();
			advanceTime(50);
		});

		expect(callback).not.toHaveBeenCalled();

		act(() => {
			advanceTime(DEFAULT_DELAY);
		});

		expect(callback).toHaveBeenCalledTimes(1);
	});
});

describeUseDebouncedCallback('cancel functionality (basic)', () => {
	it('should cancel pending callback execution', () => {
		const callback = vi.fn();
		const { result } = renderHook(() => useDebouncedCallback(callback, DEFAULT_DELAY));

		act(() => {
			result.current();
			result.current.cancel();
		});

		act(() => {
			advanceTime(DEFAULT_DELAY);
		});

		expect(callback).not.toHaveBeenCalled();
	});
});

describeUseDebouncedCallback('cancel functionality (new calls)', () => {
	it('should allow new calls after cancel', () => {
		const callback = vi.fn();
		const { result } = renderHook(() => useDebouncedCallback(callback, DEFAULT_DELAY));

		act(() => {
			result.current('first');
			result.current.cancel();
			result.current('second');
		});

		act(() => {
			advanceTime(DEFAULT_DELAY);
		});

		expect(callback).toHaveBeenCalledWith('second');
		expect(callback).toHaveBeenCalledTimes(1);
	});
});

describeUseDebouncedCallback('flush functionality (immediate execution)', () => {
	it('should flush pending callback execution immediately', () => {
		const callback = vi.fn();
		const { result } = renderHook(() => useDebouncedCallback(callback, DEFAULT_DELAY));

		act(() => {
			result.current('data');
		});

		act(() => {
			result.current.flush();
		});

		expect(callback).toHaveBeenCalledWith('data');
		expect(callback).toHaveBeenCalledTimes(1);

		act(() => {
			advanceTime(DEFAULT_DELAY);
		});

		expect(callback).toHaveBeenCalledTimes(1);
	});
});

describeUseDebouncedCallback('flush functionality (return values)', () => {
	it('should return callback result from flush', () => {
		const callback: (...args: unknown[]) => number = vi.fn((x: unknown) => Number(x) * 2);
		const { result } = renderHook(() => useDebouncedCallback(callback, DEFAULT_DELAY));

		let flushResult: number | undefined;

		act(() => {
			result.current(21);
		});

		act(() => {
			flushResult = result.current.flush();
		});

		expect(flushResult).toBe(42);
	});
});

describeUseDebouncedCallback('cleanup (cancel pending callbacks)', () => {
	it('should cancel pending callbacks on unmount', () => {
		const callback = vi.fn();
		const { result, unmount } = renderHook(() => useDebouncedCallback(callback, DEFAULT_DELAY));

		act(() => {
			result.current();
		});

		unmount();

		act(() => {
			advanceTime(DEFAULT_DELAY);
		});

		expect(callback).not.toHaveBeenCalled();
	});
});

describeUseDebouncedCallback('cleanup (timer management)', () => {
	it('should clean up timers on unmount', () => {
		const callback = vi.fn();
		const { result, unmount } = renderHook(() => useDebouncedCallback(callback, DEFAULT_DELAY));

		act(() => {
			result.current();
		});

		expect(vi.getTimerCount()).toBeGreaterThan(0);

		unmount();

		expect(vi.getTimerCount()).toBe(0);
	});
});

describeUseDebouncedCallback('dependency changes (callback updates)', () => {
	it('should handle callback dependency changes', () => {
		const callback1 = vi.fn();
		const callback2 = vi.fn();

		const { result, rerender } = renderHook(
			({ callback, delay }) => useDebouncedCallback(callback, delay),
			{
				initialProps: { callback: callback1, delay: DEFAULT_DELAY },
			}
		);

		act(() => {
			result.current();
		});

		rerender({ callback: callback2, delay: DEFAULT_DELAY });

		act(() => {
			result.current();
			advanceTime(DEFAULT_DELAY);
		});

		expect(callback1).not.toHaveBeenCalled();
		expect(callback2).toHaveBeenCalledTimes(1);
	});
});

describeUseDebouncedCallback('dependency changes (delay updates)', () => {
	it('should handle delay dependency changes', () => {
		const callbackSpy = vi.fn();
		const { result, rerender } = renderHook(
			({ callback, delay }) => useDebouncedCallback(callback, delay),
			{
				initialProps: { callback: callbackSpy, delay: LONG_DELAY },
			}
		);

		act(() => {
			result.current();
		});

		rerender({ callback: callbackSpy, delay: SHORT_DELAY });

		act(() => {
			result.current();
			advanceTime(SHORT_DELAY);
		});

		expect(callbackSpy).toHaveBeenCalledTimes(1);
	});
});

describeUseDebouncedCallback('edge cases (undefined returns)', () => {
	it('should handle callback that returns undefined', () => {
		const callback = vi.fn(() => undefined);
		const { result } = renderHook(() => useDebouncedCallback(callback, DEFAULT_DELAY));

		let flushResult: unknown;
		const flush = result.current.flush as () => unknown;

		act(() => {
			flushResult = flush();
		});

		expect(flushResult).toBeUndefined();
	});
});

describeUseDebouncedCallback('edge cases (no arguments)', () => {
	it('should handle callback with no arguments', () => {
		const callback = vi.fn(() => 'no args');
		const { result } = renderHook(() => useDebouncedCallback(callback, DEFAULT_DELAY));

		act(() => {
			result.current();
			advanceTime(DEFAULT_DELAY);
		});

		expect(callback).toHaveBeenCalledWith();
	});
});

describeUseDebouncedCallback('edge cases (many arguments)', () => {
	it('should handle callback with many arguments', () => {
		const callback = vi.fn();
		const { result } = renderHook(() => useDebouncedCallback(callback, DEFAULT_DELAY));

		act(() => {
			result.current(1, 2, 3, 4, 5);
			advanceTime(DEFAULT_DELAY);
		});

		expect(callback).toHaveBeenCalledWith(1, 2, 3, 4, 5);
	});
});
