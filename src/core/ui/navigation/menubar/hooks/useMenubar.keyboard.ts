import { handleMenubarKeyDown } from '@core/ui/navigation/menubar/helpers/MenubarKeyboard';
import type { MenubarItem } from '@src-types/ui/navigation/menubar';
import { type KeyboardEvent, type RefObject, useCallback } from 'react';

interface KeyDownHandlerParams {
	readonly items: readonly MenubarItem[];
	readonly activeItemId: string | null;
	readonly openSubmenuId: string | null;
	readonly setActiveItemId: (id: string | null) => void;
	readonly setOpenSubmenuId: (id: string | null) => void;
	readonly itemRefs: Map<string, RefObject<HTMLButtonElement>>;
	readonly handleItemClick: (itemId: string) => void;
}

export function useKeyDownHandler({
	items,
	activeItemId,
	openSubmenuId,
	setActiveItemId,
	setOpenSubmenuId,
	itemRefs,
	handleItemClick,
}: KeyDownHandlerParams) {
	return useCallback(
		(event: KeyboardEvent<HTMLElement>) => {
			handleMenubarKeyDown({
				event,
				items,
				activeItemId,
				openSubmenuId,
				setActiveItemId,
				setOpenSubmenuId,
				itemRefs,
				handleItemClick,
			});
		},
		[
			items,
			activeItemId,
			openSubmenuId,
			setActiveItemId,
			setOpenSubmenuId,
			itemRefs,
			handleItemClick,
		]
	);
}
