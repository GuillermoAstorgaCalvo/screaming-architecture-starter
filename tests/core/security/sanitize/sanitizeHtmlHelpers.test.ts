import { DEFAULT_CONFIG } from '@core/security/sanitize/sanitizeHtmlConstants';
import {
	addSecurityAttributesToLink,
	isDangerousAttribute,
	mergeSanitizeConfig,
	processElement,
	processElementAttributes,
	removeDangerousElements,
	removeDisallowedTag,
	validateUrlAttribute,
} from '@core/security/sanitize/sanitizeHtmlHelpers';
import type { SanitizeConfig } from '@core/security/sanitize/sanitizeHtmlTypes';
import { beforeEach, describe, expect, it } from 'vitest';

const JAVASCRIPT_ALERT = 'javascript:alert(1)';
const ALERT_ONE = 'alert(1)';
const HTTPS_EXAMPLE_COM = 'https://example.com';

describe('mergeSanitizeConfig - basic config', () => {
	it('should return default config when no config provided', () => {
		const result = mergeSanitizeConfig();
		expect(result.allowedTags).toEqual(DEFAULT_CONFIG.allowedTags);
		expect(result.allowedAttributes).toEqual(DEFAULT_CONFIG.allowedAttributes);
		expect(result.allowedSchemes).toEqual(DEFAULT_CONFIG.allowedSchemes);
	});

	it('should merge custom allowedTags', () => {
		const custom: SanitizeConfig = {
			allowedTags: ['div', 'span'],
		};
		const result = mergeSanitizeConfig(custom);
		expect(result.allowedTags).toEqual(['div', 'span']);
	});

	it('should merge custom allowedSchemes', () => {
		const custom: SanitizeConfig = {
			allowedSchemes: ['http', 'https', 'ftp'],
		};
		const result = mergeSanitizeConfig(custom);
		expect(result.allowedSchemes).toEqual(['http', 'https', 'ftp']);
	});
});

describe('mergeSanitizeConfig - attribute merging', () => {
	it('should merge allowedAttributes for existing tags', () => {
		const custom: SanitizeConfig = {
			allowedAttributes: {
				a: ['href', 'class', 'id'],
			},
		};
		const result = mergeSanitizeConfig(custom);
		expect(result.allowedAttributes.a).toContain('href');
		expect(result.allowedAttributes.a).toContain('class');
		expect(result.allowedAttributes.a).toContain('id');
		expect(result.allowedAttributes.a).toContain('title'); // from default
	});

	it('should add allowedAttributes for new tags', () => {
		const custom: SanitizeConfig = {
			allowedAttributes: {
				img: ['src', 'alt'],
			},
		};
		const result = mergeSanitizeConfig(custom);
		expect(result.allowedAttributes.img).toEqual(['src', 'alt']);
	});
});

describe('mergeSanitizeConfig - edge cases', () => {
	it('should deduplicate attributes when merging', () => {
		const custom: SanitizeConfig = {
			allowedAttributes: {
				a: ['href', 'href', 'title'], // duplicates
			},
		};
		const result = mergeSanitizeConfig(custom);
		const allowedAttrs = result.allowedAttributes.a;
		if (allowedAttrs) {
			const hrefCount = allowedAttrs.filter(attr => attr === 'href').length;
			expect(hrefCount).toBe(1);
		}
	});

	it('should handle empty allowedAttributes', () => {
		const custom: SanitizeConfig = {
			allowedAttributes: {},
		};
		const result = mergeSanitizeConfig(custom);
		expect(result.allowedAttributes).toEqual(DEFAULT_CONFIG.allowedAttributes);
	});
});

