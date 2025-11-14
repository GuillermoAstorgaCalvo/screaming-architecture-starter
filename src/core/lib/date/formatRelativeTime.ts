/**
 * Relative time formatting utilities
 *
 * Provides functions for formatting dates as relative time strings
 * (e.g., "2 hours ago", "in 3 days"). All functions are SSR-safe.
 */

import { toDate } from '@core/lib/date/date';
import type { DateValue } from '@core/lib/date/formatDate.types';

const MS_PER_SECOND = 1000;
const SECONDS_PER_MINUTE = 60;
const MINUTES_PER_HOUR = 60;
const HOURS_PER_DAY = 24;

/**
 * Relative time unit
 */
type RelativeTimeUnit = 'day' | 'hour' | 'minute' | 'second';

/**
 * Time differences for relative time calculation
 */
interface RelativeTimeDiffs {
	absDiffDays: number;
	absDiffHours: number;
	absDiffMinutes: number;
	absDiffSeconds: number;
	isPast: boolean;
}

/**
 * Get the pluralized unit name
 */
function getUnitName(unit: RelativeTimeUnit, count: number): string {
	if (unit === 'day') {
		return count === 1 ? 'day' : 'days';
	}
	if (unit === 'hour') {
		return count === 1 ? 'hour' : 'hours';
	}
	if (unit === 'minute') {
		return count === 1 ? 'minute' : 'minutes';
	}
	return 'seconds';
}

/**
 * Format relative time with fallback unit formatting
 */
function formatRelativeTimeFallbackUnit(
	absDiff: number,
	unit: RelativeTimeUnit,
	isPast: boolean
): string {
	if (absDiff === 0 && unit === 'second') {
		return isPast ? 'just now' : 'in a moment';
	}

	const unitName = getUnitName(unit, absDiff);
	return `${isPast ? '' : 'in '}${absDiff} ${unitName}${isPast ? ' ago' : ''}`;
}

/**
 * Format relative time using Intl.RelativeTimeFormat
 */
function formatRelativeTimeWithIntl(
	rtf: Intl.RelativeTimeFormat,
	diffs: RelativeTimeDiffs
): string {
	const { absDiffDays, absDiffHours, absDiffMinutes, absDiffSeconds, isPast } = diffs;

	if (absDiffDays > 0) {
		return rtf.format(isPast ? -absDiffDays : absDiffDays, 'day');
	}
	if (absDiffHours > 0) {
		return rtf.format(isPast ? -absDiffHours : absDiffHours, 'hour');
	}
	if (absDiffMinutes > 0) {
		return rtf.format(isPast ? -absDiffMinutes : absDiffMinutes, 'minute');
	}
	return rtf.format(isPast ? -absDiffSeconds : absDiffSeconds, 'second');
}

/**
 * Calculate time differences between date and now
 */
function calculateTimeDiffs(date: Date): RelativeTimeDiffs {
	const now = new Date();
	const diffMs = date.getTime() - now.getTime();
	const diffSeconds = Math.floor(diffMs / MS_PER_SECOND);
	const diffMinutes = Math.floor(diffSeconds / SECONDS_PER_MINUTE);
	const diffHours = Math.floor(diffMinutes / MINUTES_PER_HOUR);
	const diffDays = Math.floor(diffHours / HOURS_PER_DAY);

	return {
		absDiffSeconds: Math.abs(diffSeconds),
		absDiffMinutes: Math.abs(diffMinutes),
		absDiffHours: Math.abs(diffHours),
		absDiffDays: Math.abs(diffDays),
		isPast: diffMs < 0,
	};
}

/**
 * Format relative time with fallback (when Intl.RelativeTimeFormat is not available)
 */
function formatRelativeTimeFallback(diffs: RelativeTimeDiffs): string {
	const { absDiffDays, absDiffHours, absDiffMinutes, absDiffSeconds, isPast } = diffs;

	if (absDiffDays > 0) {
		return formatRelativeTimeFallbackUnit(absDiffDays, 'day', isPast);
	}
	if (absDiffHours > 0) {
		return formatRelativeTimeFallbackUnit(absDiffHours, 'hour', isPast);
	}
	if (absDiffMinutes > 0) {
		return formatRelativeTimeFallbackUnit(absDiffMinutes, 'minute', isPast);
	}
	return formatRelativeTimeFallbackUnit(absDiffSeconds, 'second', isPast);
}

/**
 * Format a date to relative time (e.g., "2 hours ago", "in 3 days")
 *
 * @param value - Date value (string, number, or Date)
 * @param options - Formatting options
 * @returns Relative time string or empty string if invalid
 *
 * @example
 * ```ts
 * formatRelativeTime(new Date(Date.now() - 2 * 60 * 60 * 1000)); // "2 hours ago"
 * formatRelativeTime(new Date(Date.now() + 1 * 24 * 60 * 60 * 1000)); // "in 1 day"
 * ```
 */
export function formatRelativeTime(value: DateValue, options: { locale?: string } = {}): string {
	const date = toDate(value);
	if (!date) {
		return '';
	}

	const { locale = 'en-US' } = options;
	const diffs = calculateTimeDiffs(date);

	try {
		const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
		return formatRelativeTimeWithIntl(rtf, diffs);
	} catch {
		return formatRelativeTimeFallback(diffs);
	}
}
