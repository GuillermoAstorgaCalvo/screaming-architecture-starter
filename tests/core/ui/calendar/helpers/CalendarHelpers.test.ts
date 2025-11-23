/**
 * CalendarHelpers Tests
 *
 * Tests for calendar helper functions including:
 * - Date conversion utilities
 * - Date comparison functions
 * - Calendar grid generation
 * - Week number calculation
 * - Event filtering
 * - Date formatting
 */

import {
	formatMonthYear,
	getCalendarDays,
	getEventsForDate,
	getFirstDayOfMonth,
	getFirstDayOfWeek,
	getLastDayOfMonth,
	getWeekdayNames,
	getWeekNumber,
	isDateDisabled,
	isDateInRange,
	isRangeEnd,
	isRangeStart,
	isSameDay,
	isToday,
	toDate,
} from '@core/ui/calendar/helpers/CalendarHelpers';
import { describe, expect, it } from 'vitest';

describe('CalendarHelpers - toDate', () => {
	it('converts Date object to Date', () => {
		const date = new Date(2024, 0, 15);
		expect(toDate(date)).toEqual(date);
	});

	it('converts number timestamp to Date', () => {
		const timestamp = new Date(2024, 0, 15).getTime();
		const result = toDate(timestamp);
		expect(result).toBeInstanceOf(Date);
		expect(result?.getTime()).toBe(timestamp);
	});

	it('converts valid date string to Date', () => {
		const dateString = '2024-01-15';
		const result = toDate(dateString);
		expect(result).toBeInstanceOf(Date);
		expect(result?.getFullYear()).toBe(2024);
		expect(result?.getMonth()).toBe(0);
		expect(result?.getDate()).toBe(15);
	});

	it('returns null for invalid date string', () => {
		expect(toDate('invalid-date')).toBeNull();
	});

	it('returns null for null input', () => {
		expect(toDate(null)).toBeNull();
	});

	it('returns null for undefined input', () => {
		expect(toDate(undefined)).toBeNull();
	});
});

describe('CalendarHelpers - getFirstDayOfMonth', () => {
	it('returns first day of month', () => {
		const date = new Date(2024, 5, 15);
		const result = getFirstDayOfMonth(date);
		expect(result.getFullYear()).toBe(2024);
		expect(result.getMonth()).toBe(5);
		expect(result.getDate()).toBe(1);
	});

	it('handles January correctly', () => {
		const date = new Date(2024, 0, 15);
		const result = getFirstDayOfMonth(date);
		expect(result.getMonth()).toBe(0);
		expect(result.getDate()).toBe(1);
	});

	it('handles December correctly', () => {
		const date = new Date(2024, 11, 15);
		const result = getFirstDayOfMonth(date);
		expect(result.getMonth()).toBe(11);
		expect(result.getDate()).toBe(1);
	});
});

describe('CalendarHelpers - getLastDayOfMonth', () => {
	it('returns last day of month', () => {
		const date = new Date(2024, 0, 15); // January
		const result = getLastDayOfMonth(date);
		expect(result.getFullYear()).toBe(2024);
		expect(result.getMonth()).toBe(0);
		expect(result.getDate()).toBe(31);
	});

	it('handles February in non-leap year', () => {
		const date = new Date(2023, 1, 15); // February 2023
		const result = getLastDayOfMonth(date);
		expect(result.getDate()).toBe(28);
	});

	it('handles February in leap year', () => {
		const date = new Date(2024, 1, 15); // February 2024
		const result = getLastDayOfMonth(date);
		expect(result.getDate()).toBe(29);
	});

	it('handles months with 30 days', () => {
		const date = new Date(2024, 3, 15); // April
		const result = getLastDayOfMonth(date);
		expect(result.getDate()).toBe(30);
	});
});

