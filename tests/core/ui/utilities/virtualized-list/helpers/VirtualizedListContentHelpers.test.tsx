/**
 * Tests for VirtualizedListContentHelpers
 *
 * Tests style generation, container classes, and virtual item mapping
 */

import {
	getContainerClasses,
	getContainerStyle,
	getVirtualItemsStyle,
	mapVirtualItems,
	renderVirtualItem,
} from '@core/ui/utilities/virtualized-list/helpers/VirtualizedListContentHelpers';
import type { useVirtualizer } from '@tanstack/react-virtual';
import { describe, expect, it } from 'vitest';

describe('VirtualizedListContentHelpers - getVirtualItemsStyle', () => {
	it('should return vertical styles for vertical orientation', () => {
		const style = getVirtualItemsStyle({ orientation: 'vertical', totalSize: 1000 });

		expect(style).toEqual({
			height: '1000px',
			width: '100%',
			position: 'relative',
		});
	});

	it('should return horizontal styles for horizontal orientation', () => {
		const style = getVirtualItemsStyle({ orientation: 'horizontal', totalSize: 2000 });

		expect(style).toEqual({
			width: '2000px',
			height: '100%',
			position: 'relative',
		});
	});

	it('should handle zero totalSize', () => {
		const style = getVirtualItemsStyle({ orientation: 'vertical', totalSize: 0 });

		expect(style.height).toBe('0px');
	});

	it('should handle large totalSize values', () => {
		const style = getVirtualItemsStyle({ orientation: 'vertical', totalSize: 1000000 });

		expect(style.height).toBe('1000000px');
	});
});

const CONTAINER_SIZE_400 = 400;

describe('VirtualizedListContentHelpers - getContainerStyle - orientation and size handling', () => {
	it('should return vertical container style with number size', () => {
		const style = getContainerStyle({
			containerSize: CONTAINER_SIZE_400,
			orientation: 'vertical',
			smoothScroll: false,
		});

		expect(style).toEqual({
			height: '400px',
			scrollBehavior: 'auto',
		});
	});

	it('should return horizontal container style with number size', () => {
		const style = getContainerStyle({
			containerSize: 600,
			orientation: 'horizontal',
			smoothScroll: false,
		});

		expect(style).toEqual({
			width: '600px',
			scrollBehavior: 'auto',
		});
	});

	it('should return vertical container style with string size', () => {
		const style = getContainerStyle({
			containerSize: '100%',
			orientation: 'vertical',
			smoothScroll: false,
		});

		expect(style).toEqual({
			height: '100%',
			scrollBehavior: 'auto',
		});
	});

	it('should return horizontal container style with string size', () => {
		const style = getContainerStyle({
			containerSize: '50vh',
			orientation: 'horizontal',
			smoothScroll: false,
		});

		expect(style).toEqual({
			width: '50vh',
			scrollBehavior: 'auto',
		});
	});
});

describe('VirtualizedListContentHelpers - getContainerStyle - smooth scroll behavior', () => {
	it('should enable smooth scroll when smoothScroll is true', () => {
		const style = getContainerStyle({
			containerSize: CONTAINER_SIZE_400,
			orientation: 'vertical',
			smoothScroll: true,
		});

		expect(style.scrollBehavior).toBe('smooth');
	});

	it('should disable smooth scroll when smoothScroll is false', () => {
		const style = getContainerStyle({
			containerSize: CONTAINER_SIZE_400,
			orientation: 'vertical',
			smoothScroll: false,
		});

		expect(style.scrollBehavior).toBe('auto');
	});
});

const OVERFLOW_AUTO = 'overflow-auto';

describe('VirtualizedListContentHelpers - getContainerClasses', () => {
	it('should return overflow-auto class when no className provided', () => {
		const classes = getContainerClasses();

		expect(classes).toBe(OVERFLOW_AUTO);
	});

	it('should merge custom className with overflow-auto', () => {
		const classes = getContainerClasses('custom-class');

		expect(classes).toContain(OVERFLOW_AUTO);
		expect(classes).toContain('custom-class');
	});

	it('should handle multiple custom classes', () => {
		const classes = getContainerClasses('class1 class2');

		expect(classes).toContain(OVERFLOW_AUTO);
		expect(classes).toContain('class1');
		expect(classes).toContain('class2');
	});

	it('should handle empty string className', () => {
		const classes = getContainerClasses('');

		expect(classes).toBe(OVERFLOW_AUTO);
	});
});

