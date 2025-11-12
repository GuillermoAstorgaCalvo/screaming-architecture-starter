/**
 * Content Security Policy (CSP) Helper Functions
 *
 * Internal helper functions for CSP policy building and parsing.
 * These functions are primarily used internally by policy building functions.
 */

import type { CSPDirectives } from './types';

/**
 * Builds directive value string with optional nonce
 */
export function buildDirectiveValue(directive: string, values: string[], nonce?: string): string {
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
export function processDirective(
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
 * Processes a boolean directive (no value)
 */
export function processBooleanDirective(directiveName: string, directives: CSPDirectives): void {
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
export function processValueDirective(
	part: string,
	colonIndex: number,
	directives: CSPDirectives
): void {
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
 * Process a single policy part
 */
export function processPolicyPart(part: string, directives: CSPDirectives): void {
	const colonIndex = part.indexOf(' ');
	if (colonIndex === -1) {
		processBooleanDirective(part, directives);
	} else {
		processValueDirective(part, colonIndex, directives);
	}
}
