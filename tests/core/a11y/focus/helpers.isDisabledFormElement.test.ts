/**
 * isDisabledFormElement Tests
 */

import { isDisabledFormElement } from '@core/a11y/focus/helpers';
import { describe, expect, it } from 'vitest';

describe('isDisabledFormElement - button elements', () => {
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
});

describe('isDisabledFormElement - input elements', () => {
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

	it('should handle different input types correctly', () => {
		const inputTypes = [
			'text',
			'email',
			'password',
			'number',
			'checkbox',
			'radio',
			'submit',
			'button',
		];
		for (const type of inputTypes) {
			const input = document.createElement('input');
			input.type = type;
			input.disabled = true;
			expect(isDisabledFormElement(input)).toBe(true);
		}
	});
});

describe('isDisabledFormElement - select and textarea elements', () => {
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
});

describe('isDisabledFormElement - edge cases', () => {
	it('should return false for non-form element', () => {
		const div = document.createElement('div');
		expect(isDisabledFormElement(div)).toBe(false);
	});

	it('should return false for anchor element', () => {
		const anchor = document.createElement('a');
		expect(isDisabledFormElement(anchor)).toBe(false);
	});

	it('should return false for enabled form element that was previously disabled', () => {
		const button = document.createElement('button');
		button.disabled = true;
		expect(isDisabledFormElement(button)).toBe(true);
		button.disabled = false;
		expect(isDisabledFormElement(button)).toBe(false);
	});
});
