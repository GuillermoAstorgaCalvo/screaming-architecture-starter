/**
 * ContextMenuHelpers Tests
 *
 * Tests for the ContextMenu helper functions including:
 * - isSeparator
 * - findNextEnabledIndex
 * - handleArrowKeyNavigation
 * - handleEscapeKey
 * - handleEnterOrSpace
 * - getContextMenuPosition
 */

import type {
	ContextMenuItem,
	ContextMenuItemOrSeparator,
} from '@core/ui/overlays/context-menu/ContextMenu';
import {
	findNextEnabledIndex,
	getContextMenuPosition,
	handleArrowKeyNavigation,
	handleEnterOrSpace,
	handleEscapeKey,
	isSeparator,
} from '@core/ui/overlays/context-menu/helpers/ContextMenuHelpers';
import type { KeyboardEvent } from 'react';
import { describe, expect, it, vi } from 'vitest';

const createKeyboardEvent = (
	key: string,
	options?: { preventDefault?: () => void }
): KeyboardEvent<HTMLDivElement> => {
	return {
		key,
		preventDefault: options?.preventDefault ?? vi.fn(),
		stopPropagation: vi.fn(),
	} as unknown as KeyboardEvent<HTMLDivElement>;
};

const createItem = (overrides?: Partial<ContextMenuItem>): ContextMenuItem => ({
	id: '1',
	label: 'Item',
	...overrides,
});

const createSeparator = (id: string) => ({
	id,
	type: 'separator' as const,
});

describe('isSeparator', () => {
	it('returns true for separator items', () => {
		const separator = createSeparator('sep1');
		expect(isSeparator(separator)).toBe(true);
	});

	it('returns false for regular items', () => {
		const item = createItem();
		expect(isSeparator(item)).toBe(false);
	});

	it('returns false for undefined', () => {
		expect(isSeparator(undefined)).toBe(false);
	});
});

describe('findNextEnabledIndex', () => {
	it('finds next enabled item going forward', () => {
		const items: ContextMenuItemOrSeparator[] = [
			createItem({ id: '1', disabled: true }),
			createItem({ id: '2' }),
			createItem({ id: '3' }),
		];

		const nextIndex = findNextEnabledIndex(items, 0, 1);
		expect(nextIndex).toBe(1);
	});

	it('finds next enabled item going backward', () => {
		const items: ContextMenuItemOrSeparator[] = [
			createItem({ id: '1' }),
			createItem({ id: '2' }),
			createItem({ id: '3', disabled: true }),
		];

		const nextIndex = findNextEnabledIndex(items, 2, -1);
		expect(nextIndex).toBe(1);
	});

	it('skips separators', () => {
		const items: ContextMenuItemOrSeparator[] = [
			createItem({ id: '1' }),
			createSeparator('sep1'),
			createItem({ id: '2' }),
		];

		const nextIndex = findNextEnabledIndex(items, 0, 1);
		expect(nextIndex).toBe(2);
	});

	it('wraps around when reaching end', () => {
		const items: ContextMenuItemOrSeparator[] = [createItem({ id: '1' }), createItem({ id: '2' })];

		const nextIndex = findNextEnabledIndex(items, 1, 1);
		expect(nextIndex).toBe(0);
	});

	it('wraps around when reaching start', () => {
		const items: ContextMenuItemOrSeparator[] = [createItem({ id: '1' }), createItem({ id: '2' })];

		const nextIndex = findNextEnabledIndex(items, 0, -1);
		expect(nextIndex).toBe(1);
	});

	it('returns -1 when no enabled items', () => {
		const items: ContextMenuItemOrSeparator[] = [
			createItem({ id: '1', disabled: true }),
			createItem({ id: '2', disabled: true }),
		];

		const nextIndex = findNextEnabledIndex(items, 0, 1);
		expect(nextIndex).toBe(-1);
	});

	it('finds first enabled item from -1', () => {
		const items: ContextMenuItemOrSeparator[] = [
			createItem({ id: '1', disabled: true }),
			createItem({ id: '2' }),
		];

		const nextIndex = findNextEnabledIndex(items, -1, 1);
		expect(nextIndex).toBe(1);
	});
});

