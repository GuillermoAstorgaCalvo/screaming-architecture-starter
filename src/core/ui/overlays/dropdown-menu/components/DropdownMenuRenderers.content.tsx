import { ARIA_ATTRIBUTES, MENU_STYLES } from './DropdownMenuHelpers';
import type { RenderDropdownMenuContentParams } from './DropdownMenuRenderers.types';

export function createMenuWrapperProps({
	menuRef,
	menuId,
	menuLabel,
	maxHeight,
	handleKeyDown,
}: Omit<RenderDropdownMenuContentParams, 'menuContent'>) {
	return {
		ref: menuRef,
		id: menuId,
		role: ARIA_ATTRIBUTES.ROLE_MENU,
		'aria-label': menuLabel,
		tabIndex: -1 as const, // NOSONAR: typescript:S6848 - tabIndex={-1} is required for programmatic focus on menu container per ARIA spec; menu items handle direct interaction
		className: MENU_STYLES.MENU_WRAPPER,
		style: { ['--menu-max-height' as string]: `${maxHeight}px` },
		onKeyDown: handleKeyDown, // NOSONAR: typescript:S6848 - This div has role="menu" and proper keyboard handling, which is the correct ARIA pattern for menu containers
	};
}

export function renderDropdownMenuContent({
	menuRef,
	menuId,
	menuLabel,
	maxHeight,
	handleKeyDown,
	menuContent,
}: RenderDropdownMenuContentParams) {
	// Note: Using div with role="menu" is the correct ARIA pattern for menu containers
	// The div has proper keyboard handling via onKeyDown and tabIndex for focus management
	return (
		<div {...createMenuWrapperProps({ menuRef, menuId, menuLabel, maxHeight, handleKeyDown })}>
			{menuContent}
		</div>
	);
}
