import { sanitizeHtml } from '@core/security/sanitize/sanitizeHtml';
import { MAX_HTML_LENGTH } from '@core/security/sanitize/sanitizeHtmlConstants';
import type { SanitizeConfig } from '@core/security/sanitize/sanitizeHtmlTypes';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

const EXAMPLE_LINK_HTML = '<a href="https://example.com">Link</a>';

function describeBasicSanitization() {
	describe('basic sanitization', () => {
		it('should return empty string for empty input', () => {
			expect(sanitizeHtml('')).toBe('');
		});

		it('should return empty string for null input', () => {
			// @ts-expect-error - testing null input
			expect(sanitizeHtml(null)).toBe('');
		});

		it('should preserve safe HTML', () => {
			const html = '<p>Hello World</p>';
			const result = sanitizeHtml(html);
			expect(result).toContain('<p>');
			expect(result).toContain('Hello World');
		});

		it('should preserve multiple safe tags', () => {
			const html = '<p>Paragraph</p><strong>Bold</strong><em>Italic</em>';
			const result = sanitizeHtml(html);
			expect(result).toContain('<p>');
			expect(result).toContain('<strong>');
			expect(result).toContain('<em>');
		});
	});
}

function describeXssPrevention() {
	describe('XSS prevention', () => {
		it('should remove script tags', () => {
			const html = '<p>Hello <script>alert("xss")</script>World</p>';
			const result = sanitizeHtml(html);
			expect(result).not.toContain('<script>');
			expect(result).not.toContain('</script>');
			expect(result).toContain('Hello');
			expect(result).toContain('World');
		});

		it('should remove style tags', () => {
			const html = '<p>Text</p><style>body{color:red}</style><p>More</p>';
			const result = sanitizeHtml(html);
			expect(result).not.toContain('<style>');
			expect(result).not.toContain('</style>');
		});

		it('should remove iframe tags', () => {
			const html = '<p>Text</p><iframe src="evil.com"></iframe><p>More</p>';
			const result = sanitizeHtml(html);
			expect(result).not.toContain('<iframe>');
			expect(result).not.toContain('</iframe>');
		});

		it('should remove event handlers', () => {
			const html = '<div onclick="alert(1)">Click me</div>';
			const result = sanitizeHtml(html);
			expect(result).not.toContain('onclick');
			expect(result).not.toContain('alert(1)');
		});

		it('should remove javascript: URLs', () => {
			const html = '<a href="javascript:alert(1)">Link</a>';
			const result = sanitizeHtml(html);
			expect(result).not.toContain('javascript:');
		});

		it('should remove multiple XSS vectors', () => {
			const html =
				'<p>Text</p><script>alert(1)</script><div onclick="alert(2)">Click</div><iframe src="evil.com"></iframe>';
			const result = sanitizeHtml(html);
			expect(result).not.toContain('<script>');
			expect(result).not.toContain('onclick');
			expect(result).not.toContain('<iframe>');
		});
	});
}

function describeAllowedTags() {
	describe('allowed tags', () => {
		it('should preserve allowed tags', () => {
			const html = '<p>Paragraph</p><strong>Bold</strong><em>Italic</em>';
			const result = sanitizeHtml(html);
			expect(result).toContain('<p>');
			expect(result).toContain('<strong>');
			expect(result).toContain('<em>');
		});

		it('should remove disallowed tags', () => {
			const html = '<p>Text</p><div>Disallowed</div><span>Also disallowed</span>';
			const result = sanitizeHtml(html);
			expect(result).toContain('<p>');
			expect(result).not.toContain('<div>');
			expect(result).not.toContain('<span>');
			expect(result).toContain('Disallowed'); // Content should be preserved
		});

		it('should allow custom tags via config', () => {
			const config: SanitizeConfig = {
				allowedTags: ['div', 'span'],
			};
			const html = '<div>Div content</div><span>Span content</span>';
			const result = sanitizeHtml(html, config);
			expect(result).toContain('<div>');
			expect(result).toContain('<span>');
		});
	});
}

