/**
 * Tests for isFocusable function
 */

import { isFocusable } from '@core/a11y/focus/focus';
import { describe, expect, it } from 'vitest';

describe('isFocusable - basic checks', () => {
	it('returns false for null element', () => {
		expect(isFocusable(null)).toBe(false);
	});

	it('returns false for element with tabindex="-1"', () => {
		const element = document.createElement('button');
		element.setAttribute('tabindex', '-1');
		document.body.append(element);

		expect(isFocusable(element)).toBe(false);

		element.remove();
	});

	it('returns false for non-focusable element', () => {
		const element = document.createElement('div');
		document.body.append(element);

		expect(isFocusable(element)).toBe(false);

		element.remove();
	});

	it('returns false for element not in DOM', () => {
		const element = document.createElement('button');
		// Not appended to DOM

		expect(isFocusable(element)).toBe(false);
	});
});

describe('isFocusable - focusable element types', () => {
	it('returns true for focusable button', () => {
		const element = document.createElement('button');
		document.body.append(element);

		expect(isFocusable(element)).toBe(true);

		element.remove();
	});

	it('returns true for focusable input', () => {
		const element = document.createElement('input');
		element.type = 'text';
		document.body.append(element);

		expect(isFocusable(element)).toBe(true);

		element.remove();
	});

	it('returns true for focusable link with href', () => {
		const element = document.createElement('a');
		element.href = '#';
		document.body.append(element);

		expect(isFocusable(element)).toBe(true);

		element.remove();
	});

	it('returns false for link without href', () => {
		const element = document.createElement('a');
		document.body.append(element);

		expect(isFocusable(element)).toBe(false);

		element.remove();
	});
});

describe('isFocusable - disabled and aria states', () => {
	it('returns false for disabled button', () => {
		const element = document.createElement('button');
		element.disabled = true;
		document.body.append(element);

		expect(isFocusable(element)).toBe(false);

		element.remove();
	});

	it('returns false for disabled input', () => {
		const element = document.createElement('input');
		element.type = 'text';
		element.disabled = true;
		document.body.append(element);

		expect(isFocusable(element)).toBe(false);

		element.remove();
	});

	it('returns false for element with aria-disabled="true"', () => {
		const element = document.createElement('button');
		element.setAttribute('aria-disabled', 'true');
		document.body.append(element);

		expect(isFocusable(element)).toBe(false);

		element.remove();
	});

	it('returns false for element with aria-hidden="true"', () => {
		const element = document.createElement('button');
		element.setAttribute('aria-hidden', 'true');
		document.body.append(element);

		expect(isFocusable(element)).toBe(false);

		element.remove();
	});
});

describe('isFocusable - details element handling', () => {
	it('returns false for element inside closed details', () => {
		const container = document.createElement('details');
		const element = document.createElement('button');
		container.append(element);
		document.body.append(container);

		expect(isFocusable(element)).toBe(false);

		container.remove();
	});

	it('returns true for element inside open details', () => {
		const container = document.createElement('details');
		container.open = true;
		const element = document.createElement('button');
		container.append(element);
		document.body.append(container);

		expect(isFocusable(element)).toBe(true);

		container.remove();
	});
});

describe('isFocusable - visibility checks', () => {
	it('returns false for element with display: none', () => {
		const element = document.createElement('button');
		element.style.display = 'none';
		document.body.append(element);

		expect(isFocusable(element)).toBe(false);

		element.remove();
	});

	it('returns false for element with visibility: hidden', () => {
		const element = document.createElement('button');
		element.style.visibility = 'hidden';
		document.body.append(element);

		expect(isFocusable(element)).toBe(false);

		element.remove();
	});
});

describe('isFocusable - tabindex handling', () => {
	it('returns true for element with tabindex="0"', () => {
		const element = document.createElement('div');
		element.setAttribute('tabindex', '0');
		document.body.append(element);

		expect(isFocusable(element)).toBe(true);

		element.remove();
	});

	it('returns true for element with positive tabindex', () => {
		const element = document.createElement('div');
		element.setAttribute('tabindex', '1');
		document.body.append(element);

		expect(isFocusable(element)).toBe(true);

		element.remove();
	});
});
