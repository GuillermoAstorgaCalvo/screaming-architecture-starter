/**
 * HTTP Client URL Utilities
 *
 * Utilities for building and constructing URLs for HTTP requests.
 */

/**
 * Build the full URL from baseURL and path
 */
export function buildURL(url: string, baseURL?: string): string {
	if (url.startsWith('http://') || url.startsWith('https://')) {
		return url;
	}
	const base = baseURL ?? '';
	if (!base) {
		return url;
	}
	const baseTrimmed = base.endsWith('/') ? base.slice(0, -1) : base;
	const pathTrimmed = url.startsWith('/') ? url : `/${url}`;
	return `${baseTrimmed}${pathTrimmed}`;
}