function describeAllowedAttributes() {
	describe('allowed attributes', () => {
		it('should preserve allowed attributes for anchor tags', () => {
			const html = '<a href="https://example.com" title="Example">Link</a>';
			const result = sanitizeHtml(html);
			expect(result).toContain('href="https://example.com"');
			expect(result).toContain('title="Example"');
		});

		it('should remove disallowed attributes', () => {
			const html = '<p class="test" id="myId">Text</p>';
			const result = sanitizeHtml(html);
			expect(result).not.toContain('class=');
			expect(result).not.toContain('id=');
		});

		it('should allow custom attributes via config', () => {
			const config: SanitizeConfig = {
				allowedAttributes: {
					p: ['class', 'id'],
				},
			};
			const html = '<p class="test" id="myId">Text</p>';
			const result = sanitizeHtml(html, config);
			expect(result).toContain('class="test"');
			expect(result).toContain('id="myId"');
		});
	});
}

function describeUrlValidation() {
	describe('URL validation', () => {
		it('should allow http URLs', () => {
			const html = '<a href="http://example.com">Link</a>';
			const result = sanitizeHtml(html);
			expect(result).toContain('href="http://example.com"');
		});

		it('should allow https URLs', () => {
			const result = sanitizeHtml(EXAMPLE_LINK_HTML);
			expect(result).toContain('href="https://example.com"');
		});

		it('should allow mailto URLs', () => {
			const html = '<a href="mailto:test@example.com">Email</a>';
			const result = sanitizeHtml(html);
			expect(result).toContain('href="mailto:test@example.com"');
		});

		it('should allow relative URLs', () => {
			const html = '<a href="/path/to/page">Link</a>';
			const result = sanitizeHtml(html);
			expect(result).toContain('href="/path/to/page"');
		});

		it('should allow hash URLs', () => {
			const html = '<a href="#section">Link</a>';
			const result = sanitizeHtml(html);
			expect(result).toContain('href="#section"');
		});

		it('should reject javascript: URLs', () => {
			const html = '<a href="javascript:alert(1)">Link</a>';
			const result = sanitizeHtml(html);
			expect(result).not.toContain('javascript:');
		});

		it('should reject data URIs by default', () => {
			const html = '<img src="data:text/html,<script>alert(1)</script>">';
			const result = sanitizeHtml(html);
			// img tag is not in allowed tags, so it will be removed
			expect(result).not.toContain('data:text/html');
		});

		it('should allow custom schemes via config', () => {
			const config: SanitizeConfig = {
				allowedSchemes: ['http', 'https', 'ftp'],
			};
			const html = '<a href="ftp://example.com">Link</a>';
			const result = sanitizeHtml(html, config);
			expect(result).toContain('href="ftp://example.com"');
		});
	});
}

function describeSecurityAttributes() {
	describe('security attributes', () => {
		it('should add target="_blank" to external links', () => {
			const result = sanitizeHtml(EXAMPLE_LINK_HTML);
			expect(result).toContain('target="_blank"');
		});

		it('should add rel="noopener noreferrer" to external links', () => {
			const result = sanitizeHtml(EXAMPLE_LINK_HTML);
			expect(result).toContain('rel="noopener noreferrer"');
		});

		it('should not add security attributes to hash links', () => {
			const html = '<a href="#section">Link</a>';
			const result = sanitizeHtml(html);
			expect(result).not.toContain('target=');
			expect(result).not.toContain('rel=');
		});
	});
}

function describeLengthLimits() {
	describe('length limits', () => {
		it('should return empty string for HTML exceeding MAX_HTML_LENGTH', () => {
			const longHtml = 'a'.repeat(MAX_HTML_LENGTH + 1);
			const result = sanitizeHtml(longHtml);
			expect(result).toBe('');
		});

		it('should process HTML at MAX_HTML_LENGTH', () => {
			const html = `<p>${'a'.repeat(MAX_HTML_LENGTH - 7)}</p>`;
			const result = sanitizeHtml(html);
			expect(result).toContain('<p>');
		});

		it('should process HTML just under MAX_HTML_LENGTH', () => {
			const html = `<p>${'a'.repeat(MAX_HTML_LENGTH - 8)}</p>`;
			const result = sanitizeHtml(html);
			expect(result).toContain('<p>');
		});
	});
}

