/**
 * Tests for saveActiveElement function
 */

import { saveActiveElement } from '@core/a11y/focus/focus';
import { describe, expect, it } from 'vitest';

const TEST_BUTTON_ID = 'test-button';

describe('saveActiveElement - edge cases', () => {
	it('returns null when no element has focus', () => {
		// Blur any active element
		if (document.activeElement instanceof HTMLElement) {
			document.activeElement.blur();
		}

		expect(saveActiveElement()).toBeNull();
	});

	it('returns null when body has focus', () => {
		document.body.focus();
		expect(saveActiveElement()).toBeNull();
	});

	it('returns null when documentElement has focus', () => {
		document.documentElement.focus();
		expect(saveActiveElement()).toBeNull();
	});
});

describe('saveActiveElement - element types', () => {
	it('returns currently focused element', () => {
		const button = document.createElement('button');
		button.id = TEST_BUTTON_ID;
		document.body.append(button);
		button.focus();

		const saved = saveActiveElement();
		expect(saved).toBe(button);
		expect(saved?.id).toBe(TEST_BUTTON_ID);

		button.remove();
	});

	it('returns input element when focused', () => {
		const input = document.createElement('input');
		input.type = 'text';
		input.id = 'test-input';
		document.body.append(input);
		input.focus();

		const saved = saveActiveElement();
		expect(saved).toBe(input);
		expect(saved?.id).toBe('test-input');

		input.remove();
	});

	it('returns link element when focused', () => {
		const link = document.createElement('a');
		link.href = '#';
		link.id = 'test-link';
		document.body.append(link);
		link.focus();

		const saved = saveActiveElement();
		expect(saved).toBe(link);
		expect(saved?.id).toBe('test-link');

		link.remove();
	});
});

describe('saveActiveElement - focus restoration', () => {
	it('can be used to restore focus', () => {
		const button = document.createElement('button');
		button.id = TEST_BUTTON_ID;
		document.body.append(button);
		button.focus();

		const saved = saveActiveElement();
		expect(saved).toBe(button);

		// Simulate focus change
		const otherButton = document.createElement('button');
		otherButton.id = 'other-button';
		document.body.append(otherButton);
		otherButton.focus();
		expect(document.activeElement?.id).toBe('other-button');

		// Restore focus
		saved?.focus();
		expect(document.activeElement).toBe(button);

		button.remove();
		otherButton.remove();
	});
});
