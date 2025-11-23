import { throttle } from '@core/utils/throttle/throttle';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Test constants
const DEFAULT_WAIT = 100;
const CUSTOM_WAIT = 200;
const ERROR_MESSAGE_WAIT = 'wait must be a positive finite number';
const ERROR_MESSAGE_OPTIONS = 'at least one of leading or trailing must be true';

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

// Helper functions to reduce nesting depth
const sumArgs = (...args: number[]) => {
	let sum = 0;
	for (const arg of args) {
		sum += arg;
	}
	return sum;
};

beforeEach(() => {
	vi.useFakeTimers();
});

afterEach(() => {
	vi.restoreAllMocks();
	vi.useRealTimers();
});

describe('basic throttling', () => {
	it('throttles function execution with default options', () => {
		const func = vi.fn((x: number) => x * 2);
		const throttled = createThrottledFn(func as (...args: unknown[]) => unknown);

		throttled(1);
		expect(func).toHaveBeenCalledTimes(1);
		expect(func).toHaveBeenCalledWith(1);

		throttled(2);
		throttled(3);
		expect(func).toHaveBeenCalledTimes(1); // Still only called once

		advanceTime(DEFAULT_WAIT);
		expect(func).toHaveBeenCalledTimes(2); // Trailing edge executed
		expect(func).toHaveBeenLastCalledWith(3);
	});

	it('throttles function execution with custom wait time', () => {
		const func = vi.fn();
		const throttled = createThrottledFn(func, CUSTOM_WAIT);

		throttled();
		expect(func).toHaveBeenCalledTimes(1);

		throttled();
		throttled();
		expect(func).toHaveBeenCalledTimes(1);

		advanceTime(CUSTOM_WAIT);
		expect(func).toHaveBeenCalledTimes(2);
	});

	it('allows execution after wait period expires', () => {
		const func = vi.fn();
		const throttled = createThrottledFn(func);

		throttled();
		expect(func).toHaveBeenCalledTimes(1);

		advanceTime(DEFAULT_WAIT);
		throttled();
		expect(func).toHaveBeenCalledTimes(2);
	});
});

describe('leading edge execution', () => {
	it('executes on leading edge when leading is true', () => {
		const func = vi.fn();
		const throttled = createThrottledFn(func, DEFAULT_WAIT, {
			leading: true,
			trailing: false,
		});

		throttled();
		expect(func).toHaveBeenCalledTimes(1);

		throttled();
		throttled();
		expect(func).toHaveBeenCalledTimes(1);

		advanceTime(DEFAULT_WAIT);
		expect(func).toHaveBeenCalledTimes(1); // No trailing edge
	});

	it('does not execute on leading edge when leading is false', () => {
		const func = vi.fn();
		const throttled = createThrottledFn(func, DEFAULT_WAIT, {
			leading: false,
			trailing: true,
		});

		throttled();
		expect(func).toHaveBeenCalledTimes(0);

		advanceTime(DEFAULT_WAIT);
		expect(func).toHaveBeenCalledTimes(1);
	});

	it('executes immediately on first call with leading edge', () => {
		const func = vi.fn((x: number) => x);
		const throttled = createThrottledFn(func as (...args: unknown[]) => unknown, DEFAULT_WAIT, {
			leading: true,
			trailing: true,
		});

		const result = throttled(42);
		expect(func).toHaveBeenCalledTimes(1);
		expect(func).toHaveBeenCalledWith(42);
		expect(result).toBe(42);
	});
});

