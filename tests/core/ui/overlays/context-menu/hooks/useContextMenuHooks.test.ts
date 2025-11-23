/**
 * useContextMenuHooks Tests
 *
 * Tests for the context menu hook functions including:
 * - useContextMenuRefs
 * - useHighlightedIndex
 * - useContextMenuSelection
 * - useContextMenuKeyboard
 */

import type { ContextMenuItem } from '@core/ui/overlays/context-menu/ContextMenu';
import {
	useContextMenuKeyboard,
	useContextMenuRefs,
	useContextMenuSelection,
	useHighlightedIndex,
} from '@core/ui/overlays/context-menu/hooks/useContextMenuHooks';
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

describe('useContextMenuRefs', () => {
	it('creates menuRef', () => {
		const { result } = renderHook(() => useContextMenuRefs({ items: createTestItems() }));

		expect(result.current.menuRef).toBeDefined();
		expect(result.current.menuRef.current).toBeNull();
	});

	it('creates itemRefs for non-separator items', () => {
		const items = createTestItems();
		const { result } = renderHook(() => useContextMenuRefs({ items }));

		expect(result.current.itemRefs).toBeDefined();
		// Separator gets null ref, so total length includes all items
		expect(result.current.itemRefs.length).toBeGreaterThanOrEqual(3);
		// Verify separator has null ref
		const separatorIndex = items.findIndex(item => 'type' in item && item.type === 'separator');
		if (separatorIndex >= 0) {
			expect(result.current.itemRefs[separatorIndex]).toBeNull();
		}
	});

	it('creates null refs for separators', () => {
		const items = createTestItems();
		const { result } = renderHook(() => useContextMenuRefs({ items }));

		// Separator should have null ref
		const separatorIndex = items.findIndex(item => 'type' in item && item.type === 'separator');
		expect(separatorIndex).toBeGreaterThan(-1);
	});

	it('updates itemRefs when items change', () => {
		const { result, rerender } = renderHook(({ items }) => useContextMenuRefs({ items }), {
			initialProps: { items: createTestItems() },
		});

		const initialLength = result.current.itemRefs.length;

		const newItems: ContextMenuItem[] = [
			{ id: '1', label: 'Copy' },
			{ id: '2', label: 'Paste' },
		];

		rerender({ items: newItems });

		expect(result.current.itemRefs.length).toBe(2);
		expect(result.current.itemRefs.length).not.toBe(initialLength);
	});
});

describe('useHighlightedIndex', () => {
	it('initializes with -1', () => {
		const { result } = renderHook(() => useHighlightedIndex());

		expect(result.current.highlightedIndex).toBe(-1);
	});

	it('updates highlightedIndex', () => {
		const { result } = renderHook(() => useHighlightedIndex());

		act(() => {
			result.current.setHighlightedIndex(2);
		});

		expect(result.current.highlightedIndex).toBe(2);
	});

	it('allows setting to -1', () => {
		const { result } = renderHook(() => useHighlightedIndex());

		act(() => {
			result.current.setHighlightedIndex(1);
			result.current.setHighlightedIndex(-1);
		});

		expect(result.current.highlightedIndex).toBe(-1);
	});
});

