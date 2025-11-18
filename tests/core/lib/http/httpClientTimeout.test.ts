import { createTimeoutController } from '@core/lib/http/httpClientTimeout';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('httpClientTimeout - createTimeoutController', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	describe('basic creation', () => {
		it('creates timeout controller with AbortController and timeout ID', () => {
			const result = createTimeoutController(1000);
			expect(result).not.toBeNull();
			expect(result?.controller).toBeInstanceOf(AbortController);
			expect(result?.timeoutId).toBeDefined();
			// In Node.js, setTimeout returns a Timeout object, not a number
			// In browsers, it returns a number. Both can be used with clearTimeout.
			expect(typeof result?.timeoutId === 'number' || typeof result?.timeoutId === 'object').toBe(
				true
			);
		});

		it('returns null when timeout is undefined', () => {
			const result = createTimeoutController();
			expect(result).toBeNull();
		});

		it('returns null when timeout is 0', () => {
			// Note: 0 is falsy in JavaScript, so this will return null
			// This is the current behavior based on the implementation
			const result = createTimeoutController(0);
			expect(result).toBeNull();
		});
	});

	describe('timeout behavior', () => {
		it('aborts controller after timeout duration', () => {
			const result = createTimeoutController(1000);
			expect(result).not.toBeNull();
			expect(result?.controller.signal.aborted).toBe(false);

			vi.advanceTimersByTime(1000);

			expect(result?.controller.signal.aborted).toBe(true);
		});

		it('does not abort controller before timeout', () => {
			const result = createTimeoutController(1000);
			expect(result).not.toBeNull();

			vi.advanceTimersByTime(999);

			expect(result?.controller.signal.aborted).toBe(false);
		});

		it('handles different timeout values', () => {
			const result1 = createTimeoutController(100);
			const result2 = createTimeoutController(5000);
			expect(result1).not.toBeNull();
			expect(result2).not.toBeNull();

			vi.advanceTimersByTime(100);
			expect(result1?.controller.signal.aborted).toBe(true);
			expect(result2?.controller.signal.aborted).toBe(false);

			vi.advanceTimersByTime(4900);
			expect(result2?.controller.signal.aborted).toBe(true);
		});
	});
});

describe('httpClientTimeout - createTimeoutController (multiple instances)', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	describe('multiple controllers', () => {
		it('creates independent controllers for multiple calls', () => {
			const result1 = createTimeoutController(1000);
			const result2 = createTimeoutController(2000);
			expect(result1).not.toBeNull();
			expect(result2).not.toBeNull();
			expect(result1?.controller).not.toBe(result2?.controller);
			expect(result1?.timeoutId).not.toBe(result2?.timeoutId);

			vi.advanceTimersByTime(1000);
			expect(result1?.controller.signal.aborted).toBe(true);
			expect(result2?.controller.signal.aborted).toBe(false);

			vi.advanceTimersByTime(1000);
			expect(result2?.controller.signal.aborted).toBe(true);
		});
	});

	describe('timeout management', () => {
		it('timeout ID can be used to clear timeout', () => {
			const result = createTimeoutController(1000);
			expect(result).not.toBeNull();

			if (result) {
				clearTimeout(result.timeoutId);
			}

			vi.advanceTimersByTime(1000);

			expect(result?.controller.signal.aborted).toBe(false);
		});
	});
});