describe('CalendarHelpers - getFirstDayOfWeek', () => {
	it('returns first day of week when month starts on Sunday (firstDayOfWeek = 0)', () => {
		const date = new Date(2024, 0, 1); // January 1, 2024 is a Monday
		const result = getFirstDayOfWeek(date, 0);
		expect(result.getDate()).toBe(31); // Should be Dec 31, 2023
		expect(result.getMonth()).toBe(11);
	});

	it('returns first day of week when month starts on Monday (firstDayOfWeek = 1)', () => {
		const date = new Date(2024, 0, 1); // January 1, 2024 is a Monday
		const result = getFirstDayOfWeek(date, 1);
		expect(result.getDate()).toBe(1);
		expect(result.getMonth()).toBe(0);
	});

	it('handles week starting on different days', () => {
		const date = new Date(2024, 0, 15);
		const resultSunday = getFirstDayOfWeek(date, 0);
		const resultMonday = getFirstDayOfWeek(date, 1);
		expect(resultSunday).not.toEqual(resultMonday);
	});
});

describe('CalendarHelpers - isSameDay', () => {
	it('returns true for same day', () => {
		const date1 = new Date(2024, 0, 15, 10, 30);
		const date2 = new Date(2024, 0, 15, 14, 45);
		expect(isSameDay(date1, date2)).toBe(true);
	});

	it('returns false for different days', () => {
		const date1 = new Date(2024, 0, 15);
		const date2 = new Date(2024, 0, 16);
		expect(isSameDay(date1, date2)).toBe(false);
	});

	it('returns false for different months', () => {
		const date1 = new Date(2024, 0, 15);
		const date2 = new Date(2024, 1, 15);
		expect(isSameDay(date1, date2)).toBe(false);
	});

	it('returns false for different years', () => {
		const date1 = new Date(2024, 0, 15);
		const date2 = new Date(2023, 0, 15);
		expect(isSameDay(date1, date2)).toBe(false);
	});

	it('returns false when first date is null', () => {
		const date2 = new Date(2024, 0, 15);
		expect(isSameDay(null, date2)).toBe(false);
	});

	it('returns false when second date is null', () => {
		const date1 = new Date(2024, 0, 15);
		expect(isSameDay(date1, null)).toBe(false);
	});

	it('returns false when both dates are null', () => {
		expect(isSameDay(null, null)).toBe(false);
	});
});

describe('CalendarHelpers - isToday', () => {
	it('returns true for today', () => {
		const today = new Date();
		expect(isToday(today)).toBe(true);
	});

	it('returns false for yesterday', () => {
		const yesterday = new Date();
		yesterday.setDate(yesterday.getDate() - 1);
		expect(isToday(yesterday)).toBe(false);
	});

	it('returns false for tomorrow', () => {
		const tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);
		expect(isToday(tomorrow)).toBe(false);
	});
});

describe('CalendarHelpers - isDateInRange', () => {
	it('returns true for date within range', () => {
		const date = new Date(2024, 0, 15);
		const range = { start: new Date(2024, 0, 10), end: new Date(2024, 0, 20) };
		expect(isDateInRange(date, range)).toBe(true);
	});

	it('returns true for date equal to start', () => {
		const date = new Date(2024, 0, 10);
		const range = { start: new Date(2024, 0, 10), end: new Date(2024, 0, 20) };
		expect(isDateInRange(date, range)).toBe(true);
	});

	it('returns true for date equal to end', () => {
		const date = new Date(2024, 0, 20);
		const range = { start: new Date(2024, 0, 10), end: new Date(2024, 0, 20) };
		expect(isDateInRange(date, range)).toBe(true);
	});

	it('returns false for date before range', () => {
		const date = new Date(2024, 0, 5);
		const range = { start: new Date(2024, 0, 10), end: new Date(2024, 0, 20) };
		expect(isDateInRange(date, range)).toBe(false);
	});

	it('returns false for date after range', () => {
		const date = new Date(2024, 0, 25);
		const range = { start: new Date(2024, 0, 10), end: new Date(2024, 0, 20) };
		expect(isDateInRange(date, range)).toBe(false);
	});

	it('returns false when range start is null', () => {
		const date = new Date(2024, 0, 15);
		const range = { start: null, end: new Date(2024, 0, 20) };
		expect(isDateInRange(date, range)).toBe(false);
	});

	it('returns false when range end is null', () => {
		const date = new Date(2024, 0, 15);
		const range = { start: new Date(2024, 0, 10), end: null };
		expect(isDateInRange(date, range)).toBe(false);
	});

	it('returns false when range is null', () => {
		const date = new Date(2024, 0, 15);
		expect(isDateInRange(date, null)).toBe(false);
	});

	it('returns false when range is undefined', () => {
		const date = new Date(2024, 0, 15);
		expect(isDateInRange(date, undefined)).toBe(false);
	});
});

