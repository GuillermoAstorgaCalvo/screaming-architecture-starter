/**
 * Tests for DropdownMenuNavigation
 *
 * Tests the navigation helper functions used by DropdownMenu:
 * - findNextEnabledIndex: finding next enabled item index
 * - handleArrowKeyNavigation: arrow key navigation
 * - handleHomeKey: home key navigation
 * - handleEndKey: end key navigation
 * - handleEscapeKey: escape key handling
 * - handleEnterOrSpace: enter/space key handling
 */

import {
	findNextEnabledIndex,
	handleArrowKeyNavigation,
	handleEndKey,
	handleEnterOrSpace,
	handleEscapeKey,
	handleHomeKey,
} from '@core/ui/overlays/dropdown-menu/helpers/DropdownMenuNavigation';
import type {
	DropdownMenuItem,
	DropdownMenuItemOrSeparator,
} from '@core/ui/overlays/dropdown-menu/types/DropdownMenu.types';
import { describe, expect, it, vi } from 'vitest';

function createMockItem(id: string, disabled = false): DropdownMenuItem {
	return {
		id,
		label: `Item ${id}`,
		disabled,
	};
}

function createMockSeparator(id: string): { readonly id: string; readonly type: 'separator' } {
	return { id, type: 'separator' };
}

describe('DropdownMenuNavigation - findNextEnabledIndex', () => {
	it('returns -1 when items array is empty', () => {
		const result = findNextEnabledIndex([], 0, 1);
		expect(result).toBe(-1);
	});

	it('finds next enabled index (forward direction)', () => {
		const items: DropdownMenuItemOrSeparator[] = [
			createMockItem('1'),
			createMockItem('2', true),
			createMockItem('3'),
		];
		const result = findNextEnabledIndex(items, 0, 1);
		expect(result).toBe(2);
	});

	it('finds previous enabled index (backward direction)', () => {
		const items: DropdownMenuItemOrSeparator[] = [
			createMockItem('1'),
			createMockItem('2', true),
			createMockItem('3'),
		];
		const result = findNextEnabledIndex(items, 2, -1);
		expect(result).toBe(0);
	});

	it('wraps around when reaching end (forward direction)', () => {
		const items: DropdownMenuItemOrSeparator[] = [createMockItem('1'), createMockItem('2')];
		const result = findNextEnabledIndex(items, 1, 1);
		expect(result).toBe(0);
	});

	it('wraps around when reaching start (backward direction)', () => {
		const items: DropdownMenuItemOrSeparator[] = [createMockItem('1'), createMockItem('2')];
		const result = findNextEnabledIndex(items, 0, -1);
		expect(result).toBe(1);
	});

	it('skips disabled items (forward direction)', () => {
		const items: DropdownMenuItemOrSeparator[] = [
			createMockItem('1'),
			createMockItem('2', true),
			createMockItem('3', true),
			createMockItem('4'),
		];
		const result = findNextEnabledIndex(items, 0, 1);
		expect(result).toBe(3);
	});

	it('skips disabled items (backward direction)', () => {
		const items: DropdownMenuItemOrSeparator[] = [
			createMockItem('1'),
			createMockItem('2', true),
			createMockItem('3', true),
			createMockItem('4'),
		];
		const result = findNextEnabledIndex(items, 3, -1);
		expect(result).toBe(0);
	});

	it('skips separators (forward direction)', () => {
		const items: DropdownMenuItemOrSeparator[] = [
			createMockItem('1'),
			createMockSeparator('sep1'),
			createMockItem('2'),
		];
		const result = findNextEnabledIndex(items, 0, 1);
		expect(result).toBe(2);
	});

	it('skips separators (backward direction)', () => {
		const items: DropdownMenuItemOrSeparator[] = [
			createMockItem('1'),
			createMockSeparator('sep1'),
			createMockItem('2'),
		];
		const result = findNextEnabledIndex(items, 2, -1);
		expect(result).toBe(0);
	});

	it('returns -1 when all items are disabled', () => {
		const items: DropdownMenuItemOrSeparator[] = [
			createMockItem('1', true),
			createMockItem('2', true),
		];
		const result = findNextEnabledIndex(items, 0, 1);
		expect(result).toBe(-1);
	});

	it('returns -1 when all items are separators', () => {
		const items: DropdownMenuItemOrSeparator[] = [
			createMockSeparator('sep1'),
			createMockSeparator('sep2'),
		];
		const result = findNextEnabledIndex(items, 0, 1);
		expect(result).toBe(-1);
	});

	it('handles single enabled item', () => {
		const items: DropdownMenuItemOrSeparator[] = [createMockItem('1')];
		const result = findNextEnabledIndex(items, 0, 1);
		expect(result).toBe(0);
	});

	it('handles negative start index', () => {
		const items: DropdownMenuItemOrSeparator[] = [createMockItem('1'), createMockItem('2')];
		const result = findNextEnabledIndex(items, -1, 1);
		expect(result).toBe(0);
	});

	it('handles start index beyond array length', () => {
		const items: DropdownMenuItemOrSeparator[] = [createMockItem('1'), createMockItem('2')];
		const result = findNextEnabledIndex(items, 10, 1);
		expect(result).toBe(1);
	});

	it('handles mixed disabled items and separators', () => {
		const items: DropdownMenuItemOrSeparator[] = [
			createMockItem('1'),
			createMockItem('2', true),
			createMockSeparator('sep1'),
			createMockItem('3', true),
			createMockItem('4'),
		];
		const result = findNextEnabledIndex(items, 0, 1);
		expect(result).toBe(4);
	});
});

