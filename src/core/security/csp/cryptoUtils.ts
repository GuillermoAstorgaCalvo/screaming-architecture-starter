/**
 * Crypto API Utilities
 *
 * Shared utilities for accessing the Web Crypto API across CSP modules.
 * These functions are exported for internal use within the CSP module only.
 * External code should use the public APIs in nonce.ts, hash.ts, and policy.ts.
 */

/**
 * Gets crypto API if available
 * Handles both browser and Node.js environments
 */
export function getCryptoApi(): Crypto | undefined {
	if ('crypto' in globalThis) {
		return globalThis.crypto;
	}
	if ('window' in globalThis) {
		return globalThis.window.crypto;
	}
	return undefined;
}

/**
 * Converts a Uint8Array of bytes to a base64 string
 * Uses String.fromCodePoint for byte values (0-255) in chunks to avoid
 * exceeding JavaScript's maximum argument limit (~65k arguments)
 * Note: For byte values 0-255, fromCodePoint and fromCharCode are equivalent
 *
 * @param bytes - Array of byte values (0-255)
 * @returns Base64-encoded string
 */
export function bytesToBase64(bytes: Uint8Array | number[]): string {
	// Convert bytes to binary string for base64 encoding
	// Process in chunks to avoid exceeding maximum argument limit
	// Using fromCodePoint for byte values 0-255 (equivalent to fromCharCode for this range)
	const CHUNK_SIZE = 8192; // Safe chunk size well below argument limit
	let binaryString = '';

	for (let i = 0; i < bytes.length; i += CHUNK_SIZE) {
		const chunk = bytes.slice(i, i + CHUNK_SIZE);
		binaryString += String.fromCodePoint(...chunk);
	}

	return btoa(binaryString);
}
