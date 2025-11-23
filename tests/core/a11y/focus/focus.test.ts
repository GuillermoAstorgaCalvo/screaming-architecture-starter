/**
 * Comprehensive tests for focus.ts
 *
 * Tests for getFocusableElements and isFocusable with additional edge cases
 * and scenarios. This file complements the individual test files for
 * each function by providing consolidated testing and edge case coverage.
 */

import { getFocusableElements, isFocusable } from '@core/a11y/focus/focus';
import { beforeEach, describe, expect, it } from 'vitest';

describe('getFocusableElements - basic container scenarios', () => {
	beforeEach(() => {
		document.body.innerHTML = '';
	});

	it('handles container with only text nodes', () => {
		const container = document.createElement('div');
		container.textContent = 'Just text, no elements';
		document.body.append(container);

		const focusable = getFocusableElements(container);
		expect(focusable).toEqual([]);

		container.remove();
	});

	it('handles container with nested focusable elements', () => {
		const container = document.createElement('div');
		container.innerHTML = `
				<div>
					<button>Nested Button 1</button>
					<div>
						<input type="text" />
					</div>
				</div>
				<button>Top Level Button</button>
			`;
		document.body.append(container);

		const focusable = getFocusableElements(container);
		expect(focusable.length).toBeGreaterThan(0);
		expect(
			focusable.some(
				el =>
					el.textContent === 'Nested Button 1' ||
					el.tagName === 'INPUT' ||
					el.textContent === 'Top Level Button'
			)
		).toBe(true);
		container.remove();
	});
});

describe('getFocusableElements - tabindex handling', () => {
	beforeEach(() => {
		document.body.innerHTML = '';
	});
	it('handles container with mixed tabindex values including zero', () => {
		const container = document.createElement('div');
		container.innerHTML = `
				<button tabindex="0">Explicit Zero</button>
				<button>No Tabindex</button>
				<button tabindex="1">Positive</button>
			`;
		document.body.append(container);

		const focusable = getFocusableElements(container);
		expect(focusable.length).toBe(3);
		// Positive tabindex should come first
		expect(focusable[0]?.getAttribute('tabindex')).toBe('1');
		// Then tabindex="0" and no tabindex in DOM order
		expect(focusable[1]?.getAttribute('tabindex')).toBe('0');
		expect(focusable[2]?.hasAttribute('tabindex')).toBe(false);

		container.remove();
	});

	it('handles container with invalid tabindex values', () => {
		const container = document.createElement('div');
		container.innerHTML = `
				<button tabindex="invalid">Invalid</button>
				<button tabindex="5">Valid</button>
			`;
		document.body.append(container);

		const focusable = getFocusableElements(container);
		// Invalid tabindex should be treated as 0
		expect(focusable.length).toBe(2);
		// Valid positive tabindex should come first
		expect(focusable[0]?.getAttribute('tabindex')).toBe('5');

		container.remove();
	});
});

describe('getFocusableElements - contenteditable and media elements', () => {
	beforeEach(() => {
		document.body.innerHTML = '';
	});
	it('handles container with contenteditable elements', () => {
		const container = document.createElement('div');
		container.innerHTML = `
				<div contenteditable="true">Editable</div>
				<div contenteditable="false">Not Editable</div>
				<div contenteditable="">Also Editable</div>
			`;
		document.body.append(container);

		const focusable = getFocusableElements(container);
		// contenteditable="true" and contenteditable="" should be focusable
		// contenteditable="false" should not be
		expect(focusable.length).toBe(2);
		expect(focusable.every(el => el.getAttribute('contenteditable') !== 'false')).toBe(true);

		container.remove();
	});

	it('handles container with media elements with controls', () => {
		const container = document.createElement('div');
		container.innerHTML = `
				<audio controls></audio>
				<video controls></video>
				<audio></audio>
				<video></video>
			`;
		document.body.append(container);

		const focusable = getFocusableElements(container);
		// Only elements with controls should be focusable
		expect(focusable.length).toBe(2);
		expect(focusable.every(el => el.hasAttribute('controls'))).toBe(true);

		container.remove();
	});
});

