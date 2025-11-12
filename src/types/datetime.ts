/**
 * Date and time types
 *
 * Types for date/time handling, formatting, and timezone operations
 * used across the application.
 */

/**
 * Date-like type (Date object, timestamp, or ISO string)
 */
export type DateLike = Date | number | string;

/**
 * Date format type
 */
export type DateFormat =
	| 'iso' // ISO 8601 (e.g., "2023-12-25T10:30:00Z")
	| 'iso-date' // ISO date only (e.g., "2023-12-25")
	| 'iso-time' // ISO time only (e.g., "10:30:00")
	| 'short' // Short format (e.g., "12/25/2023")
	| 'long' // Long format (e.g., "December 25, 2023")
	| 'relative' // Relative time (e.g., "2 days ago")
	| 'timestamp' // Unix timestamp (number)
	| 'custom'; // Custom format string

/**
 * Date range
 */
export interface DateRange {
	/** Start date */
	start: DateLike;
	/** End date */
	end: DateLike;
}

/**
 * Time range
 */
export interface TimeRange {
	/** Start time (hours:minutes) */
	start: string;
	/** End time (hours:minutes) */
	end: string;
}

/**
 * Calendar date
 */
export interface CalendarDate {
	/** Year */
	year: number;
	/** Month (1-12) */
	month: number;
	/** Day (1-31) */
	day: number;
}

/**
 * Time components
 */
export interface TimeComponents {
	/** Hours (0-23) */
	hours: number;
	/** Minutes (0-59) */
	minutes: number;
	/** Seconds (0-59) */
	seconds?: number;
	/** Milliseconds (0-999) */
	milliseconds?: number;
}

/**
 * Date format options
 */
export interface DateFormatOptions {
	/** Date format type */
	format?: DateFormat;
	/** Custom format string (if format is 'custom') */
	customFormat?: string;
	/** Locale for formatting */
	locale?: string;
	/** Timezone for formatting (IANA timezone, e.g., 'America/New_York', 'Europe/London', 'UTC') */
	timezone?: string;
	/** Whether to include time */
	includeTime?: boolean;
	/** Whether to use 12-hour format */
	use12Hour?: boolean;
}

/**
 * Date parsing options
 */
export interface DateParseOptions {
	/** Expected date format */
	format?: DateFormat;
	/** Custom format pattern (if format is 'custom') */
	customFormat?: string;
	/** Locale for parsing */
	locale?: string;
	/** Timezone for parsing (IANA timezone, e.g., 'America/New_York', 'Europe/London', 'UTC') */
	timezone?: string;
	/** Strict parsing (fail on invalid input) */
	strict?: boolean;
}

/**
 * Date manipulation options
 */
export interface DateManipulationOptions {
	/** Amount to add/subtract */
	amount?: number;
	/** Unit of time */
	unit?: 'years' | 'months' | 'weeks' | 'days' | 'hours' | 'minutes' | 'seconds' | 'milliseconds';
	/** Whether to round to start of unit */
	roundToStart?: boolean;
	/** Whether to round to end of unit */
	roundToEnd?: boolean;
}

/**
 * Date validation result
 */
export interface DateValidationResult {
	/** Whether the date is valid */
	valid: boolean;
	/** Error message if invalid */
	error?: string;
	/** Parsed date if valid */
	date?: Date;
}

/**
 * Duration with unit
 */
export interface DurationWithUnit {
	/** Duration value */
	value: number;
	/** Duration unit */
	unit: 'years' | 'months' | 'weeks' | 'days' | 'hours' | 'minutes' | 'seconds' | 'milliseconds';
}

/**
 * Time period
 */
export type TimePeriod = 'day' | 'week' | 'month' | 'year' | 'all';

/**
 * Relative time unit
 */
export type RelativeTimeUnit =
	| 'now'
	| 'seconds'
	| 'minutes'
	| 'hours'
	| 'days'
	| 'weeks'
	| 'months'
	| 'years';

/**
 * Relative time
 */
export interface RelativeTime {
	/** Time value */
	value: number;
	/** Time unit */
	unit: RelativeTimeUnit;
	/** Human-readable string */
	label: string;
}
