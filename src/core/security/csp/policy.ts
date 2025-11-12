/**
 * Content Security Policy (CSP) Policy Building and Parsing
 *
 * Provides utilities for building and parsing CSP policies.
 *
 * Framework Agnostic:
 * This utility is in `core/security/` because it:
 * - Has no framework dependencies
 * - Provides CSP-related security utilities
 * - Can be used in server-side rendering or client-side contexts
 *
 * Security Principles:
 * - Start with Report-Only mode before enforcing
 * - Use strict-dynamic for scripts when possible
 * - Prefer nonces or hashes over unsafe-inline
 *
 * @example
 * ```ts
 * // Build a custom CSP policy
 * const policy = buildCSPPolicy({
 *   'default-src': ["'self'"],
 *   'script-src': ["'self'", "'strict-dynamic'"],
 * }, nonce);
 *
 * // Get recommended CSP
 * const recommendedPolicy = getRecommendedCSP({
 *   apiOrigin: 'https://api.example.com',
 *   nonce: generateNonce(),
 * });
 * ```
 *
 * @see .cursor/rules/security/security-privacy.mdc
 */

import { processDirective, processPolicyPart } from './helpers';
import { validateNonce } from './nonce';
import type { CSPDirectives } from './types';

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
 * Maximum CSP policy string length (8KB)
 * Prevents DoS attacks via extremely long policy strings
 */
const MAX_POLICY_LENGTH = 8192;

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
export function parseCSPPolicy(policyString: string): CSPDirectives {
	if (!policyString || typeof policyString !== 'string') {
		return {};
	}

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
