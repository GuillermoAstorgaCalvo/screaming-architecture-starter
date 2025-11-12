import Popover from '@core/ui/popover/Popover';
import { classNames } from '@core/utils/classNames';

import { getDropdownPosition, MENU_STYLES } from './DropdownMenuHelpers';
import { renderDropdownMenuContent } from './DropdownMenuRenderers.content';
import type {
	RenderDropdownMenuContentParams,
	RenderDropdownPopoverParams,
} from './DropdownMenuRenderers.types';

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
