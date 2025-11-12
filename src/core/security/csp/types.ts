/**
 * Content Security Policy (CSP) Types
 *
 * Type definitions for CSP-related functionality.
 *
 * @see .cursor/rules/security/security-privacy.mdc
 */

/**
 * Hash algorithms supported by CSP
 */
export type HashAlgorithm = 'sha256' | 'sha384' | 'sha512';

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
