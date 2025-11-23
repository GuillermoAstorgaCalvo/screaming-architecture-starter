/**
 * Tests for useSplitter helper functions
 *
 * Tests helper functions:
 * - parseSize
 * - isHorizontal
 * - calculateNewSize
 * - applySizeConstraints
 * - sizeToCSS
 * - getDimension
 * - setDimension
 * - parseDefaultSize
 * - calculatePanelStyle
 */

import {
	applySizeConstraints,
	calculateNewSize,
	calculatePanelStyle,
	getDimension,
	isHorizontal,
	parseDefaultSize,
	parseSize,
	setDimension,
	sizeToCSS,
} from '@core/ui/utilities/splitter/helpers/useSplitter.helpers';
import { describe, expect, it } from 'vitest';

describe('useSplitter.helpers - parseSize', () => {
	it('returns 0 when size is undefined', () => {
		expect(parseSize(undefined, 1000)).toBe(0);
	});

	it('returns number as-is', () => {
		expect(parseSize(200, 1000)).toBe(200);
	});

	it('parses percentage values', () => {
		expect(parseSize('50%', 1000)).toBe(500);
		expect(parseSize('30%', 1000)).toBe(300);
	});

	it('parses pixel values', () => {
		expect(parseSize('200px', 1000)).toBe(200);
		expect(parseSize('150px', 1000)).toBe(150);
	});

	it('parses numeric strings', () => {
		expect(parseSize('200', 1000)).toBe(200);
	});

	it('returns 0 for invalid values', () => {
		expect(parseSize('invalid', 1000)).toBe(0);
	});
});

describe('useSplitter.helpers - isHorizontal', () => {
	it('returns true for horizontal orientation', () => {
		expect(isHorizontal('horizontal')).toBe(true);
	});

	it('returns false for vertical orientation', () => {
		expect(isHorizontal('vertical')).toBe(false);
	});
});

describe('useSplitter.helpers - calculateNewSize', () => {
	it('calculates new size for horizontal orientation', () => {
		const event = {
			clientX: 150,
			clientY: 100,
		} as MouseEvent;

		const result = calculateNewSize({
			event,
			orientation: 'horizontal',
			startPos: 100,
			startSize: 200,
		});

		expect(result).toBe(250); // 200 + (150 - 100)
	});

	it('calculates new size for vertical orientation', () => {
		const event = {
			clientX: 100,
			clientY: 150,
		} as MouseEvent;

		const result = calculateNewSize({
			event,
			orientation: 'vertical',
			startPos: 100,
			startSize: 200,
		});

		expect(result).toBe(250); // 200 + (150 - 100)
	});
});

describe('useSplitter.helpers - applySizeConstraints', () => {
	it('returns size when within constraints', () => {
		expect(applySizeConstraints(200, 100, 300)).toBe(200);
	});

	it('returns minSize when size is below minimum', () => {
		expect(applySizeConstraints(50, 100, 300)).toBe(100);
	});

	it('returns maxSize when size is above maximum', () => {
		expect(applySizeConstraints(400, 100, 300)).toBe(300);
	});

	it('handles undefined maxSize', () => {
		expect(applySizeConstraints(400, 100, undefined)).toBe(400);
		expect(applySizeConstraints(50, 100, undefined)).toBe(100);
	});
});

describe('useSplitter.helpers - sizeToCSS', () => {
	it('returns "auto" when size is undefined', () => {
		expect(sizeToCSS(undefined)).toBe('auto');
	});

	it('converts number to pixel string', () => {
		expect(sizeToCSS(200)).toBe('200px');
		expect(sizeToCSS(150)).toBe('150px');
	});
});

describe('useSplitter.helpers - getDimension', () => {
	it('returns width for horizontal orientation', () => {
		const element = document.createElement('div');
		element.style.width = '200px';
		element.style.height = '100px';
		// offsetWidth requires element to be in DOM
		Object.defineProperty(element, 'offsetWidth', { value: 200, writable: false });

		expect(getDimension('horizontal', element)).toBe(200);
	});

	it('returns height for vertical orientation', () => {
		const element = document.createElement('div');
		element.style.width = '200px';
		element.style.height = '100px';
		Object.defineProperty(element, 'offsetHeight', { value: 100, writable: false });

		expect(getDimension('vertical', element)).toBe(100);
	});
});

describe('useSplitter.helpers - setDimension', () => {
	it('sets width for horizontal orientation', () => {
		const element = document.createElement('div');
		setDimension('horizontal', element, 200);

		expect(element.style.width).toBe('200px');
	});

	it('sets height for vertical orientation', () => {
		const element = document.createElement('div');
		setDimension('vertical', element, 150);

		expect(element.style.height).toBe('150px');
	});
});

describe('useSplitter.helpers - parseDefaultSize', () => {
	it('returns number as-is', () => {
		const element = document.createElement('div');
		expect(parseDefaultSize(200, 'horizontal', element)).toBe(200);
	});

	it('parses percentage values', () => {
		const parent = document.createElement('div');
		parent.style.width = '1000px';
		Object.defineProperty(parent, 'offsetWidth', { value: 1000, writable: false });

		const element = document.createElement('div');
		parent.append(element);

		expect(parseDefaultSize('50%', 'horizontal', element)).toBe(500);
	});

	it('returns null when parent is missing for percentage', () => {
		const element = document.createElement('div');
		expect(parseDefaultSize('50%', 'horizontal', element)).toBeNull();
	});

	it('parses pixel values', () => {
		const element = document.createElement('div');
		expect(parseDefaultSize('200px', 'horizontal', element)).toBe(200);
	});
});

describe('useSplitter.helpers - calculatePanelStyle', () => {
	it('returns style with dimension when panelState has size', () => {
		const style = calculatePanelStyle({
			orientation: 'horizontal',
			panelState: { size: 200 },
			isCollapsed: false,
			collapsible: false,
			collapsedSize: 0,
		});

		expect(style.width).toBe('200px');
	});

	it('returns style with collapsed size when collapsed', () => {
		const style = calculatePanelStyle({
			orientation: 'horizontal',
			panelState: { size: 200 },
			isCollapsed: true,
			collapsible: true,
			collapsedSize: 50,
		});

		expect(style.width).toBe('50px');
	});

	it('returns style with height for vertical orientation', () => {
		const style = calculatePanelStyle({
			orientation: 'vertical',
			panelState: { size: 200 },
			isCollapsed: false,
			collapsible: false,
			collapsedSize: 0,
		});

		expect(style.height).toBe('200px');
	});

	it('merges with custom style', () => {
		const customStyle = { backgroundColor: 'red' };
		const style = calculatePanelStyle({
			orientation: 'horizontal',
			panelState: { size: 200 },
			isCollapsed: false,
			collapsible: false,
			collapsedSize: 0,
			style: customStyle,
		});

		expect(style.width).toBe('200px');
		expect(style.backgroundColor).toBe('red');
	});

	it('does not set dimension when panelState size is undefined', () => {
		const style = calculatePanelStyle({
			orientation: 'horizontal',
			panelState: undefined,
			isCollapsed: false,
			collapsible: false,
			collapsedSize: 0,
		});

		expect(style.width).toBeUndefined();
	});
});
