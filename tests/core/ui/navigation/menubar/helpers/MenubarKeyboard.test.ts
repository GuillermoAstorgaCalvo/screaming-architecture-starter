/**
 * MenubarKeyboard Tests
 *
 * Tests for menubar keyboard navigation:
 * - handleMenubarKeyDown
 * - findNextEnabledMenubarItemIndex
 * - Arrow key navigation
 * - Enter/Space key handling
 * - Escape key handling
 */

import {
	findNextEnabledMenubarItemIndex,
	handleMenubarKeyDown,
} from '@core/ui/navigation/menubar/helpers/MenubarKeyboard';
import type { MenubarItem } from '@src-types/ui/navigation/menubar';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';

const createTestItems = (): readonly MenubarItem[] => [
	{ id: 'file', label: 'File' },
	{ id: 'edit', label: 'Edit' },
	{ id: 'view', label: 'View' },
];

describe('findNextEnabledMenubarItemIndex', () => {
	it('finds next enabled item moving forward', () => {
		const items: readonly MenubarItem[] = [
			{ id: 'item1', label: 'Item 1', disabled: true },
			{ id: 'item2', label: 'Item 2' },
			{ id: 'item3', label: 'Item 3' },
		];

		const index = findNextEnabledMenubarItemIndex(items, 0, 1);

		expect(index).toBe(1);
	});

	it('finds next enabled item moving backward', () => {
		const items: readonly MenubarItem[] = [
			{ id: 'item1', label: 'Item 1' },
			{ id: 'item2', label: 'Item 2', disabled: true },
			{ id: 'item3', label: 'Item 3' },
		];

		const index = findNextEnabledMenubarItemIndex(items, 2, -1);

		expect(index).toBe(0);
	});

	it('wraps around when reaching end', () => {
		const items: readonly MenubarItem[] = [
			{ id: 'item1', label: 'Item 1' },
			{ id: 'item2', label: 'Item 2' },
		];

		const index = findNextEnabledMenubarItemIndex(items, 1, 1);

		expect(index).toBe(0);
	});

	it('wraps around when reaching start', () => {
		const items: readonly MenubarItem[] = [
			{ id: 'item1', label: 'Item 1' },
			{ id: 'item2', label: 'Item 2' },
		];

		const index = findNextEnabledMenubarItemIndex(items, 0, -1);

		expect(index).toBe(1);
	});

	it('returns -1 when all items are disabled', () => {
		const items: readonly MenubarItem[] = [
			{ id: 'item1', label: 'Item 1', disabled: true },
			{ id: 'item2', label: 'Item 2', disabled: true },
		];

		const index = findNextEnabledMenubarItemIndex(items, 0, 1);

		expect(index).toBe(-1);
	});

	it('skips disabled items when moving forward', () => {
		const items: readonly MenubarItem[] = [
			{ id: 'item1', label: 'Item 1' },
			{ id: 'item2', label: 'Item 2', disabled: true },
			{ id: 'item3', label: 'Item 3', disabled: true },
			{ id: 'item4', label: 'Item 4' },
		];

		const index = findNextEnabledMenubarItemIndex(items, 0, 1);

		expect(index).toBe(3);
	});
});

