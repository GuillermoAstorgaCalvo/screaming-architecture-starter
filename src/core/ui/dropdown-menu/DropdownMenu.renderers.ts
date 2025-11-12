import type { KeyboardEvent, ReactElement, ReactNode, RefObject } from 'react';

import type { DropdownPosition } from './DropdownMenu.types';
import { renderDropdownPopover } from './DropdownMenuRenderers.popover';

export interface RenderDropdownMenuParams {
	readonly open: boolean;
	readonly setOpen: (open: boolean) => void;
	readonly triggerNode: ReactElement;
	readonly align: DropdownPosition;
	readonly className?: string | undefined;
	readonly menuRef: RefObject<HTMLDivElement | null>;
	readonly menuId: string;
	readonly menuLabel?: string | undefined;
	readonly maxHeight: number;
	readonly handleKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
	readonly menuContent: ReactNode;
}

export function renderDropdownMenu({
	open,
	setOpen,
	triggerNode,
	align,
	className,
	menuRef,
	menuId,
	menuLabel,
	maxHeight,
	handleKeyDown,
	menuContent,
}: RenderDropdownMenuParams): ReactNode {
	return renderDropdownPopover({
		open,
		setOpen,
		trigger: triggerNode,
		align,
		className,
		menuRef,
		menuId,
		menuLabel,
		maxHeight,
		handleKeyDown,
		menuContent,
	});
}