describe('removeDangerousElements', () => {
	let container: HTMLElement;

	beforeEach(() => {
		container = document.createElement('div');
	});

	it('should remove script elements', () => {
		container.innerHTML = '<p>Text</p><script>alert("xss")</script><p>More text</p>';
		removeDangerousElements(container);
		expect(container.querySelector('script')).toBeNull();
		expect(container.querySelectorAll('p')).toHaveLength(2);
	});

	it('should remove style elements', () => {
		container.innerHTML = '<p>Text</p><style>body{color:red}</style><p>More text</p>';
		removeDangerousElements(container);
		expect(container.querySelector('style')).toBeNull();
	});

	it('should remove iframe elements', () => {
		container.innerHTML = '<p>Text</p><iframe src="evil.com"></iframe><p>More text</p>';
		removeDangerousElements(container);
		expect(container.querySelector('iframe')).toBeNull();
	});

	it('should remove object elements', () => {
		container.innerHTML = '<p>Text</p><object data="evil.swf"></object><p>More text</p>';
		removeDangerousElements(container);
		expect(container.querySelector('object')).toBeNull();
	});

	it('should remove embed elements', () => {
		container.innerHTML = '<p>Text</p><embed src="evil.swf"><p>More text</p>';
		removeDangerousElements(container);
		expect(container.querySelector('embed')).toBeNull();
	});

	it('should remove multiple dangerous elements', () => {
		container.innerHTML =
			'<script>alert(1)</script><style>body{}</style><iframe></iframe><p>Text</p>';
		removeDangerousElements(container);
		expect(container.querySelector('script')).toBeNull();
		expect(container.querySelector('style')).toBeNull();
		expect(container.querySelector('iframe')).toBeNull();
		expect(container.querySelector('p')).not.toBeNull();
	});

	it('should not remove safe elements', () => {
		container.innerHTML = '<p>Text</p><strong>Bold</strong><em>Italic</em>';
		removeDangerousElements(container);
		expect(container.querySelector('p')).not.toBeNull();
		expect(container.querySelector('strong')).not.toBeNull();
		expect(container.querySelector('em')).not.toBeNull();
	});
});

describe('removeDisallowedTag', () => {
	let container: HTMLElement;

	beforeEach(() => {
		container = document.createElement('div');
	});

	it('should remove disallowed tag and move children to parent', () => {
		container.innerHTML = '<div><span>Child 1</span><span>Child 2</span></div>';
		const firstSpan = container.querySelector('span');
		if (firstSpan) {
			removeDisallowedTag(firstSpan);
		}
		// The first span should be removed, but the second span should still exist
		const spans = container.querySelectorAll('span');
		expect(spans).toHaveLength(1);
		expect(spans[0]?.textContent).toBe('Child 2');
		expect(container.textContent).toBe('Child 1Child 2');
	});

	it('should handle element without parent', () => {
		const element = document.createElement('div');
		// Element not attached to DOM
		expect(() => removeDisallowedTag(element)).not.toThrow();
	});

	it('should handle element with no children', () => {
		container.innerHTML = '<div><span></span></div>';
		const span = container.querySelector('span');
		if (span) {
			removeDisallowedTag(span);
		}
		expect(container.querySelector('span')).toBeNull();
	});
});

describe('isDangerousAttribute', () => {
	it('should identify event handler attributes', () => {
		const attr = document.createAttribute('onclick');
		attr.value = ALERT_ONE;
		expect(isDangerousAttribute(attr)).toBe(true);
	});

	it('should identify javascript: URLs', () => {
		const attr = document.createAttribute('href');
		attr.value = JAVASCRIPT_ALERT;
		expect(isDangerousAttribute(attr)).toBe(true);
	});

	it('should identify javascript: URLs with different casing', () => {
		const attr = document.createAttribute('href');
		attr.value = 'JAVASCRIPT:alert(1)';
		expect(isDangerousAttribute(attr)).toBe(true);
	});

	it('should identify javascript: URLs with whitespace', () => {
		const attr = document.createAttribute('href');
		attr.value = `  ${JAVASCRIPT_ALERT}`;
		expect(isDangerousAttribute(attr)).toBe(true);
	});

	it('should not identify safe attributes', () => {
		const attr = document.createAttribute('href');
		attr.value = HTTPS_EXAMPLE_COM;
		expect(isDangerousAttribute(attr)).toBe(false);
	});

	it('should identify onerror attribute', () => {
		const attr = document.createAttribute('onerror');
		attr.value = 'alert(1)';
		expect(isDangerousAttribute(attr)).toBe(true);
	});

	it('should identify onload attribute', () => {
		const attr = document.createAttribute('onload');
		attr.value = 'alert(1)';
		expect(isDangerousAttribute(attr)).toBe(true);
	});
});

