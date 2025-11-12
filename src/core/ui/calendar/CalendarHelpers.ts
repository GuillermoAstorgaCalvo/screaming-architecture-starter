import type { DateLike } from '@src-types/datetime';

/**
 * Convert DateLike to Date object
 */
export function toDate(dateLike: DateLike | undefined | null): Date | null {
	if (!dateLike) return null;
	if (dateLike instanceof Date) return dateLike;
	if (typeof dateLike === 'number') return new Date(dateLike);
	if (typeof dateLike === 'string') {
		const date = new Date(dateLike);
		return Number.isNaN(date.getTime()) ? null : date;
	}
	return null;
}

/**
 * Get the first day of a month
 */
export function getFirstDayOfMonth(date: Date): Date {
	return new Date(date.getFullYear(), date.getMonth(), 1);
}

/**
 * Get the last day of a month
 */
export function getLastDayOfMonth(date: Date): Date {
	return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

const DAYS_IN_WEEK = 7;

/**
 * Get the first day of the week for a month (including days from previous month)
 */
export function getFirstDayOfWeek(date: Date, firstDayOfWeek: number): Date {
	const firstDay = getFirstDayOfMonth(date);
	const dayOfWeek = firstDay.getDay();
	const diff = (dayOfWeek - firstDayOfWeek + DAYS_IN_WEEK) % DAYS_IN_WEEK;
	return new Date(firstDay.getFullYear(), firstDay.getMonth(), firstDay.getDate() - diff);
}

/**
 * Check if two dates are the same day
 */
export function isSameDay(date1: Date | null, date2: Date | null): boolean {
	if (!date1 || !date2) return false;
	return (
		date1.getFullYear() === date2.getFullYear() &&
		date1.getMonth() === date2.getMonth() &&
		date1.getDate() === date2.getDate()
	);
}

/**
 * Check if a date is today
 */
export function isToday(date: Date): boolean {
	const today = new Date();
	return isSameDay(date, today);
}

/**
 * Check if a date is in a range
 */
export function isDateInRange(
	date: Date,
	range: { start: Date | null; end: Date | null } | null | undefined
): boolean {
	if (!range?.start || !range.end) return false;
	return date >= range.start && date <= range.end;
}

/**
 * Check if a date is the start of a range
 */
export function isRangeStart(
	date: Date,
	range: { start: Date | null; end: Date | null } | null | undefined
): boolean {
	if (!range?.start) return false;
	return isSameDay(date, range.start);
}

/**
 * Check if a date is the end of a range
 */
export function isRangeEnd(
	date: Date,
	range: { start: Date | null; end: Date | null } | null | undefined
): boolean {
	if (!range?.end) return false;
	return isSameDay(date, range.end);
}

/**
 * Check if a date is disabled (outside min/max range)
 */
export function isDateDisabled(date: Date, minDate?: DateLike, maxDate?: DateLike): boolean {
	const min = toDate(minDate);
	const max = toDate(maxDate);
	if (min && date < min) return true;
	if (max && date > max) return true;
	return false;
}

const WEEKS_IN_CALENDAR = 6;
const DAYS_IN_CALENDAR = WEEKS_IN_CALENDAR * DAYS_IN_WEEK - 1;

/**
 * Get all days for a calendar month view
 */
export function getCalendarDays(month: Date, firstDayOfWeek: number): Date[] {
	const days: Date[] = [];
	const startDate = getFirstDayOfWeek(month, firstDayOfWeek);
	const endDate = new Date(startDate);
	endDate.setDate(endDate.getDate() + DAYS_IN_CALENDAR);

	let currentDate = new Date(startDate);
	const finalEndDate = new Date(endDate);
	while (currentDate <= finalEndDate) {
		days.push(new Date(currentDate));
		const nextDate = new Date(currentDate);
		nextDate.setDate(nextDate.getDate() + 1);
		currentDate = nextDate;
	}

	return days;
}

/**
 * Get events for a specific date
 */
export function getEventsForDate(
	date: Date,
	events: Array<{ date: DateLike }> | undefined
): Array<{ date: DateLike }> {
	if (!events) return [];
	return events.filter(event => {
		const eventDate = toDate(event.date);
		return eventDate && isSameDay(eventDate, date);
	});
}

/**
 * Format month/year for display
 */
export function formatMonthYear(date: Date, locale: string = 'en-US'): string {
	return date.toLocaleDateString(locale, { month: 'long', year: 'numeric' });
}

const REFERENCE_YEAR = 2024;
const REFERENCE_MONTH = 0; // January
const REFERENCE_SUNDAY = 7; // Jan 7, 2024 is a Sunday

/**
 * Get weekday names
 */
export function getWeekdayNames(locale: string = 'en-US', firstDayOfWeek: number = 0): string[] {
	const names: string[] = [];
	const baseDate = new Date(REFERENCE_YEAR, REFERENCE_MONTH, REFERENCE_SUNDAY + firstDayOfWeek);

	for (let i = 0; i < DAYS_IN_WEEK; i++) {
		const dayDate = new Date(baseDate);
		dayDate.setDate(baseDate.getDate() + i);
		names.push(dayDate.toLocaleDateString(locale, { weekday: 'short' }));
	}

	return names;
}

const MILLISECONDS_PER_DAY = 86_400_000;
const DAYS_TO_ADD_FOR_WEEK_CALC = 4;
const WEEK_START_OFFSET = 7;

/**
 * Get week number for a date
 */
export function getWeekNumber(date: Date): number {
	const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
	const dayNum = d.getUTCDay() || WEEK_START_OFFSET;
	d.setUTCDate(d.getUTCDate() + DAYS_TO_ADD_FOR_WEEK_CALC - dayNum);
	const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
	return Math.ceil(
		((d.getTime() - yearStart.getTime()) / MILLISECONDS_PER_DAY + 1) / WEEK_START_OFFSET
	);
}
