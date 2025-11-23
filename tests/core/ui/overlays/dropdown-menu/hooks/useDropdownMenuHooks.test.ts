/**
 * Tests for useDropdownMenuHooks
 *
 * Tests the hooks used by DropdownMenu:
 * - useDropdownMenuRefs: refs management
 * - useHighlightedIndex: highlighted index state
 * - useDropdownMenuSelection: selection handling
 * - useDropdownMenuKeyboard: keyboard event handling
 */

import {
	useDropdownMenuKeyboard,
	useDropdownMenuRefs,
	useDropdownMenuSelection,
	useHighlightedIndex,
} from '@core/ui/overlays/dropdown-menu/hooks/useDropdownMenuHooks';
import type {
	DropdownMenuItem,
	DropdownMenuItemOrSeparator,
} from '@core/ui/overlays/dropdown-menu/types/DropdownMenu.types';
import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

function createMockItem(id: string, disabled = false): DropdownMenuItem {
	return {
		id,
		label: `Item ${id}`,
		disabled,
		onSelect: vi.fn(),
	};
}

function createMockSeparator(id: string): { readonly id: string; readonly type: 'separator' } {
	return { id, type: 'separator' };
}

describe('useDropdownMenuHooks - useDropdownMenuRefs', () => {
	it('returns menuRef and itemRefs', () => {
		const items: DropdownMenuItemOrSeparator[] = [createMockItem('1'), createMockItem('2')];
		const { result } = renderHook(() => useDropdownMenuRefs({ items }));

		expect(result.current.menuRef).toBeDefined();
		expect(result.current.itemRefs).toBeDefined();
		expect(result.current.itemRefs).toHaveLength(2);
	});

	it('creates refs only for non-separator items', () => {
		const items: DropdownMenuItemOrSeparator[] = [
			createMockItem('1'),
			createMockSeparator('sep1'),
			createMockItem('2'),
		];
		const { result } = renderHook(() => useDropdownMenuRefs({ items }));

		expect(result.current.itemRefs).toHaveLength(3);
		expect(result.current.itemRefs[0]).toBeDefined();
		expect(result.current.itemRefs[1]).toBeNull();
		expect(result.current.itemRefs[2]).toBeDefined();
	});

	it('updates refs when items change', () => {
		const { result, rerender } = renderHook(({ items }) => useDropdownMenuRefs({ items }), {
			initialProps: {
				items: [createMockItem('1')] as DropdownMenuItemOrSeparator[],
			},
		});

		expect(result.current.itemRefs).toHaveLength(1);

		rerender({
			items: [createMockItem('1'), createMockItem('2')] as DropdownMenuItemOrSeparator[],
		});

		expect(result.current.itemRefs).toHaveLength(2);
	});

	it('handles empty items array', () => {
		const { result } = renderHook(() => useDropdownMenuRefs({ items: [] }));

		expect(result.current.menuRef).toBeDefined();
		expect(result.current.itemRefs).toHaveLength(0);
	});
});

describe('useDropdownMenuHooks - useHighlightedIndex', () => {
	it('initializes with -1', () => {
		const { result } = renderHook(() => useHighlightedIndex());

		expect(result.current.highlightedIndex).toBe(-1);
		expect(result.current.setHighlightedIndex).toBeDefined();
	});

	it('updates highlighted index when setHighlightedIndex is called', async () => {
		const { result } = renderHook(() => useHighlightedIndex());

		act(() => {
			result.current.setHighlightedIndex(2);
		});

		await waitFor(() => {
			expect(result.current.highlightedIndex).toBe(2);
		});
	});

	it('allows setting highlighted index multiple times', async () => {
		const { result } = renderHook(() => useHighlightedIndex());

		act(() => {
			result.current.setHighlightedIndex(0);
		});

		await waitFor(() => {
			expect(result.current.highlightedIndex).toBe(0);
		});

		act(() => {
			result.current.setHighlightedIndex(5);
		});

		await waitFor(() => {
			expect(result.current.highlightedIndex).toBe(5);
		});

		act(() => {
			result.current.setHighlightedIndex(-1);
		});

		await waitFor(() => {
			expect(result.current.highlightedIndex).toBe(-1);
		});
	});
});