describe('validateUrlAttribute - allowed URLs', () => {
	it('should allow http URLs', () => {
		const attr = document.createAttribute('href');
		attr.value = 'http://example.com';
		expect(validateUrlAttribute(attr, ['http', 'https'])).toBe(true);
	});

	it('should allow https URLs', () => {
		const attr = document.createAttribute('href');
		attr.value = HTTPS_EXAMPLE_COM;
		expect(validateUrlAttribute(attr, ['http', 'https'])).toBe(true);
	});

	it('should allow mailto URLs', () => {
		const attr = document.createAttribute('href');
		attr.value = 'mailto:test@example.com';
		expect(validateUrlAttribute(attr, ['http', 'https', 'mailto'])).toBe(true);
	});

	it('should allow relative URLs', () => {
		const attr = document.createAttribute('href');
		attr.value = '/path/to/page';
		expect(validateUrlAttribute(attr, ['http', 'https'])).toBe(true);
	});

	it('should allow hash URLs', () => {
		const attr = document.createAttribute('href');
		attr.value = '#section';
		expect(validateUrlAttribute(attr, ['http', 'https'])).toBe(true);
	});

	it('should allow query string URLs', () => {
		const attr = document.createAttribute('href');
		attr.value = '?param=value';
		expect(validateUrlAttribute(attr, ['http', 'https'])).toBe(true);
	});
});

describe('validateUrlAttribute - rejected URLs', () => {
	it('should reject javascript: URLs', () => {
		const attr = document.createAttribute('href');
		attr.value = JAVASCRIPT_ALERT;
		expect(validateUrlAttribute(attr, ['http', 'https'])).toBe(false);
	});

	it('should reject data URIs when not explicitly allowed', () => {
		const attr = document.createAttribute('src');
		attr.value = 'data:text/html,<script>alert(1)</script>';
		expect(validateUrlAttribute(attr, ['http', 'https'])).toBe(false);
	});
});

describe('validateUrlAttribute - data URI handling', () => {
	it('should allow data URIs when explicitly allowed', () => {
		const attr = document.createAttribute('src');
		attr.value = 'data:image/png;base64,iVBORw0KGgo=';
		expect(validateUrlAttribute(attr, ['http', 'https', 'data'])).toBe(true);
	});

	it('should allow data URIs with data: scheme', () => {
		const attr = document.createAttribute('src');
		attr.value = 'data:image/png;base64,iVBORw0KGgo=';
		expect(validateUrlAttribute(attr, ['http', 'https', 'data:'])).toBe(true);
	});
});

describe('validateUrlAttribute - edge cases', () => {
	it('should handle empty attribute value', () => {
		const attr = document.createAttribute('href');
		attr.value = '';
		expect(validateUrlAttribute(attr, ['http', 'https'])).toBe(true);
	});
});