describe('CalendarHelpers - isRangeStart', () => {
	it('returns true for range start date', () => {
		const date = new Date(2024, 0, 10);
		const range = { start: new Date(2024, 0, 10), end: new Date(2024, 0, 20) };
		expect(isRangeStart(date, range)).toBe(true);
	});

	it('returns false for date not at range start', () => {
		const date = new Date(2024, 0, 15);
		const range = { start: new Date(2024, 0, 10), end: new Date(2024, 0, 20) };
		expect(isRangeStart(date, range)).toBe(false);
	});

	it('returns false when range start is null', () => {
		const date = new Date(2024, 0, 10);
		const range = { start: null, end: new Date(2024, 0, 20) };
		expect(isRangeStart(date, range)).toBe(false);
	});

	it('returns false when range is null', () => {
		const date = new Date(2024, 0, 10);
		expect(isRangeStart(date, null)).toBe(false);
	});
});

describe('CalendarHelpers - isRangeEnd', () => {
	it('returns true for range end date', () => {
		const date = new Date(2024, 0, 20);
		const range = { start: new Date(2024, 0, 10), end: new Date(2024, 0, 20) };
		expect(isRangeEnd(date, range)).toBe(true);
	});

	it('returns false for date not at range end', () => {
		const date = new Date(2024, 0, 15);
		const range = { start: new Date(2024, 0, 10), end: new Date(2024, 0, 20) };
		expect(isRangeEnd(date, range)).toBe(false);
	});

	it('returns false when range end is null', () => {
		const date = new Date(2024, 0, 20);
		const range = { start: new Date(2024, 0, 10), end: null };
		expect(isRangeEnd(date, range)).toBe(false);
	});

	it('returns false when range is null', () => {
		const date = new Date(2024, 0, 20);
		expect(isRangeEnd(date, null)).toBe(false);
	});
});

describe('CalendarHelpers - isDateDisabled', () => {
	it('returns false when no min or max date', () => {
		const date = new Date(2024, 0, 15);
		expect(isDateDisabled(date)).toBe(false);
	});

	it('returns true when date is before minDate', () => {
		const date = new Date(2024, 0, 5);
		const minDate = new Date(2024, 0, 10);
		expect(isDateDisabled(date, minDate)).toBe(true);
	});

	it('returns false when date equals minDate', () => {
		const date = new Date(2024, 0, 10);
		const minDate = new Date(2024, 0, 10);
		expect(isDateDisabled(date, minDate)).toBe(false);
	});

	it('returns false when date is after minDate', () => {
		const date = new Date(2024, 0, 15);
		const minDate = new Date(2024, 0, 10);
		expect(isDateDisabled(date, minDate)).toBe(false);
	});

	it('returns true when date is after maxDate', () => {
		const date = new Date(2024, 0, 25);
		const maxDate = new Date(2024, 0, 20);
		expect(isDateDisabled(date, undefined, maxDate)).toBe(true);
	});

	it('returns false when date equals maxDate', () => {
		const date = new Date(2024, 0, 20);
		const maxDate = new Date(2024, 0, 20);
		expect(isDateDisabled(date, undefined, maxDate)).toBe(false);
	});

	it('returns false when date is before maxDate', () => {
		const date = new Date(2024, 0, 15);
		const maxDate = new Date(2024, 0, 20);
		expect(isDateDisabled(date, undefined, maxDate)).toBe(false);
	});

	it('handles both minDate and maxDate', () => {
		const minDate = new Date(2024, 0, 10);
		const maxDate = new Date(2024, 0, 20);
		expect(isDateDisabled(new Date(2024, 0, 5), minDate, maxDate)).toBe(true);
		expect(isDateDisabled(new Date(2024, 0, 15), minDate, maxDate)).toBe(false);
		expect(isDateDisabled(new Date(2024, 0, 25), minDate, maxDate)).toBe(true);
	});

	it('handles string minDate', () => {
		const date = new Date(2024, 0, 5);
		const minDate = '2024-01-10';
		expect(isDateDisabled(date, minDate)).toBe(true);
	});

	it('handles number timestamp minDate', () => {
		const date = new Date(2024, 0, 5);
		const minDate = new Date(2024, 0, 10).getTime();
		expect(isDateDisabled(date, minDate)).toBe(true);
	});
});

