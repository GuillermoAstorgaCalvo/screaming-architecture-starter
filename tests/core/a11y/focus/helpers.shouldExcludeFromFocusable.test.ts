/**
 * shouldExcludeFromFocusable Tests
 */

import { shouldExcludeFromFocusable } from '@core/a11y/focus/helpers';
import { describe, expect, it } from 'vitest';

const ARIA_HIDDEN = 'aria-hidden';

describe('shouldExcludeFromFocusable - tabindex handling', () => {
	it('should return true for element with tabindex="-1"', () => {
		const element = document.createElement('div');
		element.setAttribute('tabindex', '-1');
		expect(shouldExcludeFromFocusable(element)).toBe(true);
	});

	it('should return false for element with tabindex="0"', () => {
		const element = document.createElement('div');
		element.setAttribute('tabindex', '0');
		expect(shouldExcludeFromFocusable(element)).toBe(false);
	});

	it('should return false for element with tabindex="1"', () => {
		const element = document.createElement('div');
		element.setAttribute('tabindex', '1');
		expect(shouldExcludeFromFocusable(element)).toBe(false);
	});
});

describe('shouldExcludeFromFocusable - disabled form elements', () => {
	it('should return true for disabled button', () => {
		const button = document.createElement('button');
		button.disabled = true;
		expect(shouldExcludeFromFocusable(button)).toBe(true);
	});

	it('should return false for enabled button', () => {
		const button = document.createElement('button');
		button.disabled = false;
		expect(shouldExcludeFromFocusable(button)).toBe(false);
	});
});

describe('shouldExcludeFromFocusable - aria attributes', () => {
	it('should return true for element with aria-disabled="true"', () => {
		const element = document.createElement('div');
		element.setAttribute('aria-disabled', 'true');
		expect(shouldExcludeFromFocusable(element)).toBe(true);
	});

	it('should return false for element with aria-disabled="false"', () => {
		const element = document.createElement('div');
		element.setAttribute('aria-disabled', 'false');
		expect(shouldExcludeFromFocusable(element)).toBe(false);
	});

	it('should return true for element with aria-hidden="true"', () => {
		const element = document.createElement('div');
		element.setAttribute(ARIA_HIDDEN, 'true');
		expect(shouldExcludeFromFocusable(element)).toBe(true);
	});
});

describe('shouldExcludeFromFocusable - details element handling', () => {
	it('should return true for element inside closed details', () => {
		const details = document.createElement('details');
		details.open = false;
		const element = document.createElement('div');
		details.append(element);
		expect(shouldExcludeFromFocusable(element)).toBe(true);
	});

	it('should return false for element inside open details', () => {
		const details = document.createElement('details');
		details.open = true;
		const element = document.createElement('div');
		details.append(element);
		expect(shouldExcludeFromFocusable(element)).toBe(false);
	});
});

describe('shouldExcludeFromFocusable - combined conditions', () => {
	it('should return true when multiple exclusion conditions are met', () => {
		const element = document.createElement('button');
		element.disabled = true;
		element.setAttribute(ARIA_HIDDEN, 'true');
		element.setAttribute('tabindex', '-1');
		expect(shouldExcludeFromFocusable(element)).toBe(true);
	});

	it('should return false for normal focusable element', () => {
		const button = document.createElement('button');
		button.disabled = false;
		expect(shouldExcludeFromFocusable(button)).toBe(false);
	});
});
