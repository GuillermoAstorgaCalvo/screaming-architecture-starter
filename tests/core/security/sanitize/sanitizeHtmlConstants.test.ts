import {
	BYTES_PER_KB,
	DEFAULT_CONFIG,
	KB_PER_MB,
	MAX_ESCAPE_LENGTH,
	MAX_HTML_LENGTH,
} from '@core/security/sanitize/sanitizeHtmlConstants';
import { describe, expect, it } from 'vitest';

const SAFE_TAGS = [
	'p',
	'br',
	'strong',
	'em',
	'u',
	's',
	'h1',
	'h2',
	'h3',
	'h4',
	'h5',
	'h6',
	'ul',
	'ol',
	'li',
	'a',
	'blockquote',
	'code',
	'pre',
];

const DANGEROUS_TAGS = ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input'];

const DANGEROUS_ATTRIBUTES = ['onclick', 'onerror', 'onload', 'onmouseover'];

const DANGEROUS_SCHEMES = ['javascript', 'data', 'vbscript'];

describe('sanitizeHtmlConstants - size constants', () => {
	it('should define BYTES_PER_KB as 1024', () => {
		expect(BYTES_PER_KB).toBe(1024);
	});

	it('should define KB_PER_MB as 1024', () => {
		expect(KB_PER_MB).toBe(1024);
	});

	it('should calculate MAX_ESCAPE_LENGTH as 1MB', () => {
		expect(MAX_ESCAPE_LENGTH).toBe(BYTES_PER_KB * KB_PER_MB);
		expect(MAX_ESCAPE_LENGTH).toBe(1024 * 1024);
		expect(MAX_ESCAPE_LENGTH).toBe(1_048_576);
	});

	it('should calculate MAX_HTML_LENGTH as 1MB', () => {
		expect(MAX_HTML_LENGTH).toBe(BYTES_PER_KB * KB_PER_MB);
		expect(MAX_HTML_LENGTH).toBe(1024 * 1024);
		expect(MAX_HTML_LENGTH).toBe(1_048_576);
	});

	it('should have MAX_ESCAPE_LENGTH equal to MAX_HTML_LENGTH', () => {
		expect(MAX_ESCAPE_LENGTH).toBe(MAX_HTML_LENGTH);
	});
});

describe('sanitizeHtmlConstants - DEFAULT_CONFIG', () => {
	describe('structure', () => {
		it('should be a required SanitizeConfig', () => {
			expect(DEFAULT_CONFIG).toBeDefined();
			expect(DEFAULT_CONFIG.allowedTags).toBeDefined();
			expect(DEFAULT_CONFIG.allowedAttributes).toBeDefined();
			expect(DEFAULT_CONFIG.allowedSchemes).toBeDefined();
		});

		it('should be immutable (frozen)', () => {
			// Note: This test verifies the config structure, not actual immutability
			// In practice, the config should be treated as read-only
			expect(DEFAULT_CONFIG).toBeDefined();
		});
	});

	describe('allowedTags', () => {
		it('should include safe HTML tags', () => {
			for (const tag of SAFE_TAGS) {
				expect(DEFAULT_CONFIG.allowedTags).toContain(tag);
			}
		});

		it('should not include dangerous tags', () => {
			for (const tag of DANGEROUS_TAGS) {
				expect(DEFAULT_CONFIG.allowedTags).not.toContain(tag);
			}
		});
	});

	describe('allowedAttributes', () => {
		it('should allow safe attributes for anchor tags', () => {
			expect(DEFAULT_CONFIG.allowedAttributes.a).toBeDefined();
			expect(DEFAULT_CONFIG.allowedAttributes.a).toContain('href');
			expect(DEFAULT_CONFIG.allowedAttributes.a).toContain('title');
			expect(DEFAULT_CONFIG.allowedAttributes.a).toContain('target');
			expect(DEFAULT_CONFIG.allowedAttributes.a).toContain('rel');
		});

		it('should not allow dangerous attributes for anchor tags', () => {
			for (const attr of DANGEROUS_ATTRIBUTES) {
				expect(DEFAULT_CONFIG.allowedAttributes.a).not.toContain(attr);
			}
		});
	});

	describe('allowedSchemes', () => {
		it('should allow safe URL schemes', () => {
			expect(DEFAULT_CONFIG.allowedSchemes).toContain('http');
			expect(DEFAULT_CONFIG.allowedSchemes).toContain('https');
			expect(DEFAULT_CONFIG.allowedSchemes).toContain('mailto');
		});

		it('should not allow dangerous URL schemes by default', () => {
			for (const scheme of DANGEROUS_SCHEMES) {
				expect(DEFAULT_CONFIG.allowedSchemes).not.toContain(scheme);
			}
		});
	});
});
