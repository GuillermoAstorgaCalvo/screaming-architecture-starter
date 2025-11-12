/**
 * Cookie parsing utilities
 *
 * Functions for parsing cookie strings into key-value pairs.
 * Handles URL decoding and edge cases like values containing '='.
 */

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
	for (const cookiePair of cookieStrings) {
		const [key, ...valueParts] = cookiePair.trim().split('=');
		if (key) {
			const value = valueParts.join('='); // Handle values that contain '='
			cookies.set(key, decodeURIComponent(value || ''));
		}
	}

	return cookies;
}
