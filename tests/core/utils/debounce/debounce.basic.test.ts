import { describe, expect, it, vi } from 'vitest';

import {
	advanceTime,
	createDebouncedFn,
	DEFAULT_WAIT,
	useDebounceTestTimers,
} from './debounce.test-helpers';

const registerBasicDebouncingSuite = () => {
	describe('basic debouncing', () => {
		it('delays function execution', async () => {
			const fn = vi.fn();
			const debounced = createDebouncedFn(fn);

			debounced();
			expect(fn).not.toHaveBeenCalled();

			advanceTime(50);
			expect(fn).not.toHaveBeenCalled();

			advanceTime(50);
			expect(fn).toHaveBeenCalledTimes(1);
		});

		it('resets delay on subsequent calls', () => {
			const fn = vi.fn();
			const debounced = createDebouncedFn(fn);

			debounced();
			advanceTime(50);
			debounced();
			advanceTime(50);
			expect(fn).not.toHaveBeenCalled();

			advanceTime(50);
			expect(fn).toHaveBeenCalledTimes(1);
		});

		it('handles multiple rapid calls and executes only once', () => {
			const fn = vi.fn();
			const debounced = createDebouncedFn(fn);

			debounced();
			debounced();
			debounced();
			debounced();
			debounced();

			expect(fn).not.toHaveBeenCalled();

			advanceTime(DEFAULT_WAIT);
			expect(fn).toHaveBeenCalledTimes(1);
		});

		it('passes arguments correctly', () => {
			const fn = vi.fn((a: number, b: string) => `${a}-${b}`);
			const debounced = createDebouncedFn(fn);

			debounced(42, 'test');
			advanceTime(DEFAULT_WAIT);

			expect(fn).toHaveBeenCalledWith(42, 'test');
			expect(fn).toHaveBeenCalledTimes(1);
		});

		it('uses the last arguments when called multiple times', () => {
			const fn = vi.fn();
			const debounced = createDebouncedFn(fn);

			debounced(1);
			debounced(2);
			debounced(3);
			advanceTime(DEFAULT_WAIT);

			expect(fn).toHaveBeenCalledWith(3);
			expect(fn).toHaveBeenCalledTimes(1);
		});
	});
};

const registerCancelFunctionalitySuite = () => {
	describe('cancel functionality', () => {
		it('cancels pending execution', () => {
			const fn = vi.fn();
			const debounced = createDebouncedFn(fn);

			debounced();
			debounced.cancel();

			advanceTime(DEFAULT_WAIT);
			expect(fn).not.toHaveBeenCalled();
		});

		it('can cancel after multiple calls', () => {
			const fn = vi.fn();
			const debounced = createDebouncedFn(fn);

			debounced();
			debounced();
			debounced();
			debounced.cancel();

			advanceTime(DEFAULT_WAIT);
			expect(fn).not.toHaveBeenCalled();
		});

		it('clears state when cancelled', () => {
			const fn = vi.fn();
			const debounced = createDebouncedFn(fn);

			debounced('test');
			debounced.cancel();

			debounced('new');
			advanceTime(DEFAULT_WAIT);

			expect(fn).toHaveBeenCalledWith('new');
			expect(fn).toHaveBeenCalledTimes(1);
		});
	});
};

const registerFlushFunctionalitySuite = () => {
	describe('flush functionality', () => {
		it('flushes pending execution immediately', () => {
			const fn = vi.fn();
			const debounced = createDebouncedFn(fn);

			debounced();
			const result = debounced.flush();

			expect(fn).toHaveBeenCalledTimes(1);
			expect(result).toBeUndefined();

			advanceTime(DEFAULT_WAIT);
			expect(fn).toHaveBeenCalledTimes(1);
		});

		it('flushes with correct arguments', () => {
			const fn = vi.fn((x: number) => x * 2);
			const debounced = createDebouncedFn(fn);

			debounced(21);
			const result = debounced.flush();

			expect(fn).toHaveBeenCalledWith(21);
			expect(fn).toHaveBeenCalledTimes(1);
			expect(result).toBe(42);
		});

		it('returns undefined when flushing with no pending execution', () => {
			const fn = vi.fn();
			const debounced = createDebouncedFn(fn);

			const result1 = debounced.flush();
			expect(result1).toBeUndefined();
			expect(fn).not.toHaveBeenCalled();

			debounced();
			advanceTime(DEFAULT_WAIT);
			expect(fn).toHaveBeenCalledTimes(1);

			const result2 = debounced.flush();
			expect(result2).toBeUndefined();
			expect(fn).toHaveBeenCalledTimes(1);
		});

		it('flushes after multiple calls with last arguments', () => {
			const fn = vi.fn();
			const debounced = createDebouncedFn(fn);

			debounced(1);
			debounced(2);
			debounced(3);
			debounced.flush();

			expect(fn).toHaveBeenCalledWith(3);
			expect(fn).toHaveBeenCalledTimes(1);
		});
	});
};

describe('debounce - basic behavior', () => {
	useDebounceTestTimers();

	registerBasicDebouncingSuite();
	registerCancelFunctionalitySuite();
	registerFlushFunctionalitySuite();
});
