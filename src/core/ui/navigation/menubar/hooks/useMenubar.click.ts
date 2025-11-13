import type { MenubarItem } from '@src-types/ui/navigation/menubar';
import { useCallback } from 'react';

interface HandleItemClickParams {
	readonly itemId: string;
	readonly items: readonly MenubarItem[];
	readonly openSubmenuId: string | null;
	readonly setOpenSubmenuId: (id: string | null) => void;
	readonly setActiveItemId: (id: string | null) => void;
}

export function handleItemClickLogic({
	itemId,
	items,
	openSubmenuId,
	setOpenSubmenuId,
	setActiveItemId,
}: HandleItemClickParams): void {
	const item = items.find(i => i.id === itemId);
	if (!item) return;

	if (item.submenu && item.submenu.length > 0) {
		// Toggle submenu
		if (openSubmenuId === itemId) {
			setOpenSubmenuId(null);
			setActiveItemId(null);
		} else {
			setOpenSubmenuId(itemId);
			setActiveItemId(itemId);
		}
	} else {
		// Execute action if available
		if (item.onSelect) {
			const result = item.onSelect();
			if (result instanceof Promise) {
				result.catch(() => {
					// Ignore errors from async select handler
				});
			}
		}
		setOpenSubmenuId(null);
		setActiveItemId(null);
	}
}

interface ItemClickHandlerParams {
	readonly items: readonly MenubarItem[];
	readonly openSubmenuId: string | null;
	readonly setOpenSubmenuId: (id: string | null) => void;
	readonly setActiveItemId: (id: string | null) => void;
}

export function useItemClickHandler({
	items,
	openSubmenuId,
	setOpenSubmenuId,
	setActiveItemId,
}: ItemClickHandlerParams) {
	return useCallback(
		(itemId: string) => {
			handleItemClickLogic({ itemId, items, openSubmenuId, setOpenSubmenuId, setActiveItemId });
		},
		[items, openSubmenuId, setOpenSubmenuId, setActiveItemId]
	);
}

interface SubmenuCloseHandlerParams {
	readonly setOpenSubmenuId: (id: string | null) => void;
	readonly setActiveItemId: (id: string | null) => void;
}

export function useSubmenuCloseHandler({
	setOpenSubmenuId,
	setActiveItemId,
}: SubmenuCloseHandlerParams) {
	return useCallback(() => {
		setOpenSubmenuId(null);
		setActiveItemId(null);
	}, [setOpenSubmenuId, setActiveItemId]);
}
