import { type ReactElement, type ReactNode, type RefObject, useMemo } from 'react';

import type { DropdownMenuItem, DropdownMenuItemOrSeparator } from './DropdownMenu.types';
import { renderMenuContent } from './DropdownMenuRenderers.items';
import { createTriggerNode } from './DropdownMenuRenderers.trigger';

export interface UsePrepareDropdownMenuContentParams {
	readonly trigger: ReactElement;
	readonly open: boolean;
	readonly menuId: string;
	readonly setOpen: (open: boolean) => void;
	readonly items: DropdownMenuItemOrSeparator[];
	readonly highlightedIndex: number;
	readonly itemRefs: (RefObject<HTMLButtonElement | null> | null)[];
	readonly handleSelect: (item: DropdownMenuItem) => Promise<undefined>;
	readonly emptyState: ReactNode;
}

export function usePrepareDropdownMenuContent({
	trigger,
	open,
	menuId,
	setOpen,
	items,
	highlightedIndex,
	itemRefs,
	handleSelect,
	emptyState,
}: UsePrepareDropdownMenuContentParams) {
	const triggerNode = useMemo(
		() => createTriggerNode({ trigger, open, menuId, setOpen }),
		[menuId, open, setOpen, trigger]
	);
	const menuContent = useMemo(
		() => renderMenuContent({ items, highlightedIndex, itemRefs, handleSelect, emptyState }),
		[emptyState, handleSelect, highlightedIndex, itemRefs, items]
	);
	return { triggerNode, menuContent };
}
