/**
 * useMenubar.click Tests
 *
 * Tests for menubar click handlers:
 * - handleItemClickLogic
 * - useItemClickHandler
 * - useSubmenuCloseHandler
 */

import {
	handleItemClickLogic,
	useItemClickHandler,
	useSubmenuCloseHandler,
} from '@core/ui/navigation/menubar/hooks/useMenubar.click';
import type { MenubarItem } from '@src-types/ui/navigation/menubar';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const createTestItems = (): readonly MenubarItem[] => [
	{ id: 'file', label: 'File' },
	{
		id: 'edit',
		label: 'Edit',
		submenu: [{ id: 'copy', label: 'Copy' }],
	},
];

describe('handleItemClickLogic', () => {
	it('toggles submenu when clicking item with submenu', () => {
		const items: readonly MenubarItem[] = [
			{
				id: 'file',
				label: 'File',
				submenu: [{ id: 'new', label: 'New' }],
			},
		];

		const setOpenSubmenuId = vi.fn();
		const setActiveItemId = vi.fn();

		handleItemClickLogic({
			itemId: 'file',
			items,
			openSubmenuId: null,
			setOpenSubmenuId,
			setActiveItemId,
		});

		expect(setOpenSubmenuId).toHaveBeenCalledWith('file');
		expect(setActiveItemId).toHaveBeenCalledWith('file');
	});

	it('closes submenu when clicking already open submenu item', () => {
		const items: readonly MenubarItem[] = [
			{
				id: 'file',
				label: 'File',
				submenu: [{ id: 'new', label: 'New' }],
			},
		];

		const setOpenSubmenuId = vi.fn();
		const setActiveItemId = vi.fn();

		handleItemClickLogic({
			itemId: 'file',
			items,
			openSubmenuId: 'file',
			setOpenSubmenuId,
			setActiveItemId,
		});

		expect(setOpenSubmenuId).toHaveBeenCalledWith(null);
		expect(setActiveItemId).toHaveBeenCalledWith(null);
	});

	it('executes onSelect for item without submenu', () => {
		const onSelect = vi.fn();
		const items: readonly MenubarItem[] = [{ id: 'file', label: 'File', onSelect }];

		const setOpenSubmenuId = vi.fn();
		const setActiveItemId = vi.fn();

		handleItemClickLogic({
			itemId: 'file',
			items,
			openSubmenuId: null,
			setOpenSubmenuId,
			setActiveItemId,
		});

		expect(onSelect).toHaveBeenCalled();
		expect(setOpenSubmenuId).toHaveBeenCalledWith(null);
		expect(setActiveItemId).toHaveBeenCalledWith(null);
	});

	it('handles async onSelect', async () => {
		const onSelect = vi.fn().mockResolvedValue(undefined);
		const items: readonly MenubarItem[] = [{ id: 'file', label: 'File', onSelect }];

		const setOpenSubmenuId = vi.fn();
		const setActiveItemId = vi.fn();

		handleItemClickLogic({
			itemId: 'file',
			items,
			openSubmenuId: null,
			setOpenSubmenuId,
			setActiveItemId,
		});

		expect(onSelect).toHaveBeenCalled();
		await onSelect();
		expect(setOpenSubmenuId).toHaveBeenCalledWith(null);
	});

	it('does nothing when item not found', () => {
		const items: readonly MenubarItem[] = [{ id: 'file', label: 'File' }];
		const setOpenSubmenuId = vi.fn();
		const setActiveItemId = vi.fn();

		handleItemClickLogic({
			itemId: 'nonexistent',
			items,
			openSubmenuId: null,
			setOpenSubmenuId,
			setActiveItemId,
		});

		expect(setOpenSubmenuId).not.toHaveBeenCalled();
		expect(setActiveItemId).not.toHaveBeenCalled();
	});

	it('closes other submenu when opening new one', () => {
		const items: readonly MenubarItem[] = [
			{
				id: 'file',
				label: 'File',
				submenu: [{ id: 'new', label: 'New' }],
			},
			{
				id: 'edit',
				label: 'Edit',
				submenu: [{ id: 'copy', label: 'Copy' }],
			},
		];

		const setOpenSubmenuId = vi.fn();
		const setActiveItemId = vi.fn();

		handleItemClickLogic({
			itemId: 'edit',
			items,
			openSubmenuId: 'file',
			setOpenSubmenuId,
			setActiveItemId,
		});

		expect(setOpenSubmenuId).toHaveBeenCalledWith('edit');
		expect(setActiveItemId).toHaveBeenCalledWith('edit');
	});
});

describe('useItemClickHandler', () => {
	it('returns a function that calls handleItemClickLogic', () => {
		const items = createTestItems();
		const setOpenSubmenuId = vi.fn();
		const setActiveItemId = vi.fn();

		const { result } = renderHook(() =>
			useItemClickHandler({
				items,
				openSubmenuId: null,
				setOpenSubmenuId,
				setActiveItemId,
			})
		);

		act(() => {
			result.current('file');
		});

		expect(setActiveItemId).toHaveBeenCalled();
	});

	it('memoizes handler based on dependencies', () => {
		const items: readonly MenubarItem[] = createTestItems();
		const setOpenSubmenuId = vi.fn();
		const setActiveItemId = vi.fn();

		const { result, rerender } = renderHook(
			({ items, openSubmenuId }: { items: readonly MenubarItem[]; openSubmenuId: string | null }) =>
				useItemClickHandler({
					items,
					openSubmenuId,
					setOpenSubmenuId,
					setActiveItemId,
				}),
			{ initialProps: { items, openSubmenuId: null as string | null } }
		);

		const firstHandler = result.current;

		rerender({ items, openSubmenuId: null });
		expect(result.current).toBe(firstHandler);

		rerender({ items, openSubmenuId: 'file' });
		expect(result.current).not.toBe(firstHandler);
	});
});

describe('useSubmenuCloseHandler', () => {
	it('returns a function that closes submenu', () => {
		const setOpenSubmenuId = vi.fn();
		const setActiveItemId = vi.fn();

		const { result } = renderHook(() =>
			useSubmenuCloseHandler({
				setOpenSubmenuId,
				setActiveItemId,
			})
		);

		act(() => {
			result.current();
		});

		expect(setOpenSubmenuId).toHaveBeenCalledWith(null);
		expect(setActiveItemId).toHaveBeenCalledWith(null);
	});

	it('memoizes handler based on dependencies', () => {
		const setOpenSubmenuId = vi.fn();
		const setActiveItemId = vi.fn();

		const { result, rerender } = renderHook(
			({ setOpenSubmenuId, setActiveItemId }) =>
				useSubmenuCloseHandler({
					setOpenSubmenuId,
					setActiveItemId,
				}),
			{ initialProps: { setOpenSubmenuId, setActiveItemId } }
		);

		const firstHandler = result.current;

		rerender({ setOpenSubmenuId, setActiveItemId });
		expect(result.current).toBe(firstHandler);
	});
});
