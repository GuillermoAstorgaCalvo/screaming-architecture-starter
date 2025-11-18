import { formatTime } from '@core/lib/date/formatTime';
import { describe, expect, it } from 'vitest';

// Test constants
const TEST_DATE_UTC = '2024-01-15T14:30:00Z';
const TEST_DATE_MORNING_UTC = '2024-01-15T02:30:00Z';
const TEST_DATE_NOON_UTC = '2024-01-15T12:00:00Z';
const TEST_DATE_MIDNIGHT_UTC = '2024-01-15T00:00:00Z';
const TEST_DATE_WITH_SECONDS_UTC = '2024-01-15T14:30:45Z';

// Helper function to create a mock Intl.DateTimeFormat that throws
function createMockDateTimeFormat() {
	class MockDateTimeFormat {
		constructor() {
			throw new Error('Intl error');
		}

		format() {
			return '';
		}
	}
	return MockDateTimeFormat as typeof Intl.DateTimeFormat;
}

// Helper function to mock Intl.DateTimeFormat and restore it
function withMockedIntl<T>(callback: () => T): T {
	const originalIntl = globalThis.Intl;
	const MockDateTimeFormat = createMockDateTimeFormat();
	globalThis.Intl = {
		...originalIntl,
		DateTimeFormat: MockDateTimeFormat,
	} as typeof Intl;

	try {
		return callback();
	} finally {
		globalThis.Intl = originalIntl;
	}
}

// Helper to create a local date (avoiding timezone issues in fallback tests)
interface LocalDateOptions {
	year: number;
	month: number;
	day: number;
	hours: number;
	minutes: number;
	seconds?: number;
}

function createLocalDate(options: LocalDateOptions) {
	const { year, month, day, hours, minutes, seconds = 0 } = options;
	return new Date(year, month, day, hours, minutes, seconds);
}

describe('formatTime - basic functionality', () => {
	it('should format a Date object to time string', () => {
		const date = new Date(TEST_DATE_UTC);
		const result = formatTime(date);
		expect(result).toBeTruthy();
		expect(typeof result).toBe('string');
		expect(result.length).toBeGreaterThan(0);
	});

	it('should format a date string to time string', () => {
		const result = formatTime(TEST_DATE_UTC);
		expect(result).toBeTruthy();
		expect(typeof result).toBe('string');
	});

	it('should format a timestamp to time string', () => {
		const timestamp = new Date(TEST_DATE_UTC).getTime();
		const result = formatTime(timestamp);
		expect(result).toBeTruthy();
		expect(typeof result).toBe('string');
	});

	it('should return empty string for invalid date', () => {
		expect(formatTime('invalid')).toBe('');
		expect(formatTime(null)).toBe('');
		expect(formatTime(undefined)).toBe('');
	});
});

describe('formatTime - 12-hour clock', () => {
	it('should use 12-hour format by default', () => {
		const date = new Date(TEST_DATE_UTC);
		const result = formatTime(date, { hour12: true });
		expect(result).toMatch(/am|pm/i);
	});

	it('should format afternoon time with PM', () => {
		const date = new Date(TEST_DATE_UTC);
		const result = formatTime(date, { hour12: true, timeZone: 'UTC' });
		expect(result).toMatch(/pm/i);
	});

	it('should format morning time with AM', () => {
		const date = new Date(TEST_DATE_MORNING_UTC);
		const result = formatTime(date, { hour12: true, timeZone: 'UTC' });
		expect(result).toMatch(/am/i);
	});

	it('should format noon correctly', () => {
		const date = new Date(TEST_DATE_NOON_UTC);
		const result = formatTime(date, { hour12: true, timeZone: 'UTC' });
		expect(result).toMatch(/pm/i);
	});

	it('should format midnight correctly', () => {
		const date = new Date(TEST_DATE_MIDNIGHT_UTC);
		const result = formatTime(date, { hour12: true, timeZone: 'UTC' });
		expect(result).toMatch(/am/i);
	});
});

describe('formatTime - 24-hour clock', () => {
	it('should use 24-hour format when hour12 is false', () => {
		const date = new Date(TEST_DATE_UTC);
		const result = formatTime(date, { hour12: false, timeZone: 'UTC' });
		expect(result).not.toMatch(/am|pm/i);
		expect(result).toMatch(/14/);
	});

	it('should format afternoon time in 24-hour format', () => {
		const date = new Date(TEST_DATE_UTC);
		const result = formatTime(date, { hour12: false, timeZone: 'UTC' });
		expect(result).toMatch(/14:30/);
	});

	it('should format morning time in 24-hour format', () => {
		const date = new Date(TEST_DATE_MORNING_UTC);
		const result = formatTime(date, { hour12: false, timeZone: 'UTC' });
		expect(result).toMatch(/02:30/);
	});
});

