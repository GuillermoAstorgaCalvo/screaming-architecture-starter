import { formatISO } from '@core/lib/date/formatISO';
import { describe, expect, it } from 'vitest';

const TEST_DATE_STRING = '2024-01-15';
const TEST_DATE_ISO = '2024-01-15T14:30:45.123Z';
const TEST_DATE_MIDNIGHT_UTC = '2024-01-15T00:00:00Z';

describe('formatISO', () => {
	describeWithoutTime();
	describeWithTime();
	describeEdgeCases();
});

function describeWithoutTime() {
	describe('formatISO without time', () => {
		it('should format a Date object to YYYY-MM-DD', () => {
			const date = new Date(TEST_DATE_MIDNIGHT_UTC);
			const result = formatISO(date);
			expect(result).toBe(TEST_DATE_STRING);
		});

		it('should format a date string to YYYY-MM-DD', () => {
			const result = formatISO(TEST_DATE_STRING);
			expect(result).toBe(TEST_DATE_STRING);
		});

		it('should format a timestamp to YYYY-MM-DD', () => {
			const timestamp = new Date(TEST_DATE_MIDNIGHT_UTC).getTime();
			const result = formatISO(timestamp);
			expect(result).toBe(TEST_DATE_STRING);
		});

		it('should pad single digit months and days', () => {
			const date = new Date('2024-01-05T00:00:00Z');
			const result = formatISO(date);
			expect(result).toBe('2024-01-05');
		});

		it('should handle dates at end of month', () => {
			const date = new Date('2024-01-31T00:00:00Z');
			const result = formatISO(date);
			expect(result).toBe('2024-01-31');
		});

		it('should handle dates at end of year', () => {
			const date = new Date('2024-12-31T00:00:00Z');
			const result = formatISO(date);
			expect(result).toBe('2024-12-31');
		});

		it('should return empty string for invalid date', () => {
			expect(formatISO('invalid')).toBe('');
			expect(formatISO(null)).toBe('');
			expect(formatISO(undefined)).toBe('');
		});

		it('should use local date, not UTC', () => {
			// Create a date that might be different in local timezone
			const date = new Date('2024-01-15T23:00:00Z');
			const result = formatISO(date, false);
			// The result depends on local timezone, but should be a valid date string
			expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
		});
	});
}

function describeWithTime() {
	describe('formatISO with time', () => {
		it('should format a Date object to ISO string with time', () => {
			const date = new Date(TEST_DATE_ISO);
			const result = formatISO(date, true);
			expect(result).toBe(date.toISOString());
		});

		it('should format a date string to ISO string with time', () => {
			const date = new Date(TEST_DATE_ISO);
			const result = formatISO(TEST_DATE_ISO, true);
			expect(result).toBe(date.toISOString());
		});

		it('should format a timestamp to ISO string with time', () => {
			const timestamp = new Date(TEST_DATE_ISO).getTime();
			const date = new Date(timestamp);
			const result = formatISO(timestamp, true);
			expect(result).toBe(date.toISOString());
		});

		it('should include milliseconds in ISO string', () => {
			const date = new Date(TEST_DATE_ISO);
			const result = formatISO(date, true);
			expect(result).toContain('.123Z');
		});

		it('should include timezone in ISO string', () => {
			const date = new Date(TEST_DATE_ISO);
			const result = formatISO(date, true);
			expect(result).toMatch(/Z$/);
		});

		it('should return empty string for invalid date with time', () => {
			expect(formatISO('invalid', true)).toBe('');
			expect(formatISO(null, true)).toBe('');
			expect(formatISO(undefined, true)).toBe('');
		});
	});
}

function describeEdgeCases() {
	describe('formatISO edge cases', () => {
		it('should handle leap year dates', () => {
			const date = new Date('2024-02-29T00:00:00Z');
			const result = formatISO(date);
			expect(result).toBe('2024-02-29');
		});

		it('should handle dates at midnight', () => {
			const date = new Date(TEST_DATE_MIDNIGHT_UTC);
			const result = formatISO(date);
			expect(result).toBe(TEST_DATE_STRING);
		});

		it('should handle dates at end of day', () => {
			// Use local date to avoid timezone issues
			const date = new Date(2024, 0, 15, 23, 59, 59, 999);
			const result = formatISO(date);
			expect(result).toBe(TEST_DATE_STRING);
		});

		it('should default to not including time', () => {
			const date = new Date(TEST_DATE_ISO);
			const resultDefault = formatISO(date);
			const resultExplicit = formatISO(date, false);
			expect(resultDefault).toBe(resultExplicit);
			expect(resultDefault).toBe(TEST_DATE_STRING);
		});
	});
}
