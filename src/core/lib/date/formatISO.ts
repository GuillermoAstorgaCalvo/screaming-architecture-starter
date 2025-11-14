/**
 * ISO date formatting utilities
 *
 * Provides functions for formatting dates as ISO strings.
 * All functions are SSR-safe.
 */

import { toDate } from '@core/lib/date/date';
import type { DateValue } from '@core/lib/date/formatDate.types';

/**
 * Format a date to ISO string (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss.sssZ)
 *
 * @param value - Date value (string, number, or Date)
 * @param includeTime - Whether to include time (default: false)
 * @returns ISO string or empty string if invalid
 *
 * @example
 * ```ts
 * formatISO(new Date('2024-01-15')); // "2024-01-15"
 * formatISO(new Date('2024-01-15T14:30:00'), true); // "2024-01-15T14:30:00.000Z"
 * ```
 */
export function formatISO(value: DateValue, includeTime = false): string {
	const date = toDate(value);
	if (!date) {
		return '';
	}

	if (includeTime) {
		return date.toISOString();
	}

	// Format as YYYY-MM-DD
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
}
