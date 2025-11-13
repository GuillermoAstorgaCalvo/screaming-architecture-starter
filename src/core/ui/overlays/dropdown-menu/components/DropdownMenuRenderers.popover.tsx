import { renderDropdownMenuContent } from '@core/ui/overlays/dropdown-menu/components/DropdownMenuRenderers.content';
import {
	getDropdownPosition,
	MENU_STYLES,
} from '@core/ui/overlays/dropdown-menu/helpers/DropdownMenuHelpers';
import type {
	RenderDropdownMenuContentParams,
	RenderDropdownPopoverParams,
} from '@core/ui/overlays/dropdown-menu/types/DropdownMenuRenderers.types';
import Popover from '@core/ui/popover/Popover';
import { classNames } from '@core/utils/classNames';

export function renderDropdownPopover({
	open,
	setOpen,
	trigger,
	align = 'center',
	className,
	menuRef,
	menuId,
	menuLabel,
	maxHeight,
	handleKeyDown,
	menuContent,
}: RenderDropdownPopoverParams) {
	const popoverProps = {
		isOpen: open,
		onClose: () => setOpen(false),
		trigger,
		position: getDropdownPosition(align),
		className: classNames(MENU_STYLES.POPOVER_BASE, className),
	} as const;
	const menuContentParams: RenderDropdownMenuContentParams = {
		menuRef,
		menuId,
		menuLabel,
		maxHeight,
		handleKeyDown,
		menuContent,
	};
	return <Popover {...popoverProps}>{renderDropdownMenuContent(menuContentParams)}</Popover>;
}
