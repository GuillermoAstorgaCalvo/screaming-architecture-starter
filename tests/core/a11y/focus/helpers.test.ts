/**
 * Focus Helpers Tests
 *
 * Tests for focus management helper functions including:
 * - Disabled form element detection
 * - Focusable element exclusion logic
 * - ARIA hidden detection
 * - Closed details element detection
 * - Element visibility checks
 * - Focus bounds calculation
 * - Tab navigation wrapping
 */

import {
	getFocusBounds,
	handleShiftTabWrap,
	handleTabWrap,
	isAriaHidden,
	isDisabledFormElement,
	isElementVisible,
	isInsideClosedDetails,
	shouldExcludeFromFocusable,
} from '@core/a11y/focus/helpers';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const ARIA_HIDDEN = 'aria-hidden';

describe('isDisabledFormElement', () => {
	it('should return true for disabled button', () => {
		const button = document.createElement('button');
		button.disabled = true;
		expect(isDisabledFormElement(button)).toBe(true);
	});

	it('should return false for enabled button', () => {
		const button = document.createElement('button');
		button.disabled = false;
		expect(isDisabledFormElement(button)).toBe(false);
	});

	it('should return true for disabled input', () => {
		const input = document.createElement('input');
		input.disabled = true;
		expect(isDisabledFormElement(input)).toBe(true);
	});

	it('should return false for enabled input', () => {
		const input = document.createElement('input');
		input.disabled = false;
		expect(isDisabledFormElement(input)).toBe(false);
	});

	it('should return true for disabled select', () => {
		const select = document.createElement('select');
		select.disabled = true;
		expect(isDisabledFormElement(select)).toBe(true);
	});

	it('should return false for enabled select', () => {
		const select = document.createElement('select');
		select.disabled = false;
		expect(isDisabledFormElement(select)).toBe(false);
	});

	it('should return true for disabled textarea', () => {
		const textarea = document.createElement('textarea');
		textarea.disabled = true;
		expect(isDisabledFormElement(textarea)).toBe(true);
	});

	it('should return false for enabled textarea', () => {
		const textarea = document.createElement('textarea');
		textarea.disabled = false;
		expect(isDisabledFormElement(textarea)).toBe(false);
	});

	it('should return false for non-form element', () => {
		const div = document.createElement('div');
		expect(isDisabledFormElement(div)).toBe(false);
	});

	it('should return false for anchor element', () => {
		const anchor = document.createElement('a');
		expect(isDisabledFormElement(anchor)).toBe(false);
	});
});

describe('isAriaHidden', () => {
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
});

describe('isInsideClosedDetails', () => {
	it('should return true when element is inside closed details', () => {
		const details = document.createElement('details');
		details.open = false;
		const element = document.createElement('div');
		details.append(element);
		expect(isInsideClosedDetails(element)).toBe(true);
	});

	it('should return false when element is inside open details', () => {
		const details = document.createElement('details');
		details.open = true;
		const element = document.createElement('div');
		details.append(element);
		expect(isInsideClosedDetails(element)).toBe(false);
	});

	it('should return false when element is not inside details', () => {
		const element = document.createElement('div');
		expect(isInsideClosedDetails(element)).toBe(false);
	});

	it('should return true when element is nested inside closed details', () => {
		const details = document.createElement('details');
		details.open = false;
		const parent = document.createElement('div');
		const child = document.createElement('div');
		details.append(parent);
		parent.append(child);
		expect(isInsideClosedDetails(child)).toBe(true);
	});

	it('should return false when element is nested inside open details', () => {
		const details = document.createElement('details');
		details.open = true;
		const parent = document.createElement('div');
		const child = document.createElement('div');
		details.append(parent);
		parent.append(child);
		expect(isInsideClosedDetails(child)).toBe(false);
	});

	it('should return false when element is inside open details but ancestor is closed', () => {
		const outerDetails = document.createElement('details');
		outerDetails.open = false;
		const innerDetails = document.createElement('details');
		innerDetails.open = true;
		const element = document.createElement('div');
		outerDetails.append(innerDetails);
		innerDetails.append(element);
		// Should return true because outer details is closed
		expect(isInsideClosedDetails(element)).toBe(true);
	});
});