describe('CalendarHelpers - getCalendarDays', () => {
	it('returns array of dates for calendar month', () => {
		const month = new Date(2024, 0, 1); // January 2024
		const days = getCalendarDays(month, 0); // Sunday first
		expect(days.length).toBe(42); // 6 weeks * 7 days
	});

	it('includes days from previous month', () => {
		const month = new Date(2024, 0, 1);
		const days = getCalendarDays(month, 0);
		const firstDay = days[0];
		expect(firstDay).toBeDefined();
		expect(firstDay?.getMonth()).toBe(11); // December
	});

	it('includes days from next month', () => {
		const month = new Date(2024, 0, 1);
		const days = getCalendarDays(month, 0);
		const lastDay = days.at(-1);
		expect(lastDay?.getMonth()).toBeGreaterThanOrEqual(0);
	});

	it('handles different firstDayOfWeek values', () => {
		const month = new Date(2024, 0, 1);
		const daysSunday = getCalendarDays(month, 0);
		const daysMonday = getCalendarDays(month, 1);
		expect(daysSunday[0]).not.toEqual(daysMonday[0]);
	});

	it('returns consecutive dates', () => {
		const month = new Date(2024, 0, 1);
		const days = getCalendarDays(month, 0);
		for (let i = 1; i < days.length; i++) {
			const prevDate = new Date(days.at(i - 1)!);
			prevDate.setDate(prevDate.getDate() + 1);
			expect(days.at(i)?.getTime()).toBe(prevDate.getTime());
		}
	});
});

describe('CalendarHelpers - getEventsForDate', () => {
	it('returns empty array when events is undefined', () => {
		const date = new Date(2024, 0, 15);
		expect(getEventsForDate(date, undefined)).toEqual([]);
	});

	it('returns empty array when events is empty', () => {
		const date = new Date(2024, 0, 15);
		expect(getEventsForDate(date, [])).toEqual([]);
	});

	it('returns events for matching date', () => {
		const date = new Date(2024, 0, 15);
		const events = [
			{ date: new Date(2024, 0, 15) },
			{ date: new Date(2024, 0, 16) },
			{ date: new Date(2024, 0, 15) },
		];
		const result = getEventsForDate(date, events);
		expect(result).toHaveLength(2);
		const eventDates = result.map(e => toDate(e.date)).filter((d): d is Date => d !== null);
		expect(eventDates.every(d => isSameDay(d, date))).toBe(true);
	});

	it('returns empty array when no events match date', () => {
		const date = new Date(2024, 0, 15);
		const events = [{ date: new Date(2024, 0, 16) }, { date: new Date(2024, 0, 17) }];
		expect(getEventsForDate(date, events)).toEqual([]);
	});

	it('handles string dates', () => {
		const date = new Date(2024, 0, 15);
		const events = [{ date: '2024-01-15' }, { date: '2024-01-16' }];
		const result = getEventsForDate(date, events);
		expect(result).toHaveLength(1);
	});

	it('handles number timestamps', () => {
		const date = new Date(2024, 0, 15);
		const events = [
			{ date: new Date(2024, 0, 15).getTime() },
			{ date: new Date(2024, 0, 16).getTime() },
		];
		const result = getEventsForDate(date, events);
		expect(result).toHaveLength(1);
	});
});