describe('DropdownMenuNavigation - handleArrowKeyNavigation', () => {
	it('prevents default event behavior', () => {
		const event = {
			preventDefault: vi.fn(),
			key: 'ArrowDown',
		} as unknown as React.KeyboardEvent<HTMLDivElement>;
		const items: DropdownMenuItemOrSeparator[] = [createMockItem('1')];
		const setHighlightedIndex = vi.fn();

		handleArrowKeyNavigation({
			event,
			items,
			highlightedIndex: 0,
			setHighlightedIndex,
		});

		expect(event.preventDefault).toHaveBeenCalled();
	});

	it('handles ArrowDown key', () => {
		const event = {
			preventDefault: vi.fn(),
			key: 'ArrowDown',
		} as unknown as React.KeyboardEvent<HTMLDivElement>;
		const items: DropdownMenuItemOrSeparator[] = [createMockItem('1'), createMockItem('2')];
		const setHighlightedIndex = vi.fn();

		handleArrowKeyNavigation({
			event,
			items,
			highlightedIndex: 0,
			setHighlightedIndex,
		});

		expect(setHighlightedIndex).toHaveBeenCalledWith(1);
	});

	it('handles ArrowUp key', () => {
		const event = {
			preventDefault: vi.fn(),
			key: 'ArrowUp',
		} as unknown as React.KeyboardEvent<HTMLDivElement>;
		const items: DropdownMenuItemOrSeparator[] = [createMockItem('1'), createMockItem('2')];
		const setHighlightedIndex = vi.fn();

		handleArrowKeyNavigation({
			event,
			items,
			highlightedIndex: 1,
			setHighlightedIndex,
		});

		expect(setHighlightedIndex).toHaveBeenCalledWith(0);
	});

	it('skips disabled items when navigating', () => {
		const event = {
			preventDefault: vi.fn(),
			key: 'ArrowDown',
		} as unknown as React.KeyboardEvent<HTMLDivElement>;
		const items: DropdownMenuItemOrSeparator[] = [
			createMockItem('1'),
			createMockItem('2', true),
			createMockItem('3'),
		];
		const setHighlightedIndex = vi.fn();

		handleArrowKeyNavigation({
			event,
			items,
			highlightedIndex: 0,
			setHighlightedIndex,
		});

		expect(setHighlightedIndex).toHaveBeenCalledWith(2);
	});

	it('does not call setHighlightedIndex when no enabled item found', () => {
		const event = {
			preventDefault: vi.fn(),
			key: 'ArrowDown',
		} as unknown as React.KeyboardEvent<HTMLDivElement>;
		const items: DropdownMenuItemOrSeparator[] = [
			createMockItem('1', true),
			createMockItem('2', true),
		];
		const setHighlightedIndex = vi.fn();

		handleArrowKeyNavigation({
			event,
			items,
			highlightedIndex: 0,
			setHighlightedIndex,
		});

		expect(setHighlightedIndex).not.toHaveBeenCalled();
	});
});

