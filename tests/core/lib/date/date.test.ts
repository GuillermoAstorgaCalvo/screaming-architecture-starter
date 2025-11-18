import {
	addDays,
	addHours,
	addMinutes,
	daysDiff,
	endOfDay,
	isFuture,
	isPast,
	isToday,
	isValidDate,
	startOfDay,
	toDate,
	toUTCString,
} from '@core/lib/date/date';
import { describe, expect, it } from 'vitest';

const DATE_2024_01_01 = '2024-01-01';
const DATE_2024_01_08 = '2024-01-08';
const DATE_2020_01_01 = '2020-01-01';
const DATE_2100_01_01 = '2100-01-01';
const DAYS_SEVEN = 7;
const HOURS_TWO = 2;
const MINUTES_THIRTY = 30;
const TEST_SHOULD_NOT_MUTATE = 'should not mutate the original date';

describe('isValidDate', () => {
	it('should return true for valid Date objects', () => {
		expect(isValidDate(new Date())).toBe(true);
		expect(isValidDate(new Date(DATE_2024_01_01))).toBe(true);
		expect(isValidDate(new Date(1704067200000))).toBe(true);
	});

	it('should return false for invalid Date objects', () => {
		expect(isValidDate(new Date('invalid'))).toBe(false);
		expect(isValidDate(new Date(Number.NaN))).toBe(false);
	});

	it('should return false for non-Date values', () => {
		expect(isValidDate(DATE_2024_01_01)).toBe(false);
		expect(isValidDate(1704067200000)).toBe(false);
		expect(isValidDate(null)).toBe(false);
		expect(isValidDate(undefined)).toBe(false);
		expect(isValidDate({})).toBe(false);
		expect(isValidDate([])).toBe(false);
	});
});

describe('toDate', () => {
	it('should convert valid string dates to Date objects', () => {
		const result = toDate(DATE_2024_01_01);
		expect(result).toBeInstanceOf(Date);
		expect(result?.getFullYear()).toBe(2024);
		expect(result?.getMonth()).toBe(0); // January is 0
		expect(result?.getDate()).toBe(1);
	});

	it('should convert valid number timestamps to Date objects', () => {
		const timestamp = 1704067200000; // 2024-01-01T00:00:00.000Z
		const result = toDate(timestamp);
		expect(result).toBeInstanceOf(Date);
		expect(result?.getTime()).toBe(timestamp);
	});

	it('should return Date object if already a Date', () => {
		const date = new Date(DATE_2024_01_01);
		const result = toDate(date);
		expect(result).toBe(date);
	});

	it('should return null for invalid string dates', () => {
		expect(toDate('invalid')).toBeNull();
		expect(toDate('not-a-date')).toBeNull();
	});

	it('should return null for null or undefined', () => {
		expect(toDate(null)).toBeNull();
		expect(toDate(undefined)).toBeNull();
	});

	it('should return null for invalid Date objects', () => {
		const invalidDate = new Date('invalid');
		expect(toDate(invalidDate)).toBeNull();
	});
});

describe('addDays', () => {
	it('should add positive days to a date', () => {
		const date = new Date(DATE_2024_01_01);
		const result = addDays(date, DAYS_SEVEN);
		expect(result.getDate()).toBe(8);
		expect(result.getMonth()).toBe(0);
		expect(result.getFullYear()).toBe(2024);
	});

	it('should subtract days when negative value is provided', () => {
		const date = new Date(DATE_2024_01_08);
		const result = addDays(date, -DAYS_SEVEN);
		expect(result.getDate()).toBe(1);
		expect(result.getMonth()).toBe(0);
		expect(result.getFullYear()).toBe(2024);
	});

	it('should handle month boundaries correctly', () => {
		const date = new Date('2024-01-31');
		const result = addDays(date, 1);
		expect(result.getDate()).toBe(1);
		expect(result.getMonth()).toBe(1); // February
		expect(result.getFullYear()).toBe(2024);
	});

	it('should handle year boundaries correctly', () => {
		const date = new Date('2024-12-31');
		const result = addDays(date, 1);
		expect(result.getDate()).toBe(1);
		expect(result.getMonth()).toBe(0); // January
		expect(result.getFullYear()).toBe(2025);
	});

	it(TEST_SHOULD_NOT_MUTATE, () => {
		const date = new Date(DATE_2024_01_01);
		const originalTime = date.getTime();
		addDays(date, DAYS_SEVEN);
		expect(date.getTime()).toBe(originalTime);
	});
});