describe('processElementAttributes', () => {
	let element: HTMLElement;
	let config: Required<SanitizeConfig>;

	beforeEach(() => {
		config = mergeSanitizeConfig();
		element = document.createElement('div');
	});

	it('should remove dangerous attributes', () => {
		element.setAttribute('onclick', ALERT_ONE);
		processElementAttributes(element, config);
		expect(element.hasAttribute('onclick')).toBe(false);
	});

	it('should remove disallowed attributes', () => {
		element.setAttribute('class', 'test');
		processElementAttributes(element, config);
		expect(element.hasAttribute('class')).toBe(false);
	});

	it('should keep allowed attributes for anchor tags', () => {
		const anchor = document.createElement('a');
		anchor.setAttribute('href', HTTPS_EXAMPLE_COM);
		anchor.setAttribute('title', 'Example');
		processElementAttributes(anchor, config);
		expect(anchor.hasAttribute('href')).toBe(true);
		expect(anchor.hasAttribute('title')).toBe(true);
	});

	it('should remove invalid URL attributes', () => {
		const anchor = document.createElement('a');
		anchor.setAttribute('href', JAVASCRIPT_ALERT);
		processElementAttributes(anchor, config);
		expect(anchor.hasAttribute('href')).toBe(false);
	});

	it('should remove href with invalid scheme', () => {
		const anchor = document.createElement('a');
		anchor.setAttribute('href', 'ftp://example.com');
		processElementAttributes(anchor, config);
		expect(anchor.hasAttribute('href')).toBe(false);
	});
});

describe('addSecurityAttributesToLink', () => {
	it('should add target and rel to external links', () => {
		const anchor = document.createElement('a');
		anchor.setAttribute('href', 'https://example.com');
		addSecurityAttributesToLink(anchor);
		expect(anchor.getAttribute('target')).toBe('_blank');
		expect(anchor.getAttribute('rel')).toBe('noopener noreferrer');
	});

	it('should not add attributes to hash links', () => {
		const anchor = document.createElement('a');
		anchor.setAttribute('href', '#section');
		addSecurityAttributesToLink(anchor);
		expect(anchor.hasAttribute('target')).toBe(false);
		expect(anchor.hasAttribute('rel')).toBe(false);
	});

	it('should not add attributes to elements without href', () => {
		const anchor = document.createElement('a');
		addSecurityAttributesToLink(anchor);
		expect(anchor.hasAttribute('target')).toBe(false);
		expect(anchor.hasAttribute('rel')).toBe(false);
	});

	it('should not add attributes to non-anchor elements', () => {
		const div = document.createElement('div');
		div.setAttribute('href', HTTPS_EXAMPLE_COM);
		addSecurityAttributesToLink(div);
		expect(div.hasAttribute('target')).toBe(false);
		expect(div.hasAttribute('rel')).toBe(false);
	});
});

describe('processElement', () => {
	let config: Required<SanitizeConfig>;

	beforeEach(() => {
		config = mergeSanitizeConfig();
	});

	it('should remove disallowed tags', () => {
		const container = document.createElement('div');
		container.innerHTML = '<p>Text</p><div>Disallowed</div>';
		const div = container.querySelector('div');
		if (div) {
			processElement(div, config);
		}
		// The div should be removed, but its children should remain
		expect(container.querySelector('div')).toBeNull();
	});

	it('should process allowed tags', () => {
		const container = document.createElement('div');
		container.innerHTML = '<p>Text</p>';
		const p = container.querySelector('p');
		if (p) {
			processElement(p, config);
		}
		expect(container.querySelector('p')).not.toBeNull();
	});

	it('should process attributes for allowed tags', () => {
		const anchor = document.createElement('a');
		anchor.setAttribute('href', HTTPS_EXAMPLE_COM);
		anchor.setAttribute('onclick', ALERT_ONE);
		processElement(anchor, config);
		expect(anchor.hasAttribute('href')).toBe(true);
		expect(anchor.hasAttribute('onclick')).toBe(false);
	});

	it('should add security attributes to links', () => {
		const anchor = document.createElement('a');
		anchor.setAttribute('href', HTTPS_EXAMPLE_COM);
		processElement(anchor, config);
		expect(anchor.getAttribute('target')).toBe('_blank');
		expect(anchor.getAttribute('rel')).toBe('noopener noreferrer');
	});
});
