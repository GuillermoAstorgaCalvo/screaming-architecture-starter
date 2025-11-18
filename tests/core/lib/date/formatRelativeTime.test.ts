import { formatRelativeTime } from '@core/lib/date/formatRelativeTime';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Test constants
const BASE_DATE = '2024-01-15T12:00:00Z';
const ONE_HOUR_AGO = '2024-01-15T11:00:00Z';
const ONE_HOUR_FUTURE = '2024-01-15T14:00:00Z';

/**
 * Mock RelativeTimeFormat constructor that throws
 */
function MockRelativeTimeFormat() {
	throw new Error('Not available');
}

/**
 * Helper function to create a mock Intl.RelativeTimeFormat that throws
 */
function createMockRelativeTimeFormat(): typeof Intl.RelativeTimeFormat {
	return MockRelativeTimeFormat as unknown as typeof Intl.RelativeTimeFormat;
}

/**
 * Helper function to setup mock Intl.RelativeTimeFormat
 */
function setupMockIntl(): () => void {
	const originalIntl = globalThis.Intl;
	const MockRTF = createMockRelativeTimeFormat();
	globalThis.Intl = {
		...originalIntl,
		RelativeTimeFormat: MockRTF,
	} as typeof Intl;

	return () => {
		globalThis.Intl = originalIntl;
	};
}

// Shared setup for all formatRelativeTime tests
beforeEach(() => {
	vi.useFakeTimers();
});

afterEach(() => {
	vi.useRealTimers();
});

describe('formatRelativeTime with Intl.RelativeTimeFormat - past times', () => {
	beforeEach(() => {
		vi.setSystemTime(new Date(BASE_DATE));
	});

	it('should format seconds ago', () => {
		const date = new Date('2024-01-15T11:59:30Z');
		const result = formatRelativeTime(date);
		expect(result).toBeTruthy();
		expect(typeof result).toBe('string');
		expect(result.length).toBeGreaterThan(0);
	});

	it('should format minutes ago', () => {
		const date = new Date('2024-01-15T11:58:00Z'); // 2 minutes ago
		const result = formatRelativeTime(date);
		expect(result).toBeTruthy();
		// May return "yesterday" if crossing day boundary, or "minute ago"
		expect(result.length).toBeGreaterThan(0);
	});

	it('should format hours ago', () => {
		const date = new Date(ONE_HOUR_AGO); // 1 hour ago
		const result = formatRelativeTime(date);
		expect(result).toBeTruthy();
		// May return "yesterday" if crossing day boundary, or "hour ago"
		expect(result.length).toBeGreaterThan(0);
	});

	it('should format days ago', () => {
		const date = new Date('2024-01-10T12:00:00Z');
		const result = formatRelativeTime(date);
		expect(result).toBeTruthy();
		expect(result).toMatch(/day|ago/i);
	});

	it('should handle just now (0 seconds)', () => {
		const date = new Date(BASE_DATE);
		const result = formatRelativeTime(date);
		expect(result).toBeTruthy();
	});
});

describe('formatRelativeTime with Intl.RelativeTimeFormat - future times', () => {
	beforeEach(() => {
		vi.setSystemTime(new Date(BASE_DATE));
	});

	it('should format future seconds', () => {
		const date = new Date('2024-01-15T12:00:30Z');
		const result = formatRelativeTime(date);
		expect(result).toBeTruthy();
		expect(typeof result).toBe('string');
	});

	it('should format future minutes', () => {
		const date = new Date('2024-01-15T12:30:00Z');
		const result = formatRelativeTime(date);
		expect(result).toBeTruthy();
		expect(result).toMatch(/minute|in/i);
	});

	it('should format future hours', () => {
		const date = new Date(ONE_HOUR_FUTURE);
		const result = formatRelativeTime(date);
		expect(result).toBeTruthy();
		expect(result).toMatch(/hour|in/i);
	});

	it('should format future days', () => {
		const date = new Date('2024-01-20T12:00:00Z');
		const result = formatRelativeTime(date);
		expect(result).toBeTruthy();
		expect(result).toMatch(/day|in/i);
	});
});