describe('DropdownMenuNavigation - handleHomeKey', () => {
	it('prevents default event behavior', () => {
		const event = {
			preventDefault: vi.fn(),
		} as unknown as React.KeyboardEvent<HTMLDivElement>;
		const items: DropdownMenuItemOrSeparator[] = [createMockItem('1')];
		const setHighlightedIndex = vi.fn();

		handleHomeKey(event, items, setHighlightedIndex);

		expect(event.preventDefault).toHaveBeenCalled();
	});

	it('sets highlighted index to first enabled item', () => {
		const event = {
			preventDefault: vi.fn(),
		} as unknown as React.KeyboardEvent<HTMLDivElement>;
		const items: DropdownMenuItemOrSeparator[] = [createMockItem('1'), createMockItem('2')];
		const setHighlightedIndex = vi.fn();

		handleHomeKey(event, items, setHighlightedIndex);

		expect(setHighlightedIndex).toHaveBeenCalledWith(0);
	});

	it('skips disabled items and separators to find first enabled', () => {
		const event = {
			preventDefault: vi.fn(),
		} as unknown as React.KeyboardEvent<HTMLDivElement>;
		const items: DropdownMenuItemOrSeparator[] = [
			createMockItem('1', true),
			createMockSeparator('sep1'),
			createMockItem('2'),
		];
		const setHighlightedIndex = vi.fn();

		handleHomeKey(event, items, setHighlightedIndex);

		expect(setHighlightedIndex).toHaveBeenCalledWith(2);
	});

	it('does not call setHighlightedIndex when no enabled item found', () => {
		const event = {
			preventDefault: vi.fn(),
		} as unknown as React.KeyboardEvent<HTMLDivElement>;
		const items: DropdownMenuItemOrSeparator[] = [
			createMockItem('1', true),
			createMockItem('2', true),
		];
		const setHighlightedIndex = vi.fn();

		handleHomeKey(event, items, setHighlightedIndex);

		expect(setHighlightedIndex).not.toHaveBeenCalled();
	});
});

describe('DropdownMenuNavigation - handleEndKey', () => {
	it('prevents default event behavior', () => {
		const event = {
			preventDefault: vi.fn(),
		} as unknown as React.KeyboardEvent<HTMLDivElement>;
		const items: DropdownMenuItemOrSeparator[] = [createMockItem('1')];
		const setHighlightedIndex = vi.fn();

		handleEndKey(event, items, setHighlightedIndex);

		expect(event.preventDefault).toHaveBeenCalled();
	});

	it('sets highlighted index to last enabled item', () => {
		const event = {
			preventDefault: vi.fn(),
		} as unknown as React.KeyboardEvent<HTMLDivElement>;
		const items: DropdownMenuItemOrSeparator[] = [createMockItem('1'), createMockItem('2')];
		const setHighlightedIndex = vi.fn();

		handleEndKey(event, items, setHighlightedIndex);

		expect(setHighlightedIndex).toHaveBeenCalledWith(1);
	});

	it('skips disabled items and separators to find last enabled', () => {
		const event = {
			preventDefault: vi.fn(),
		} as unknown as React.KeyboardEvent<HTMLDivElement>;
		const items: DropdownMenuItemOrSeparator[] = [
			createMockItem('1'),
			createMockItem('2', true),
			createMockSeparator('sep1'),
		];
		const setHighlightedIndex = vi.fn();

		handleEndKey(event, items, setHighlightedIndex);

		expect(setHighlightedIndex).toHaveBeenCalledWith(0);
	});

	it('does not call setHighlightedIndex when no enabled item found', () => {
		const event = {
			preventDefault: vi.fn(),
		} as unknown as React.KeyboardEvent<HTMLDivElement>;
		const items: DropdownMenuItemOrSeparator[] = [
			createMockItem('1', true),
			createMockItem('2', true),
		];
		const setHighlightedIndex = vi.fn();

		handleEndKey(event, items, setHighlightedIndex);

		expect(setHighlightedIndex).not.toHaveBeenCalled();
	});
});