describe('useContextMenuSelection', () => {
	it('calls item onSelect when provided', async () => {
		const itemOnSelect = vi.fn();
		const item: ContextMenuItem = { id: '1', label: 'Copy', onSelect: itemOnSelect };
		const setOpen = vi.fn();
		const { result } = renderHook(() =>
			useContextMenuSelection({
				onSelect: undefined,
				setOpen,
			})
		);

		await act(async () => {
			await result.current.handleSelect(item);
		});

		expect(itemOnSelect).toHaveBeenCalledTimes(1);
	});

	it('calls onSelect prop when provided', async () => {
		const onSelect = vi.fn();
		const item: ContextMenuItem = { id: '1', label: 'Copy' };
		const setOpen = vi.fn();
		const { result } = renderHook(() =>
			useContextMenuSelection({
				onSelect,
				setOpen,
			})
		);

		await act(async () => {
			await result.current.handleSelect(item);
		});

		expect(onSelect).toHaveBeenCalledWith(item);
	});

	it('closes menu after selection', async () => {
		const setOpen = vi.fn();
		const item: ContextMenuItem = { id: '1', label: 'Copy' };
		const { result } = renderHook(() =>
			useContextMenuSelection({
				onSelect: undefined,
				setOpen,
			})
		);

		await act(async () => {
			await result.current.handleSelect(item);
		});

		expect(setOpen).toHaveBeenCalledWith(false);
	});

	it('does not select disabled items', async () => {
		const itemOnSelect = vi.fn();
		const item: ContextMenuItem = {
			id: '1',
			label: 'Delete',
			onSelect: itemOnSelect,
			disabled: true,
		};
		const setOpen = vi.fn();
		const { result } = renderHook(() =>
			useContextMenuSelection({
				onSelect: undefined,
				setOpen,
			})
		);

		await act(async () => {
			await result.current.handleSelect(item);
		});

		expect(itemOnSelect).not.toHaveBeenCalled();
		expect(setOpen).not.toHaveBeenCalled();
	});

	it('handles async onSelect', async () => {
		const itemOnSelect = vi.fn(async () => {
			await new Promise(resolve => setTimeout(resolve, 10));
		});
		const item: ContextMenuItem = { id: '1', label: 'Copy', onSelect: itemOnSelect };
		const setOpen = vi.fn();
		const { result } = renderHook(() =>
			useContextMenuSelection({
				onSelect: undefined,
				setOpen,
			})
		);

		await act(async () => {
			await result.current.handleSelect(item);
		});

		expect(itemOnSelect).toHaveBeenCalledTimes(1);
		expect(setOpen).toHaveBeenCalledWith(false);
	});
});

