import type { KeyboardEvent, ReactElement, ReactNode, RefObject } from 'react';

import type {
	DropdownMenuItem,
	DropdownMenuItemOrSeparator,
	DropdownMenuProps,
} from './DropdownMenu.types';

export interface CreateTriggerNodeParams {
	readonly trigger: ReactElement;
	readonly open: boolean;
	readonly menuId: string;
	readonly setOpen: (open: boolean) => void;
}

export interface RenderMenuContentParams {
	readonly items: DropdownMenuItemOrSeparator[];
	readonly highlightedIndex: number;
	readonly itemRefs: (RefObject<HTMLButtonElement | null> | null)[];
	readonly handleSelect: (item: DropdownMenuItem) => Promise<undefined>;
	readonly emptyState: ReactNode;
}

export interface RenderMenuItemParams {
	readonly item: DropdownMenuItemOrSeparator;
	readonly index: number;
	readonly highlightedIndex: number;
	readonly itemRef: RefObject<HTMLButtonElement | null> | null;
	readonly handleSelect: (item: DropdownMenuItem) => Promise<undefined>;
}

export interface RenderDropdownMenuContentParams {
	readonly menuRef: RefObject<HTMLDivElement | null>;
	readonly menuId: string;
	readonly menuLabel?: string | undefined;
	readonly maxHeight: number;
	readonly handleKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
	readonly menuContent: ReactNode;
}

export interface RenderDropdownPopoverParams {
	readonly open: boolean;
	readonly setOpen: (open: boolean) => void;
	readonly trigger: ReactElement;
	readonly align: DropdownMenuProps['align'];
	readonly className?: string | undefined;
	readonly menuRef: RefObject<HTMLDivElement | null>;
	readonly menuId: string;
	readonly menuLabel?: string | undefined;
	readonly maxHeight: number;
	readonly handleKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
	readonly menuContent: ReactNode;
}

export function isSeparator(
	item: DropdownMenuItemOrSeparator
): item is { readonly id: string; readonly type: 'separator' } {
	return 'type' in item;
}
