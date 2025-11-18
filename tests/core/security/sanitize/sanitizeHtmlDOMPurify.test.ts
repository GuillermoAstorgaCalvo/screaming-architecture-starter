import { MAX_HTML_LENGTH } from '@core/security/sanitize/sanitizeHtmlConstants';
import {
	isDOMPurifyAvailable,
	sanitizeHtmlWithDOMPurify,
	validateHtmlInput,
} from '@core/security/sanitize/sanitizeHtmlDOMPurify';
import type { SanitizeConfig } from '@core/security/sanitize/sanitizeHtmlTypes';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const HELLO_WORLD_HTML = '<p>Hello World</p>';
const EXAMPLE_LINK_HTML = '<a href="https://example.com">Link</a>';

// Helper functions for window mocking
function setupWindowMock(mockDOMPurify: { sanitize: ReturnType<typeof vi.fn> } | undefined) {
	// @ts-expect-error - mocking DOMPurify
	globalThis.window = {
		DOMPurify: mockDOMPurify,
	} as typeof globalThis.window;
}

function restoreWindow(originalWindow: typeof globalThis.window) {
	Object.defineProperty(globalThis, 'window', {
		value: originalWindow,
		writable: true,
		configurable: true,
	});
}

describe('isDOMPurifyAvailable', () => {
	let originalWindow: typeof globalThis.window;

	beforeEach(() => {
		originalWindow = globalThis.window;
	});

	afterEach(() => {
		restoreWindow(originalWindow);
	});

	it('should return false when DOMPurify is not available', () => {
		expect(isDOMPurifyAvailable()).toBe(false);
	});

	it('should return true when DOMPurify is available', () => {
		const mockDOMPurify = {
			sanitize: vi.fn((html: string) => html),
		};
		setupWindowMock(mockDOMPurify);
		expect(isDOMPurifyAvailable()).toBe(true);
	});

	it('should return false when window is undefined', () => {
		// @ts-expect-error - simulating SSR environment
		delete globalThis.window;
		expect(isDOMPurifyAvailable()).toBe(false);
	});

	it('should handle errors gracefully', () => {
		Object.defineProperty(globalThis, 'window', {
			get: () => {
				throw new Error('Access denied');
			},
			configurable: true,
		});
		expect(isDOMPurifyAvailable()).toBe(false);
	});
});

describe('validateHtmlInput', () => {
	it('should return empty string for empty input', () => {
		expect(validateHtmlInput('')).toBe('');
	});

	it('should return empty string for null input', () => {
		// @ts-expect-error - testing null input
		expect(validateHtmlInput(null)).toBe('');
	});

	it('should return empty string for HTML exceeding MAX_HTML_LENGTH', () => {
		const longHtml = 'a'.repeat(MAX_HTML_LENGTH + 1);
		expect(validateHtmlInput(longHtml)).toBe('');
	});

	it('should return input for valid HTML within limits', () => {
		expect(validateHtmlInput(HELLO_WORLD_HTML)).toBe(HELLO_WORLD_HTML);
	});

	it('should return input at MAX_HTML_LENGTH', () => {
		const html = 'a'.repeat(MAX_HTML_LENGTH);
		expect(validateHtmlInput(html)).toBe(html);
	});

	it('should return input just under MAX_HTML_LENGTH', () => {
		const html = 'a'.repeat(MAX_HTML_LENGTH - 1);
		expect(validateHtmlInput(html)).toBe(html);
	});
});

describe('sanitizeHtmlWithDOMPurify - availability and fallback', () => {
	let originalWindow: typeof globalThis.window;
	let mockDOMPurify: { sanitize: ReturnType<typeof vi.fn> };

	beforeEach(() => {
		originalWindow = globalThis.window;
		mockDOMPurify = {
			sanitize: vi.fn((html: string) => html),
		};
	});

	afterEach(() => {
		restoreWindow(originalWindow);
	});

	it('should fall back to basic sanitization when DOMPurify is not available', () => {
		const html = '<p>Hello <script>alert("xss")</script>World</p>';
		const result = sanitizeHtmlWithDOMPurify(html);
		expect(result).not.toContain('<script>');
		expect(result).toContain('Hello');
		expect(result).toContain('World');
	});

	it('should use DOMPurify when available', () => {
		setupWindowMock(mockDOMPurify);
		mockDOMPurify.sanitize.mockReturnValue(HELLO_WORLD_HTML);

		const result = sanitizeHtmlWithDOMPurify(HELLO_WORLD_HTML);

		expect(mockDOMPurify.sanitize).toHaveBeenCalledWith(HELLO_WORLD_HTML, expect.any(Object));
		expect(result).toBe(HELLO_WORLD_HTML);
	});

	it('should handle DOMPurify returning null', () => {
		setupWindowMock({
			sanitize: vi.fn(() => null),
		});

		const result = sanitizeHtmlWithDOMPurify(HELLO_WORLD_HTML);
		expect(result).toContain('<p>');
	});

	it('should handle DOMPurify being undefined after check', () => {
		setupWindowMock(undefined);

		const result = sanitizeHtmlWithDOMPurify(HELLO_WORLD_HTML);
		expect(result).toContain('<p>');
	});
});

