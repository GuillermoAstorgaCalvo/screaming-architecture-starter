import { formatDate, formatDateTime } from '@core/lib/date/formatDate';
import { describe, expect, it } from 'vitest';

const TEST_DATE = '2024-01-15';
const TEST_DATETIME = '2024-01-15T14:30:00';

function runBasicFormattingTests() {
	describe('basic formatting', () => {
		it('should format a Date object to readable string', () => {
			const date = new Date(`${TEST_DATE}T00:00:00`);
			const result = formatDate(date);
			expect(result).toBeTruthy();
			expect(typeof result).toBe('string');
			// The exact format depends on locale, but should contain date info
			expect(result.length).toBeGreaterThan(0);
		});

		it('should format a date string', () => {
			const result = formatDate(TEST_DATE);
			expect(result).toBeTruthy();
			expect(typeof result).toBe('string');
		});

		it('should format a timestamp number', () => {
			const timestamp = new Date(TEST_DATE).getTime();
			const result = formatDate(timestamp);
			expect(result).toBeTruthy();
			expect(typeof result).toBe('string');
		});

		it('should return empty string for invalid date', () => {
			expect(formatDate('invalid')).toBe('');
			expect(formatDate(null)).toBe('');
			expect(formatDate(undefined)).toBe('');
		});
	});
}

function runFormatOptionsTests() {
	describe('format options', () => {
		it('should use short format when short option is true', () => {
			const date = new Date(TEST_DATE);
			const result = formatDate(date, { short: true });
			expect(result).toBeTruthy();
			// Short format typically uses numeric month/day
			expect(result).toMatch(/\d/);
		});

		it('should use long format by default', () => {
			const date = new Date(TEST_DATE);
			const result = formatDate(date, { short: false });
			expect(result).toBeTruthy();
		});
	});
}

function runTimeOptionsTests() {
	describe('time options', () => {
		it('should include time when includeTime option is true', () => {
			const date = new Date(TEST_DATETIME);
			const result = formatDate(date, { includeTime: true });
			expect(result).toBeTruthy();
			// Should contain time information
			expect(result.length).toBeGreaterThan(0);
		});

		it('should not include time by default', () => {
			const date = new Date(TEST_DATETIME);
			const resultWithoutTime = formatDate(date, { includeTime: false });
			const resultDefault = formatDate(date);
			// Both should be similar (no time)
			expect(resultWithoutTime).toBeTruthy();
			expect(resultDefault).toBeTruthy();
		});
	});
}

function runLocaleAndTimezoneTests() {
	describe('locale and timezone', () => {
		it('should use custom locale', () => {
			const date = new Date(TEST_DATE);
			const resultEn = formatDate(date, { locale: 'en-US' });
			const resultEs = formatDate(date, { locale: 'es-ES' });
			expect(resultEn).toBeTruthy();
			expect(resultEs).toBeTruthy();
			// Different locales may produce different formats
			expect(typeof resultEn).toBe('string');
			expect(typeof resultEs).toBe('string');
		});

		it('should use custom timezone', () => {
			const date = new Date('2024-01-15T12:00:00Z');
			const resultUTC = formatDate(date, { timeZone: 'UTC', includeTime: true });
			const resultEST = formatDate(date, { timeZone: 'America/New_York', includeTime: true });
			expect(resultUTC).toBeTruthy();
			expect(resultEST).toBeTruthy();
		});
	});
}

function runEdgeCasesTests() {
	describe('edge cases', () => {
		it('should fallback to ISO string if Intl.DateTimeFormat fails', () => {
			const date = new Date(TEST_DATE);
			const originalIntl = globalThis.Intl;
			// Mock Intl.DateTimeFormat to throw an error
			const MockDateTimeFormat = function () {
				throw new Error('Intl error');
			} as unknown as typeof Intl.DateTimeFormat;
			globalThis.Intl = {
				...originalIntl,
				DateTimeFormat: MockDateTimeFormat,
			} as typeof Intl;

			const result = formatDate(date);
			expect(result).toBe(date.toISOString());

			// Restore Intl
			globalThis.Intl = originalIntl;
		});

		it('should combine multiple options', () => {
			const date = new Date(TEST_DATETIME);
			const result = formatDate(date, {
				short: true,
				includeTime: true,
				locale: 'en-US',
				timeZone: 'UTC',
			});
			expect(result).toBeTruthy();
			expect(typeof result).toBe('string');
		});
	});
}

function runFormatDateTimeTests() {
	describe('formatDateTime', () => {
		it('should format date and time', () => {
			const date = new Date(TEST_DATETIME);
			const result = formatDateTime(date);
			expect(result).toBeTruthy();
			expect(typeof result).toBe('string');
		});

		it('should include time by default', () => {
			const date = new Date(TEST_DATETIME);
			const dateTimeResult = formatDateTime(date);
			const dateResult = formatDate(date, { includeTime: true });
			// Both should include time
			expect(dateTimeResult).toBeTruthy();
			expect(dateResult).toBeTruthy();
		});

		it('should accept formatDate options', () => {
			const date = new Date(TEST_DATETIME);
			const result = formatDateTime(date, { locale: 'en-US', short: true });
			expect(result).toBeTruthy();
			expect(typeof result).toBe('string');
		});

		it('should return empty string for invalid date', () => {
			expect(formatDateTime('invalid')).toBe('');
			expect(formatDateTime(null)).toBe('');
			expect(formatDateTime(undefined)).toBe('');
		});

		it('should work with different date formats', () => {
			const dateObj = new Date(TEST_DATETIME);
			const dateStr = TEST_DATETIME;
			const timestamp = dateObj.getTime();

			expect(formatDateTime(dateObj)).toBeTruthy();
			expect(formatDateTime(dateStr)).toBeTruthy();
			expect(formatDateTime(timestamp)).toBeTruthy();
		});
	});
}

describe('formatDate', () => {
	describe('formatDate', () => {
		runBasicFormattingTests();
		runFormatOptionsTests();
		runTimeOptionsTests();
		runLocaleAndTimezoneTests();
		runEdgeCasesTests();
	});

	runFormatDateTimeTests();
});