describe('useDropdownMenuHooks - useDropdownMenuSelection', () => {
	it('returns handleSelect function', () => {
		const setOpen = vi.fn();
		const { result } = renderHook(() => useDropdownMenuSelection({ onSelect: undefined, setOpen }));

		expect(result.current.handleSelect).toBeDefined();
		expect(typeof result.current.handleSelect).toBe('function');
	});

	it('calls item.onSelect when provided', async () => {
		const setOpen = vi.fn();
		const onSelect = vi.fn();
		const itemOnSelect = vi.fn().mockResolvedValue(undefined);
		const item: DropdownMenuItem = {
			...createMockItem('1'),
			onSelect: itemOnSelect,
		};

		const { result } = renderHook(() => useDropdownMenuSelection({ onSelect, setOpen }));

		await result.current.handleSelect(item);

		expect(itemOnSelect).toHaveBeenCalled();
		expect(onSelect).toHaveBeenCalledWith(item);
		expect(setOpen).toHaveBeenCalledWith(false);
	});

	it('calls onSelect callback when provided', async () => {
		const setOpen = vi.fn();
		const onSelect = vi.fn();
		const item = createMockItem('1');

		const { result } = renderHook(() => useDropdownMenuSelection({ onSelect, setOpen }));

		await result.current.handleSelect(item);

		expect(onSelect).toHaveBeenCalledWith(item);
		expect(setOpen).toHaveBeenCalledWith(false);
	});

	it('closes menu after selection', async () => {
		const setOpen = vi.fn();
		const item = createMockItem('1');

		const { result } = renderHook(() => useDropdownMenuSelection({ onSelect: undefined, setOpen }));

		await result.current.handleSelect(item);

		expect(setOpen).toHaveBeenCalledWith(false);
	});

	it('does not call onSelect or close menu for disabled items', async () => {
		const setOpen = vi.fn();
		const onSelect = vi.fn();
		const item = createMockItem('1', true);

		const { result } = renderHook(() => useDropdownMenuSelection({ onSelect, setOpen }));

		await result.current.handleSelect(item);

		expect(onSelect).not.toHaveBeenCalled();
		expect(setOpen).not.toHaveBeenCalled();
	});

	it('handles async item.onSelect', async () => {
		const setOpen = vi.fn();
		const itemOnSelect = vi.fn().mockResolvedValue(undefined);
		const item: DropdownMenuItem = {
			...createMockItem('1'),
			onSelect: itemOnSelect,
		};

		const { result } = renderHook(() => useDropdownMenuSelection({ onSelect: undefined, setOpen }));

		await result.current.handleSelect(item);

		expect(itemOnSelect).toHaveBeenCalled();
		expect(setOpen).toHaveBeenCalledWith(false);
	});

	it('handles item.onSelect that returns void', async () => {
		const setOpen = vi.fn();
		const itemOnSelect = vi.fn();
		const item: DropdownMenuItem = {
			...createMockItem('1'),
			onSelect: itemOnSelect,
		};

		const { result } = renderHook(() => useDropdownMenuSelection({ onSelect: undefined, setOpen }));

		await result.current.handleSelect(item);

		expect(itemOnSelect).toHaveBeenCalled();
		expect(setOpen).toHaveBeenCalledWith(false);
	});
});

