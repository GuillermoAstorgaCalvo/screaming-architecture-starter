/**
 * filterUtils Tests
 *
 * Tests for helper functions:
 * - reactNodeToString
 */

import { reactNodeToString } from '@core/ui/data-display/data-table/helpers/filterUtils';
import type * as React from 'react';
import { createElement } from 'react';
import { describe, expect, it } from 'vitest';

describe('reactNodeToString', () => {
	describe('simple types', () => {
		it('should return empty string for null', () => {
			expect(reactNodeToString(null)).toBe('');
		});

		it('should return empty string for undefined', () => {
			expect(reactNodeToString(undefined)).toBe('');
		});

		it('should return string as-is', () => {
			expect(reactNodeToString('hello')).toBe('hello');
			expect(reactNodeToString('')).toBe('');
			expect(reactNodeToString('test string')).toBe('test string');
		});

		it('should convert number to string', () => {
			expect(reactNodeToString(0)).toBe('0');
			expect(reactNodeToString(42)).toBe('42');
			expect(reactNodeToString(-10)).toBe('-10');
			expect(reactNodeToString(3.14)).toBe('3.14');
		});

		it('should convert boolean to string', () => {
			expect(reactNodeToString(true)).toBe('true');
			expect(reactNodeToString(false)).toBe('false');
		});
	});

	describe('React elements with string children', () => {
		it('should extract string from React element with string child', () => {
			const element = createElement('div', {}, 'Hello World');
			expect(reactNodeToString(element)).toBe('Hello World');
		});

		it('should extract empty string from React element with empty string child', () => {
			const element = createElement('div', {}, '');
			expect(reactNodeToString(element)).toBe('');
		});

		it('should extract string from React element with props containing string children', () => {
			const element = createElement('span', { children: 'Test' });
			expect(reactNodeToString(element)).toBe('Test');
		});
	});

	describe('React elements with array of children', () => {
		it('should join array of string children', () => {
			const element = createElement('div', {}, 'Hello', ' ', 'World');
			// Each element is joined with a space, so 'Hello' + ' ' + 'World' becomes 'Hello   World'
			expect(reactNodeToString(element)).toBe('Hello   World');
		});

		it('should join array of number children', () => {
			const element = createElement('div', {}, 1, 2, 3);
			expect(reactNodeToString(element)).toBe('1 2 3');
		});

		it('should join mixed array of string and number children', () => {
			const element = createElement('div', {}, 'Count: ', 42);
			expect(reactNodeToString(element)).toBe('Count:  42');
		});

		it('should join array with boolean children', () => {
			const element = createElement('div', {}, true, ' ', false);
			// Each element is joined with a space
			expect(reactNodeToString(element)).toBe('true   false');
		});

		it('should filter out null and undefined from array', () => {
			const element = createElement('div', {}, 'Hello', null, 'World', undefined);
			expect(reactNodeToString(element)).toBe('Hello World');
		});

		it('should handle array with only null and undefined', () => {
			const element = createElement('div', {}, null, undefined);
			expect(reactNodeToString(element)).toBe('');
		});

		it('should handle array with props.children', () => {
			const element = createElement('div', { children: ['Hello', ' ', 'World'] });
			// Each element is joined with a space
			expect(reactNodeToString(element)).toBe('Hello   World');
		});
	});

	describe('React elements with complex children', () => {
		it('should return empty string for React element with nested React element', () => {
			const nested = createElement('span', {}, 'Nested');
			const element = createElement('div', {}, nested);
			expect(reactNodeToString(element)).toBe('');
		});

		it('should return empty string for React element with object children', () => {
			const element = createElement('div', {}, { key: 'value' } as unknown as React.ReactNode);
			expect(reactNodeToString(element)).toBe('');
		});

		it('should return empty string for React element with function children', () => {
			const element = createElement('div', {}, (() => 'test') as unknown as React.ReactNode);
			expect(reactNodeToString(element)).toBe('');
		});

		it('should recursively extract text from nested React elements', () => {
			const nested = createElement('span', {}, 'Nested');
			const element = createElement('div', {}, 'Hello', nested, 'World');
			// The function recursively extracts text from nested elements
			expect(reactNodeToString(element)).toBe('Hello Nested World');
		});
	});

	describe('React elements without props', () => {
		it('should return empty string for React element with no props', () => {
			const element = createElement('div');
			expect(reactNodeToString(element)).toBe('');
		});

		it('should return empty string for React element with empty props', () => {
			const element = createElement('div', {});
			expect(reactNodeToString(element)).toBe('');
		});

		it('should return empty string for React element with props but no children', () => {
			const element = createElement('div', { className: 'test' });
			expect(reactNodeToString(element)).toBe('');
		});
	});

	describe('complex objects', () => {
		it('should return empty string for plain object', () => {
			expect(reactNodeToString({ key: 'value' } as unknown as React.ReactNode)).toBe('');
		});

		it('should return empty string for array', () => {
			expect(reactNodeToString([1, 2, 3])).toBe('');
		});

		it('should return empty string for object without props', () => {
			expect(reactNodeToString({ type: 'div' } as unknown as React.ReactNode)).toBe('');
		});

		it('should return empty string for object with props but no children property', () => {
			expect(
				reactNodeToString({
					type: 'div',
					props: { className: 'test' },
				} as unknown as React.ReactNode)
			).toBe('');
		});
	});

	describe('edge cases', () => {
		it('should handle React element with children as undefined in props', () => {
			const element = createElement('div', { children: undefined });
			expect(reactNodeToString(element)).toBe('');
		});

		it('should handle React element with children as null in props', () => {
			const element = createElement('div', { children: null });
			expect(reactNodeToString(element)).toBe('');
		});

		it('should handle React element with empty array children', () => {
			const element = createElement('div', { children: [] });
			expect(reactNodeToString(element)).toBe('');
		});

		it('should handle deeply nested arrays with simple types', () => {
			// Note: This tests the recursive nature when array contains simple types
			const element = createElement('div', {}, ['a', 'b', 'c']);
			expect(reactNodeToString(element)).toBe('a b c');
		});

		it('should handle zero as a valid number', () => {
			expect(reactNodeToString(0)).toBe('0');
		});

		it('should handle negative numbers', () => {
			expect(reactNodeToString(-1)).toBe('-1');
		});

		it('should handle very long strings', () => {
			const longString = 'a'.repeat(1000);
			expect(reactNodeToString(longString)).toBe(longString);
		});
	});
});