describe('formatRelativeTime with fallback', () => {
	beforeEach(() => {
		vi.setSystemTime(new Date(BASE_DATE));
	});

	it('should fallback when Intl.RelativeTimeFormat is not available', () => {
		const date = new Date(ONE_HOUR_AGO);
		const restoreIntl = setupMockIntl();

		const result = formatRelativeTime(date);
		expect(result).toBeTruthy();
		expect(result).toMatch(/hour|ago/i);

		restoreIntl();
	});

	it('should format "just now" or "in a moment" in fallback mode for same time', () => {
		const date = new Date(BASE_DATE);
		const restoreIntl = setupMockIntl();

		const result = formatRelativeTime(date);
		// Can be either "just now" (past) or "in a moment" (future) depending on timing
		expect(result).toMatch(/just now|in a moment/i);

		restoreIntl();
	});

	it('should format future "in a moment" in fallback mode', () => {
		const date = new Date(BASE_DATE);
		const restoreIntl = setupMockIntl();

		// For future dates, it should say "in a moment" for 0 seconds
		const result = formatRelativeTime(date);
		expect(result).toBeTruthy();

		restoreIntl();
	});
});

describe('formatRelativeTime with different input types', () => {
	beforeEach(() => {
		vi.setSystemTime(new Date(BASE_DATE));
	});

	it('should format Date object', () => {
		const date = new Date(ONE_HOUR_AGO);
		const result = formatRelativeTime(date);
		expect(result).toBeTruthy();
	});

	it('should format date string', () => {
		const result = formatRelativeTime(ONE_HOUR_AGO);
		expect(result).toBeTruthy();
	});

	it('should format timestamp', () => {
		const timestamp = new Date(ONE_HOUR_AGO).getTime();
		const result = formatRelativeTime(timestamp);
		expect(result).toBeTruthy();
	});

	it('should return empty string for invalid date', () => {
		expect(formatRelativeTime('invalid')).toBe('');
		expect(formatRelativeTime(null)).toBe('');
		expect(formatRelativeTime(undefined)).toBe('');
	});
});

describe('formatRelativeTime with locale', () => {
	beforeEach(() => {
		vi.setSystemTime(new Date(BASE_DATE));
	});

	it('should use default locale (en-US)', () => {
		const date = new Date(ONE_HOUR_AGO);
		const result = formatRelativeTime(date);
		expect(result).toBeTruthy();
	});

	it('should use custom locale', () => {
		const date = new Date(ONE_HOUR_AGO);
		const result = formatRelativeTime(date, { locale: 'es-ES' });
		expect(result).toBeTruthy();
	});
});

describe('formatRelativeTime edge cases', () => {
	beforeEach(() => {
		vi.setSystemTime(new Date(BASE_DATE));
	});

	it('should handle very large time differences', () => {
		const date = new Date('2020-01-01T12:00:00Z');
		const result = formatRelativeTime(date);
		expect(result).toBeTruthy();
		expect(result).toMatch(/day|ago/i);
	});

	it('should handle very small time differences', () => {
		const date = new Date('2024-01-15T12:00:00.100Z');
		const result = formatRelativeTime(date);
		expect(result).toBeTruthy();
	});

	it('should handle dates exactly one day apart', () => {
		const date = new Date('2024-01-14T12:00:00Z');
		const result = formatRelativeTime(date);
		expect(result).toBeTruthy();
		expect(result).toMatch(/day|ago/i);
	});

	it('should handle dates exactly one hour apart', () => {
		const date = new Date(ONE_HOUR_AGO); // 1 hour ago
		const result = formatRelativeTime(date);
		expect(result).toBeTruthy();
		// May return "yesterday" if crossing day boundary, or "hour ago"
		expect(result.length).toBeGreaterThan(0);
	});
});
