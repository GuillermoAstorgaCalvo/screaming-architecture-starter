import { describe, expect, it, vi } from 'vitest';

import {
	advanceTime,
	createDebouncedFn,
	DEFAULT_WAIT,
	MAX_WAIT,
	useDebounceTestTimers,
} from './debounce.test-helpers';

const registerLeadingEdgeSuite = () => {
	describe('leading edge option', () => {
		it('executes immediately on first call when leading is true', () => {
			const fn = vi.fn();
			const debounced = createDebouncedFn(fn, DEFAULT_WAIT, {
				leading: true,
				trailing: false,
			});

			debounced();
			expect(fn).toHaveBeenCalledTimes(1);

			advanceTime(DEFAULT_WAIT);
			expect(fn).toHaveBeenCalledTimes(1);
		});

		it('does not execute on leading edge when leading is false', () => {
			const fn = vi.fn();
			const debounced = createDebouncedFn(fn, DEFAULT_WAIT, {
				leading: false,
				trailing: true,
			});

			debounced();
			expect(fn).not.toHaveBeenCalled();

			advanceTime(DEFAULT_WAIT);
			expect(fn).toHaveBeenCalledTimes(1);
		});

		it('executes on leading edge for subsequent calls after maxWait', () => {
			const fn = vi.fn();
			const debounced = createDebouncedFn(fn, DEFAULT_WAIT, {
				leading: true,
				trailing: false,
				maxWait: MAX_WAIT,
			});

			debounced();
			expect(fn).toHaveBeenCalledTimes(1);

			advanceTime(MAX_WAIT);
			expect(fn).toHaveBeenCalledTimes(2);

			debounced();
			expect(fn).toHaveBeenCalledTimes(3);

			advanceTime(DEFAULT_WAIT);
			expect(fn).toHaveBeenCalledTimes(3);
		});

		it('uses leading edge arguments', () => {
			const fn = vi.fn();
			const debounced = createDebouncedFn(fn, DEFAULT_WAIT, { leading: true });

			debounced('first');
			expect(fn).toHaveBeenCalledWith('first');

			debounced('second');
			advanceTime(DEFAULT_WAIT);
			expect(fn).toHaveBeenCalledWith('second');
		});
	});
};

const registerTrailingEdgeSuite = () => {
	describe('trailing edge option', () => {
		it('executes on trailing edge by default', () => {
			const fn = vi.fn();
			const debounced = createDebouncedFn(fn);

			debounced();
			expect(fn).not.toHaveBeenCalled();

			advanceTime(DEFAULT_WAIT);
			expect(fn).toHaveBeenCalledTimes(1);
		});

		it('does not execute on trailing edge when trailing is false', () => {
			const fn = vi.fn();
			const debounced = createDebouncedFn(fn, DEFAULT_WAIT, {
				leading: true,
				trailing: false,
			});

			debounced();
			expect(fn).toHaveBeenCalledTimes(1);

			advanceTime(DEFAULT_WAIT);
			expect(fn).toHaveBeenCalledTimes(1);
		});

		it('executes on trailing edge with last arguments', () => {
			const fn = vi.fn();
			const debounced = createDebouncedFn(fn, DEFAULT_WAIT, { trailing: true });

			debounced(1);
			debounced(2);
			debounced(3);

			advanceTime(DEFAULT_WAIT);
			expect(fn).toHaveBeenCalledWith(3);
			expect(fn).toHaveBeenCalledTimes(1);
		});
	});
};

const registerCombinedEdgeSuite = () => {
	const bothEdgesOptions = { leading: true, trailing: true };

	describe('leading and trailing edge combinations', () => {
		it('executes on both leading and trailing edges', () => {
			const fn = vi.fn();
			const debounced = createDebouncedFn(fn, DEFAULT_WAIT, bothEdgesOptions);

			debounced();
			expect(fn).toHaveBeenCalledTimes(1);

			advanceTime(DEFAULT_WAIT);
			expect(fn).toHaveBeenCalledTimes(2);
		});

		it('executes on both edges when arguments change', () => {
			const fn = vi.fn();
			const debounced = createDebouncedFn(fn, DEFAULT_WAIT, bothEdgesOptions);

			debounced('test');
			expect(fn).toHaveBeenCalledWith('test');

			advanceTime(DEFAULT_WAIT);
			expect(fn).toHaveBeenCalledWith('test');
			expect(fn).toHaveBeenCalledTimes(2);
		});

		it('executes on both edges when called multiple times', () => {
			const fn = vi.fn();
			const debounced = createDebouncedFn(fn, DEFAULT_WAIT, bothEdgesOptions);

			debounced(1);
			expect(fn).toHaveBeenCalledTimes(1);

			advanceTime(50);
			debounced(2);
			expect(fn).toHaveBeenCalledTimes(1);

			advanceTime(DEFAULT_WAIT);
			expect(fn).toHaveBeenCalledWith(2);
			expect(fn).toHaveBeenCalledTimes(2);
		});
	});
};

const registerMaxWaitSuite = () => {
	describe('maxWait option', () => {
		it('forces execution after maxWait time', () => {
			const fn = vi.fn();
			const debounced = createDebouncedFn(fn, DEFAULT_WAIT, { maxWait: MAX_WAIT });

			debounced();
			advanceTime(50);
			debounced();
			advanceTime(50);
			debounced();
			advanceTime(50);
			debounced();
			advanceTime(50);

			expect(fn).toHaveBeenCalledTimes(1);
		});

		it('resets maxWait timer on new invocation after maxWait', () => {
			const fn = vi.fn();
			const debounced = createDebouncedFn(fn, DEFAULT_WAIT, { maxWait: MAX_WAIT });

			debounced();
			advanceTime(MAX_WAIT);
			expect(fn).toHaveBeenCalledTimes(1);

			debounced();
			advanceTime(MAX_WAIT);
			expect(fn).toHaveBeenCalledTimes(2);
		});

		it('uses last arguments when maxWait triggers', () => {
			const fn = vi.fn();
			const debounced = createDebouncedFn(fn, DEFAULT_WAIT, { maxWait: MAX_WAIT });

			debounced(1);
			advanceTime(50);
			debounced(2);
			advanceTime(50);
			debounced(3);
			advanceTime(DEFAULT_WAIT);

			expect(fn).toHaveBeenCalledWith(3);
			expect(fn).toHaveBeenCalledTimes(1);
		});

		it('works with leading edge and maxWait', () => {
			const fn = vi.fn();
			const debounced = createDebouncedFn(fn, DEFAULT_WAIT, {
				leading: true,
				maxWait: MAX_WAIT,
			});

			debounced(1);
			expect(fn).toHaveBeenCalledWith(1);
			expect(fn).toHaveBeenCalledTimes(1);

			advanceTime(50);
			debounced(2);
			advanceTime(50);
			debounced(3);
			advanceTime(DEFAULT_WAIT);

			expect(fn).toHaveBeenCalledWith(3);
			expect(fn).toHaveBeenCalledTimes(2);
		});
	});
};

describe('debounce - edge options', () => {
	useDebounceTestTimers();

	registerLeadingEdgeSuite();
	registerTrailingEdgeSuite();
	registerCombinedEdgeSuite();
	registerMaxWaitSuite();
});
