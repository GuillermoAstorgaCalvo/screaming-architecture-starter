/**
 * isAriaHidden Tests
 */

import { isAriaHidden } from '@core/a11y/focus/helpers';
import { describe, expect, it } from 'vitest';

const ARIA_HIDDEN = 'aria-hidden';

describe('isAriaHidden - direct attribute checks', () => {
	it('should return true when element has aria-hidden="true"', () => {
		const element = document.createElement('div');
		element.setAttribute(ARIA_HIDDEN, 'true');
		expect(isAriaHidden(element)).toBe(true);
	});

	it('should return false when element has aria-hidden="false"', () => {
		const element = document.createElement('div');
		element.setAttribute(ARIA_HIDDEN, 'false');
		expect(isAriaHidden(element)).toBe(false);
	});

	it('should return false when element has no aria-hidden attribute', () => {
		const element = document.createElement('div');
		expect(isAriaHidden(element)).toBe(false);
	});

	it('should handle element with aria-hidden attribute but not "true"', () => {
		const element = document.createElement('div');
		element.setAttribute(ARIA_HIDDEN, 'false');
		expect(isAriaHidden(element)).toBe(false);
	});
});

describe('isAriaHidden - parent and ancestor traversal', () => {
	it('should return true when parent has aria-hidden="true"', () => {
		const parent = document.createElement('div');
		parent.setAttribute(ARIA_HIDDEN, 'true');
		const child = document.createElement('div');
		parent.append(child);
		expect(isAriaHidden(child)).toBe(true);
	});

	it('should return true when ancestor has aria-hidden="true"', () => {
		const grandparent = document.createElement('div');
		grandparent.setAttribute(ARIA_HIDDEN, 'true');
		const parent = document.createElement('div');
		const child = document.createElement('div');
		grandparent.append(parent);
		parent.append(child);
		expect(isAriaHidden(child)).toBe(true);
	});

	it('should return false when parent has aria-hidden="false" but child has none', () => {
		const parent = document.createElement('div');
		parent.setAttribute(ARIA_HIDDEN, 'false');
		const child = document.createElement('div');
		parent.append(child);
		expect(isAriaHidden(child)).toBe(false);
	});

	it('should handle element with multiple ancestors having aria-hidden', () => {
		const grandparent = document.createElement('div');
		grandparent.setAttribute(ARIA_HIDDEN, 'true');
		const parent = document.createElement('div');
		parent.setAttribute(ARIA_HIDDEN, 'false');
		const child = document.createElement('div');
		grandparent.append(parent);
		parent.append(child);
		// Should return true because grandparent has aria-hidden="true"
		expect(isAriaHidden(child)).toBe(true);
	});
});

describe('isAriaHidden - edge cases', () => {
	it('should stop traversal at document.body', () => {
		const element = document.createElement('div');
		document.body.append(element);
		// body should not have aria-hidden="true" in normal cases
		expect(isAriaHidden(element)).toBe(false);
	});

	it('should stop traversal at document.documentElement', () => {
		const element = document.createElement('div');
		document.body.append(element);
		expect(isAriaHidden(element)).toBe(false);
	});

	it('should handle element directly on body', () => {
		const element = document.createElement('div');
		document.body.append(element);
		expect(isAriaHidden(element)).toBe(false);
	});
});
