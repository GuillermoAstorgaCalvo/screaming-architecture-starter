import { HTTP_TIMEOUTS, RETRY_TIMEOUTS, UI_TIMEOUTS } from '@core/constants/timeouts';
import { describe, expect, it } from 'vitest';

describe('timeout constants', () => {
	it('locks the HTTP timeout values', () => {
		expect(HTTP_TIMEOUTS).toEqual({
			DEFAULT: 30000,
			SHORT: 5000,
			LONG: 60000,
			EXTENDED: 120000,
		});
	});

	it('locks the UI timeout values', () => {
		expect(UI_TIMEOUTS).toEqual({
			DEBOUNCE_DEFAULT: 300,
			DEBOUNCE_SHORT: 150,
			DEBOUNCE_LONG: 500,
			THROTTLE_DEFAULT: 100,
			THROTTLE_SHORT: 50,
			THROTTLE_LONG: 200,
			LOADING_DELAY: 200,
			TOOLTIP_DELAY: 500,
			TOOLTIP_HIDE_DELAY: 100,
			TOAST_DELAY: 3000,
		});
	});

	it('locks the retry timeout values', () => {
		expect(RETRY_TIMEOUTS).toEqual({
			INITIAL_RETRY_DELAY: 1000,
			MAX_RETRY_DELAY: 10000,
			POLLING_INTERVAL: 5000,
			POLLING_INTERVAL_SHORT: 2000,
			POLLING_INTERVAL_LONG: 30000,
		});
	});
});
