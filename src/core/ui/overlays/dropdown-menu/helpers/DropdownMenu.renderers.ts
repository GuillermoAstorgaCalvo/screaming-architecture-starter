import { renderDropdownPopover } from '@core/ui/overlays/dropdown-menu/components/DropdownMenuRenderers.popover';
import type { DropdownPosition } from '@core/ui/overlays/dropdown-menu/types/DropdownMenu.types';
import type { KeyboardEvent, ReactElement, ReactNode, RefObject } from 'react';

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
