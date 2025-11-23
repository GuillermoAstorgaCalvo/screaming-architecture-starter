/**
 * useContextMenu Tests
 *
 * Tests for the useContextMenu hook including:
 * - Returns all required properties
 * - Controlled and uncontrolled modes
 * - Focus management
 * - Item selection
 * - Keyboard navigation
 * - Ref management
 */

import type { ContextMenuItem } from '@core/ui/overlays/context-menu/ContextMenu';
import { useContextMenu } from '@core/ui/overlays/context-menu/hooks/useContextMenu';
import { renderHook, waitFor } from '@testing-library/react';
import { act } from 'react';
import { describe, expect, it, vi } from 'vitest';

const createTestItems = (): Array<
	ContextMenuItem | { readonly id: string; readonly type: 'separator' }
> => [
	{ id: '1', label: 'Copy', onSelect: vi.fn() },
	{ id: '2', label: 'Paste', onSelect: vi.fn() },
	{ id: 'sep1', type: 'separator' as const },
	{ id: '3', label: 'Delete', onSelect: vi.fn(), disabled: true },
];

describe('useContextMenu', () => {
	it('returns all required properties', () => {
		const { result } = renderHook(() =>
			useContextMenu({
				items: createTestItems(),
			})
		);

		expect(result.current).toHaveProperty('open');
		expect(result.current).toHaveProperty('menuRef');
		expect(result.current).toHaveProperty('itemRefs');
		expect(result.current).toHaveProperty('highlightedIndex');
		expect(result.current).toHaveProperty('setHighlightedIndex');
		expect(result.current).toHaveProperty('menuId');
		expect(result.current).toHaveProperty('setOpen');
		expect(result.current).toHaveProperty('focusItem');
		expect(result.current).toHaveProperty('handleSelect');
		expect(result.current).toHaveProperty('handleKeyDown');
	});

	it('initializes with closed state in uncontrolled mode', () => {
		const { result } = renderHook(() =>
			useContextMenu({
				items: createTestItems(),
			})
		);

		expect(result.current.open).toBe(false);
	});

	it('respects isOpen prop in controlled mode', () => {
		const { result, rerender } = renderHook(
			({ isOpen }) =>
				useContextMenu({
					items: createTestItems(),
					isOpen,
				}),
			{ initialProps: { isOpen: false } }
		);

		expect(result.current.open).toBe(false);

		rerender({ isOpen: true });

		expect(result.current.open).toBe(true);
	});

	it('calls onOpenChange when state changes', () => {
		const onOpenChange = vi.fn();
		const { result } = renderHook(() =>
			useContextMenu({
				items: createTestItems(),
				isOpen: false,
				onOpenChange,
			})
		);

		act(() => {
			result.current.setOpen(true);
		});

		expect(onOpenChange).toHaveBeenCalledWith(true);
	});

	it('does not update internal state in controlled mode', () => {
		const onOpenChange = vi.fn();
		const { result } = renderHook(() =>
			useContextMenu({
				items: createTestItems(),
				isOpen: false,
				onOpenChange,
			})
		);

		act(() => {
			result.current.setOpen(true);
		});

		// In controlled mode, open state should remain false until prop changes
		expect(result.current.open).toBe(false);
		expect(onOpenChange).toHaveBeenCalledWith(true);
	});

	it('updates internal state in uncontrolled mode', () => {
		const { result } = renderHook(() =>
			useContextMenu({
				items: createTestItems(),
			})
		);

		act(() => {
			result.current.setOpen(true);
		});

		expect(result.current.open).toBe(true);
	});

	it('resets highlightedIndex when closing', () => {
		const { result } = renderHook(() =>
			useContextMenu({
				items: createTestItems(),
			})
		);

		act(() => {
			result.current.setOpen(true);
			result.current.setHighlightedIndex(1);
		});

		expect(result.current.highlightedIndex).toBe(1);

		act(() => {
			result.current.setOpen(false);
		});

		expect(result.current.highlightedIndex).toBe(-1);
	});

	it('creates refs for menu and items', () => {
		const { result } = renderHook(() =>
			useContextMenu({
				items: createTestItems(),
			})
		);

		expect(result.current.menuRef).toBeDefined();
		expect(result.current.itemRefs).toBeDefined();
		expect(result.current.itemRefs.length).toBeGreaterThan(0);
	});

	it('creates itemRefs only for non-separator items', () => {
		const items = createTestItems();
		const { result } = renderHook(() =>
			useContextMenu({
				items,
			})
		);

		// Should have refs for all non-separator items (Copy, Paste, Delete)
		// The separator gets a null ref, so total length includes it
		expect(result.current.itemRefs.length).toBeGreaterThanOrEqual(3);
		// Verify separator has null ref
		const separatorIndex = items.findIndex(item => 'type' in item && item.type === 'separator');
		if (separatorIndex >= 0) {
			expect(result.current.itemRefs[separatorIndex]).toBeNull();
		}
	});

	it('generates unique menuId', () => {
		const { result: result1 } = renderHook(() =>
			useContextMenu({
				items: createTestItems(),
			})
		);

		const { result: result2 } = renderHook(() =>
			useContextMenu({
				items: createTestItems(),
			})
		);

		expect(result1.current.menuId).toBeDefined();
		expect(result2.current.menuId).toBeDefined();
		expect(result1.current.menuId).not.toBe(result2.current.menuId);
	});

	it('calls onSelect when item is selected', async () => {
		const onSelect = vi.fn();
		const itemOnSelect = vi.fn();
		const items: ContextMenuItem[] = [{ id: '1', label: 'Copy', onSelect: itemOnSelect }];
		const { result } = renderHook(() =>
			useContextMenu({
				items,
				onSelect,
			})
		);

		await act(async () => {
			expect(items[0]).toBeDefined();
			await result.current.handleSelect(items[0]!);
		});

		expect(itemOnSelect).toHaveBeenCalledTimes(1);
		expect(onSelect).toHaveBeenCalledWith(items[0]);
	});

	it('closes menu after item selection', async () => {
		const items: ContextMenuItem[] = [{ id: '1', label: 'Copy', onSelect: vi.fn() }];
		const { result } = renderHook(() =>
			useContextMenu({
				items,
			})
		);

		act(() => {
			result.current.setOpen(true);
		});

		expect(result.current.open).toBe(true);

		await act(async () => {
			expect(items[0]).toBeDefined();
			await result.current.handleSelect(items[0]!);
		});

		expect(result.current.open).toBe(false);
	});

	it('does not select disabled items', async () => {
		const itemOnSelect = vi.fn();
		const items: ContextMenuItem[] = [
			{ id: '1', label: 'Delete', onSelect: itemOnSelect, disabled: true },
		];
		const { result } = renderHook(() =>
			useContextMenu({
				items,
			})
		);

		await act(async () => {
			expect(items[0]).toBeDefined();
			await result.current.handleSelect(items[0]!);
		});

		expect(itemOnSelect).not.toHaveBeenCalled();
	});

	it('handles keyboard navigation', () => {
		const { result } = renderHook(() =>
			useContextMenu({
				items: createTestItems(),
			})
		);

		act(() => {
			result.current.setOpen(true);
		});

		const event = {
			key: 'ArrowDown',
			preventDefault: vi.fn(),
		} as unknown as React.KeyboardEvent<HTMLDivElement>;

		act(() => {
			result.current.handleKeyDown(event);
		});

		// Should highlight first enabled item
		expect(result.current.highlightedIndex).toBeGreaterThanOrEqual(0);
	});

	it('focuses first enabled item when opening', async () => {
		const items = createTestItems();
		const { result } = renderHook(() =>
			useContextMenu({
				items,
			})
		);

		// Mock focus method
		const mockFocus = vi.fn();
		if (result.current.itemRefs[0]?.current) {
			result.current.itemRefs[0].current.focus = mockFocus;
		}

		act(() => {
			result.current.setOpen(true);
		});

		await waitFor(() => {
			expect(result.current.highlightedIndex).toBeGreaterThanOrEqual(0);
		});
	});

	it('focuses menu when no enabled items', async () => {
		const items: ContextMenuItem[] = [{ id: '1', label: 'Item', disabled: true }];
		const { result } = renderHook(() =>
			useContextMenu({
				items,
			})
		);

		// Create a mock element with focus method
		const mockElement = document.createElement('div');
		const mockFocus = vi.fn();
		mockElement.focus = mockFocus;
		result.current.menuRef.current = mockElement;

		act(() => {
			result.current.setOpen(true);
		});

		await waitFor(
			() => {
				// Menu should be focused when no enabled items
				expect(mockFocus).toHaveBeenCalled();
			},
			{ timeout: 2000 }
		);
	});
});
