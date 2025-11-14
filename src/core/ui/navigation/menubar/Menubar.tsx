import i18n from '@core/i18n/i18n';
import { getMenubarClasses } from '@core/ui/navigation/menubar/helpers/MenubarHelpers';
import { renderMenubarItem } from '@core/ui/navigation/menubar/helpers/MenubarRender';
import { useMenubar } from '@core/ui/navigation/menubar/hooks/useMenubar';
import { useMenubarState } from '@core/ui/navigation/menubar/hooks/useMenubarState';
import type {
	MenubarItem as MenubarItemType,
	MenubarProps,
} from '@src-types/ui/navigation/menubar';

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
			aria-label={i18n.t('a11y.applicationMenu', { ns: 'common' })}
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
