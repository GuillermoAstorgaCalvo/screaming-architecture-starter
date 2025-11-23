/**
 * getFocusBounds Tests
 */

import { getFocusBounds } from '@core/a11y/focus/helpers';
import { describe, expect, it } from 'vitest';

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

	it('should handle array with undefined elements gracefully', () => {
		const button1 = document.createElement('button');
		const button2 = document.createElement('button');
		const elements: HTMLElement[] = [button1, button2].filter(Boolean);
		const result = getFocusBounds(elements);
		expect(result).not.toBeNull();
		expect(result?.first).toBe(elements[0]);
		expect(result?.last).toBe(elements[1]);
	});
});
