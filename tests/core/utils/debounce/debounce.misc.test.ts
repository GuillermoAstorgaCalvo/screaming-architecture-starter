import { describe, expect, it, vi } from 'vitest';

import {
	advanceTime,
	createDebouncedFn,
	DEFAULT_WAIT,
	MAX_WAIT,
	useDebounceTestTimers,
} from './debounce.test-helpers';

const registerReturnValueSuite = () => {
	describe('return values', () => {
		it('returns undefined when function has not executed yet', () => {
			const fn = vi.fn(() => 'result');
			const debounced = createDebouncedFn(fn);

			const result = debounced();
			expect(result).toBeUndefined();
			expect(fn).not.toHaveBeenCalled();
		});

		it('returns result from leading edge execution', () => {
			const fn = vi.fn((x: number) => x * 2);
			const debounced = createDebouncedFn(fn, DEFAULT_WAIT, { leading: true });

			const result = debounced(21);
			expect(result).toBe(42);
			expect(fn).toHaveBeenCalledTimes(1);
		});

		it('returns previous result when called again before execution', () => {
			const fn = vi.fn((x: number) => x * 2);
			const debounced = createDebouncedFn(fn, DEFAULT_WAIT, { leading: true });

			const result1 = debounced(21);
			expect(result1).toBe(42);

			const result2 = debounced(10);
			expect(result2).toBe(42);
		});
	});
};

const registerValidationSuite = () => {
	describe('validation and error handling', () => {
		it('throws error for invalid wait parameter', () => {
			const fn = vi.fn();
			const invalidWaits = [-1, 0, Number.NaN, Infinity, '100' as unknown as number];

			for (const wait of invalidWaits) {
				expect(() => createDebouncedFn(fn, wait)).toThrow(TypeError);
			}
		});

		it('throws error for invalid maxWait parameter', () => {
			const fn = vi.fn();
			const invalidMaxWaits = [-1, 0, Number.NaN, Infinity];

			for (const maxWait of invalidMaxWaits) {
				expect(() => createDebouncedFn(fn, DEFAULT_WAIT, { maxWait })).toThrow(TypeError);
			}
		});

		it('throws error when maxWait is less than wait', () => {
			const fn = vi.fn();

			expect(() => createDebouncedFn(fn, DEFAULT_WAIT, { maxWait: 50 })).toThrow(TypeError);
		});

		it('throws error when both leading and trailing are false without maxWait', () => {
			const fn = vi.fn();

			expect(() =>
				createDebouncedFn(fn, DEFAULT_WAIT, { leading: false, trailing: false })
			).toThrow(TypeError);
		});

		it('allows both leading and trailing to be false when maxWait is provided', () => {
			const fn = vi.fn();
			const debounced = createDebouncedFn(fn, DEFAULT_WAIT, {
				leading: false,
				trailing: false,
				maxWait: MAX_WAIT,
			});

			debounced();
			advanceTime(MAX_WAIT);

			expect(fn).toHaveBeenCalledTimes(1);
		});
	});
};

const registerCleanupSuite = () => {
	describe('cleanup on unmount', () => {
		it('can be cancelled to prevent execution after component unmount', () => {
			const fn = vi.fn();
			const debounced = createDebouncedFn(fn);

			debounced();
			debounced.cancel();

			advanceTime(DEFAULT_WAIT);
			expect(fn).not.toHaveBeenCalled();
		});

		it('can be flushed before unmount to execute pending calls', () => {
			const fn = vi.fn();
			const debounced = createDebouncedFn(fn);

			debounced('data');
			debounced.flush();

			expect(fn).toHaveBeenCalledWith('data');
			expect(fn).toHaveBeenCalledTimes(1);

			debounced.cancel();
			advanceTime(DEFAULT_WAIT);
			expect(fn).toHaveBeenCalledTimes(1);
		});

		it('handles multiple cancel calls gracefully', () => {
			const fn = vi.fn();
			const debounced = createDebouncedFn(fn);

			debounced();
			debounced.cancel();
			debounced.cancel();
			debounced.cancel();

			advanceTime(DEFAULT_WAIT);
			expect(fn).not.toHaveBeenCalled();
		});
	});
};

const registerEdgeCasesSuite = () => {
	describe('edge cases', () => {
		it('handles function that returns undefined', () => {
			const fn = vi.fn(() => undefined);
			const debounced = createDebouncedFn(fn, DEFAULT_WAIT, { leading: true });

			const result = debounced();
			expect(result).toBeUndefined();
			expect(fn).toHaveBeenCalledTimes(1);
		});

		it('handles function that returns null', () => {
			const fn = vi.fn(() => null);
			const debounced = createDebouncedFn(fn, DEFAULT_WAIT, { leading: true });

			const result = debounced();
			expect(result).toBeNull();
			expect(fn).toHaveBeenCalledTimes(1);
		});

		it('handles function with no arguments', () => {
			const fn = vi.fn(() => 'no args');
			const debounced = createDebouncedFn(fn);

			debounced();
			advanceTime(DEFAULT_WAIT);

			expect(fn).toHaveBeenCalledWith();
			expect(fn).toHaveBeenCalledTimes(1);
		});

		it('handles function with many arguments', () => {
			const sum = (...args: number[]) => {
				let total = 0;
				for (const arg of args) {
					total += arg;
				}
				return total;
			};
			const fn = vi.fn(sum);
			const debounced = createDebouncedFn(fn);

			debounced(1, 2, 3, 4, 5);
			advanceTime(DEFAULT_WAIT);

			expect(fn).toHaveBeenCalledWith(1, 2, 3, 4, 5);
			expect(fn).toHaveBeenCalledTimes(1);
		});

		it('handles async function results correctly', async () => {
			const fn = vi.fn(async (x: number) => x * 2);
			const debounced = createDebouncedFn(fn, DEFAULT_WAIT, { leading: true });

			const result = debounced(21);
			expect(result).toBeInstanceOf(Promise);
			expect(fn).toHaveBeenCalledTimes(1);
			await expect(result).resolves.toBe(42);
		});
	});
};

const registerTypeSafetySuite = () => {
	describe('type safety', () => {
		it('preserves function signature types', () => {
			const fn = (a: string, b: number): string => `${a}-${b}`;
			const debounced = createDebouncedFn(fn as any, DEFAULT_WAIT);

			debounced('test', 42);
			advanceTime(DEFAULT_WAIT);
		});

		it('preserves return type in flush', () => {
			const fn = (x: number): number => x * 2;
			const debounced = createDebouncedFn(fn as any, DEFAULT_WAIT);

			debounced(21);
			const result = debounced.flush();
			expect(typeof result).toBe('number');
		});
	});
};

describe('debounce - misc behavior', () => {
	useDebounceTestTimers();

	registerReturnValueSuite();
	registerValidationSuite();
	registerCleanupSuite();
	registerEdgeCasesSuite();
	registerTypeSafetySuite();
});