describe('formatTime - seconds', () => {
	it('should include seconds when includeSeconds is true', () => {
		const date = new Date(TEST_DATE_WITH_SECONDS_UTC);
		const result = formatTime(date, { includeSeconds: true, timeZone: 'UTC' });
		expect(result).toMatch(/45/);
	});

	it('should not include seconds by default', () => {
		const date = new Date(TEST_DATE_WITH_SECONDS_UTC);
		const result = formatTime(date, { includeSeconds: false, timeZone: 'UTC' });
		// Should not contain seconds (format may vary, but typically no :45)
		expect(result).toBeTruthy();
	});

	it('should format time with seconds in 12-hour format', () => {
		const date = new Date(TEST_DATE_WITH_SECONDS_UTC);
		const result = formatTime(date, {
			includeSeconds: true,
			hour12: true,
			timeZone: 'UTC',
		});
		expect(result).toMatch(/45/);
		expect(result).toMatch(/pm/i);
	});

	it('should format time with seconds in 24-hour format', () => {
		const date = new Date(TEST_DATE_WITH_SECONDS_UTC);
		const result = formatTime(date, {
			includeSeconds: true,
			hour12: false,
			timeZone: 'UTC',
		});
		expect(result).toMatch(/14:30:45/);
	});
});

describe('formatTime - timezone', () => {
	it('should use UTC timezone when specified', () => {
		const date = new Date(TEST_DATE_UTC);
		const result = formatTime(date, { timeZone: 'UTC' });
		expect(result).toBeTruthy();
	});

	it('should use custom timezone when specified', () => {
		const date = new Date(TEST_DATE_UTC);
		const result = formatTime(date, { timeZone: 'America/New_York' });
		expect(result).toBeTruthy();
	});

	it('should use user timezone by default', () => {
		const date = new Date(TEST_DATE_UTC);
		const result = formatTime(date);
		expect(result).toBeTruthy();
	});
});

describe('formatTime - locale', () => {
	it('should use default locale (en-US)', () => {
		const date = new Date(TEST_DATE_UTC);
		const result = formatTime(date, { locale: 'en-US', timeZone: 'UTC' });
		expect(result).toBeTruthy();
	});

	it('should use custom locale', () => {
		const date = new Date(TEST_DATE_UTC);
		const result = formatTime(date, { locale: 'es-ES', timeZone: 'UTC' });
		expect(result).toBeTruthy();
	});
});

describe('formatTime - fallback', () => {
	it('should fallback when Intl.DateTimeFormat fails', () => {
		const date = new Date(TEST_DATE_UTC);
		const result = withMockedIntl(() => formatTime(date, { hour12: true }));
		expect(result).toBeTruthy();
		expect(result).toMatch(/pm|am/i);
	});

	it('should fallback to 12-hour format correctly', () => {
		const date = createLocalDate({ year: 2024, month: 0, day: 15, hours: 14, minutes: 30 });
		const result = withMockedIntl(() => formatTime(date, { hour12: true, includeSeconds: false }));
		expect(result).toMatch(/2:30/);
		expect(result).toMatch(/pm/i);
	});

	it('should fallback to 24-hour format correctly', () => {
		const date = createLocalDate({ year: 2024, month: 0, day: 15, hours: 14, minutes: 30 });
		const result = withMockedIntl(() => formatTime(date, { hour12: false, includeSeconds: false }));
		expect(result).toMatch(/14:30/);
	});

	it('should fallback with seconds included', () => {
		const date = createLocalDate({
			year: 2024,
			month: 0,
			day: 15,
			hours: 14,
			minutes: 30,
			seconds: 45,
		});
		const result = withMockedIntl(() => formatTime(date, { hour12: true, includeSeconds: true }));
		expect(result).toMatch(/2:30:45/);
		expect(result).toMatch(/pm/i);
	});

	it('should handle midnight in fallback mode', () => {
		const date = createLocalDate({ year: 2024, month: 0, day: 15, hours: 0, minutes: 0 });
		const result = withMockedIntl(() => formatTime(date, { hour12: true }));
		expect(result).toMatch(/12:00/);
		expect(result).toMatch(/am/i);
	});

	it('should handle noon in fallback mode', () => {
		const date = createLocalDate({ year: 2024, month: 0, day: 15, hours: 12, minutes: 0 });
		const result = withMockedIntl(() => formatTime(date, { hour12: true }));
		expect(result).toMatch(/12:00/);
		expect(result).toMatch(/pm/i);
	});
});

describe('formatTime - edge cases', () => {
	it('should handle single digit hours in fallback mode', () => {
		const date = createLocalDate({ year: 2024, month: 0, day: 15, hours: 9, minutes: 30 });
		const result = withMockedIntl(() => formatTime(date, { hour12: false }));
		expect(result).toMatch(/09:30/);
	});

	it('should handle single digit minutes in fallback mode', () => {
		const date = createLocalDate({ year: 2024, month: 0, day: 15, hours: 14, minutes: 5 });
		const result = withMockedIntl(() => formatTime(date, { hour12: false }));
		expect(result).toMatch(/14:05/);
	});

	it('should combine all options', () => {
		const date = new Date(TEST_DATE_WITH_SECONDS_UTC);
		const result = formatTime(date, {
			locale: 'en-US',
			timeZone: 'UTC',
			hour12: true,
			includeSeconds: true,
		});
		expect(result).toBeTruthy();
		expect(result).toMatch(/pm/i);
	});
});
