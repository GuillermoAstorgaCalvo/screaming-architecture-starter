/**
 * Cookie parsing utilities
 *
 * Functions for parsing cookie strings into key-value pairs.
 * Handles URL decoding and edge cases like values containing '='.
 */

/**
 * Known cookie attributes that should be ignored when parsing
 * These are not actual cookie key-value pairs but metadata
 */
const COOKIE_ATTRIBUTES = new Set([
	'path',
	'domain',
	'expires',
	'max-age',
	'secure',
	'httpOnly',
	'sameSite',
	'samesite',
]);

/**
 * Check if cookie string contains malformed entries (entries starting with '=')
 */
function hasMalformedEntries(cookieStrings: string[]): boolean {
	return cookieStrings.some(pair => {
		const trimmed = pair.trim();
		return trimmed.startsWith('=');
	});
}

/**
 * Parse a single cookie pair and add to map if valid
 */
function parseCookiePair(
	cookiePair: string,
	cookies: Map<string, string>,
	hasMalformed: boolean
): void {
	const trimmed = cookiePair.trim();
	if (!trimmed) {
		return;
	}

	const equalIndex = trimmed.indexOf('=');
	// Skip cookies without '=' (no value, likely an attribute or malformed)
	if (equalIndex === -1) {
		return;
	}

	const key = trimmed.slice(0, equalIndex).trim();
	const value = trimmed.slice(equalIndex + 1).trim();

	// Skip empty keys or known cookie attributes
	if (!key || COOKIE_ATTRIBUTES.has(key.toLowerCase())) {
		return;
	}

	// Skip cookies with empty values when string contains malformed entries
	if (hasMalformed && !value) {
		return;
	}

	// Only include cookies with valid keys
	cookies.set(key, decodeURIComponent(value || ''));
}

/**
 * Parse cookie string into key-value pairs
 *
 * @param cookieString - The document.cookie string to parse
 * @returns Map of cookie key-value pairs
 *
 * @example
 * ```ts
 * const cookies = parseCookies('key1=value1; key2=value2');
 * cookies.get('key1'); // 'value1'
 * ```
 */
export function parseCookies(cookieString?: string): Map<string, string> {
	const cookies = new Map<string, string>();
	if (!cookieString) {
		return cookies;
	}

	const cookieStrings = cookieString.split(';');
	const hasMalformed = hasMalformedEntries(cookieStrings);

	for (const cookiePair of cookieStrings) {
		parseCookiePair(cookiePair, cookies, hasMalformed);
	}

	return cookies;
}
