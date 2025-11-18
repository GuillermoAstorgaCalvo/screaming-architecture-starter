import { MAX_ESCAPE_LENGTH } from '@core/security/sanitize/sanitizeHtmlConstants';
import { escapeHtml } from '@core/security/sanitize/sanitizeHtmlEscape';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

describe('escapeHtml - basic HTML escaping', () => {
	it('should escape less-than sign', () => {
		expect(escapeHtml('<')).toBe('&lt;');
	});

	it('should escape greater-than sign', () => {
		expect(escapeHtml('>')).toBe('&gt;');
	});

	it('should escape ampersand', () => {
		expect(escapeHtml('&')).toBe('&amp;');
	});

	it('should escape double quotes', () => {
		expect(escapeHtml('"')).toBe('&quot;');
	});

	it('should escape single quotes', () => {
		expect(escapeHtml("'")).toBe('&#39;');
	});

	it('should escape all HTML special characters', () => {
		expect(escapeHtml('<>&"\'')).toBe('&lt;&gt;&amp;&quot;&#39;');
	});

	it('should escape script tags', () => {
		expect(escapeHtml('<script>alert("xss")</script>')).toBe(
			'&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
		);
	});

	it('should escape event handlers', () => {
		expect(escapeHtml('<div onclick="alert(1)">')).toBe('&lt;div onclick=&quot;alert(1)&quot;&gt;');
	});

	it('should escape javascript: URLs', () => {
		expect(escapeHtml('<a href="javascript:alert(1)">')).toBe(
			'&lt;a href=&quot;javascript:alert(1)&quot;&gt;'
		);
	});
});

describe('escapeHtml - text content', () => {
	it('should not escape plain text', () => {
		expect(escapeHtml('Hello World')).toBe('Hello World');
	});

	it('should escape text with HTML mixed in', () => {
		expect(escapeHtml('Hello <strong>World</strong>')).toBe(
			'Hello &lt;strong&gt;World&lt;/strong&gt;'
		);
	});

	it('should handle empty string', () => {
		expect(escapeHtml('')).toBe('');
	});

	it('should handle whitespace', () => {
		expect(escapeHtml('   ')).toBe('   ');
	});

	it('should handle newlines', () => {
		expect(escapeHtml('line1\nline2')).toBe('line1\nline2');
	});

	it('should handle tabs', () => {
		expect(escapeHtml('line1\tline2')).toBe('line1\tline2');
	});
});

describe('escapeHtml - edge cases', () => {
	it('should handle non-string input by converting to string', () => {
		// @ts-expect-error - testing non-string input
		expect(escapeHtml(null)).toBe('');
		// @ts-expect-error - testing non-string input
		expect(escapeHtml(undefined)).toBe('undefined');
		// @ts-expect-error - testing non-string input
		expect(escapeHtml(123)).toBe('123');
		// @ts-expect-error - testing non-string input
		expect(escapeHtml(true)).toBe('true');
	});

	it('should handle already escaped entities', () => {
		// Should escape the & in &amp; to prevent double-escaping issues
		expect(escapeHtml('&amp;')).toBe('&amp;amp;');
	});

	it('should handle mixed content', () => {
		const input = 'Text with <tags> and "quotes" and \'apostrophes\'';
		const expected = 'Text with &lt;tags&gt; and &quot;quotes&quot; and &#39;apostrophes&#39;';
		expect(escapeHtml(input)).toBe(expected);
	});

	it('should handle unicode characters', () => {
		expect(escapeHtml('Hello 世界')).toBe('Hello 世界');
		expect(escapeHtml('Emoji 🎉')).toBe('Emoji 🎉');
	});
});

describe('escapeHtml - length limits', () => {
	it('should truncate text exceeding MAX_ESCAPE_LENGTH', () => {
		const longText = 'a'.repeat(MAX_ESCAPE_LENGTH + 1000);
		const result = escapeHtml(longText);
		expect(result.length).toBe(MAX_ESCAPE_LENGTH);
		expect(result).toBe('a'.repeat(MAX_ESCAPE_LENGTH));
	});

	it('should handle text at MAX_ESCAPE_LENGTH', () => {
		const text = 'a'.repeat(MAX_ESCAPE_LENGTH);
		const result = escapeHtml(text);
		expect(result.length).toBe(MAX_ESCAPE_LENGTH);
		expect(result).toBe(text);
	});

	it('should handle text just under MAX_ESCAPE_LENGTH', () => {
		const text = 'a'.repeat(MAX_ESCAPE_LENGTH - 1);
		const result = escapeHtml(text);
		expect(result.length).toBe(MAX_ESCAPE_LENGTH - 1);
		expect(result).toBe(text);
	});

	it('should truncate before escaping when length exceeds limit', () => {
		const longText = '<'.repeat(MAX_ESCAPE_LENGTH + 1000);
		const result = escapeHtml(longText);
		// Result should be truncated and then escaped
		expect(result.length).toBe(MAX_ESCAPE_LENGTH);
		expect(result).toBe('&lt;'.repeat(Math.floor(MAX_ESCAPE_LENGTH / 4)));
	});
});

describe('escapeHtml - SSR safety', () => {
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

	it('should use fallback escaping when document is undefined (SSR)', () => {
		// @ts-expect-error - simulating SSR environment
		delete globalThis.document;
		expect(escapeHtml('<script>alert("xss")</script>')).toBe(
			'&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
		);
	});

	it('should escape ampersand first in SSR mode to prevent double-escaping', () => {
		// @ts-expect-error - simulating SSR environment
		delete globalThis.document;
		expect(escapeHtml('&amp;')).toBe('&amp;amp;');
	});

	it('should handle all special characters in SSR mode', () => {
		// @ts-expect-error - simulating SSR environment
		delete globalThis.document;
		expect(escapeHtml('<>&"\'')).toBe('&lt;&gt;&amp;&quot;&#39;');
	});
});

describe('escapeHtml - XSS prevention', () => {
	it('should prevent script injection', () => {
		const malicious = '<script>alert("XSS")</script>';
		const escaped = escapeHtml(malicious);
		expect(escaped).not.toContain('<script>');
		expect(escaped).not.toContain('</script>');
		expect(escaped).toContain('&lt;script&gt;');
	});

	it('should prevent event handler injection', () => {
		const malicious = '<div onclick="alert(1)">Click</div>';
		const escaped = escapeHtml(malicious);
		expect(escaped).not.toContain('<div onclick=');
		expect(escaped).toContain('&lt;div');
		expect(escaped).toContain('onclick=&quot;');
	});

	it('should prevent javascript: URL injection', () => {
		const malicious = '<a href="javascript:alert(1)">Link</a>';
		const escaped = escapeHtml(malicious);
		expect(escaped).not.toContain('href="javascript:');
		expect(escaped).toContain('&quot;javascript:');
	});

	it('should prevent iframe injection', () => {
		const malicious = '<iframe src="evil.com"></iframe>';
		const escaped = escapeHtml(malicious);
		expect(escaped).not.toContain('<iframe');
		expect(escaped).toContain('&lt;iframe');
	});

	it('should prevent style injection', () => {
		const malicious = '<style>body{display:none}</style>';
		const escaped = escapeHtml(malicious);
		expect(escaped).not.toContain('<style');
		expect(escaped).toContain('&lt;style');
	});

	it('should prevent data URI injection', () => {
		const malicious = '<img src="data:text/html,<script>alert(1)</script>">';
		const escaped = escapeHtml(malicious);
		expect(escaped).not.toContain('src="data:text/html');
		expect(escaped).toContain('&quot;data:text/html');
	});
});
