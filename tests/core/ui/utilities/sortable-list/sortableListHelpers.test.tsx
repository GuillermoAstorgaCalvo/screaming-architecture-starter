/**
 * Tests for sortableListHelpers
 *
 * Tests helper functions:
 * - getSortableListItemClasses
 * - getDragHandleClasses
 * - moveItem
 * - useSortableListConfig
 * - prepareItemHandlers
 * - prepareRenderedItems
 */

import {
	getDragHandleClasses,
	getSortableListItemClasses,
	moveItem,
	prepareItemHandlers,
	prepareRenderedItems,
	useSortableListConfig,
} from '@core/ui/utilities/sortable-list/helpers/SortableListHelpers';
import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const DEFAULT_SIZE = 'md' as const;
const DEFAULT_BASE_PROPS = {
	size: DEFAULT_SIZE,
	isDragging: false,
	isDragTarget: false,
	disabled: false,
} as const;

const createMockSortableListState = () => ({
	draggedItemId: null,
	dragTargetIndex: null,
	handleDragStart: vi.fn(),
	handleDragEnd: vi.fn(),
	handleDragOver: vi.fn(),
	handleDrop: vi.fn(),
	handleKeyDown: vi.fn(),
});

const HOVER_BG_MUTED_CLASS = 'hover:bg-muted';
const CUSTOM_CLASS_NAME = 'custom-class';

describe('getSortableListItemClasses - base classes', () => {
	it('returns base classes', () => {
		const classes = getSortableListItemClasses(DEFAULT_BASE_PROPS);

		expect(classes).toContain('cursor-move');
		expect(classes).toContain(HOVER_BG_MUTED_CLASS);
	});
});

describe('getSortableListItemClasses - disabled state', () => {
	it('applies disabled classes', () => {
		const classes = getSortableListItemClasses({
			...DEFAULT_BASE_PROPS,
			disabled: true,
		});

		expect(classes).toContain('opacity-disabled');
		expect(classes).toContain('cursor-not-allowed');
		expect(classes).not.toContain(HOVER_BG_MUTED_CLASS);
	});
});

describe('getSortableListItemClasses - dragging state', () => {
	it('applies dragging classes', () => {
		const classes = getSortableListItemClasses({
			...DEFAULT_BASE_PROPS,
			isDragging: true,
		});

		expect(classes).toContain('opacity-disabled');
		expect(classes).toContain('scale-95');
		expect(classes).not.toContain(HOVER_BG_MUTED_CLASS);
	});
});

describe('getSortableListItemClasses - drag target state', () => {
	it('applies drag target classes', () => {
		const classes = getSortableListItemClasses({
			...DEFAULT_BASE_PROPS,
			isDragTarget: true,
		});

		expect(classes).toContain('ring-2');
		expect(classes).toContain('ring-primary');
		expect(classes).toContain('ring-offset-2');
	});
});

describe('getSortableListItemClasses - custom className', () => {
	it('merges custom className', () => {
		const classes = getSortableListItemClasses({
			...DEFAULT_BASE_PROPS,
			className: CUSTOM_CLASS_NAME,
		});

		expect(classes).toContain(CUSTOM_CLASS_NAME);
	});
});

describe('getSortableListItemClasses - size variants', () => {
	it('handles all size variants', () => {
		const smClasses = getSortableListItemClasses({
			...DEFAULT_BASE_PROPS,
			size: 'sm',
		});

		const mdClasses = getSortableListItemClasses({
			...DEFAULT_BASE_PROPS,
			size: 'md',
		});

		const lgClasses = getSortableListItemClasses({
			...DEFAULT_BASE_PROPS,
			size: 'lg',
		});

		expect(smClasses).toBeTruthy();
		expect(mdClasses).toBeTruthy();
		expect(lgClasses).toBeTruthy();
	});
});

describe('getDragHandleClasses', () => {
	it('returns base classes', () => {
		const classes = getDragHandleClasses({
			size: DEFAULT_SIZE,
			disabled: false,
		});

		expect(classes).toContain('cursor-grab');
		expect(classes).toContain('active:cursor-grabbing');
	});

	it('applies disabled classes', () => {
		const classes = getDragHandleClasses({
			size: DEFAULT_SIZE,
			disabled: true,
		});

		expect(classes).toContain('cursor-not-allowed');
		expect(classes).not.toContain('cursor-grab');
	});

	it('applies size classes for sm', () => {
		const classes = getDragHandleClasses({
			size: 'sm',
			disabled: false,
		});

		expect(classes).toContain('w-4');
		expect(classes).toContain('h-4');
	});

	it('applies size classes for md', () => {
		const classes = getDragHandleClasses({
			size: DEFAULT_SIZE,
			disabled: false,
		});

		expect(classes).toContain('w-5');
		expect(classes).toContain('h-5');
	});

	it('applies size classes for lg', () => {
		const classes = getDragHandleClasses({
			size: 'lg',
			disabled: false,
		});

		expect(classes).toContain('w-6');
		expect(classes).toContain('h-6');
	});

	it('merges custom className', () => {
		const classes = getDragHandleClasses({
			size: DEFAULT_SIZE,
			disabled: false,
			className: CUSTOM_CLASS_NAME,
		});

		expect(classes).toContain(CUSTOM_CLASS_NAME);
	});
});