describe('VirtualizedListContentHelpers - renderVirtualItem', () => {
	const mockItems = [
		{ id: 1, name: 'Item 1' },
		{ id: 2, name: 'Item 2' },
	];
	const mockRenderItem = (item: { id: number; name: string }) => <div>{item.name}</div>;
	const mockVirtualizer = {
		measureElement: () => {},
	} as unknown as ReturnType<typeof useVirtualizer<HTMLDivElement, Element>>;

	const [firstItem] = mockItems;
	if (!firstItem) {
		throw new Error('First item not found');
	}

	it('should render virtual item with correct props', () => {
		const virtualItem = { index: 0, start: 0 };

		const view = renderVirtualItem({
			item: firstItem,
			index: 0,
			virtualItem,
			virtualizer: mockVirtualizer,
			renderItem: mockRenderItem,
			orientation: 'vertical',
		});

		expect(view).toBeDefined();
		// Key is set internally by React, we verify it's a valid React element
		expect(view).toHaveProperty('key');
	});

	it('should use getItemKey when provided', () => {
		const virtualItem = { index: 0, start: 0 };
		const getItemKey = (_item: { id: number; name: string }, index: number) => `key-${index}`;

		const view = renderVirtualItem({
			item: firstItem,
			index: 0,
			virtualItem,
			virtualizer: mockVirtualizer,
			renderItem: mockRenderItem,
			getItemKey,
			orientation: 'vertical',
		});

		expect(view).toBeDefined();
		// Key is set internally by React, we verify it's a valid React element
		expect(view).toHaveProperty('key');
	});

	it('should handle horizontal orientation', () => {
		const virtualItem = { index: 0, start: 0 };

		const view = renderVirtualItem({
			item: firstItem,
			index: 0,
			virtualItem,
			virtualizer: mockVirtualizer,
			renderItem: mockRenderItem,
			orientation: 'horizontal',
		});

		expect(view).toBeDefined();
	});
});

const mockItemsForMapVirtualItems = [
	{ id: 1, name: 'Item 1' },
	{ id: 2, name: 'Item 2' },
	{ id: 3, name: 'Item 3' },
];
const mockRenderItemForMapVirtualItems = (item: { id: number; name: string }) => (
	<div>{item.name}</div>
);
const mockVirtualizerForMapVirtualItems = {
	measureElement: () => {},
} as unknown as ReturnType<typeof useVirtualizer<HTMLDivElement, Element>>;

describe('VirtualizedListContentHelpers - mapVirtualItems - basic mapping', () => {
	it('should map virtual items to rendered components', () => {
		const virtualItems = [
			{ index: 0, start: 0, end: 50, size: 50 },
			{ index: 1, start: 50, end: 100, size: 50 },
		] as ReturnType<ReturnType<typeof useVirtualizer<HTMLDivElement, Element>>['getVirtualItems']>;

		const result = mapVirtualItems({
			items: mockItemsForMapVirtualItems,
			virtualItems,
			virtualizer: mockVirtualizerForMapVirtualItems,
			renderItem: mockRenderItemForMapVirtualItems,
			orientation: 'vertical',
		});

		expect(result).toHaveLength(2);
		expect(result[0]).toBeDefined();
		expect(result[1]).toBeDefined();
	});
});

describe('VirtualizedListContentHelpers - mapVirtualItems - edge cases', () => {
	it('should return null for missing items', () => {
		const virtualItems = [
			{ index: 0, start: 0, end: 50, size: 50 },
			{ index: 10, start: 500, end: 550, size: 50 }, // Index 10 doesn't exist
		] as ReturnType<ReturnType<typeof useVirtualizer<HTMLDivElement, Element>>['getVirtualItems']>;

		const result = mapVirtualItems({
			items: mockItemsForMapVirtualItems,
			virtualItems,
			virtualizer: mockVirtualizerForMapVirtualItems,
			renderItem: mockRenderItemForMapVirtualItems,
			orientation: 'vertical',
		});

		expect(result).toHaveLength(2);
		expect(result[0]).toBeDefined();
		expect(result[1]).toBeNull();
	});

	it('should handle empty virtual items array', () => {
		const virtualItems = [] as ReturnType<
			ReturnType<typeof useVirtualizer<HTMLDivElement, Element>>['getVirtualItems']
		>;

		const result = mapVirtualItems({
			items: mockItemsForMapVirtualItems,
			virtualItems,
			virtualizer: mockVirtualizerForMapVirtualItems,
			renderItem: mockRenderItemForMapVirtualItems,
			orientation: 'vertical',
		});

		expect(result).toHaveLength(0);
		expect(result).toEqual([]);
	});
});

describe('VirtualizedListContentHelpers - mapVirtualItems - optional parameters', () => {
	it('should use getItemKey when provided', () => {
		const virtualItems = [{ index: 0, start: 0, end: 50, size: 50 }] as ReturnType<
			ReturnType<typeof useVirtualizer<HTMLDivElement, Element>>['getVirtualItems']
		>;
		const getItemKey = (_item: { id: number; name: string }, index: number) => `key-${index}`;

		const result = mapVirtualItems({
			items: mockItemsForMapVirtualItems,
			virtualItems,
			virtualizer: mockVirtualizerForMapVirtualItems,
			renderItem: mockRenderItemForMapVirtualItems,
			getItemKey,
			orientation: 'vertical',
		});

		expect(result).toHaveLength(1);
		// Key is set internally by React, we verify it's a valid React element
		expect(result[0]).toHaveProperty('key');
	});

	it('should handle horizontal orientation', () => {
		const virtualItems = [{ index: 0, start: 0, end: 50, size: 50 }] as ReturnType<
			ReturnType<typeof useVirtualizer<HTMLDivElement, Element>>['getVirtualItems']
		>;

		const result = mapVirtualItems({
			items: mockItemsForMapVirtualItems,
			virtualItems,
			virtualizer: mockVirtualizerForMapVirtualItems,
			renderItem: mockRenderItemForMapVirtualItems,
			orientation: 'horizontal',
		});

		expect(result).toHaveLength(1);
		expect(result[0]).toBeDefined();
	});
});
