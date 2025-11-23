/**
 * Tests for createThrottledHandler helper function
 */

import { createThrottledHandler } from '@core/ui/affix/helpers/useAffix.helpers';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('useAffix.helpers - createThrottledHandler', () => {
	beforeEach(() => {
		vi.useFakeTimers();
		vi.spyOn(globalThis, 'requestAnimationFrame').mockImplementation(cb => {
			return setTimeout(cb, 16) as unknown as number;
		});
		vi.spyOn(globalThis, 'cancelAnimationFrame').mockImplementation(id => {
			clearTimeout(id);
		});
	});

	afterEach(() => {
		vi.useRealTimers();
		vi.restoreAllMocks();
	});

	describe('immediate execution', () => {
		it('calls handler immediately when delay has passed', () => {
			const handler = vi.fn();
			const throttled = createThrottledHandler(handler, 16);

			throttled();
			vi.advanceTimersByTime(16);

			expect(handler).toHaveBeenCalledTimes(1);
		});

		it('calls handler immediately on first call', () => {
			const handler = vi.fn();
			const throttled = createThrottledHandler(handler, 16);

			throttled();

			expect(handler).toHaveBeenCalledTimes(1);
		});

		it('calls handler immediately when delay has passed between calls', () => {
			const handler = vi.fn();
			const throttled = createThrottledHandler(handler, 16);

			throttled();
			vi.advanceTimersByTime(20); // Past delay
			throttled();

			expect(handler).toHaveBeenCalledTimes(2);
		});
	});
});

describe('useAffix.helpers - createThrottledHandler - throttling behavior', () => {
	beforeEach(() => {
		vi.useFakeTimers();
		vi.spyOn(globalThis, 'requestAnimationFrame').mockImplementation(cb => {
			return setTimeout(cb, 16) as unknown as number;
		});
		vi.spyOn(globalThis, 'cancelAnimationFrame').mockImplementation(id => {
			clearTimeout(id);
		});
	});

	afterEach(() => {
		vi.useRealTimers();
		vi.restoreAllMocks();
	});

	it('schedules handler with requestAnimationFrame when called within delay', () => {
		const handler = vi.fn();
		const throttled = createThrottledHandler(handler, 16);

		throttled(); // First call
		vi.advanceTimersByTime(5);
		throttled(); // Second call within delay

		expect(handler).toHaveBeenCalledTimes(1); // Only first call executed

		vi.advanceTimersByTime(20); // Advance past delay

		expect(handler).toHaveBeenCalledTimes(2); // Second call executed via RAF
	});

	it('cancels previous requestAnimationFrame when called multiple times within delay', () => {
		const handler = vi.fn();
		const throttled = createThrottledHandler(handler, 16);

		throttled(); // First call
		vi.advanceTimersByTime(5);
		throttled(); // Second call
		vi.advanceTimersByTime(5);
		throttled(); // Third call - should cancel second

		expect(handler).toHaveBeenCalledTimes(1);

		vi.advanceTimersByTime(20);

		expect(handler).toHaveBeenCalledTimes(2); // Only third call executed
	});

	it('handles multiple rapid calls correctly', () => {
		const handler = vi.fn();
		const throttled = createThrottledHandler(handler, 16);

		throttled();
		vi.advanceTimersByTime(1);
		throttled();
		vi.advanceTimersByTime(1);
		throttled();
		vi.advanceTimersByTime(1);
		throttled();

		expect(handler).toHaveBeenCalledTimes(1);

		vi.advanceTimersByTime(20);

		expect(handler).toHaveBeenCalledTimes(2); // Last call executed
	});
});

describe('useAffix.helpers - createThrottledHandler - delay configuration', () => {
	beforeEach(() => {
		vi.useFakeTimers();
		vi.spyOn(globalThis, 'requestAnimationFrame').mockImplementation(cb => {
			return setTimeout(cb, 16) as unknown as number;
		});
		vi.spyOn(globalThis, 'cancelAnimationFrame').mockImplementation(id => {
			clearTimeout(id);
		});
	});

	afterEach(() => {
		vi.useRealTimers();
		vi.restoreAllMocks();
	});

	it('works with custom delay values', () => {
		const handler = vi.fn();
		const throttled = createThrottledHandler(handler, 100);

		throttled();
		vi.advanceTimersByTime(50);
		throttled();

		expect(handler).toHaveBeenCalledTimes(1);

		vi.advanceTimersByTime(60);

		expect(handler).toHaveBeenCalledTimes(2);
	});

	it('handles zero delay', () => {
		const handler = vi.fn();
		const throttled = createThrottledHandler(handler, 0);

		throttled();
		throttled();

		expect(handler).toHaveBeenCalledTimes(2);
	});
});
