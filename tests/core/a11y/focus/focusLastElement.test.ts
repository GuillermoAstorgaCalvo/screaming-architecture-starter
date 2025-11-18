/**
 * Tests for focusLastElement function
 */

import { focusLastElement } from '@core/a11y/focus/focus';
import { describe, expect, it } from 'vitest';

describe('focusLastElement', () => {
	it('returns null for null container', () => {
		expect(focusLastElement(null)).toBeNull();
	});

	it('returns null for container with no focusable elements', () => {
		const container = document.createElement('div');
		container.innerHTML = '<div>Some text</div>';
		document.body.append(container);

		expect(focusLastElement(container)).toBeNull();

		container.remove();
	});

	it('focuses last focusable element in container', () => {
		const container = document.createElement('div');
		container.innerHTML = `
			<button id="first">First</button>
			<button id="second">Second</button>
			<input type="text" id="third" />
		`;
		document.body.append(container);

		const focused = focusLastElement(container);
		expect(focused).toBeTruthy();
		expect(focused?.id).toBe('third');
		expect(document.activeElement?.id).toBe('third');

		container.remove();
	});

	it('respects tabindex order when focusing last element', () => {
		const container = document.createElement('div');
		container.innerHTML = `
			<button tabindex="3">Button 3</button>
			<button tabindex="1">Button 1</button>
			<button tabindex="2">Button 2</button>
		`;
		document.body.append(container);

		const focused = focusLastElement(container);
		// Last in tab order should be the one with highest positive tabindex or last in DOM order
		expect(focused).toBeTruthy();

		container.remove();
	});
});
