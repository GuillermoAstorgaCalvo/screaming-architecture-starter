import { addDays, toUTCString } from '@core/lib/date/date';
import type { CookieOptions } from '@src-types/ports';

import {
	COOKIE_DELETE_EXPIRATION,
	getDefaultCookieOptions,
} from './cookieStorageAdapter.constants';

/**
 * Cookie serialization utilities
 *
 * Functions for serializing cookie options and values into cookie string format.
 */

/**
 * Calculate expiration date from days
 *
 * @param expiresDays - Number of days until expiration
 * @returns UTC string representation of expiration date
 */
export function calculateExpirationDate(expiresDays: number): string {
	const expirationDate = addDays(new Date(), expiresDays);
	return toUTCString(expirationDate);
}

/**
 * Serialize expiration option
 *
 * @param expiresDays - Number of days until expiration (undefined, 0, or negative to delete)
 * @param parts - Array to append expiration string to
 */
export function serializeExpiration(expiresDays: number | undefined, parts: string[]): void {
	if (expiresDays === undefined) {
		return;
	}

	if (expiresDays <= 0) {
		// Delete cookie by setting expiration in the past
		parts.push(`expires=${COOKIE_DELETE_EXPIRATION}`);
	} else {
		const expirationDate = calculateExpirationDate(expiresDays);
		parts.push(`expires=${expirationDate}`);
	}
}

/**
 * Serialize cookie options into cookie string format
 *
 * @param options - Cookie options to serialize
 * @returns Serialized cookie options string (e.g., "; path=/; secure; sameSite=Lax")
 */
export function serializeCookieOptions(options: CookieOptions = {}): string {
	const parts: string[] = [];
	const opts: CookieOptions = {
		...getDefaultCookieOptions(),
		...options,
	};

	serializeExpiration(opts.expiresDays, parts);

	if (opts.path) {
		parts.push(`path=${opts.path}`);
	}

	if (opts.domain) {
		parts.push(`domain=${opts.domain}`);
	}

	if (opts.sameSite) {
		parts.push(`sameSite=${opts.sameSite}`);
	}

	if (opts.secure) {
		parts.push('secure');
	}

	return parts.length > 0 ? `; ${parts.join('; ')}` : '';
}