describe('trailing edge execution', () => {
	it('executes on trailing edge when trailing is true', () => {
		const func = vi.fn();
		const throttled = createThrottledFn(func, DEFAULT_WAIT, {
			leading: false,
			trailing: true,
		});

		throttled();
		expect(func).toHaveBeenCalledTimes(0);

		advanceTime(DEFAULT_WAIT);
		expect(func).toHaveBeenCalledTimes(1);
	});

	it('does not execute on trailing edge when trailing is false', () => {
		const func = vi.fn();
		const throttled = createThrottledFn(func, DEFAULT_WAIT, {
			leading: true,
			trailing: false,
		});

		throttled();
		expect(func).toHaveBeenCalledTimes(1);

		advanceTime(DEFAULT_WAIT);
		expect(func).toHaveBeenCalledTimes(1); // No trailing edge
	});

	it('executes trailing edge with last arguments', () => {
		const func = vi.fn();
		const throttled = createThrottledFn(func, DEFAULT_WAIT, {
			leading: true,
			trailing: true,
		});

		throttled(1);
		expect(func).toHaveBeenCalledWith(1);

		throttled(2);
		throttled(3);
		expect(func).toHaveBeenCalledTimes(1);

		advanceTime(DEFAULT_WAIT);
		expect(func).toHaveBeenCalledTimes(2);
		expect(func).toHaveBeenLastCalledWith(3);
	});
});

describe('both leading and trailing', () => {
	it('executes on both leading and trailing edges by default', () => {
		const func = vi.fn();
		const throttled = createThrottledFn(func);

		throttled();
		expect(func).toHaveBeenCalledTimes(1); // Leading edge

		throttled();
		throttled();
		expect(func).toHaveBeenCalledTimes(1);

		advanceTime(DEFAULT_WAIT);
		expect(func).toHaveBeenCalledTimes(2); // Trailing edge
	});

	it('handles multiple rapid calls with both edges', () => {
		const func = vi.fn();
		const throttled = createThrottledFn(func, DEFAULT_WAIT, {
			leading: true,
			trailing: true,
		});

		throttled(1); // Leading edge
		expect(func).toHaveBeenCalledTimes(1);

		throttled(2);
		throttled(3);
		throttled(4);
		expect(func).toHaveBeenCalledTimes(1);

		advanceTime(DEFAULT_WAIT);
		expect(func).toHaveBeenCalledTimes(2); // Trailing edge with last args (4)
		expect(func).toHaveBeenLastCalledWith(4);
	});

	it('handles sequence of calls across multiple throttle periods', () => {
		const func = vi.fn();
		const throttled = createThrottledFn(func, DEFAULT_WAIT, {
			leading: true,
			trailing: true,
		});

		throttled(1); // Leading edge
		expect(func).toHaveBeenCalledTimes(1);

		advanceTime(DEFAULT_WAIT);
		expect(func).toHaveBeenCalledTimes(2); // Trailing edge

		// After trailing edge, lastCallTime was updated, so immediate call is throttled
		throttled(2);
		expect(func).toHaveBeenCalledTimes(2); // Throttled (lastCallTime was just updated)

		throttled(3);
		expect(func).toHaveBeenCalledTimes(2); // Still throttled

		advanceTime(DEFAULT_WAIT);
		expect(func).toHaveBeenCalledTimes(3); // Trailing edge with last args (3)
	});
});

describe('cancel functionality', () => {
	it('cancels pending trailing edge execution', () => {
		const func = vi.fn();
		const throttled = createThrottledFn(func, DEFAULT_WAIT, {
			leading: true,
			trailing: true,
		});

		throttled();
		expect(func).toHaveBeenCalledTimes(1);

		throttled();
		throttled.cancel();

		advanceTime(DEFAULT_WAIT);
		expect(func).toHaveBeenCalledTimes(1); // Trailing edge was cancelled
	});

	it('cancels when no execution has occurred', () => {
		const func = vi.fn();
		const throttled = createThrottledFn(func, DEFAULT_WAIT, {
			leading: false,
			trailing: true,
		});

		throttled();
		expect(func).toHaveBeenCalledTimes(0);

		throttled.cancel();

		advanceTime(DEFAULT_WAIT);
		expect(func).toHaveBeenCalledTimes(0);
	});

	it('allows new calls after cancel', () => {
		const func = vi.fn();
		const throttled = createThrottledFn(func);

		throttled();
		expect(func).toHaveBeenCalledTimes(1); // Leading edge

		throttled();
		throttled.cancel();

		// After cancel, lastCallTime is cleared, so next call starts new cycle
		throttled();
		expect(func).toHaveBeenCalledTimes(2); // New leading edge

		advanceTime(DEFAULT_WAIT);
		expect(func).toHaveBeenCalledTimes(3); // New trailing edge
	});

	it('can be called multiple times safely', () => {
		const func = vi.fn();
		const throttled = createThrottledFn(func);

		throttled();
		throttled.cancel();
		throttled.cancel();
		throttled.cancel();

		advanceTime(DEFAULT_WAIT);
		expect(func).toHaveBeenCalledTimes(1); // Only leading edge
	});
});

