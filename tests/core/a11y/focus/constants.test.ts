/**
 * Focus Constants Tests
 *
 * Tests for focus management constants including:
 * - FOCUSABLE_SELECTOR validation
 */

import { FOCUSABLE_SELECTOR } from '@core/a11y/focus/constants';
import { describe, expect, it } from 'vitest';

describe('FOCUSABLE_SELECTOR - basic validation', () => {
	it('should be a string', () => {
		expect(typeof FOCUSABLE_SELECTOR).toBe('string');
	});

	it('should not be empty', () => {
		expect(FOCUSABLE_SELECTOR.length).toBeGreaterThan(0);
	});

	it('should match expected selector format', () => {
		const expectedSelector =
			'button, [href], input, select, textarea, details > summary, [tabindex]:not([tabindex="-1"]), audio[controls], video[controls], [contenteditable]:not([contenteditable="false"])';
		expect(FOCUSABLE_SELECTOR).toBe(expectedSelector);
	});
});

describe('FOCUSABLE_SELECTOR - selector inclusion', () => {
	it('should include button selector', () => {
		expect(FOCUSABLE_SELECTOR).toContain('button');
	});

	it('should include href selector', () => {
		expect(FOCUSABLE_SELECTOR).toContain('[href]');
	});

	it('should include input selector', () => {
		expect(FOCUSABLE_SELECTOR).toContain('input');
	});

	it('should include select selector', () => {
		expect(FOCUSABLE_SELECTOR).toContain('select');
	});

	it('should include textarea selector', () => {
		expect(FOCUSABLE_SELECTOR).toContain('textarea');
	});

	it('should include details > summary selector', () => {
		expect(FOCUSABLE_SELECTOR).toContain('details > summary');
	});

	it('should include tabindex selector excluding -1', () => {
		expect(FOCUSABLE_SELECTOR).toContain('[tabindex]:not([tabindex="-1"])');
	});

	it('should include audio[controls] selector', () => {
		expect(FOCUSABLE_SELECTOR).toContain('audio[controls]');
	});

	it('should include video[controls] selector', () => {
		expect(FOCUSABLE_SELECTOR).toContain('video[controls]');
	});

	it('should include contenteditable selector excluding false', () => {
		expect(FOCUSABLE_SELECTOR).toContain('[contenteditable]:not([contenteditable="false"])');
	});
});

describe('FOCUSABLE_SELECTOR - DOM matching', () => {
	it('should be a valid CSS selector', () => {
		// Test that the selector can be used with querySelectorAll
		// This will throw if the selector is invalid
		expect(() => {
			document.querySelectorAll(FOCUSABLE_SELECTOR);
		}).not.toThrow();
	});

	it('should match focusable elements in DOM', () => {
		// Create a test container
		const container = document.createElement('div');
		container.innerHTML = `
			<button>Button</button>
			<a href="#">Link</a>
			<input type="text" />
			<select><option>Option</option></select>
			<textarea></textarea>
			<details><summary>Summary</summary></details>
			<div tabindex="0">Tabindex 0</div>
			<audio controls></audio>
			<video controls></video>
			<div contenteditable>Editable</div>
		`;
		document.body.append(container);

		const matches = container.querySelectorAll(FOCUSABLE_SELECTOR);
		// Should match all the focusable elements we added
		expect(matches.length).toBeGreaterThan(0);

		// Clean up
		container.remove();
	});

	it('should not match elements with tabindex="-1"', () => {
		const container = document.createElement('div');
		container.innerHTML = `
			<div tabindex="-1">Not focusable</div>
			<div tabindex="0">Focusable</div>
		`;
		document.body.append(container);

		const matches = container.querySelectorAll(FOCUSABLE_SELECTOR);
		// Should only match the element with tabindex="0"
		const tabindexElements = Array.from(matches).filter(el => el.getAttribute('tabindex') !== null);
		expect(tabindexElements.length).toBe(1);
		expect(tabindexElements[0]?.getAttribute('tabindex')).toBe('0');

		// Clean up
		container.remove();
	});

	it('should not match elements with contenteditable="false"', () => {
		const container = document.createElement('div');
		container.innerHTML = `
			<div contenteditable="false">Not editable</div>
			<div contenteditable="true">Editable</div>
			<div contenteditable>Editable (default)</div>
		`;
		document.body.append(container);

		const matches = container.querySelectorAll(FOCUSABLE_SELECTOR);
		// Should match the editable elements but not the false one
		const editableElements = Array.from(matches).filter(el => el.hasAttribute('contenteditable'));
		expect(editableElements.length).toBe(2);
		expect(editableElements.every(el => el.getAttribute('contenteditable') !== 'false')).toBe(true);

		// Clean up
		container.remove();
	});
});