describe('DropdownMenuNavigation - handleEscapeKey', () => {
	it('prevents default event behavior', () => {
		const event = {
			preventDefault: vi.fn(),
		} as unknown as React.KeyboardEvent<HTMLDivElement>;
		const setOpen = vi.fn();

		handleEscapeKey(event, setOpen);

		expect(event.preventDefault).toHaveBeenCalled();
	});

	it('calls setOpen with false', () => {
		const event = {
			preventDefault: vi.fn(),
		} as unknown as React.KeyboardEvent<HTMLDivElement>;
		const setOpen = vi.fn();

		handleEscapeKey(event, setOpen);

		expect(setOpen).toHaveBeenCalledWith(false);
	});
});

describe('DropdownMenuNavigation - handleEnterOrSpace', () => {
	it('prevents default event behavior', () => {
		const event = {
			preventDefault: vi.fn(),
		} as unknown as React.KeyboardEvent<HTMLDivElement>;
		const items: DropdownMenuItemOrSeparator[] = [createMockItem('1')];
		const handleSelect = vi.fn().mockResolvedValue(undefined);

		handleEnterOrSpace({
			event,
			items,
			highlightedIndex: 0,
			handleSelect,
		});

		expect(event.preventDefault).toHaveBeenCalled();
	});

	it('calls handleSelect with highlighted item when item is enabled', async () => {
		const event = {
			preventDefault: vi.fn(),
		} as unknown as React.KeyboardEvent<HTMLDivElement>;
		const items: DropdownMenuItemOrSeparator[] = [createMockItem('1')];
		const handleSelect = vi.fn().mockResolvedValue(undefined);

		handleEnterOrSpace({
			event,
			items,
			highlightedIndex: 0,
			handleSelect,
		});

		await new Promise(resolve => setTimeout(resolve, 0));

		expect(handleSelect).toHaveBeenCalledWith(items[0]);
	});

	it('does not call handleSelect when highlighted item is disabled', () => {
		const event = {
			preventDefault: vi.fn(),
		} as unknown as React.KeyboardEvent<HTMLDivElement>;
		const items: DropdownMenuItemOrSeparator[] = [createMockItem('1', true)];
		const handleSelect = vi.fn();

		handleEnterOrSpace({
			event,
			items,
			highlightedIndex: 0,
			handleSelect,
		});

		expect(handleSelect).not.toHaveBeenCalled();
	});

	it('does not call handleSelect when highlighted item is a separator', () => {
		const event = {
			preventDefault: vi.fn(),
		} as unknown as React.KeyboardEvent<HTMLDivElement>;
		const items: DropdownMenuItemOrSeparator[] = [createMockSeparator('sep1'), createMockItem('1')];
		const handleSelect = vi.fn();

		handleEnterOrSpace({
			event,
			items,
			highlightedIndex: 0,
			handleSelect,
		});

		expect(handleSelect).not.toHaveBeenCalled();
	});

	it('handles async handleSelect errors gracefully', async () => {
		const event = {
			preventDefault: vi.fn(),
		} as unknown as React.KeyboardEvent<HTMLDivElement>;
		const items: DropdownMenuItemOrSeparator[] = [createMockItem('1')];
		const handleSelect = vi.fn().mockRejectedValue(new Error('Test error'));

		// Should not throw
		expect(() => {
			handleEnterOrSpace({
				event,
				items,
				highlightedIndex: 0,
				handleSelect,
			});
		}).not.toThrow();

		await new Promise(resolve => setTimeout(resolve, 0));
		expect(handleSelect).toHaveBeenCalled();
	});
});
