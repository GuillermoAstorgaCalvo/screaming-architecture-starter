import { MenubarItem } from '@core/ui/navigation/menubar/components/MenubarItem';
import { MenubarSubmenu } from '@core/ui/navigation/menubar/components/MenubarSubmenu';
import type { MenubarItem as MenubarItemType } from '@src-types/ui/navigation/menubar';
import type { RefObject } from 'react';

interface RenderMenubarItemParams {
	readonly item: MenubarItemType;
	readonly activeItemId: string | null;
	readonly openSubmenuId: string | null;
	readonly itemRef: RefObject<HTMLButtonElement> | undefined;
	readonly handleItemClick: (itemId: string) => void;
	readonly handleSubmenuClose: () => void;
}

/**
 * Renders a menubar item (either a regular item or a submenu)
 */
export function renderMenubarItem({
	item,
	activeItemId,
	openSubmenuId,
	itemRef,
	handleItemClick,
	handleSubmenuClose,
}: RenderMenubarItemParams) {
	const isActive = activeItemId === item.id;
	const isSubmenuOpen = openSubmenuId === item.id;

	if (item.submenu && item.submenu.length > 0) {
		return (
			<MenubarSubmenu
				key={item.id}
				item={item}
				isActive={isActive}
				isOpen={isSubmenuOpen}
				itemRef={itemRef}
				onItemClick={() => handleItemClick(item.id)}
				onSubmenuClose={handleSubmenuClose}
			/>
		);
	}

	return (
		<MenubarItem
			key={item.id}
			item={item}
			isActive={isActive}
			itemRef={itemRef}
			onClick={() => handleItemClick(item.id)}
		/>
	);
}