describe('addHours', () => {
	it('should add positive hours to a date', () => {
		const date = new Date(`${DATE_2024_01_01}T10:00:00`);
		const result = addHours(date, HOURS_TWO);
		expect(result.getHours()).toBe(12);
	});

	it('should subtract hours when negative value is provided', () => {
		const date = new Date(`${DATE_2024_01_01}T12:00:00`);
		const result = addHours(date, -HOURS_TWO);
		expect(result.getHours()).toBe(10);
	});

	it('should handle day boundaries correctly', () => {
		const date = new Date(`${DATE_2024_01_01}T23:00:00`);
		const result = addHours(date, HOURS_TWO);
		expect(result.getDate()).toBe(HOURS_TWO);
		expect(result.getHours()).toBe(1);
	});

	it(TEST_SHOULD_NOT_MUTATE, () => {
		const date = new Date(`${DATE_2024_01_01}T10:00:00`);
		const originalTime = date.getTime();
		addHours(date, HOURS_TWO);
		expect(date.getTime()).toBe(originalTime);
	});
});

describe('addMinutes', () => {
	it('should add positive minutes to a date', () => {
		const date = new Date(`${DATE_2024_01_01}T10:00:00`);
		const result = addMinutes(date, MINUTES_THIRTY);
		expect(result.getMinutes()).toBe(MINUTES_THIRTY);
	});

	it('should subtract minutes when negative value is provided', () => {
		const date = new Date(`${DATE_2024_01_01}T10:30:00`);
		const result = addMinutes(date, -MINUTES_THIRTY);
		expect(result.getMinutes()).toBe(0);
	});

	it('should handle hour boundaries correctly', () => {
		const date = new Date(`${DATE_2024_01_01}T10:45:00`);
		const result = addMinutes(date, MINUTES_THIRTY);
		expect(result.getHours()).toBe(11);
		expect(result.getMinutes()).toBe(15);
	});

	it(TEST_SHOULD_NOT_MUTATE, () => {
		const date = new Date(`${DATE_2024_01_01}T10:00:00`);
		const originalTime = date.getTime();
		addMinutes(date, MINUTES_THIRTY);
		expect(date.getTime()).toBe(originalTime);
	});
});

describe('daysDiff', () => {
	it('should return positive difference when date1 is later', () => {
		const date1 = new Date(DATE_2024_01_08);
		const date2 = new Date(DATE_2024_01_01);
		expect(daysDiff(date1, date2)).toBe(DAYS_SEVEN);
	});

	it('should return negative difference when date1 is earlier', () => {
		const date1 = new Date(DATE_2024_01_01);
		const date2 = new Date(DATE_2024_01_08);
		expect(daysDiff(date1, date2)).toBe(-DAYS_SEVEN);
	});

	it('should return 0 for same dates', () => {
		const date = new Date(DATE_2024_01_01);
		expect(daysDiff(date, date)).toBe(0);
	});

	it('should handle dates on same day correctly', () => {
		const date1 = new Date(`${DATE_2024_01_01}T14:30:00`);
		const date2 = new Date(`${DATE_2024_01_01}T10:00:00`);
		expect(daysDiff(date1, date2)).toBe(0);
	});

	it('should handle dates across month boundaries', () => {
		const date1 = new Date('2024-02-01');
		const date2 = new Date('2024-01-25');
		expect(daysDiff(date1, date2)).toBe(DAYS_SEVEN);
	});

	it('should handle dates across year boundaries', () => {
		const date1 = new Date(DATE_2024_01_01);
		const date2 = new Date('2023-12-25');
		expect(daysDiff(date1, date2)).toBe(DAYS_SEVEN);
	});
});

describe('isPast', () => {
	it('should return true for dates in the past', () => {
		const pastDate = new Date(DATE_2020_01_01);
		expect(isPast(pastDate)).toBe(true);
	});

	it('should return false for dates in the future', () => {
		const futureDate = new Date(DATE_2100_01_01);
		expect(isPast(futureDate)).toBe(false);
	});

	it('should return false for current time (within milliseconds)', () => {
		const now = new Date();
		expect(isPast(now)).toBe(false);
	});

	it('should handle dates very close to now', () => {
		const justPast = new Date(Date.now() - 1000);
		expect(isPast(justPast)).toBe(true);
	});
});