describe('isElementVisible', () => {
	beforeEach(() => {
		// Clean up any elements added to the DOM
		document.body.innerHTML = '';
	});

	it('should return false for element not in DOM', () => {
		const element = document.createElement('div');
		expect(isElementVisible(element)).toBe(false);
	});

	it('should return true for element in DOM with default styles', () => {
		const element = document.createElement('div');
		document.body.append(element);
		expect(isElementVisible(element)).toBe(true);
	});

	it('should return false for element with display: none', () => {
		const element = document.createElement('div');
		element.style.display = 'none';
		document.body.append(element);
		expect(isElementVisible(element)).toBe(false);
	});

	it('should return false for element with visibility: hidden', () => {
		const element = document.createElement('div');
		element.style.visibility = 'hidden';
		document.body.append(element);
		expect(isElementVisible(element)).toBe(false);
	});

	it('should return true for element with visibility: visible', () => {
		const element = document.createElement('div');
		element.style.visibility = 'visible';
		document.body.append(element);
		expect(isElementVisible(element)).toBe(true);
	});

	it('should return true for element with display: block', () => {
		const element = document.createElement('div');
		element.style.display = 'block';
		document.body.append(element);
		expect(isElementVisible(element)).toBe(true);
	});

	it('should return true for element with display: flex', () => {
		const element = document.createElement('div');
		element.style.display = 'flex';
		document.body.append(element);
		expect(isElementVisible(element)).toBe(true);
	});
});

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

describe('getFocusBounds', () => {
	it('should return null for empty array', () => {
		expect(getFocusBounds([])).toBeNull();
	});

	it('should return same element for first and last when array has one element', () => {
		const element = document.createElement('button');
		const result = getFocusBounds([element]);
		expect(result).not.toBeNull();
		expect(result?.first).toBe(element);
		expect(result?.last).toBe(element);
	});

	it('should return first and last elements for array with two elements', () => {
		const first = document.createElement('button');
		const last = document.createElement('button');
		const result = getFocusBounds([first, last]);
		expect(result).not.toBeNull();
		expect(result?.first).toBe(first);
		expect(result?.last).toBe(last);
	});

	it('should return first and last elements for array with multiple elements', () => {
		const first = document.createElement('button');
		const middle = document.createElement('button');
		const last = document.createElement('button');
		const result = getFocusBounds([first, middle, last]);
		expect(result).not.toBeNull();
		expect(result?.first).toBe(first);
		expect(result?.last).toBe(last);
	});

	it('should return first and last elements for array with many elements', () => {
		const elements = Array.from({ length: 10 }, () => document.createElement('button'));
		const result = getFocusBounds(elements);
		expect(result).not.toBeNull();
		expect(result?.first).toBe(elements[0]);
		expect(result?.last).toBe(elements[9]);
	});
});

describe('handleShiftTabWrap - focus wrapping behavior', () => {
	beforeEach(() => {
		document.body.innerHTML = '';
	});

	it('should wrap focus to last element when on first element', () => {
		const first = document.createElement('button');
		const last = document.createElement('button');
		first.textContent = 'First';
		last.textContent = 'Last';
		document.body.append(first);
		document.body.append(last);

		const event = new KeyboardEvent('keydown', {
			key: 'Tab',
			shiftKey: true,
			cancelable: true,
		});

		const focusSpy = vi.spyOn(last, 'focus');

		handleShiftTabWrap({
			firstElement: first,
			lastElement: last,
			activeElement: first,
			event,
		});

		expect(focusSpy).toHaveBeenCalled();
		expect(event.defaultPrevented).toBe(true);
	});

	it('should not wrap focus when not on first element', () => {
		const first = document.createElement('button');
		const middle = document.createElement('button');
		const last = document.createElement('button');
		document.body.append(first);
		document.body.append(middle);
		document.body.append(last);

		const event = new KeyboardEvent('keydown', {
			key: 'Tab',
			shiftKey: true,
			cancelable: true,
		});

		const focusSpy = vi.spyOn(last, 'focus');

		handleShiftTabWrap({
			firstElement: first,
			lastElement: last,
			activeElement: middle,
			event,
		});

		expect(focusSpy).not.toHaveBeenCalled();
	});
});

