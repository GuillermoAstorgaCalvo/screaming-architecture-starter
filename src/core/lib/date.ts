/**
 * Date utilities
 *
 * Common date manipulation and utility functions used across the application.
 * Provides SSR-safe date operations and common date-related helpers.
 */

const MS_PER_SECOND = 1000;
const SECONDS_PER_MINUTE = 60;
const MINUTES_PER_HOUR = 60;
const HOURS_PER_DAY = 24;
const MS_PER_DAY = MS_PER_SECOND * SECONDS_PER_MINUTE * MINUTES_PER_HOUR * HOURS_PER_DAY;

const END_OF_DAY_HOUR = 23;
const END_OF_DAY_MINUTE = 59;
const END_OF_DAY_SECOND = 59;
const END_OF_DAY_MS = 999;

/**
 * Check if a value is a valid Date object
 *
 * @param value - Value to check
 * @returns Whether the value is a valid Date
 *
 * @example
 * ```ts
 * isValidDate(new Date()); // true
 * isValidDate(new Date('invalid')); // false
 * isValidDate('2024-01-01'); // false
 * ```
 */
export function isValidDate(value: unknown): value is Date {
	return value instanceof Date && !Number.isNaN(value.getTime());
}

/**
 * Create a Date from a value, returning null if invalid
 *
 * @param value - Value to convert to Date (string, number, or Date)
 * @returns Date object or null if invalid
 *
 * @example
 * ```ts
 * toDate('2024-01-01'); // Date object
 * toDate(1704067200000); // Date object
 * toDate('invalid'); // null
 * ```
 */
export function toDate(value: string | number | Date | null | undefined): Date | null {
	if (value == null) {
		return null;
	}

	if (value instanceof Date) {
		return isValidDate(value) ? value : null;
	}

	const date = new Date(value);
	return isValidDate(date) ? date : null;
}

/**
 * Add days to a date
 *
 * @param date - Starting date
 * @param days - Number of days to add (can be negative)
 * @returns New Date object with days added
 *
 * @example
 * ```ts
 * addDays(new Date('2024-01-01'), 7); // 2024-01-08
 * addDays(new Date('2024-01-01'), -1); // 2023-12-31
 * ```
 */
export function addDays(date: Date, days: number): Date {
	const result = new Date(date);
	result.setDate(result.getDate() + days);
	return result;
}

/**
 * Add hours to a date
 *
 * @param date - Starting date
 * @param hours - Number of hours to add (can be negative)
 * @returns New Date object with hours added
 *
 * @example
 * ```ts
 * addHours(new Date('2024-01-01T10:00:00'), 2); // 2024-01-01T12:00:00
 * ```
 */
export function addHours(date: Date, hours: number): Date {
	const result = new Date(date);
	result.setHours(result.getHours() + hours);
	return result;
}

/**
 * Add minutes to a date
 *
 * @param date - Starting date
 * @param minutes - Number of minutes to add (can be negative)
 * @returns New Date object with minutes added
 *
 * @example
 * ```ts
 * addMinutes(new Date('2024-01-01T10:00:00'), 30); // 2024-01-01T10:30:00
 * ```
 */
export function addMinutes(date: Date, minutes: number): Date {
	const result = new Date(date);
	result.setMinutes(result.getMinutes() + minutes);
	return result;
}

/**
 * Calculate the difference in days between two dates
 *
 * @param date1 - First date
 * @param date2 - Second date
 * @returns Number of days difference (positive if date1 is later)
 *
 * @example
 * ```ts
 * daysDiff(new Date('2024-01-08'), new Date('2024-01-01')); // 7
 * daysDiff(new Date('2024-01-01'), new Date('2024-01-08')); // -7
 * ```
 */
export function daysDiff(date1: Date, date2: Date): number {
	const diffTime = date1.getTime() - date2.getTime();
	return Math.floor(diffTime / MS_PER_DAY);
}

/**
 * Check if a date is in the past
 *
 * @param date - Date to check
 * @returns Whether the date is in the past
 *
 * @example
 * ```ts
 * isPast(new Date('2020-01-01')); // true
 * isPast(new Date('2100-01-01')); // false
 * ```
 */
export function isPast(date: Date): boolean {
	return date.getTime() < Date.now();
}

/**
 * Check if a date is in the future
 *
 * @param date - Date to check
 * @returns Whether the date is in the future
 *
 * @example
 * ```ts
 * isFuture(new Date('2100-01-01')); // true
 * isFuture(new Date('2020-01-01')); // false
 * ```
 */
export function isFuture(date: Date): boolean {
	return date.getTime() > Date.now();
}

/**
 * Check if a date is today
 *
 * @param date - Date to check
 * @returns Whether the date is today
 *
 * @example
 * ```ts
 * isToday(new Date()); // true
 * isToday(new Date('2020-01-01')); // false
 * ```
 */
export function isToday(date: Date): boolean {
	const today = new Date();
	return (
		date.getDate() === today.getDate() &&
		date.getMonth() === today.getMonth() &&
		date.getFullYear() === today.getFullYear()
	);
}

/**
 * Get the start of the day (00:00:00.000)
 *
 * @param date - Date to get start of day for
 * @returns New Date object at start of day
 *
 * @example
 * ```ts
 * startOfDay(new Date('2024-01-01T14:30:00')); // 2024-01-01T00:00:00.000
 * ```
 */
export function startOfDay(date: Date): Date {
	const result = new Date(date);
	result.setHours(0, 0, 0, 0);
	return result;
}

/**
 * Get the end of the day (23:59:59.999)
 *
 * @param date - Date to get end of day for
 * @returns New Date object at end of day
 *
 * @example
 * ```ts
 * endOfDay(new Date('2024-01-01T14:30:00')); // 2024-01-01T23:59:59.999
 * ```
 */
export function endOfDay(date: Date): Date {
	const result = new Date(date);
	result.setHours(END_OF_DAY_HOUR, END_OF_DAY_MINUTE, END_OF_DAY_SECOND, END_OF_DAY_MS);
	return result;
}

/**
 * Format date to UTC string (for cookies, headers, etc.)
 *
 * @param date - Date to format
 * @returns UTC string (e.g., "Thu, 01 Jan 1970 00:00:00 GMT")
 *
 * @example
 * ```ts
 * toUTCString(new Date()); // "Mon, 01 Jan 2024 12:00:00 GMT"
 * ```
 */
export function toUTCString(date: Date): string {
	return date.toUTCString();
}