describe('handleMenubarKeyDown', () => {
	it('handles ArrowRight key', () => {
		const items = createTestItems();
		const itemRefs = new Map();
		for (const item of items) {
			const ref = createRef<HTMLButtonElement>();
			ref.current = document.createElement('button');
			itemRefs.set(item.id, ref);
		}

		const setActiveItemId = vi.fn();
		const setOpenSubmenuId = vi.fn();
		const handleItemClick = vi.fn();

		const event = {
			key: 'ArrowRight',
			preventDefault: vi.fn(),
		} as unknown as React.KeyboardEvent<HTMLElement>;

		handleMenubarKeyDown({
			event,
			items,
			activeItemId: 'file',
			openSubmenuId: null,
			setActiveItemId,
			setOpenSubmenuId,
			itemRefs,
			handleItemClick,
		});

		expect(event.preventDefault).toHaveBeenCalled();
		expect(setActiveItemId).toHaveBeenCalledWith('edit');
	});

	it('handles ArrowLeft key', () => {
		const items = createTestItems();
		const itemRefs = new Map();
		for (const item of items) {
			const ref = createRef<HTMLButtonElement>();
			ref.current = document.createElement('button');
			itemRefs.set(item.id, ref);
		}

		const setActiveItemId = vi.fn();
		const setOpenSubmenuId = vi.fn();
		const handleItemClick = vi.fn();

		const event = {
			key: 'ArrowLeft',
			preventDefault: vi.fn(),
		} as unknown as React.KeyboardEvent<HTMLElement>;

		handleMenubarKeyDown({
			event,
			items,
			activeItemId: 'edit',
			openSubmenuId: null,
			setActiveItemId,
			setOpenSubmenuId,
			itemRefs,
			handleItemClick,
		});

		expect(event.preventDefault).toHaveBeenCalled();
		expect(setActiveItemId).toHaveBeenCalledWith('file');
	});

	it('handles ArrowDown key to open submenu', () => {
		const items: readonly MenubarItem[] = [
			{
				id: 'file',
				label: 'File',
				submenu: [{ id: 'new', label: 'New' }],
			},
		];

		const setActiveItemId = vi.fn();
		const setOpenSubmenuId = vi.fn();
		const handleItemClick = vi.fn();
		const itemRefs = new Map();

		const event = {
			key: 'ArrowDown',
			preventDefault: vi.fn(),
		} as unknown as React.KeyboardEvent<HTMLElement>;

		handleMenubarKeyDown({
			event,
			items,
			activeItemId: 'file',
			openSubmenuId: null,
			setActiveItemId,
			setOpenSubmenuId,
			itemRefs,
			handleItemClick,
		});

		expect(event.preventDefault).toHaveBeenCalled();
		expect(setOpenSubmenuId).toHaveBeenCalledWith('file');
	});

	it('does not open submenu when ArrowDown on item without submenu', () => {
		const items = createTestItems();
		const setActiveItemId = vi.fn();
		const setOpenSubmenuId = vi.fn();
		const handleItemClick = vi.fn();
		const itemRefs = new Map();

		const event = {
			key: 'ArrowDown',
			preventDefault: vi.fn(),
		} as unknown as React.KeyboardEvent<HTMLElement>;

		handleMenubarKeyDown({
			event,
			items,
			activeItemId: 'file',
			openSubmenuId: null,
			setActiveItemId,
			setOpenSubmenuId,
			itemRefs,
			handleItemClick,
		});

		expect(event.preventDefault).toHaveBeenCalled();
		expect(setOpenSubmenuId).not.toHaveBeenCalled();
	});

	it('handles Escape key', () => {
		const items = createTestItems();
		const setActiveItemId = vi.fn();
		const setOpenSubmenuId = vi.fn();
		const handleItemClick = vi.fn();
		const itemRefs = new Map();

		const event = {
			key: 'Escape',
			preventDefault: vi.fn(),
		} as unknown as React.KeyboardEvent<HTMLElement>;

		handleMenubarKeyDown({
			event,
			items,
			activeItemId: 'file',
			openSubmenuId: 'file',
			setActiveItemId,
			setOpenSubmenuId,
			itemRefs,
			handleItemClick,
		});

		expect(event.preventDefault).toHaveBeenCalled();
		expect(setOpenSubmenuId).toHaveBeenCalledWith(null);
		expect(setActiveItemId).toHaveBeenCalledWith(null);
	});

	it('handles Enter key', () => {
		const items = createTestItems();
		const setActiveItemId = vi.fn();
		const setOpenSubmenuId = vi.fn();
		const handleItemClick = vi.fn();
		const itemRefs = new Map();

		const event = {
			key: 'Enter',
			preventDefault: vi.fn(),
		} as unknown as React.KeyboardEvent<HTMLElement>;

		handleMenubarKeyDown({
			event,
			items,
			activeItemId: 'file',
			openSubmenuId: null,
			setActiveItemId,
			setOpenSubmenuId,
			itemRefs,
			handleItemClick,
		});

		expect(event.preventDefault).toHaveBeenCalled();
		expect(handleItemClick).toHaveBeenCalledWith('file');
	});

	it('handles Space key', () => {
		const items = createTestItems();
		const setActiveItemId = vi.fn();
		const setOpenSubmenuId = vi.fn();
		const handleItemClick = vi.fn();
		const itemRefs = new Map();

		const event = {
			key: ' ',
			preventDefault: vi.fn(),
		} as unknown as React.KeyboardEvent<HTMLElement>;

		handleMenubarKeyDown({
			event,
			items,
			activeItemId: 'file',
			openSubmenuId: null,
			setActiveItemId,
			setOpenSubmenuId,
			itemRefs,
			handleItemClick,
		});

		expect(event.preventDefault).toHaveBeenCalled();
		expect(handleItemClick).toHaveBeenCalledWith('file');
	});

	it('ignores unknown keys', () => {
		const items = createTestItems();
		const setActiveItemId = vi.fn();
		const setOpenSubmenuId = vi.fn();
		const handleItemClick = vi.fn();
		const itemRefs = new Map();

		const event = {
			key: 'a',
			preventDefault: vi.fn(),
		} as unknown as React.KeyboardEvent<HTMLElement>;

		handleMenubarKeyDown({
			event,
			items,
			activeItemId: 'file',
			openSubmenuId: null,
			setActiveItemId,
			setOpenSubmenuId,
			itemRefs,
			handleItemClick,
		});

		expect(event.preventDefault).toHaveBeenCalled();
		expect(setActiveItemId).not.toHaveBeenCalled();
		expect(handleItemClick).not.toHaveBeenCalled();
	});

	it('skips disabled items when navigating', () => {
		const items: readonly MenubarItem[] = [
			{ id: 'file', label: 'File' },
			{ id: 'edit', label: 'Edit', disabled: true },
			{ id: 'view', label: 'View' },
		];

		const itemRefs = new Map();
		for (const item of items) {
			const ref = createRef<HTMLButtonElement>();
			ref.current = document.createElement('button');
			itemRefs.set(item.id, ref);
		}

		const setActiveItemId = vi.fn();
		const setOpenSubmenuId = vi.fn();
		const handleItemClick = vi.fn();

		const event = {
			key: 'ArrowRight',
			preventDefault: vi.fn(),
		} as unknown as React.KeyboardEvent<HTMLElement>;

		handleMenubarKeyDown({
			event,
			items,
			activeItemId: 'file',
			openSubmenuId: null,
			setActiveItemId,
			setOpenSubmenuId,
			itemRefs,
			handleItemClick,
		});

		expect(setActiveItemId).toHaveBeenCalledWith('view');
	});
});