describe('flush functionality', () => {
	it('immediately executes pending trailing edge', () => {
		const func = vi.fn();
		const throttled = createThrottledFn(func, DEFAULT_WAIT, {
			leading: true,
			trailing: true,
		});

		throttled(1);
		expect(func).toHaveBeenCalledTimes(1);

		throttled(2);
		throttled(3);
		expect(func).toHaveBeenCalledTimes(1);

		const result = throttled.flush();
		expect(func).toHaveBeenCalledTimes(2);
		expect(func).toHaveBeenLastCalledWith(3);
		const [, lastResult] = func.mock.results;
		const expectedResult = lastResult?.value;
		if (expectedResult !== undefined) {
			expect(result).toBe(expectedResult);
		}

		advanceTime(DEFAULT_WAIT);
		expect(func).toHaveBeenCalledTimes(2); // No additional execution
	});

	it('returns undefined when no pending execution', () => {
		const func = vi.fn();
		const throttled = createThrottledFn(func);

		throttled();
		advanceTime(DEFAULT_WAIT);

		const result = throttled.flush();
		expect(result).toBeUndefined();
	});

	it('returns last result when no pending execution but has result', () => {
		const func = vi.fn(() => 'result');
		const throttled = createThrottledFn(func);

		const firstResult = throttled();
		expect(firstResult).toBe('result');

		advanceTime(DEFAULT_WAIT);

		const flushResult = throttled.flush();
		expect(flushResult).toBe('result');
	});

	it('works with trailing-only mode', () => {
		const func = vi.fn((x: number) => x * 2);
		const throttled = createThrottledFn(func as (...args: unknown[]) => unknown, DEFAULT_WAIT, {
			leading: false,
			trailing: true,
		});

		throttled(5);
		expect(func).toHaveBeenCalledTimes(0);

		const result = throttled.flush();
		expect(func).toHaveBeenCalledTimes(1);
		expect(func).toHaveBeenCalledWith(5);
		expect(result).toBe(10);
	});
});

describe('multiple rapid calls', () => {
	it('handles many rapid calls within throttle period', () => {
		const func = vi.fn();
		const throttled = createThrottledFn(func);

		for (let i = 0; i < 10; i++) {
			throttled(i);
		}

		expect(func).toHaveBeenCalledTimes(1); // Only leading edge
		expect(func).toHaveBeenCalledWith(0);

		advanceTime(DEFAULT_WAIT);
		expect(func).toHaveBeenCalledTimes(2); // Trailing edge with last args
		expect(func).toHaveBeenLastCalledWith(9);
	});

	it('handles rapid calls across multiple periods', () => {
		const func = vi.fn();
		const throttled = createThrottledFn(func);

		throttled(1);
		expect(func).toHaveBeenCalledTimes(1);

		advanceTime(DEFAULT_WAIT);
		expect(func).toHaveBeenCalledTimes(2);

		// After trailing edge, lastCallTime was updated, so immediate call is throttled
		throttled(2);
		expect(func).toHaveBeenCalledTimes(2); // Throttled (lastCallTime was just updated)

		throttled(3);
		throttled(4);
		expect(func).toHaveBeenCalledTimes(2); // Still throttled

		advanceTime(DEFAULT_WAIT);
		expect(func).toHaveBeenCalledTimes(3); // Trailing edge with last args (4)
	});

	it('handles calls with different arguments', () => {
		const func = vi.fn((a: number, b: string) => `${a}-${b}`);
		const throttled = createThrottledFn(func as (...args: unknown[]) => unknown);

		throttled(1, 'a');
		expect(func).toHaveBeenCalledWith(1, 'a');

		throttled(2, 'b');
		throttled(3, 'c');
		expect(func).toHaveBeenCalledTimes(1);

		advanceTime(DEFAULT_WAIT);
		expect(func).toHaveBeenCalledTimes(2);
		expect(func).toHaveBeenLastCalledWith(3, 'c');
	});
});