describe('useDropdownMenuHooks - useDropdownMenuKeyboard', () => {
	it('returns handleKeyDown function', () => {
		const items: DropdownMenuItemOrSeparator[] = [createMockItem('1')];
		const { result } = renderHook(() =>
			useDropdownMenuKeyboard({
				open: true,
				items,
				highlightedIndex: 0,
				setHighlightedIndex: vi.fn(),
				setOpen: vi.fn(),
				handleSelect: vi.fn().mockResolvedValue(undefined),
			})
		);

		expect(result.current.handleKeyDown).toBeDefined();
		expect(typeof result.current.handleKeyDown).toBe('function');
	});

	it('does not process keyboard events when menu is closed', () => {
		const items: DropdownMenuItemOrSeparator[] = [createMockItem('1')];
		const setHighlightedIndex = vi.fn();
		const { result } = renderHook(() =>
			useDropdownMenuKeyboard({
				open: false,
				items,
				highlightedIndex: 0,
				setHighlightedIndex,
				setOpen: vi.fn(),
				handleSelect: vi.fn().mockResolvedValue(undefined),
			})
		);

		const event = {
			key: 'ArrowDown',
			preventDefault: vi.fn(),
		} as unknown as React.KeyboardEvent<HTMLDivElement>;

		result.current.handleKeyDown(event);

		expect(setHighlightedIndex).not.toHaveBeenCalled();
	});

	it('does not process keyboard events when items array is empty', () => {
		const setHighlightedIndex = vi.fn();
		const { result } = renderHook(() =>
			useDropdownMenuKeyboard({
				open: true,
				items: [],
				highlightedIndex: 0,
				setHighlightedIndex,
				setOpen: vi.fn(),
				handleSelect: vi.fn().mockResolvedValue(undefined),
			})
		);

		const event = {
			key: 'ArrowDown',
			preventDefault: vi.fn(),
		} as unknown as React.KeyboardEvent<HTMLDivElement>;

		result.current.handleKeyDown(event);

		expect(setHighlightedIndex).not.toHaveBeenCalled();
	});

	it('handles ArrowDown key', () => {
		const items: DropdownMenuItemOrSeparator[] = [createMockItem('1'), createMockItem('2')];
		const setHighlightedIndex = vi.fn();
		const { result } = renderHook(() =>
			useDropdownMenuKeyboard({
				open: true,
				items,
				highlightedIndex: 0,
				setHighlightedIndex,
				setOpen: vi.fn(),
				handleSelect: vi.fn().mockResolvedValue(undefined),
			})
		);

		const event = {
			key: 'ArrowDown',
			preventDefault: vi.fn(),
		} as unknown as React.KeyboardEvent<HTMLDivElement>;

		result.current.handleKeyDown(event);

		expect(setHighlightedIndex).toHaveBeenCalledWith(1);
	});

	it('handles ArrowUp key', () => {
		const items: DropdownMenuItemOrSeparator[] = [createMockItem('1'), createMockItem('2')];
		const setHighlightedIndex = vi.fn();
		const { result } = renderHook(() =>
			useDropdownMenuKeyboard({
				open: true,
				items,
				highlightedIndex: 1,
				setHighlightedIndex,
				setOpen: vi.fn(),
				handleSelect: vi.fn().mockResolvedValue(undefined),
			})
		);

		const event = {
			key: 'ArrowUp',
			preventDefault: vi.fn(),
		} as unknown as React.KeyboardEvent<HTMLDivElement>;

		result.current.handleKeyDown(event);

		expect(setHighlightedIndex).toHaveBeenCalledWith(0);
	});

	it('handles Home key', () => {
		const items: DropdownMenuItemOrSeparator[] = [createMockItem('1'), createMockItem('2')];
		const setHighlightedIndex = vi.fn();
		const { result } = renderHook(() =>
			useDropdownMenuKeyboard({
				open: true,
				items,
				highlightedIndex: 1,
				setHighlightedIndex,
				setOpen: vi.fn(),
				handleSelect: vi.fn().mockResolvedValue(undefined),
			})
		);

		const event = {
			key: 'Home',
			preventDefault: vi.fn(),
		} as unknown as React.KeyboardEvent<HTMLDivElement>;

		result.current.handleKeyDown(event);

		expect(setHighlightedIndex).toHaveBeenCalledWith(0);
	});

	it('handles End key', () => {
		const items: DropdownMenuItemOrSeparator[] = [createMockItem('1'), createMockItem('2')];
		const setHighlightedIndex = vi.fn();
		const { result } = renderHook(() =>
			useDropdownMenuKeyboard({
				open: true,
				items,
				highlightedIndex: 0,
				setHighlightedIndex,
				setOpen: vi.fn(),
				handleSelect: vi.fn().mockResolvedValue(undefined),
			})
		);

		const event = {
			key: 'End',
			preventDefault: vi.fn(),
		} as unknown as React.KeyboardEvent<HTMLDivElement>;

		result.current.handleKeyDown(event);

		expect(setHighlightedIndex).toHaveBeenCalledWith(1);
	});

	it('handles Escape key', () => {
		const items: DropdownMenuItemOrSeparator[] = [createMockItem('1')];
		const setOpen = vi.fn();
		const { result } = renderHook(() =>
			useDropdownMenuKeyboard({
				open: true,
				items,
				highlightedIndex: 0,
				setHighlightedIndex: vi.fn(),
				setOpen,
				handleSelect: vi.fn().mockResolvedValue(undefined),
			})
		);

		const event = {
			key: 'Escape',
			preventDefault: vi.fn(),
		} as unknown as React.KeyboardEvent<HTMLDivElement>;

		result.current.handleKeyDown(event);

		expect(setOpen).toHaveBeenCalledWith(false);
	});

	it('handles Enter key', async () => {
		const items: DropdownMenuItemOrSeparator[] = [createMockItem('1')];
		const handleSelect = vi.fn().mockResolvedValue(undefined);
		const { result } = renderHook(() =>
			useDropdownMenuKeyboard({
				open: true,
				items,
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

		result.current.handleKeyDown(event);

		await waitFor(() => {
			expect(handleSelect).toHaveBeenCalled();
		});
	});

	it('handles Space key', async () => {
		const items: DropdownMenuItemOrSeparator[] = [createMockItem('1')];
		const handleSelect = vi.fn().mockResolvedValue(undefined);
		const { result } = renderHook(() =>
			useDropdownMenuKeyboard({
				open: true,
				items,
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

		result.current.handleKeyDown(event);

		await waitFor(() => {
			expect(handleSelect).toHaveBeenCalled();
		});
	});

	it('ignores unknown keys', () => {
		const items: DropdownMenuItemOrSeparator[] = [createMockItem('1')];
		const setHighlightedIndex = vi.fn();
		const setOpen = vi.fn();
		const handleSelect = vi.fn();
		const { result } = renderHook(() =>
			useDropdownMenuKeyboard({
				open: true,
				items,
				highlightedIndex: 0,
				setHighlightedIndex,
				setOpen,
				handleSelect,
			})
		);

		const event = {
			key: 'a',
			preventDefault: vi.fn(),
		} as unknown as React.KeyboardEvent<HTMLDivElement>;

		result.current.handleKeyDown(event);

		expect(setHighlightedIndex).not.toHaveBeenCalled();
		expect(setOpen).not.toHaveBeenCalled();
		expect(handleSelect).not.toHaveBeenCalled();
	});
});