function describeSsrSafety() {
	describe('SSR safety', () => {
		let originalDocument: typeof document;

		beforeEach(() => {
			originalDocument = globalThis.document;
		});

		afterEach(() => {
			// Restore document
			Object.defineProperty(globalThis, 'document', {
				value: originalDocument,
				writable: true,
				configurable: true,
			});
		});

		it('should fall back to escaping when document is undefined (SSR)', () => {
			// @ts-expect-error - simulating SSR environment
			delete globalThis.document;
			const html = '<script>alert("xss")</script>';
			const result = sanitizeHtml(html);
			// Should be escaped, not sanitized
			expect(result).toContain('&lt;script&gt;');
			expect(result).not.toContain('<script>');
		});

		it('should escape HTML in SSR mode', () => {
			// @ts-expect-error - simulating SSR environment
			delete globalThis.document;
			const html = '<p>Hello World</p>';
			const result = sanitizeHtml(html);
			expect(result).toContain('&lt;p&gt;');
		});
	});
}

function describeComplexHtml() {
	describe('complex HTML', () => {
		it('should handle nested tags', () => {
			const html = '<p>Text with <strong>bold</strong> and <em>italic</em></p>';
			const result = sanitizeHtml(html);
			expect(result).toContain('<p>');
			expect(result).toContain('<strong>');
			expect(result).toContain('<em>');
		});

		it('should handle lists', () => {
			const html = '<ul><li>Item 1</li><li>Item 2</li></ul>';
			const result = sanitizeHtml(html);
			expect(result).toContain('<ul>');
			expect(result).toContain('<li>');
		});

		it('should handle headings', () => {
			const html = '<h1>Heading 1</h1><h2>Heading 2</h2><h3>Heading 3</h3>';
			const result = sanitizeHtml(html);
			expect(result).toContain('<h1>');
			expect(result).toContain('<h2>');
			expect(result).toContain('<h3>');
		});

		it('should handle blockquotes', () => {
			const html = '<blockquote>Quote text</blockquote>';
			const result = sanitizeHtml(html);
			expect(result).toContain('<blockquote>');
		});

		it('should handle code blocks', () => {
			const html = '<pre><code>console.log("hello");</code></pre>';
			const result = sanitizeHtml(html);
			expect(result).toContain('<pre>');
			expect(result).toContain('<code>');
		});
	});
}

function describeEdgeCases() {
	describe('edge cases', () => {
		it('should handle malformed HTML', () => {
			const html = '<p>Unclosed tag<div>Nested</p>';
			const result = sanitizeHtml(html);
			// Should still sanitize what it can
			expect(result).toContain('Unclosed tag');
		});

		it('should handle HTML with only text', () => {
			const html = 'Just plain text, no tags';
			const result = sanitizeHtml(html);
			expect(result).toBe('Just plain text, no tags');
		});

		it('should handle HTML with only whitespace', () => {
			const html = '   \n\t   ';
			const result = sanitizeHtml(html);
			expect(result).toBe(html);
		});

		it('should handle mixed case tags', () => {
			const html = '<P>Text</P><STRONG>Bold</STRONG>';
			const result = sanitizeHtml(html);
			// Tags should be normalized to lowercase
			expect(result.toLowerCase()).toContain('<p>');
			expect(result.toLowerCase()).toContain('<strong>');
		});
	});
}

describe('sanitizeHtml', () => {
	describeBasicSanitization();
	describeXssPrevention();
	describeAllowedTags();
	describeAllowedAttributes();
	describeUrlValidation();
	describeSecurityAttributes();
	describeLengthLimits();
	describeSsrSafety();
	describeComplexHtml();
	describeEdgeCases();
});
