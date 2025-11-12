/**
 * Content Security Policy (CSP) Nonce Generation
 *
 * Provides utilities for generating cryptographically secure nonces for CSP.
 *
 * Framework Agnostic:
 * This utility is in `core/security/` because it:
 * - Has no framework dependencies
 * - Provides CSP-related security utilities
 * - Can be used in server-side rendering or client-side contexts
 *
 * Security Principles:
 * - Generate unique nonces per request/response
 * - Prefer hashes for static inline content
 * - Start with Report-Only mode before enforcing
 * - Use strict-dynamic for scripts when possible
 *
 * @example
 * ```ts
 * // Generate a nonce for inline scripts
 * const nonce = generateNonce();
 * // Use: <script nonce={nonce}>...</script>
 * ```
 *
 * @see .cursor/rules/security/security-privacy.mdc
 */

import { bytesToBase64, getCryptoApi } from './cryptoUtils';

/**
 * Maximum recommended nonce length (256 bytes)
 * Very long nonces can cause performance issues in CSP headers
 */
const MAX_NONCE_LENGTH = 256;

/**
 * Validates nonce length
 */
function validateNonceLength(length: number): void {
	if (length <= 0 || !Number.isInteger(length)) {
		throw new Error('Nonce length must be a positive integer');
	}
	if (length > MAX_NONCE_LENGTH) {
		throw new Error(`Nonce length must not exceed ${MAX_NONCE_LENGTH} bytes`);
	}
}

/**
 * Generates nonce using crypto API
 */
function generateNonceWithCrypto(length: number): string | null {
	const cryptoApi = getCryptoApi();
	if (!cryptoApi?.getRandomValues) {
		return null;
	}

	try {
		const bytes = new Uint8Array(length);
		cryptoApi.getRandomValues(bytes);
		// Convert bytes to base64, then make URL-safe (base64url encoding)
		return bytesToBase64(bytes).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');
	} catch {
		return null;
	}
}

/**
 * Generates nonce using fallback method (less secure)
 */
function generateNonceFallback(length: number): string {
	let result = '';
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
	for (let i = 0; i < length * 2; i++) {
		result += characters.charAt(Math.floor(Math.random() * characters.length));
	}
	return result;
}

/**
 * Generate a cryptographically secure random nonce for CSP
 *
 * Nonces should be:
 * - Generated per request/response (unique each time)
 * - Included in the CSP header
 * - Added as an attribute to allowed inline scripts/styles
 *
 * @param length - Length of the nonce in bytes (default: 16)
 * @returns Base64-encoded nonce string
 *
 * @example
 * ```ts
 * const nonce = generateNonce();
 * // => 'aB3cD4eF5gH6iJ7kL8mN9oP0qR1sT2u'
 * ```
 */
export function generateNonce(length: number = 16): string {
	validateNonceLength(length);

	const cryptoResult = generateNonceWithCrypto(length);
	if (cryptoResult) {
		return cryptoResult;
	}

	// ⚠️ SECURITY WARNING: Fallback for environments without crypto (NOT cryptographically secure)
	// This fallback uses Math.random() which is NOT suitable for production use.
	// Only use this in development environments. For production, ensure Web Crypto API is available
	// or generate nonces server-side.
	return generateNonceFallback(length);
}

/**
 * Validates nonce format
 */
export function validateNonce(nonce: string | undefined | null): void {
	// Allow undefined/null (nonce is optional)
	if (nonce === undefined || nonce === null) {
		return;
	}

	// If provided, must be a non-empty string
	if (typeof nonce !== 'string' || nonce.trim().length === 0) {
		throw new Error('Nonce must be a non-empty string');
	}
}