describe('moveItem', () => {
	describe('basic movement', () => {
		it('moves item from one index to another', () => {
			const array = ['a', 'b', 'c', 'd'];
			const result = moveItem(array, 1, 3);

			expect(result).toEqual(['a', 'c', 'd', 'b']);
		});

		it('moves item to the beginning', () => {
			const array = ['a', 'b', 'c'];
			const result = moveItem(array, 2, 0);

			expect(result).toEqual(['c', 'a', 'b']);
		});

		it('moves item to the end', () => {
			const array = ['a', 'b', 'c'];
			const result = moveItem(array, 0, 2);

			expect(result).toEqual(['b', 'c', 'a']);
		});
	});

	describe('edge cases', () => {
		it('handles moving to the same index', () => {
			const array = ['a', 'b', 'c'];
			const result = moveItem(array, 1, 1);

			expect(result).toEqual(['a', 'b', 'c']);
		});

		it('handles moving forward', () => {
			const array = ['a', 'b', 'c', 'd'];
			const result = moveItem(array, 0, 2);

			expect(result).toEqual(['b', 'c', 'a', 'd']);
		});

		it('handles moving backward', () => {
			const array = ['a', 'b', 'c', 'd'];
			const result = moveItem(array, 3, 1);

			expect(result).toEqual(['a', 'd', 'b', 'c']);
		});

		it('handles empty array', () => {
			const array: string[] = [];
			const result = moveItem(array, 0, 0);

			expect(result).toEqual([]);
		});

		it('handles invalid fromIndex', () => {
			const array = ['a', 'b', 'c'];
			const result = moveItem(array, 10, 1);

			expect(result).toEqual(['a', 'b', 'c']);
		});
	});

	describe('data types', () => {
		it('handles objects', () => {
			const array = [{ id: 1 }, { id: 2 }, { id: 3 }];
			const result = moveItem(array, 0, 2);

			expect(result).toEqual([{ id: 2 }, { id: 3 }, { id: 1 }]);
		});

		it('does not mutate original array', () => {
			const array = ['a', 'b', 'c'];
			const original = [...array];
			moveItem(array, 0, 2);

			expect(array).toEqual(original);
		});
	});
});

describe('useSortableListConfig', () => {
	it('returns sortable list state', () => {
		const items = [
			{ id: '1', data: 'Item 1' },
			{ id: '2', data: 'Item 2' },
		];
		const onReorder = vi.fn();

		const { result } = renderHook(() =>
			useSortableListConfig({
				items,
				onReorder,
				disabled: false,
			})
		);

		expect(result.current).toBeDefined();
		expect(result.current.draggedItemId).toBeNull();
		expect(result.current.dragTargetIndex).toBeNull();
		expect(typeof result.current.handleDragStart).toBe('function');
		expect(typeof result.current.handleDragEnd).toBe('function');
		expect(typeof result.current.handleDragOver).toBe('function');
		expect(typeof result.current.handleDrop).toBe('function');
		expect(typeof result.current.handleKeyDown).toBe('function');
	});
});

describe('prepareItemHandlers', () => {
	it('prepares event handlers from sortable list state', () => {
		const mockState = createMockSortableListState();

		const handlers = prepareItemHandlers(mockState);

		expect(handlers.handleDragStart).toBe(mockState.handleDragStart);
		expect(handlers.handleDragEnd).toBe(mockState.handleDragEnd);
		expect(handlers.handleDragOver).toBe(mockState.handleDragOver);
		expect(handlers.handleDrop).toBe(mockState.handleDrop);
		expect(handlers.handleKeyDown).toBe(mockState.handleKeyDown);
	});
});

describe('prepareRenderedItems', () => {
	it('prepares rendered items with handlers', () => {
		const items = [
			{ id: '1', data: 'Item 1' },
			{ id: '2', data: 'Item 2' },
		];
		const mockState = createMockSortableListState();

		const view = prepareRenderedItems({
			sortableListState: mockState,
			items,
			showDragHandle: true,
			disabled: false,
			renderItem: item => item.data,
		});

		expect(view).toBeDefined();
		expect(Array.isArray(view)).toBe(true);
		expect(view.length).toBe(items.length);
	});

	it('handles empty items array', () => {
		const mockState = createMockSortableListState();

		const view = prepareRenderedItems({
			sortableListState: mockState,
			items: [],
			showDragHandle: true,
			disabled: false,
			renderItem: () => 'Item',
		});

		expect(view).toEqual([]);
	});
});