describe('handleShiftTabWrap - event handling', () => {
	beforeEach(() => {
		document.body.innerHTML = '';
	});

	it('should prevent default when event is cancelable', () => {
		const first = document.createElement('button');
		const last = document.createElement('button');
		document.body.append(first);
		document.body.append(last);

		const event = new KeyboardEvent('keydown', {
			key: 'Tab',
			shiftKey: true,
			cancelable: true,
		});

		handleShiftTabWrap({
			firstElement: first,
			lastElement: last,
			activeElement: first,
			event,
		});

		expect(event.defaultPrevented).toBe(true);
	});

	it('should handle non-cancelable event gracefully', () => {
		const first = document.createElement('button');
		const last = document.createElement('button');
		document.body.append(first);
		document.body.append(last);

		const event = new KeyboardEvent('keydown', {
			key: 'Tab',
			shiftKey: true,
			cancelable: false,
		});

		const focusSpy = vi.spyOn(last, 'focus');

		handleShiftTabWrap({
			firstElement: first,
			lastElement: last,
			activeElement: first,
			event,
		});

		expect(focusSpy).toHaveBeenCalled();
		expect(event.defaultPrevented).toBe(true);
	});
});

describe('handleTabWrap - focus wrapping behavior', () => {
	beforeEach(() => {
		document.body.innerHTML = '';
	});

	it('should wrap focus to first element when on last element', () => {
		const first = document.createElement('button');
		const last = document.createElement('button');
		first.textContent = 'First';
		last.textContent = 'Last';
		document.body.append(first);
		document.body.append(last);

		const event = new KeyboardEvent('keydown', {
			key: 'Tab',
			cancelable: true,
		});

		const focusSpy = vi.spyOn(first, 'focus');

		handleTabWrap({
			firstElement: first,
			lastElement: last,
			activeElement: last,
			event,
		});

		expect(focusSpy).toHaveBeenCalled();
		expect(event.defaultPrevented).toBe(true);
	});

	it('should not wrap focus when not on last element', () => {
		const first = document.createElement('button');
		const middle = document.createElement('button');
		const last = document.createElement('button');
		document.body.append(first);
		document.body.append(middle);
		document.body.append(last);

		const event = new KeyboardEvent('keydown', {
			key: 'Tab',
			cancelable: true,
		});

		const focusSpy = vi.spyOn(first, 'focus');

		handleTabWrap({
			firstElement: first,
			lastElement: last,
			activeElement: middle,
			event,
		});

		expect(focusSpy).not.toHaveBeenCalled();
	});
});

describe('handleTabWrap - event handling', () => {
	beforeEach(() => {
		document.body.innerHTML = '';
	});

	it('should prevent default when event is cancelable', () => {
		const first = document.createElement('button');
		const last = document.createElement('button');
		document.body.append(first);
		document.body.append(last);

		const event = new KeyboardEvent('keydown', {
			key: 'Tab',
			cancelable: true,
		});

		handleTabWrap({
			firstElement: first,
			lastElement: last,
			activeElement: last,
			event,
		});

		expect(event.defaultPrevented).toBe(true);
	});

	it('should handle non-cancelable event gracefully', () => {
		const first = document.createElement('button');
		const last = document.createElement('button');
		document.body.append(first);
		document.body.append(last);

		const event = new KeyboardEvent('keydown', {
			key: 'Tab',
			cancelable: false,
		});

		const focusSpy = vi.spyOn(first, 'focus');

		handleTabWrap({
			firstElement: first,
			lastElement: last,
			activeElement: last,
			event,
		});

		expect(focusSpy).toHaveBeenCalled();
		expect(event.defaultPrevented).toBe(true);
	});
});