describe('handleArrowKeyNavigation', () => {
	it('prevents default behavior', () => {
		const items: ContextMenuItemOrSeparator[] = [createItem({ id: '1' })];
		const setHighlightedIndex = vi.fn();
		const event = createKeyboardEvent('ArrowDown', { preventDefault: vi.fn() });

		handleArrowKeyNavigation({
			event,
			items,
			highlightedIndex: -1,
			setHighlightedIndex,
		});

		expect(event.preventDefault).toHaveBeenCalled();
	});

	it('navigates down on ArrowDown', () => {
		const items: ContextMenuItemOrSeparator[] = [createItem({ id: '1' }), createItem({ id: '2' })];
		const setHighlightedIndex = vi.fn();
		const event = createKeyboardEvent('ArrowDown', { preventDefault: vi.fn() });

		handleArrowKeyNavigation({
			event,
			items,
			highlightedIndex: 0,
			setHighlightedIndex,
		});

		expect(setHighlightedIndex).toHaveBeenCalledWith(1);
	});

	it('navigates up on ArrowUp', () => {
		const items: ContextMenuItemOrSeparator[] = [createItem({ id: '1' }), createItem({ id: '2' })];
		const setHighlightedIndex = vi.fn();
		const event = createKeyboardEvent('ArrowUp', { preventDefault: vi.fn() });

		handleArrowKeyNavigation({
			event,
			items,
			highlightedIndex: 1,
			setHighlightedIndex,
		});

		expect(setHighlightedIndex).toHaveBeenCalledWith(0);
	});

	it('skips disabled items', () => {
		const items: ContextMenuItemOrSeparator[] = [
			createItem({ id: '1' }),
			createItem({ id: '2', disabled: true }),
			createItem({ id: '3' }),
		];
		const setHighlightedIndex = vi.fn();
		const event = createKeyboardEvent('ArrowDown', { preventDefault: vi.fn() });

		handleArrowKeyNavigation({
			event,
			items,
			highlightedIndex: 0,
			setHighlightedIndex,
		});

		expect(setHighlightedIndex).toHaveBeenCalledWith(2);
	});
});

describe('handleEscapeKey', () => {
	it('prevents default behavior', () => {
		const setOpen = vi.fn();
		const event = createKeyboardEvent('Escape', { preventDefault: vi.fn() });

		handleEscapeKey(event, setOpen);

		expect(event.preventDefault).toHaveBeenCalled();
	});

	it('closes menu', () => {
		const setOpen = vi.fn();
		const event = createKeyboardEvent('Escape', { preventDefault: vi.fn() });

		handleEscapeKey(event, setOpen);

		expect(setOpen).toHaveBeenCalledWith(false);
	});
});

describe('handleEnterOrSpace', () => {
	it('prevents default behavior', async () => {
		const items: ContextMenuItemOrSeparator[] = [createItem({ id: '1' })];
		const handleSelect = vi.fn().mockResolvedValue(undefined);
		const event = createKeyboardEvent('Enter', { preventDefault: vi.fn() });

		await handleEnterOrSpace({
			event,
			items,
			highlightedIndex: 0,
			handleSelect,
		});

		expect(event.preventDefault).toHaveBeenCalled();
	});

	it('selects item on Enter', async () => {
		const item = createItem({ id: '1' });
		const items: ContextMenuItemOrSeparator[] = [item];
		const handleSelect = vi.fn().mockResolvedValue(undefined);
		const event = createKeyboardEvent('Enter', { preventDefault: vi.fn() });

		await handleEnterOrSpace({
			event,
			items,
			highlightedIndex: 0,
			handleSelect,
		});

		expect(handleSelect).toHaveBeenCalledWith(item);
	});

	it('selects item on Space', async () => {
		const item = createItem({ id: '1' });
		const items: ContextMenuItemOrSeparator[] = [item];
		const handleSelect = vi.fn().mockResolvedValue(undefined);
		const event = createKeyboardEvent(' ', { preventDefault: vi.fn() });

		await handleEnterOrSpace({
			event,
			items,
			highlightedIndex: 0,
			handleSelect,
		});

		expect(handleSelect).toHaveBeenCalledWith(item);
	});

	it('does not select separator', () => {
		const items: ContextMenuItemOrSeparator[] = [createSeparator('sep1')];
		const handleSelect = vi.fn();
		const event = createKeyboardEvent('Enter', { preventDefault: vi.fn() });

		handleEnterOrSpace({
			event,
			items,
			highlightedIndex: 0,
			handleSelect,
		});

		expect(handleSelect).not.toHaveBeenCalled();
	});

	it('does not select disabled item', () => {
		const items: ContextMenuItemOrSeparator[] = [createItem({ id: '1', disabled: true })];
		const handleSelect = vi.fn();
		const event = createKeyboardEvent('Enter', { preventDefault: vi.fn() });

		handleEnterOrSpace({
			event,
			items,
			highlightedIndex: 0,
			handleSelect,
		});

		expect(handleSelect).not.toHaveBeenCalled();
	});

	it('handles async handleSelect errors gracefully', async () => {
		const item = createItem({ id: '1' });
		const items: ContextMenuItemOrSeparator[] = [item];
		const handleSelect = vi.fn().mockRejectedValue(new Error('Test error'));
		const event = createKeyboardEvent('Enter', { preventDefault: vi.fn() });

		// The function should not throw even if handleSelect rejects
		await handleEnterOrSpace({
			event,
			items,
			highlightedIndex: 0,
			handleSelect,
		});

		expect(handleSelect).toHaveBeenCalledWith(item);
	});
});

describe('getContextMenuPosition', () => {
	it('returns bottom-start for start alignment', () => {
		expect(getContextMenuPosition('start')).toBe('bottom-start');
	});

	it('returns bottom for center alignment', () => {
		expect(getContextMenuPosition('center')).toBe('bottom');
	});

	it('returns bottom-end for end alignment', () => {
		expect(getContextMenuPosition('end')).toBe('bottom-end');
	});

	it('defaults to center when alignment is not provided', () => {
		// Function has default parameter, so we can call without argument

		expect(getContextMenuPosition()).toBe('bottom');
	});
});
