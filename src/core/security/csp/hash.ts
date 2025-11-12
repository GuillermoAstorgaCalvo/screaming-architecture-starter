/**
 * Content Security Policy (CSP) Hash Generation
 *
 * Provides utilities for generating CSP hashes for inline content.
 *
 * Framework Agnostic:
 * This utility is in `core/security/` because it:
 * - Has no framework dependencies
 * - Provides CSP-related security utilities
 * - Can be used in server-side rendering or client-side contexts
 *
 * Security Principles:
 * - Prefer hashes for static inline content
 * - Generate hashes at build time when possible
 * - Use nonces for dynamic content
 *
 * @example
 * ```ts
 * // Generate SHA-256 hash for inline script
 * const hash = await generateHash('console.log("hello");');
 * // Use in CSP: script-src 'sha256-{hash}'
 * ```
 *
 * @see .cursor/rules/security/security-privacy.mdc
 */

import { bytesToBase64, getCryptoApi } from './cryptoUtils';
import type { HashAlgorithm } from './types';

/**
 * Type-safe conversion from HashAlgorithm to Web Crypto API algorithm names
 */
const CRYPTO_ALGORITHM_MAP: Record<HashAlgorithm, 'SHA-256' | 'SHA-384' | 'SHA-512'> = {
	sha256: 'SHA-256',
	sha384: 'SHA-384',
	sha512: 'SHA-512',
};

/**
 * Generates hash using Web Crypto API
 */
async function generateHashWithCrypto(
	content: string,
	algorithm: HashAlgorithm,
	cryptoApi: Crypto
): Promise<string> {
	const encoder = new TextEncoder();
	const data = encoder.encode(content);
	const cryptoAlgorithm = CRYPTO_ALGORITHM_MAP[algorithm];
	const hashBuffer = await cryptoApi.subtle.digest(cryptoAlgorithm, data);
	const hashArray = new Uint8Array(hashBuffer);
	const hashBase64 = bytesToBase64(hashArray);
	return `${algorithm}-${hashBase64}`;
}

/**
 * Generate a CSP hash for inline content
 *
 * CSP hashes allow you to whitelist specific inline scripts or styles
 * without using nonces or unsafe-inline. This is preferred for static content.
 *
 * @param content - The inline script or style content
 * @param algorithm - Hash algorithm to use (default: 'sha256')
 * @returns Base64-encoded hash prefixed with algorithm name
 *
 * @example
 * ```ts
 * const hash = await generateHash('console.log("hello");');
 * // => 'sha256-abc123...'
 *
 * // Use in CSP header:
 * // script-src 'self' 'sha256-abc123...'
 * ```
 */
export async function generateHash(
	content: string,
	algorithm: HashAlgorithm = 'sha256'
): Promise<string> {
	if (!content || typeof content !== 'string') {
		throw new Error('Content must be a non-empty string');
	}

	const cryptoApi = getCryptoApi();
	if (!cryptoApi?.subtle) {
		throw new Error('SubtleCrypto not available. Generate hashes server-side or at build time.');
	}

	try {
		return await generateHashWithCrypto(content, algorithm, cryptoApi);
	} catch (error) {
		// Note: In environments without SubtleCrypto, you would need to:
		// 1. Generate hashes at build time
		// 2. Use a Node.js crypto module server-side
		// 3. Or fall back to nonces
		throw new Error(
			`Failed to generate hash: ${error instanceof Error ? error.message : String(error)}. Generate hashes server-side or at build time.`
		);
	}
}

/**
 * Synchronous hash generation (not available in browser)
 *
 * **Note**: This function always throws an error because the Web Crypto API's
 * digest operation is asynchronous. This placeholder exists for API consistency.
 *
 * **Alternatives**:
 * - Use `generateHash()` (async) for runtime hash generation
 * - Generate hashes at build time using Node.js crypto module
 * - Generate hashes server-side and include in your build output
 *
 * @param _content - The inline script or style content
 * @param _algorithm - Hash algorithm to use (default: 'sha256')
 * @returns Never returns (always throws)
 * @throws Error indicating that synchronous hashing is not available
 *
 * @example
 * ```ts
 * // ❌ This will throw an error
 * const hash = generateHashSync('console.log("hello");');
 *
 * // ✅ Use async version instead
 * const hash = await generateHash('console.log("hello");');
 * ```
 */
export function generateHashSync(_content: string, _algorithm: HashAlgorithm = 'sha256'): string {
	throw new Error(
		'generateHashSync is not available in browser. Use generateHash (async) or generate hashes at build time/server-side.'
	);
}