describe('return values', () => {
	it('returns result from leading edge execution', () => {
		const func = vi.fn((x: number) => x * 2);
		const throttled = createThrottledFn(func as (...args: unknown[]) => unknown);

		const result = throttled(21);
		expect(result).toBe(42);
	});

	it('returns last result for throttled calls', () => {
		const func = vi.fn((x: number) => x * 2);
		const throttled = createThrottledFn(func as (...args: unknown[]) => unknown);

		const firstResult = throttled(1);
		expect(firstResult).toBe(2);

		const result = throttled(2);
		expect(result).toBe(2); // Returns last result, not undefined
	});

	it('returns result from trailing edge when using flush', () => {
		const func = vi.fn((x: number) => x * 2);
		const throttled = createThrottledFn(func as (...args: unknown[]) => unknown);

		throttled(1);
		throttled(2);
		const result = throttled.flush();
		expect(result).toBe(4);
	});
});

describe('edge cases', () => {
	it('handles function that returns undefined', () => {
		const func = vi.fn(() => undefined);
		const throttled = createThrottledFn(func as (...args: unknown[]) => unknown);

		const result = throttled();
		expect(func).toHaveBeenCalledTimes(1);
		expect(result).toBeUndefined();
	});

	it('handles function that returns null', () => {
		const func = vi.fn(() => null);
		const throttled = createThrottledFn(func);

		const result = throttled();
		expect(func).toHaveBeenCalledTimes(1);
		expect(result).toBeNull();
	});

	it('handles function with no arguments', () => {
		const func = vi.fn(() => 'no-args');
		const throttled = createThrottledFn(func);

		throttled();
		expect(func).toHaveBeenCalledTimes(1);

		throttled();
		advanceTime(DEFAULT_WAIT);
		expect(func).toHaveBeenCalledTimes(2);
	});

	it('handles function with many arguments', () => {
		const func = vi.fn(sumArgs);
		const throttled = createThrottledFn(func as (...args: unknown[]) => unknown);

		throttled(1, 2, 3, 4, 5);
		expect(func).toHaveBeenCalledWith(1, 2, 3, 4, 5);
	});
});

describe('validation', () => {
	it('throws error for invalid wait (zero)', () => {
		const func = vi.fn();
		expect(() => throttle(func, 0)).toThrow(TypeError);
		expect(() => throttle(func, 0)).toThrow(ERROR_MESSAGE_WAIT);
	});

	it('throws error for invalid wait (negative)', () => {
		const func = vi.fn();
		expect(() => throttle(func, -100)).toThrow(TypeError);
		expect(() => throttle(func, -100)).toThrow(ERROR_MESSAGE_WAIT);
	});

	it('throws error for invalid wait (NaN)', () => {
		const func = vi.fn();
		expect(() => throttle(func, Number.NaN)).toThrow(TypeError);
		expect(() => throttle(func, Number.NaN)).toThrow(ERROR_MESSAGE_WAIT);
	});

	it('throws error for invalid wait (Infinity)', () => {
		const func = vi.fn();
		expect(() => throttle(func, Number.POSITIVE_INFINITY)).toThrow(TypeError);
		expect(() => throttle(func, Number.POSITIVE_INFINITY)).toThrow(ERROR_MESSAGE_WAIT);
	});

	it('throws error when both leading and trailing are false', () => {
		const func = vi.fn();
		const invalidOptions = { leading: false, trailing: false };
		expect(() => throttle(func, DEFAULT_WAIT, invalidOptions)).toThrow(TypeError);
		expect(() => throttle(func, DEFAULT_WAIT, invalidOptions)).toThrow(ERROR_MESSAGE_OPTIONS);
	});

	it('accepts valid wait values', () => {
		const func = vi.fn();
		expect(() => throttle(func, 1)).not.toThrow();
		expect(() => throttle(func, DEFAULT_WAIT)).not.toThrow();
		expect(() => throttle(func, 1000.5)).not.toThrow();
	});
});