describe('isFuture', () => {
	it('should return true for dates in the future', () => {
		const futureDate = new Date(DATE_2100_01_01);
		expect(isFuture(futureDate)).toBe(true);
	});

	it('should return false for dates in the past', () => {
		const pastDate = new Date(DATE_2020_01_01);
		expect(isFuture(pastDate)).toBe(false);
	});

	it('should return false for current time (within milliseconds)', () => {
		const now = new Date();
		expect(isFuture(now)).toBe(false);
	});

	it('should handle dates very close to now', () => {
		const justFuture = new Date(Date.now() + 1000);
		expect(isFuture(justFuture)).toBe(true);
	});
});

describe('isToday', () => {
	it('should return true for today', () => {
		const today = new Date();
		expect(isToday(today)).toBe(true);
	});

	it('should return false for dates in the past', () => {
		const pastDate = new Date(DATE_2020_01_01);
		expect(isToday(pastDate)).toBe(false);
	});

	it('should return false for dates in the future', () => {
		const futureDate = new Date(DATE_2100_01_01);
		expect(isToday(futureDate)).toBe(false);
	});

	it('should return true regardless of time of day', () => {
		const todayMorning = new Date();
		todayMorning.setHours(0, 0, 0, 0);
		expect(isToday(todayMorning)).toBe(true);

		const todayEvening = new Date();
		todayEvening.setHours(23, 59, 59, 999);
		expect(isToday(todayEvening)).toBe(true);
	});
});

describe('startOfDay', () => {
	it('should set time to 00:00:00.000', () => {
		const date = new Date(`${DATE_2024_01_01}T14:30:45.123`);
		const result = startOfDay(date);
		expect(result.getHours()).toBe(0);
		expect(result.getMinutes()).toBe(0);
		expect(result.getSeconds()).toBe(0);
		expect(result.getMilliseconds()).toBe(0);
	});

	it('should preserve the date, month, and year', () => {
		const date = new Date('2024-01-15T14:30:00');
		const result = startOfDay(date);
		expect(result.getDate()).toBe(15);
		expect(result.getMonth()).toBe(0);
		expect(result.getFullYear()).toBe(2024);
	});

	it(TEST_SHOULD_NOT_MUTATE, () => {
		const date = new Date(`${DATE_2024_01_01}T14:30:00`);
		const originalTime = date.getTime();
		startOfDay(date);
		expect(date.getTime()).toBe(originalTime);
	});
});

describe('endOfDay', () => {
	it('should set time to 23:59:59.999', () => {
		const date = new Date(`${DATE_2024_01_01}T14:30:45.123`);
		const result = endOfDay(date);
		expect(result.getHours()).toBe(23);
		expect(result.getMinutes()).toBe(59);
		expect(result.getSeconds()).toBe(59);
		expect(result.getMilliseconds()).toBe(999);
	});

	it('should preserve the date, month, and year', () => {
		const date = new Date('2024-01-15T14:30:00');
		const result = endOfDay(date);
		expect(result.getDate()).toBe(15);
		expect(result.getMonth()).toBe(0);
		expect(result.getFullYear()).toBe(2024);
	});

	it(TEST_SHOULD_NOT_MUTATE, () => {
		const date = new Date(`${DATE_2024_01_01}T14:30:00`);
		const originalTime = date.getTime();
		endOfDay(date);
		expect(date.getTime()).toBe(originalTime);
	});
});

describe('toUTCString', () => {
	it('should format date as UTC string', () => {
		const date = new Date(`${DATE_2024_01_01}T12:00:00Z`);
		const result = toUTCString(date);
		expect(result).toBe(date.toUTCString());
		expect(result).toContain('GMT');
	});

	it('should handle different dates correctly', () => {
		const date1 = new Date(`${DATE_2024_01_01}T00:00:00Z`);
		const date2 = new Date('2024-12-31T23:59:59Z');
		expect(toUTCString(date1)).toBe(date1.toUTCString());
		expect(toUTCString(date2)).toBe(date2.toUTCString());
	});
});
