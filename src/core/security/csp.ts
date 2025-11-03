/**
 * Content Security Policy (CSP) Helpers
 *
 * Provides utilities for generating CSP nonces, hashes, and policy recommendations.
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
 *
 * // Generate SHA-256 hash for inline script
 * const hash = generateHash('console.log("hello");');
 * // Use in CSP: script-src 'sha256-{hash}'
 * ```
 *
 * @see .cursor/rules/security/security-privacy.mdc
 */

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
 * Gets crypto API if available
 */
function getCryptoApi(): Crypto | undefined {
	if ('crypto' in globalThis) {
		return globalThis.crypto;
	}
	if ('window' in globalThis) {
		return globalThis.window.crypto;
	}
	return undefined;
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
		const charCodes = Array.from(bytes);
		return btoa(String.fromCodePoint(...charCodes))
			.replaceAll('+', '-')
			.replaceAll('/', '_')
			.replace(/=+$/, '');
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

export function generateNonce(length: number = 16): string {
	validateNonceLength(length);

	const cryptoResult = generateNonceWithCrypto(length);
	if (cryptoResult) {
		return cryptoResult;
	}

	// Fallback for environments without crypto (less secure)
	// Note: This is NOT cryptographically secure and should only be used in development
	return generateNonceFallback(length);
}

/**
 * Hash algorithms supported by CSP
 */
export type HashAlgorithm = 'sha256' | 'sha384' | 'sha512';

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
 * const hash = generateHash('console.log("hello");');
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
		const encoder = new TextEncoder();
		const data = encoder.encode(content);
		const hashBuffer = await cryptoApi.subtle.digest(algorithm.toUpperCase(), data);
		const hashArray = Array.from(new Uint8Array(hashBuffer));
		const hashBase64 = btoa(String.fromCodePoint(...hashArray));
		return `${algorithm}-${hashBase64}`;
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

/**
 * CSP policy directives
 */
export interface CSPDirectives {
	'default-src'?: string[];
	'script-src'?: string[];
	'style-src'?: string[];
	'img-src'?: string[];
	'connect-src'?: string[];
	'font-src'?: string[];
	'object-src'?: string[];
	'media-src'?: string[];
	'frame-src'?: string[];
	'worker-src'?: string[];
	'manifest-src'?: string[];
	'base-uri'?: string[];
	'form-action'?: string[];
	'frame-ancestors'?: string[];
	'report-uri'?: string[];
	'report-to'?: string[];
	'upgrade-insecure-requests'?: boolean;
	'block-all-mixed-content'?: boolean;
}

/**
 * Validates nonce format
 */
function validateNonce(nonce: string | undefined | null): void {
	if (
		nonce !== undefined &&
		nonce !== null &&
		(typeof nonce !== 'string' || nonce.trim().length === 0)
	) {
		throw new Error('Nonce must be a non-empty string');
	}
}

/**
 * Builds directive value string with optional nonce
 */
function buildDirectiveValue(directive: string, values: string[], nonce?: string): string {
	let directiveValue = values.slice();

	// Add nonce to script-src and style-src if provided
	if (nonce && (directive === 'script-src' || directive === 'style-src')) {
		directiveValue = [`'nonce-${nonce}'`, ...directiveValue];
	}

	return directiveValue.join(' ');
}

/**
 * Processes a single directive into a CSP part
 */
function processDirective(
	directive: string,
	values: boolean | string[] | undefined | null,
	nonce?: string
): string | null {
	if (values === undefined || values === null) {
		return null;
	}

	// Handle boolean directives
	if (typeof values === 'boolean') {
		return values ? directive : null;
	}

	// Validate array values
	if (!Array.isArray(values)) {
		return null;
	}

	const directiveValue = buildDirectiveValue(directive, values, nonce);
	return directiveValue.length > 0 ? `${directive} ${directiveValue}` : null;
}

/**
 * Build a CSP header string from directives
 *
 * @param directives - CSP policy directives
 * @param nonce - Optional nonce to add to script-src and style-src
 * @returns CSP header value string
 *
 * @example
 * ```ts
 * const policy = buildCSPPolicy({
 *   'default-src': ["'self'"],
 *   'script-src': ["'self'", "'strict-dynamic'"],
 *   'style-src': ["'self'", "'unsafe-inline'"],
 * }, nonce);
 * // => "default-src 'self'; script-src 'self' 'nonce-...' 'strict-dynamic'; ..."
 * ```
 */
export function buildCSPPolicy(directives: CSPDirectives, nonce?: string): string {
	validateNonce(nonce);

	const parts: string[] = [];

	for (const [directive, values] of Object.entries(directives)) {
		const part = processDirective(directive, values, nonce);
		if (part) {
			parts.push(part);
		}
	}

	return parts.join('; ');
}

/**
 * Recommended minimal CSP policy for production
 *
 * This is a starting point - adjust based on your application's needs.
 * Start with Report-Only mode before enforcing.
 *
 * @param options - Configuration options
 * @param options.apiOrigin - Allowed API origin (default: 'self')
 * @param options.enableReportOnly - Use Report-Only mode (default: true for safety)
 * @param options.reportUri - Optional CSP report endpoint
 * @param options.nonce - Optional nonce for inline scripts/styles
 * @returns CSP policy string
 *
 * @example
 * ```ts
 * const policy = getRecommendedCSP({
 *   apiOrigin: 'https://api.example.com',
 *   enableReportOnly: true,
 *   reportUri: '/api/csp-report',
 *   nonce: generateNonce(),
 * });
 * ```
 */
export function getRecommendedCSP(
	options: {
		apiOrigin?: string;
		enableReportOnly?: boolean;
		reportUri?: string;
		nonce?: string;
	} = {}
): string {
	const { apiOrigin = "'self'", enableReportOnly = true, reportUri, nonce } = options;
	const connectSrc = apiOrigin === "'self'" ? [apiOrigin] : ["'self'", apiOrigin];

	const directives: CSPDirectives = {
		'default-src': ["'self'"],
		'script-src': ["'self'", "'strict-dynamic'"],
		'style-src': ["'self'", "'unsafe-inline'"], // Consider removing unsafe-inline in the future
		'img-src': ["'self'", 'data:', 'https:'],
		'connect-src': connectSrc,
		'font-src': ["'self'", 'data:'],
		'object-src': ["'none'"],
		'base-uri': ["'self'"],
		'form-action': ["'self'"],
		'frame-ancestors': ["'none'"],
		'upgrade-insecure-requests': true,
		...(reportUri && { 'report-uri': [reportUri] }),
	};

	const policy = buildCSPPolicy(directives, nonce);
	const headerName = enableReportOnly
		? 'Content-Security-Policy-Report-Only'
		: 'Content-Security-Policy';

	return `${headerName}: ${policy}`;
}

/**
 * Processes a boolean directive (no value)
 */
function processBooleanDirective(directiveName: string, directives: CSPDirectives): void {
	if (
		directiveName === 'upgrade-insecure-requests' ||
		directiveName === 'block-all-mixed-content'
	) {
		directives[directiveName] = true;
	}
}

/**
 * Processes a directive with values
 */
function processValueDirective(part: string, colonIndex: number, directives: CSPDirectives): void {
	const directive = part.slice(0, Math.max(0, colonIndex)).trim();
	const values = part
		.slice(Math.max(0, colonIndex + 1))
		.trim()
		.split(/\s+/)
		.filter(v => v.length > 0);

	if (values.length > 0) {
		(directives as Record<string, string[]>)[directive] = values;
	}
}

/**
 * Parse a CSP policy string into directives object
 * Useful for testing or policy manipulation
 *
 * @param policyString - CSP header value string
 * @returns Parsed CSP directives
 *
 * @example
 * ```ts
 * const directives = parseCSPPolicy("default-src 'self'; script-src 'self' 'nonce-abc'");
 * // => { 'default-src': ["'self'"], 'script-src': ["'self'", "'nonce-abc'"] }
 * ```
 */
/**
 * Process a single policy part
 */
function processPolicyPart(part: string, directives: CSPDirectives): void {
	const colonIndex = part.indexOf(' ');
	if (colonIndex === -1) {
		processBooleanDirective(part, directives);
	} else {
		processValueDirective(part, colonIndex, directives);
	}
}

export function parseCSPPolicy(policyString: string): CSPDirectives {
	if (!policyString || typeof policyString !== 'string') {
		return {};
	}

	const MAX_POLICY_LENGTH = 8192;
	if (policyString.length > MAX_POLICY_LENGTH) {
		return {};
	}

	const directives: CSPDirectives = {};
	const parts = policyString.split(';').map(part => part.trim());

	for (const part of parts) {
		if (part) {
			processPolicyPart(part, directives);
		}
	}

	return directives;
}
