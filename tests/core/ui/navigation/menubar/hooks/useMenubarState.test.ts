/**
 * useMenubarState Tests
 *
 * Tests for menubar state hook:
 * - State initialization
 * - State updates
 * - Ref creation
 */

import { useMenubarState } from '@core/ui/navigation/menubar/hooks/useMenubarState';
import type { MenubarItem } from '@src-types/ui/navigation/menubar';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

const createTestItems = (): readonly MenubarItem[] => [
	{ id: 'file', label: 'File' },
	{ id: 'edit', label: 'Edit' },
	{ id: 'view', label: 'View' },
];

describe('useMenubarState', () => {
	it('initializes with null activeItemId', () => {
		const items = createTestItems();
		const { result } = renderHook(() => useMenubarState(items));

		expect(result.current.activeItemId).toBeNull();
	});

	it('initializes with null openSubmenuId', () => {
		const items = createTestItems();
		const { result } = renderHook(() => useMenubarState(items));

		expect(result.current.openSubmenuId).toBeNull();
	});

	it('creates refs for all items', () => {
		const items = createTestItems();
		const { result } = renderHook(() => useMenubarState(items));

		expect(result.current.itemRefs.size).toBe(3);
		expect(result.current.itemRefs.has('file')).toBe(true);
		expect(result.current.itemRefs.has('edit')).toBe(true);
		expect(result.current.itemRefs.has('view')).toBe(true);
	});

	it('updates activeItemId when setActiveItemId is called', () => {
		const items = createTestItems();
		const { result } = renderHook(() => useMenubarState(items));

		act(() => {
			result.current.setActiveItemId('file');
		});

		expect(result.current.activeItemId).toBe('file');
	});

	it('updates openSubmenuId when setOpenSubmenuId is called', () => {
		const items = createTestItems();
		const { result } = renderHook(() => useMenubarState(items));

		act(() => {
			result.current.setOpenSubmenuId('file');
		});

		expect(result.current.openSubmenuId).toBe('file');
	});

	it('can set activeItemId to null', () => {
		const items = createTestItems();
		const { result } = renderHook(() => useMenubarState(items));

		act(() => {
			result.current.setActiveItemId('file');
			result.current.setActiveItemId(null);
		});

		expect(result.current.activeItemId).toBeNull();
	});

	it('can set openSubmenuId to null', () => {
		const items = createTestItems();
		const { result } = renderHook(() => useMenubarState(items));

		act(() => {
			result.current.setOpenSubmenuId('file');
			result.current.setOpenSubmenuId(null);
		});

		expect(result.current.openSubmenuId).toBeNull();
	});

	it('creates refs when items change', () => {
		const initialItems = createTestItems();
		const { result, rerender } = renderHook(({ items }) => useMenubarState(items), {
			initialProps: { items: initialItems },
		});

		const newItems: readonly MenubarItem[] = [
			{ id: 'file', label: 'File' },
			{ id: 'help', label: 'Help' },
		];

		rerender({ items: newItems });

		expect(result.current.itemRefs.size).toBe(2);
		expect(result.current.itemRefs.has('file')).toBe(true);
		expect(result.current.itemRefs.has('help')).toBe(true);
		expect(result.current.itemRefs.has('edit')).toBe(false);
	});

	it('handles empty items array', () => {
		const items: readonly MenubarItem[] = [];
		const { result } = renderHook(() => useMenubarState(items));

		expect(result.current.itemRefs.size).toBe(0);
		expect(result.current.activeItemId).toBeNull();
		expect(result.current.openSubmenuId).toBeNull();
	});

	it('maintains refs across state updates', () => {
		const items = createTestItems();
		const { result } = renderHook(() => useMenubarState(items));

		const initialRefs = result.current.itemRefs;

		act(() => {
			result.current.setActiveItemId('file');
			result.current.setOpenSubmenuId('edit');
		});

		expect(result.current.itemRefs).toBe(initialRefs);
		expect(result.current.itemRefs.size).toBe(3);
	});
});
