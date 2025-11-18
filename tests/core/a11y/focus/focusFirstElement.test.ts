/**
 * Tests for focusFirstElement function
 */

import { focusFirstElement } from '@core/a11y/focus/focus';
import { describe, expect, it } from 'vitest';

describe('focusFirstElement', () => {
	it('returns null for null container', () => {
		expect(focusFirstElement(null)).toBeNull();
	});

	it('returns null for container with no focusable elements', () => {
		const container = document.createElement('div');
		container.innerHTML = '<div>Some text</div>';
		document.body.append(container);

		expect(focusFirstElement(container)).toBeNull();

		container.remove();
	});

	it('focuses first focusable element in container', () => {
		const container = document.createElement('div');
		container.innerHTML = `
			<button id="first">First</button>
			<button id="second">Second</button>
			<input type="text" id="third" />
		`;
		document.body.append(container);

		const focused = focusFirstElement(container);
		expect(focused).toBeTruthy();
		expect(focused?.id).toBe('first');
		expect(document.activeElement?.id).toBe('first');

		container.remove();
	});

	it('focuses container if it is focusable and has no children', () => {
		const container = document.createElement('div');
		container.setAttribute('tabindex', '0');
		document.body.append(container);

		const focused = focusFirstElement(container);
		expect(focused).toBe(container);
		expect(document.activeElement).toBe(container);

		container.remove();
	});

	it('focuses container if it is focusable even with children', () => {
		const container = document.createElement('div');
		container.setAttribute('tabindex', '0');
		container.innerHTML = '<button>Child</button>';
		document.body.append(container);

		const focused = focusFirstElement(container);
		expect(focused).toBe(container);
		expect(document.activeElement).toBe(container);

		container.remove();
	});

	it('respects tabindex order when focusing first element', () => {
		const container = document.createElement('div');
		container.innerHTML = `
			<button tabindex="3">Button 3</button>
			<button tabindex="1">Button 1</button>
			<button tabindex="2">Button 2</button>
		`;
		document.body.append(container);

		const focused = focusFirstElement(container);
		expect(focused?.getAttribute('tabindex')).toBe('1');

		container.remove();
	});
});
