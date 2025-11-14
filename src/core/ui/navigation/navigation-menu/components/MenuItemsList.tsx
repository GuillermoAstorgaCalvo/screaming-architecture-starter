import { NavigationMenuItem } from '@core/ui/navigation/navigation-menu/components/NavigationMenuItem';
import type {
	MenuItemRendererProps,
	SharedMenuProps,
} from '@core/ui/navigation/navigation-menu/types/types';
import type { NavigationMenuItem as NavigationMenuItemType } from '@src-types/ui/navigation/navigationMenu';

function renderMenuItem({
	item,
	index,
	activeItemId,
	size,
	variant,
	orientation,
	itemRefs,
	onItemChange,
}: MenuItemRendererProps) {
	const itemRef = itemRefs[index];
	if (!itemRef) return null;

	return (
		<NavigationMenuItem
			key={item.id}
			item={item}
			isActive={item.id === activeItemId}
			size={size}
			variant={variant}
			orientation={orientation}
			itemRef={itemRef}
			onClick={() => onItemChange(item.id)}
		/>
	);
}

export function MenuItemsList(props: Readonly<SharedMenuProps>) {
	return (
		<ul className="flex list-none gap-1">
			{props.items.map((item: NavigationMenuItemType, index: number) =>
				renderMenuItem({ ...props, item, index })
			)}
		</ul>
	);
}
