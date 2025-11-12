/**
 * Date formatting utilities
 *
 * Provides common date formatting functions for consistent date display
 * across the application. All functions are SSR-safe.
 */

import { toDate } from './date';
import type { DateValue, FormatDateOptions } from './formatDate.types';

/**
 * Format a date value to a readable string
 *
 * @param value - Date value (string, number, or Date)
 * @param options - Formatting options
 * @returns Formatted date string or empty string if invalid
 *
 * @example
 * ```ts
 * formatDate(new Date('2024-01-15')); // "January 15, 2024"
 * formatDate('2024-01-15', { short: true }); // "1/15/2024"
 * formatDate(new Date('2024-01-15T14:30:00'), { includeTime: true }); // "January 15, 2024 at 2:30 PM"
 * ```
 */
export function formatDate(value: DateValue, options: FormatDateOptions = {}): string {
	const date = toDate(value);
	if (!date) {
		return '';
	}

	const { locale = 'en-US', timeZone, includeTime = false, short = false } = options;

	const dateOptions: Intl.DateTimeFormatOptions = {
		timeZone,
	};

	if (short) {
		dateOptions.month = 'numeric';
		dateOptions.day = 'numeric';
		dateOptions.year = 'numeric';
	} else {
		dateOptions.month = 'long';
		dateOptions.day = 'numeric';
		dateOptions.year = 'numeric';
	}

	if (includeTime) {
		dateOptions.hour = 'numeric';
		dateOptions.minute = '2-digit';
	}

	try {
		return new Intl.DateTimeFormat(locale, dateOptions).format(date);
	} catch {
		// Fallback to ISO string if Intl.DateTimeFormat fails
		return date.toISOString();
	}
}

/**
 * Format a date to a date and time string
 *
 * @param value - Date value (string, number, or Date)
 * @param options - Formatting options
 * @returns Date and time string or empty string if invalid
 *
 * @example
 * ```ts
 * formatDateTime(new Date('2024-01-15T14:30:00')); // "January 15, 2024 at 2:30 PM"
 * ```
 */
export function formatDateTime(value: DateValue, options: FormatDateOptions = {}): string {
	return formatDate(value, { ...options, includeTime: true });
}
