import type { ReactElement, ReactNode } from 'react';

import type { DropdownMenuItemOrSeparator, DropdownPosition } from './DropdownMenu.types';
import type { useDropdownMenu } from './useDropdownMenu';

export interface PrepareContentParams {
	readonly menuData: ReturnType<typeof useDropdownMenu>;
	readonly trigger: ReactElement;
	readonly items: DropdownMenuItemOrSeparator[];
	readonly emptyState: ReactNode;
}

export function prepareContentParams({
	menuData,
	trigger,
	items,
	emptyState,
}: PrepareContentParams) {
	return {
		trigger,
		open: menuData.open,
		menuId: menuData.menuId,
		setOpen: menuData.setOpen,
		items,
		highlightedIndex: menuData.highlightedIndex,
		itemRefs: menuData.itemRefs,
		handleSelect: menuData.handleSelect,
		emptyState,
	};
}

export interface PrepareRenderParams {
	readonly menuData: ReturnType<typeof useDropdownMenu>;
	readonly triggerNode: ReactElement;
	readonly menuContent: ReactNode;
	readonly align: DropdownPosition;
	readonly className: string | undefined;
	readonly menuLabel: string | undefined;
	readonly maxHeight: number;
}

export function prepareRenderParams({
	menuData,
	triggerNode,
	menuContent,
	align,
	className,
	menuLabel,
	maxHeight,
}: PrepareRenderParams) {
	return {
		open: menuData.open,
		setOpen: menuData.setOpen,
		triggerNode,
		align,
		className,
		menuRef: menuData.menuRef,
		menuId: menuData.menuId,
		menuLabel,
		maxHeight,
		handleKeyDown: menuData.handleKeyDown,
		menuContent,
	};
}