describe('getFocusableElements - area and details elements', () => {
	beforeEach(() => {
		document.body.innerHTML = '';
	});
	it('handles container with area elements with href', () => {
		const container = document.createElement('div');
		container.innerHTML = `
				<map name="test-map">
					<area href="#" alt="Area 1" />
					<area alt="Area 2" />
				</map>
			`;
		document.body.append(container);

		const focusable = getFocusableElements(container);
		// Only area with href should be focusable
		expect(focusable.length).toBe(1);
		expect(focusable[0]?.tagName).toBe('AREA');
		expect(focusable[0]?.hasAttribute('href')).toBe(true);

		container.remove();
	});

	it('handles container with details summary elements', () => {
		const container = document.createElement('div');
		container.innerHTML = `
				<details>
					<summary>Summary 1</summary>
					<button>Button</button>
				</details>
				<details open>
					<summary>Summary 2</summary>
					<button>Button 2</button>
				</details>
			`;
		document.body.append(container);

		const focusable = getFocusableElements(container);
		// Summary in closed details is not focusable (inside closed details)
		// Summary in open details should be focusable
		// Button in closed details should be excluded
		// Button in open details should be included
		expect(focusable.length).toBe(2);
		expect(focusable.some(el => el.tagName === 'SUMMARY' && el.textContent === 'Summary 2')).toBe(
			true
		);
		expect(focusable.some(el => el.textContent === 'Button 2')).toBe(true);
		expect(focusable.some(el => el.textContent === 'Button')).toBe(false);
		container.remove();
	});
});

describe('isFocusable - tabindex scenarios', () => {
	beforeEach(() => {
		document.body.innerHTML = '';
	});

	it('returns false for element with tabindex="-1" even if it matches selector', () => {
		const element = document.createElement('button');
		element.setAttribute('tabindex', '-1');
		document.body.append(element);

		expect(isFocusable(element)).toBe(false);

		element.remove();
	});

	it('returns true for element with tabindex="0"', () => {
		const element = document.createElement('div');
		element.setAttribute('tabindex', '0');
		document.body.append(element);

		expect(isFocusable(element)).toBe(true);

		element.remove();
	});

	it('returns true for element with positive tabindex', () => {
		const element = document.createElement('div');
		element.setAttribute('tabindex', '5');
		document.body.append(element);

		expect(isFocusable(element)).toBe(true);

		element.remove();
	});

	it('handles element with invalid tabindex attribute', () => {
		const element = document.createElement('button');
		element.setAttribute('tabindex', 'not-a-number');
		document.body.append(element);

		// Should still be focusable as button matches selector
		// Invalid tabindex is treated as 0
		expect(isFocusable(element)).toBe(true);

		element.remove();
	});
});

describe('isFocusable - disabled and aria states', () => {
	beforeEach(() => {
		document.body.innerHTML = '';
	});
	it('returns false for disabled select element', () => {
		const element = document.createElement('select');
		element.disabled = true;
		document.body.append(element);

		expect(isFocusable(element)).toBe(false);

		element.remove();
	});

	it('returns false for disabled textarea element', () => {
		const element = document.createElement('textarea');
		element.disabled = true;
		document.body.append(element);

		expect(isFocusable(element)).toBe(false);

		element.remove();
	});

	it('returns false for element with aria-disabled="true" even if not disabled', () => {
		const element = document.createElement('button');
		element.setAttribute('aria-disabled', 'true');
		document.body.append(element);

		expect(isFocusable(element)).toBe(false);

		element.remove();
	});

	it('returns true for element with aria-disabled="false"', () => {
		const element = document.createElement('button');
		element.setAttribute('aria-disabled', 'false');
		document.body.append(element);

		expect(isFocusable(element)).toBe(true);

		element.remove();
	});
});

describe('isFocusable - parent context scenarios', () => {
	beforeEach(() => {
		document.body.innerHTML = '';
	});
	it('returns false for element with parent having aria-hidden="true"', () => {
		const parent = document.createElement('div');
		parent.setAttribute('aria-hidden', 'true');
		const element = document.createElement('button');
		parent.append(element);
		document.body.append(parent);

		expect(isFocusable(element)).toBe(false);

		parent.remove();
	});

	it('returns false for element inside nested closed details', () => {
		const outerDetails = document.createElement('details');
		outerDetails.open = false;
		const innerDetails = document.createElement('details');
		innerDetails.open = true;
		const element = document.createElement('button');
		outerDetails.append(innerDetails);
		innerDetails.append(element);
		document.body.append(outerDetails);

		expect(isFocusable(element)).toBe(false);

		outerDetails.remove();
	});
});
