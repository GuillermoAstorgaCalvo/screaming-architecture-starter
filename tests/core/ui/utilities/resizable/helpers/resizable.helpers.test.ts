/**
 * Tests for resizable helper functions
 *
 * Tests helper functions:
 * - parseSize
 * - getOptionalProps
 */

import {
	getOptionalProps,
	parseSize,
} from '@core/ui/utilities/resizable/helpers/Resizable.helpers';
import type { ResizableProps } from '@src-types/ui/overlays/containers';
import { describe, expect, it } from 'vitest';

// Test constants
const HANDLE_CLASS = 'handle-class';
const CONTAINER_CLASS = 'container-class';
const CUSTOM_CLASS = 'custom-class';

describe('resizable.helpers - parseSize', () => {
	it('returns number as-is', () => {
		expect(parseSize(200)).toBe(200);
		expect(parseSize(0)).toBe(0);
		expect(parseSize(100.5)).toBe(100.5);
		expect(parseSize(-50)).toBe(-50);
	});

	it('parses pixel values', () => {
		expect(parseSize('200px')).toBe(200);
		expect(parseSize('150px')).toBe(150);
		expect(parseSize('0px')).toBe(0);
		expect(parseSize('100.5px')).toBe(100.5);
	});

	it('parses percentage values', () => {
		expect(parseSize('50%')).toBe(50);
		expect(parseSize('30%')).toBe(30);
		expect(parseSize('100%')).toBe(100);
		expect(parseSize('0%')).toBe(0);
		expect(parseSize('25.5%')).toBe(25.5);
	});

	it('parses numeric strings without units', () => {
		expect(parseSize('200')).toBe(200);
		expect(parseSize('150')).toBe(150);
		expect(parseSize('0')).toBe(0);
		expect(parseSize('100.5')).toBe(100.5);
	});

	it('handles edge cases', () => {
		expect(parseSize('')).toBeNaN();
		expect(parseSize('abc')).toBeNaN();
		expect(parseSize('px')).toBeNaN();
		expect(parseSize('%')).toBeNaN();
	});

	it('handles whitespace in strings', () => {
		expect(parseSize(' 200px ')).toBe(200);
		expect(parseSize(' 50% ')).toBe(50);
		expect(parseSize(' 100 ')).toBe(100);
	});

	it('handles decimal values', () => {
		expect(parseSize(123.456)).toBe(123.456);
		expect(parseSize('123.456px')).toBe(123.456);
		expect(parseSize('123.456%')).toBe(123.456);
		expect(parseSize('123.456')).toBe(123.456);
	});
});

describe('resizable.helpers - getOptionalProps', () => {
	describeBasicCases();
	describeCombinedProps();
	describeEdgeCases();
});

function describeBasicCases() {
	describe('basic cases', () => {
		it('returns empty object when all props are undefined', () => {
			const result = getOptionalProps(undefined, undefined, undefined);
			expect(result).toEqual({});
		});

		it('includes className when defined', () => {
			const result = getOptionalProps(CUSTOM_CLASS, undefined, undefined);
			expect(result).toEqual({ className: CUSTOM_CLASS });
		});

		it('includes handleClassName when defined', () => {
			const result = getOptionalProps(undefined, HANDLE_CLASS, undefined);
			expect(result).toEqual({ handleClassName: HANDLE_CLASS });
		});

		it('includes style when defined', () => {
			const customStyle: ResizableProps['style'] = { backgroundColor: 'red' };
			const result = getOptionalProps(undefined, undefined, customStyle);
			expect(result).toEqual({ style: customStyle });
		});
	});
}

function describeCombinedProps() {
	describe('combined props', () => {
		it('includes all props when all are defined', () => {
			const customStyle: ResizableProps['style'] = { backgroundColor: 'blue' };
			const result = getOptionalProps(CONTAINER_CLASS, HANDLE_CLASS, customStyle);
			expect(result).toEqual({
				className: CONTAINER_CLASS,
				handleClassName: HANDLE_CLASS,
				style: customStyle,
			});
		});

		it('includes className and handleClassName when style is undefined', () => {
			const result = getOptionalProps(CONTAINER_CLASS, HANDLE_CLASS, undefined);
			expect(result).toEqual({
				className: CONTAINER_CLASS,
				handleClassName: HANDLE_CLASS,
			});
			expect(result.style).toBeUndefined();
		});

		it('includes className and style when handleClassName is undefined', () => {
			const customStyle: ResizableProps['style'] = { width: '100px' };
			const result = getOptionalProps(CONTAINER_CLASS, undefined, customStyle);
			expect(result).toEqual({
				className: CONTAINER_CLASS,
				style: customStyle,
			});
			expect(result.handleClassName).toBeUndefined();
		});

		it('includes handleClassName and style when className is undefined', () => {
			const customStyle: ResizableProps['style'] = { height: '200px' };
			const result = getOptionalProps(undefined, HANDLE_CLASS, customStyle);
			expect(result).toEqual({
				handleClassName: HANDLE_CLASS,
				style: customStyle,
			});
			expect(result.className).toBeUndefined();
		});
	});
}

function describeEdgeCases() {
	describe('edge cases', () => {
		it('handles empty string values', () => {
			const result = getOptionalProps('', '', undefined);
			expect(result).toEqual({
				className: '',
				handleClassName: '',
			});
		});

		it('handles complex style objects', () => {
			const complexStyle: ResizableProps['style'] = {
				backgroundColor: 'red',
				width: '100px',
				height: '200px',
				padding: '10px',
			};
			const result = getOptionalProps(undefined, undefined, complexStyle);
			expect(result).toEqual({ style: complexStyle });
			expect(result.style).toBe(complexStyle);
		});

		it('excludes undefined values from result', () => {
			const result = getOptionalProps('class', undefined, undefined);
			expect(result).not.toHaveProperty('handleClassName');
			expect(result).not.toHaveProperty('style');
			expect(result).toHaveProperty('className');
		});
	});
}
