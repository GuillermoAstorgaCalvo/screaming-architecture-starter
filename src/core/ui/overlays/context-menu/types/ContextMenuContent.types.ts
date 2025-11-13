import type {
	ContextMenuItem,
	ContextMenuItemOrSeparator,
	ContextMenuProps,
} from '@core/ui/overlays/context-menu/ContextMenu';
import type { KeyboardEvent, ReactElement, ReactNode, RefObject } from 'react';

export interface CreateTriggerNodeParams {
	readonly trigger: ReactElement;
	readonly open: boolean;
	readonly menuId: string;
	readonly setOpen: (open: boolean) => void;
}

export interface RenderMenuContentParams {
	readonly items: ContextMenuItemOrSeparator[];
	readonly highlightedIndex: number;
	readonly itemRefs: (RefObject<HTMLButtonElement | null> | null)[];
	readonly handleSelect: (item: ContextMenuItem) => Promise<undefined>;
	readonly emptyState: ReactNode;
}

export interface RenderContextMenuContentParams {
	readonly menuRef: RefObject<HTMLDivElement | null>;
	readonly menuId: string;
	readonly menuLabel?: string | undefined;
	readonly maxHeight: number;
	readonly handleKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
	readonly menuContent: ReactNode;
}

export interface ContextMenuContentProps {
	readonly open: boolean;
	readonly setOpen: (open: boolean) => void;
	readonly trigger: ReactElement;
	readonly align: ContextMenuProps['align'];
	readonly className?: string | undefined;
	readonly menuRef: RefObject<HTMLDivElement | null>;
	readonly menuId: string;
	readonly menuLabel?: string | undefined;
	readonly maxHeight: number;
	readonly handleKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
	readonly menuContent?: ReactNode;
	readonly items: ContextMenuItemOrSeparator[];
	readonly highlightedIndex: number;
	readonly itemRefs: (RefObject<HTMLButtonElement | null> | null)[];
	readonly handleSelect: (item: ContextMenuItem) => Promise<undefined>;
	readonly emptyState: ReactNode;
}

export interface RenderPopoverParams {
	readonly open: boolean;
	readonly setOpen: (open: boolean) => void;
	readonly trigger: ReactElement;
	readonly align: ContextMenuProps['align'];
	readonly className?: string | undefined;
	readonly menuRef: RefObject<HTMLDivElement | null>;
	readonly menuId: string;
	readonly menuLabel?: string | undefined;
	readonly maxHeight: number;
	readonly handleKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
	readonly menuContent: ReactNode;
}