describe('sanitizeHtmlWithDOMPurify - configuration', () => {
	let originalWindow: typeof globalThis.window;
	let mockDOMPurify: { sanitize: ReturnType<typeof vi.fn> };

	beforeEach(() => {
		originalWindow = globalThis.window;
		mockDOMPurify = {
			sanitize: vi.fn((html: string) => html),
		};
	});

	afterEach(() => {
		restoreWindow(originalWindow);
	});

	it('should pass config to DOMPurify when provided', () => {
		setupWindowMock(mockDOMPurify);

		const config: SanitizeConfig = {
			allowedTags: ['p', 'div'],
		};

		mockDOMPurify.sanitize.mockReturnValue(HELLO_WORLD_HTML);

		sanitizeHtmlWithDOMPurify(HELLO_WORLD_HTML, config);

		expect(mockDOMPurify.sanitize).toHaveBeenCalledWith(
			HELLO_WORLD_HTML,
			expect.objectContaining({
				ALLOWED_TAGS: ['p', 'div'],
			})
		);
	});

	it('should convert allowedAttributes to ALLOWED_ATTR array', () => {
		setupWindowMock(mockDOMPurify);

		const config: SanitizeConfig = {
			allowedAttributes: {
				a: ['href', 'title', 'class'],
			},
		};

		mockDOMPurify.sanitize.mockReturnValue(EXAMPLE_LINK_HTML);

		sanitizeHtmlWithDOMPurify(EXAMPLE_LINK_HTML, config);

		expect(mockDOMPurify.sanitize).toHaveBeenCalledWith(
			EXAMPLE_LINK_HTML,
			expect.objectContaining({
				ALLOWED_ATTR: expect.arrayContaining(['href', 'title', 'class']),
			})
		);
	});

	it('should use default attributes when config is not provided', () => {
		setupWindowMock(mockDOMPurify);
		mockDOMPurify.sanitize.mockReturnValue(EXAMPLE_LINK_HTML);

		sanitizeHtmlWithDOMPurify(EXAMPLE_LINK_HTML);

		expect(mockDOMPurify.sanitize).toHaveBeenCalledWith(
			EXAMPLE_LINK_HTML,
			expect.objectContaining({
				ALLOWED_ATTR: expect.arrayContaining(['href', 'title', 'target', 'rel']),
			})
		);
	});
});

describe('sanitizeHtmlWithDOMPurify - input validation', () => {
	it('should return empty string for invalid input', () => {
		const longHtml = 'a'.repeat(MAX_HTML_LENGTH + 1);
		const result = sanitizeHtmlWithDOMPurify(longHtml);
		expect(result).toBe('');
	});

	it('should return empty string for empty input', () => {
		expect(sanitizeHtmlWithDOMPurify('')).toBe('');
	});
});

describe('sanitizeHtmlWithDOMPurify - security and XSS protection', () => {
	let originalWindow: typeof globalThis.window;

	beforeEach(() => {
		originalWindow = globalThis.window;
	});

	afterEach(() => {
		restoreWindow(originalWindow);
	});

	it('should sanitize XSS attempts with DOMPurify', () => {
		setupWindowMock({
			sanitize: vi.fn((html: string) => {
				return html.replaceAll(/<script[^>]*>.*?<\/script>/gi, '');
			}),
		});

		const html = '<p>Hello <script>alert("xss")</script>World</p>';
		const result = sanitizeHtmlWithDOMPurify(html);
		expect(result).not.toContain('<script>');
		expect(result).toContain('Hello');
		expect(result).toContain('World');
	});

	it('should handle complex HTML with DOMPurify', () => {
		setupWindowMock({
			sanitize: vi.fn((html: string) => html),
		});

		const html = '<div><p>Paragraph</p><strong>Bold</strong></div>';
		const result = sanitizeHtmlWithDOMPurify(html);
		expect(result).toBe(html);
	});
});
