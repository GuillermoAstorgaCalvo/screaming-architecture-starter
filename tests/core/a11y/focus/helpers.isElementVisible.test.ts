/**
 * isElementVisible Tests
 */

import { isElementVisible } from '@core/a11y/focus/helpers';
import { beforeEach, describe, expect, it } from 'vitest';

describe('isElementVisible - DOM presence', () => {
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

	it('should return false for element removed from DOM after being added', () => {
		const element = document.createElement('div');
		document.body.append(element);
		expect(isElementVisible(element)).toBe(true);
		element.remove();
		expect(isElementVisible(element)).toBe(false);
	});
});

describe('isElementVisible - display property', () => {
	beforeEach(() => {
		// Clean up any elements added to the DOM
		document.body.innerHTML = '';
	});

	it('should return false for element with display: none', () => {
		const element = document.createElement('div');
		element.style.display = 'none';
		document.body.append(element);
		expect(isElementVisible(element)).toBe(false);
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

	it('should return true for element with display: grid', () => {
		const element = document.createElement('div');
		element.style.display = 'grid';
		document.body.append(element);
		expect(isElementVisible(element)).toBe(true);
	});

	it('should return true for element with display: inline-block', () => {
		const element = document.createElement('div');
		element.style.display = 'inline-block';
		document.body.append(element);
		expect(isElementVisible(element)).toBe(true);
	});
});

describe('isElementVisible - visibility property', () => {
	beforeEach(() => {
		// Clean up any elements added to the DOM
		document.body.innerHTML = '';
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
});

describe('isElementVisible - combined properties', () => {
	beforeEach(() => {
		// Clean up any elements added to the DOM
		document.body.innerHTML = '';
	});

	it('should return false for element with both display: none and visibility: hidden', () => {
		const element = document.createElement('div');
		element.style.display = 'none';
		element.style.visibility = 'hidden';
		document.body.append(element);
		expect(isElementVisible(element)).toBe(false);
		element.remove();
	});
});
