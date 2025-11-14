/**
 * Shared types for date formatting utilities
 */

/**
 * Date value that can be converted to a Date object
 */
export type DateValue = string | number | Date | null | undefined;

/**
 * Options for date formatting
 */
export interface FormatDateOptions {
	/**
	 * Locale to use for formatting (default: 'en-US')
	 */
	locale?: string;
	/**
	 * Timezone (default: user's timezone)
	 */
	timeZone?: string;
	/**
	 * Whether to include time (default: false)
	 */
	includeTime?: boolean;
	/**
	 * Whether to use short format (default: false)
	 */
	short?: boolean;
}

/**
 * Options for time formatting
 */
export interface FormatTimeOptions {
	/**
	 * Locale to use for formatting (default: 'en-US')
	 */
	locale?: string;
	/**
	 * Timezone (default: user's timezone)
	 */
	timeZone?: string;
	/**
	 * Whether to use 12-hour clock (default: true)
	 */
	hour12?: boolean;
	/**
	 * Whether to include seconds (default: false)
	 */
	includeSeconds?: boolean;
}
