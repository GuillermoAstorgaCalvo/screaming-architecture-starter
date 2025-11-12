/**
 * Time formatting utilities
 *
 * Provides functions for formatting dates as time strings.
 * All functions are SSR-safe.
 */

import { toDate } from './date';
import type { DateValue, FormatTimeOptions } from './formatDate.types';

const HOURS_IN_12_HOUR_CLOCK = 12;

/**
 * Format a date to a time string.
 *
 * @param value - Date value (string, number, or Date)
 * @param options - Formatting options
 * @returns Time string or empty string if invalid
 *
 * @example
 * ```ts
 * formatTime(new Date('2024-01-15T14:30:00Z'), { timeZone: 'UTC' }); // "2:30 PM"
 * formatTime(new Date('2024-01-15T14:30:00Z'), { timeZone: 'UTC', hour12: false }); // "14:30"
 * formatTime(new Date('2024-01-15T14:30:45Z'), { timeZone: 'UTC', includeSeconds: true }); // "2:30:45 PM"
 * ```
 */
export function formatTime(value: DateValue, options: FormatTimeOptions = {}): string {
	const date = toDate(value);
	if (!date) {
		return '';
	}

	const { locale = 'en-US', timeZone, hour12 = true, includeSeconds = false } = options;

	const formatOptions: Intl.DateTimeFormatOptions = {
		hour: 'numeric',
		minute: '2-digit',
		second: includeSeconds ? '2-digit' : undefined,
		hour12,
		timeZone,
	};

	try {
		return new Intl.DateTimeFormat(locale, formatOptions).format(date);
	} catch {
		return formatTimeFallback(date, { includeSeconds, hour12 });
	}
}

interface FormatTimeFallbackOptions {
	includeSeconds: boolean;
	hour12: boolean;
}

function formatTimeFallback(date: Date, options: FormatTimeFallbackOptions): string {
	// Fallback formatting
	// Note: When Intl is unavailable we cannot reliably convert between timezones,
	// so we fall back to formatting the local Date instance.
	const { includeSeconds, hour12 } = options;
	const hours = date.getHours();
	const minutes = String(date.getMinutes()).padStart(2, '0');
	const seconds = includeSeconds ? `:${String(date.getSeconds()).padStart(2, '0')}` : '';

	if (hour12) {
		const ampm = hours >= HOURS_IN_12_HOUR_CLOCK ? 'PM' : 'AM';
		const displayHours = hours % HOURS_IN_12_HOUR_CLOCK || HOURS_IN_12_HOUR_CLOCK;
		return `${displayHours}:${minutes}${seconds} ${ampm}`;
	}

	const hours24 = String(hours).padStart(2, '0');
	return `${hours24}:${minutes}${seconds}`;
}
