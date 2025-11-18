/**
 * Tests for getFocusableElements function
 */

import { getFocusableElements } from '@core/a11y/focus/focus';
import { describe, expect, it } from 'vitest';

describe('getFocusableElements - basic functionality', () => {
	it('returns empty array for null container', () => {
		expect(getFocusableElements(null)).toEqual([]);
	});

	it('returns empty array for container with no focusable elements', () => {
		const container = document.createElement('div');
		container.innerHTML = '<div>Some text</div>';
		expect(getFocusableElements(container)).toEqual([]);

		container.remove();
	});

	it('returns focusable elements within container', () => {
		const container = document.createElement('div');
		container.innerHTML = `
				<button>Button 1</button>
				<input type="text" />
				<a href="#">Link</a>
				<textarea></textarea>
			`;
		document.body.append(container);

		const focusable = getFocusableElements(container);
		expect(focusable).toHaveLength(4);
		expect(focusable[0]?.tagName).toBe('BUTTON');
		expect(focusable[1]?.tagName).toBe('INPUT');
		expect(focusable[2]?.tagName).toBe('A');
		expect(focusable[3]?.tagName).toBe('TEXTAREA');

		container.remove();
	});
});

describe('getFocusableElements - exclusion rules', () => {
	it('excludes elements with tabindex="-1"', () => {
		const container = document.createElement('div');
		container.innerHTML = `
				<button>Button 1</button>
				<button tabindex="-1">Button 2</button>
				<input type="text" />
			`;
		document.body.append(container);

		const focusable = getFocusableElements(container);
		expect(focusable).toHaveLength(2);
		expect(focusable[0]?.textContent).toBe('Button 1');
		expect(focusable[1]?.tagName).toBe('INPUT');

		container.remove();
	});

	it('excludes disabled form elements', () => {
		const container = document.createElement('div');
		container.innerHTML = `
				<button>Button 1</button>
				<button disabled>Button 2</button>
				<input type="text" disabled />
				<input type="text" />
			`;
		document.body.append(container);

		const focusable = getFocusableElements(container);
		expect(focusable).toHaveLength(2);
		expect(focusable[0]?.textContent).toBe('Button 1');
		expect(focusable[1]?.tagName).toBe('INPUT');
		expect(focusable[1]?.hasAttribute('disabled')).toBe(false);

		container.remove();
	});

	it('excludes elements with aria-disabled="true"', () => {
		const container = document.createElement('div');
		container.innerHTML = `
				<button>Button 1</button>
				<button aria-disabled="true">Button 2</button>
				<input type="text" />
			`;
		document.body.append(container);

		const focusable = getFocusableElements(container);
		expect(focusable).toHaveLength(2);
		expect(focusable[0]?.textContent).toBe('Button 1');
		expect(focusable[1]?.tagName).toBe('INPUT');

		container.remove();
	});

	it('excludes elements with aria-hidden="true"', () => {
		const container = document.createElement('div');
		container.innerHTML = `
				<button>Button 1</button>
				<button aria-hidden="true">Button 2</button>
				<input type="text" />
			`;
		document.body.append(container);

		const focusable = getFocusableElements(container);
		expect(focusable).toHaveLength(2);
		expect(focusable[0]?.textContent).toBe('Button 1');
		expect(focusable[1]?.tagName).toBe('INPUT');

		container.remove();
	});
});

describe('getFocusableElements - details element handling', () => {
	it('excludes elements inside closed details element', () => {
		const container = document.createElement('div');
		container.innerHTML = `
			<button>Button 1</button>
			<details>
				<summary>Summary</summary>
				<button>Button 2</button>
			</details>
		`;
		document.body.append(container);

		const focusable = getFocusableElements(container);
		// Summary and button inside closed details are both excluded
		expect(focusable).toHaveLength(1);
		expect(focusable[0]?.textContent).toBe('Button 1');

		container.remove();
	});

	it('includes elements inside open details element', () => {
		const container = document.createElement('div');
		container.innerHTML = `
			<button>Button 1</button>
			<details open>
				<summary>Summary</summary>
				<button>Button 2</button>
			</details>
		`;
		document.body.append(container);

		const focusable = getFocusableElements(container);
		expect(focusable).toHaveLength(3);
		expect(focusable[0]?.textContent).toBe('Button 1');
		expect(focusable[1]?.tagName).toBe('SUMMARY');
		expect(focusable[2]?.textContent).toBe('Button 2');

		container.remove();
	});
});

describe('getFocusableElements - tabindex ordering', () => {
	it('sorts elements by tabindex (positive tabindex first)', () => {
		const container = document.createElement('div');
		container.innerHTML = `
				<button tabindex="3">Button 3</button>
				<button tabindex="1">Button 1</button>
				<button tabindex="2">Button 2</button>
				<button>Button 0</button>
			`;
		document.body.append(container);

		const focusable = getFocusableElements(container);
		expect(focusable).toHaveLength(4);
		expect(focusable[0]?.getAttribute('tabindex')).toBe('1');
		expect(focusable[1]?.getAttribute('tabindex')).toBe('2');
		expect(focusable[2]?.getAttribute('tabindex')).toBe('3');
		expect(focusable[3]?.hasAttribute('tabindex')).toBe(false);

		container.remove();
	});

	it('maintains DOM order for elements with tabindex="0" or no tabindex', () => {
		const container = document.createElement('div');
		container.innerHTML = `
				<button>Button A</button>
				<button tabindex="0">Button B</button>
				<button>Button C</button>
			`;
		document.body.append(container);

		const focusable = getFocusableElements(container);
		expect(focusable).toHaveLength(3);
		expect(focusable[0]?.textContent).toBe('Button A');
		expect(focusable[1]?.textContent).toBe('Button B');
		expect(focusable[2]?.textContent).toBe('Button C');

		container.remove();
	});

	it('handles mixed tabindex values correctly', () => {
		const container = document.createElement('div');
		container.innerHTML = `
				<button tabindex="5">Button 5</button>
				<button>Button 0</button>
				<button tabindex="2">Button 2</button>
				<button tabindex="0">Button 0 explicit</button>
			`;
		document.body.append(container);

		const focusable = getFocusableElements(container);
		expect(focusable).toHaveLength(4);
		// Positive tabindex should come first
		expect(focusable[0]?.getAttribute('tabindex')).toBe('2');
		expect(focusable[1]?.getAttribute('tabindex')).toBe('5');
		// Then elements with tabindex="0" or no tabindex in DOM order
		expect(focusable[2]?.textContent).toBe('Button 0');
		expect(focusable[3]?.textContent).toBe('Button 0 explicit');

		container.remove();
	});
});