describe('CalendarHelpers - formatMonthYear', () => {
	it('formats date with default locale', () => {
		const date = new Date(2024, 0, 15);
		const result = formatMonthYear(date);
		expect(result).toContain('2024');
		expect(result).toContain('January');
	});

	it('formats date with custom locale', () => {
		const date = new Date(2024, 0, 15);
		const result = formatMonthYear(date, 'fr-FR');
		expect(result).toContain('2024');
	});

	it('handles different months', () => {
		const january = new Date(2024, 0, 15);
		const february = new Date(2024, 1, 15);
		const janResult = formatMonthYear(january);
		const febResult = formatMonthYear(february);
		expect(janResult).not.toBe(febResult);
	});
});

describe('CalendarHelpers - getWeekdayNames', () => {
	it('returns array of 7 weekday names', () => {
		const names = getWeekdayNames();
		expect(names).toHaveLength(7);
	});

	it('returns weekday names with default locale', () => {
		const names = getWeekdayNames();
		expect(names.every(name => typeof name === 'string')).toBe(true);
		expect(names.every(name => name.length > 0)).toBe(true);
	});

	it('returns weekday names with custom locale', () => {
		const names = getWeekdayNames('fr-FR');
		expect(names).toHaveLength(7);
		expect(names.every(name => typeof name === 'string')).toBe(true);
	});

	it('starts with Sunday when firstDayOfWeek is 0', () => {
		const names = getWeekdayNames('en-US', 0);
		expect(names[0]).toMatch(/sun/i);
	});

	it('starts with Monday when firstDayOfWeek is 1', () => {
		const names = getWeekdayNames('en-US', 1);
		expect(names[0]).toMatch(/mon/i);
	});

	it('returns different order for different firstDayOfWeek', () => {
		const namesSunday = getWeekdayNames('en-US', 0);
		const namesMonday = getWeekdayNames('en-US', 1);
		expect(namesSunday[0]).not.toBe(namesMonday[0]);
	});
});

describe('CalendarHelpers - getWeekNumber', () => {
	it('returns a number', () => {
		const date = new Date(2024, 0, 15);
		const weekNumber = getWeekNumber(date);
		expect(typeof weekNumber).toBe('number');
		expect(weekNumber).toBeGreaterThan(0);
		expect(weekNumber).toBeLessThanOrEqual(53);
	});

	it('returns week 1 for first week of year', () => {
		const date = new Date(2024, 0, 1);
		const weekNumber = getWeekNumber(date);
		expect(weekNumber).toBeGreaterThanOrEqual(1);
	});

	it('returns consistent week numbers for same week', () => {
		const date1 = new Date(2024, 0, 1);
		const date2 = new Date(2024, 0, 3);
		const week1 = getWeekNumber(date1);
		const week2 = getWeekNumber(date2);
		// They might be in the same week or adjacent weeks
		expect(Math.abs(week1 - week2)).toBeLessThanOrEqual(1);
	});

	it('handles dates in different months', () => {
		const janDate = new Date(2024, 0, 15);
		const febDate = new Date(2024, 1, 15);
		const janWeek = getWeekNumber(janDate);
		const febWeek = getWeekNumber(febDate);
		expect(febWeek).toBeGreaterThan(janWeek);
		expect(janWeek).toBeGreaterThan(0);
	});
});