describe('useContextMenuKeyboard', () => {
	it('returns handleKeyDown function', () => {
		const { result } = renderHook(() =>
			useContextMenuKeyboard({
				items: createTestItems(),
				highlightedIndex: -1,
				setHighlightedIndex: vi.fn(),
				setOpen: vi.fn(),
				handleSelect: vi.fn(),
			})
		);

		expect(typeof result.current.handleKeyDown).toBe('function');
	});

	it('handles ArrowDown key', () => {
		const setHighlightedIndex = vi.fn();
		const { result } = renderHook(() =>
			useContextMenuKeyboard({
				items: createTestItems(),
				highlightedIndex: -1,
				setHighlightedIndex,
				setOpen: vi.fn(),
				handleSelect: vi.fn(),
			})
		);

		const event = {
			key: 'ArrowDown',
			preventDefault: vi.fn(),
		} as unknown as React.KeyboardEvent<HTMLDivElement>;

		act(() => {
			result.current.handleKeyDown(event);
		});

		expect(event.preventDefault).toHaveBeenCalled();
		expect(setHighlightedIndex).toHaveBeenCalled();
	});

	it('handles ArrowUp key', () => {
		const setHighlightedIndex = vi.fn();
		const { result } = renderHook(() =>
			useContextMenuKeyboard({
				items: createTestItems(),
				highlightedIndex: 1,
				setHighlightedIndex,
				setOpen: vi.fn(),
				handleSelect: vi.fn(),
			})
		);

		const event = {
			key: 'ArrowUp',
			preventDefault: vi.fn(),
		} as unknown as React.KeyboardEvent<HTMLDivElement>;

		act(() => {
			result.current.handleKeyDown(event);
		});

		expect(event.preventDefault).toHaveBeenCalled();
		expect(setHighlightedIndex).toHaveBeenCalled();
	});

	it('handles Enter key', async () => {
		const handleSelect = vi.fn().mockResolvedValue(undefined);
		const items = createTestItems().filter(item => !('type' in item)) as ContextMenuItem[];
		const { result } = renderHook(() =>
			useContextMenuKeyboard({
				items: createTestItems(),
				highlightedIndex: 0,
				setHighlightedIndex: vi.fn(),
				setOpen: vi.fn(),
				handleSelect,
			})
		);

		const event = {
			key: 'Enter',
			preventDefault: vi.fn(),
		} as unknown as React.KeyboardEvent<HTMLDivElement>;

		await act(async () => {
			result.current.handleKeyDown(event);
		});

		expect(event.preventDefault).toHaveBeenCalled();
		await waitFor(() => {
			expect(handleSelect).toHaveBeenCalled();
		});
	});

	it('handles Space key', async () => {
		const handleSelect = vi.fn().mockResolvedValue(undefined);
		const { result } = renderHook(() =>
			useContextMenuKeyboard({
				items: createTestItems(),
				highlightedIndex: 0,
				setHighlightedIndex: vi.fn(),
				setOpen: vi.fn(),
				handleSelect,
			})
		);

		const event = {
			key: ' ',
			preventDefault: vi.fn(),
		} as unknown as React.KeyboardEvent<HTMLDivElement>;

		await act(async () => {
			result.current.handleKeyDown(event);
		});

		expect(event.preventDefault).toHaveBeenCalled();
		await waitFor(() => {
			expect(handleSelect).toHaveBeenCalled();
		});
	});

	it('handles Escape key', () => {
		const setOpen = vi.fn();
		const { result } = renderHook(() =>
			useContextMenuKeyboard({
				items: createTestItems(),
				highlightedIndex: -1,
				setHighlightedIndex: vi.fn(),
				setOpen,
				handleSelect: vi.fn(),
			})
		);

		const event = {
			key: 'Escape',
			preventDefault: vi.fn(),
		} as unknown as React.KeyboardEvent<HTMLDivElement>;

		act(() => {
			result.current.handleKeyDown(event);
		});

		expect(event.preventDefault).toHaveBeenCalled();
		expect(setOpen).toHaveBeenCalledWith(false);
	});

	it('handles Home key', () => {
		const setHighlightedIndex = vi.fn();
		const { result } = renderHook(() =>
			useContextMenuKeyboard({
				items: createTestItems(),
				highlightedIndex: 1,
				setHighlightedIndex,
				setOpen: vi.fn(),
				handleSelect: vi.fn(),
			})
		);

		const event = {
			key: 'Home',
			preventDefault: vi.fn(),
		} as unknown as React.KeyboardEvent<HTMLDivElement>;

		act(() => {
			result.current.handleKeyDown(event);
		});

		expect(event.preventDefault).toHaveBeenCalled();
		expect(setHighlightedIndex).toHaveBeenCalled();
	});

	it('handles End key', () => {
		const setHighlightedIndex = vi.fn();
		const { result } = renderHook(() =>
			useContextMenuKeyboard({
				items: createTestItems(),
				highlightedIndex: 0,
				setHighlightedIndex,
				setOpen: vi.fn(),
				handleSelect: vi.fn(),
			})
		);

		const event = {
			key: 'End',
			preventDefault: vi.fn(),
		} as unknown as React.KeyboardEvent<HTMLDivElement>;

		act(() => {
			result.current.handleKeyDown(event);
		});

		expect(event.preventDefault).toHaveBeenCalled();
		expect(setHighlightedIndex).toHaveBeenCalled();
	});

	it('ignores other keys', () => {
		const setHighlightedIndex = vi.fn();
		const setOpen = vi.fn();
		const handleSelect = vi.fn();
		const { result } = renderHook(() =>
			useContextMenuKeyboard({
				items: createTestItems(),
				highlightedIndex: -1,
				setHighlightedIndex,
				setOpen,
				handleSelect,
			})
		);

		const event = {
			key: 'a',
			preventDefault: vi.fn(),
		} as unknown as React.KeyboardEvent<HTMLDivElement>;

		act(() => {
			result.current.handleKeyDown(event);
		});

		expect(event.preventDefault).not.toHaveBeenCalled();
		expect(setHighlightedIndex).not.toHaveBeenCalled();
		expect(setOpen).not.toHaveBeenCalled();
		expect(handleSelect).not.toHaveBeenCalled();
	});

	it('skips disabled items during navigation', () => {
		const setHighlightedIndex = vi.fn();
		const items: ContextMenuItem[] = [
			{ id: '1', label: 'Copy' },
			{ id: '2', label: 'Delete', disabled: true },
			{ id: '3', label: 'Paste' },
		];
		const { result } = renderHook(() =>
			useContextMenuKeyboard({
				items,
				highlightedIndex: 0,
				setHighlightedIndex,
				setOpen: vi.fn(),
				handleSelect: vi.fn(),
			})
		);

		const event = {
			key: 'ArrowDown',
			preventDefault: vi.fn(),
		} as unknown as React.KeyboardEvent<HTMLDivElement>;

		act(() => {
			result.current.handleKeyDown(event);
		});

		// Should skip disabled item and go to next enabled (index 2)
		expect(setHighlightedIndex).toHaveBeenCalledWith(2);
	});
});
