import { MenubarItem } from '@core/ui/navigation/menubar/components/MenubarItem';
import { MenubarSubmenu } from '@core/ui/navigation/menubar/components/MenubarSubmenu';
import { getMenubarClasses } from '@core/ui/navigation/menubar/helpers/MenubarHelpers';
import { useMenubar } from '@core/ui/navigation/menubar/hooks/useMenubar';
import type {
	MenubarItem as MenubarItemType,
	MenubarProps,
} from '@src-types/ui/navigation/menubar';
import { createRef, type RefObject, useMemo, useState } from 'react';

interface RenderMenubarItemParams {
	readonly item: MenubarItemType;
	readonly activeItemId: string | null;
	readonly openSubmenuId: string | null;
	readonly itemRef: RefObject<HTMLButtonElement> | undefined;
	readonly handleItemClick: (itemId: string) => void;
	readonly handleSubmenuClose: () => void;
}

function renderMenubarItem({
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

function createItemRefs(
	items: readonly MenubarItemType[]
): Map<string, RefObject<HTMLButtonElement>> {
	const refs = new Map<string, RefObject<HTMLButtonElement>>();
	for (const item of items) {
		refs.set(item.id, createRef<HTMLButtonElement>() as RefObject<HTMLButtonElement>);
	}
	return refs;
}

function useMenubarState(items: readonly MenubarItemType[]) {
	const [activeItemId, setActiveItemId] = useState<string | null>(null);
	const [openSubmenuId, setOpenSubmenuId] = useState<string | null>(null);
	const itemRefs = useMemo(() => createItemRefs(items), [items]);
	return { activeItemId, setActiveItemId, openSubmenuId, setOpenSubmenuId, itemRefs };
}

/**
 * Menubar - Horizontal menu bar component (application menu)
 *
 * Features:
 * - Keyboard navigation (Arrow keys, Enter, Escape)
 * - Submenu support with dropdowns
 * - Accessible ARIA attributes
 * - Dark mode support
 * - Multiple menu items with optional submenus
 *
 * @example
 * ```tsx
 * <Menubar
 *   items={[
 *     { id: 'file', label: 'File', submenu: [...] },
 *     { id: 'edit', label: 'Edit' },
 *   ]}
 * />
 * ```
 */
export default function Menubar({ items, className, ...props }: Readonly<MenubarProps>) {
	const { activeItemId, setActiveItemId, openSubmenuId, setOpenSubmenuId, itemRefs } =
		useMenubarState(items);
	const { handleKeyDown, handleItemClick, handleSubmenuClose } = useMenubar({
		items,
		activeItemId,
		setActiveItemId,
		openSubmenuId,
		setOpenSubmenuId,
		itemRefs,
	});
	const classes = getMenubarClasses({ className });

	return (
		<div
			role="menubar"
			aria-label="Application menu"
			className={classes}
			onKeyDown={handleKeyDown}
			tabIndex={0}
			{...props}
		>
			{items.map((item: MenubarItemType) => {
				const itemRef = itemRefs.get(item.id);
				return renderMenubarItem({
					item,
					activeItemId,
					openSubmenuId,
					itemRef,
					handleItemClick,
					handleSubmenuClose,
				});
			})}
		</div>
	);
}
