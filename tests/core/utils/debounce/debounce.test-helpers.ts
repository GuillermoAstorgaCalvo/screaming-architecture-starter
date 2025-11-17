import { debounce } from '@core/utils/debounce/debounce';
import { afterEach, beforeEach, vi } from 'vitest';

export const DEFAULT_WAIT = 100;
export const MAX_WAIT = 200;

export const createDebouncedFn = (
	fn: any,
	wait = DEFAULT_WAIT,
	options: Parameters<typeof debounce>[2] = {}
) => debounce(fn, wait, options);

export const advanceTime = (ms: number) => {
	vi.advanceTimersByTime(ms);
};

export const useDebounceTestTimers = () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.restoreAllMocks();
		vi.useRealTimers();
	});
};
