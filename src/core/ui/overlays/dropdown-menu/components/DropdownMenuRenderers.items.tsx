import Divider from '@core/ui/divider/Divider';
import { MenuItemButton } from '@core/ui/overlays/dropdown-menu/components/MenuItemButton';
import { MENU_STYLES } from '@core/ui/overlays/dropdown-menu/helpers/DropdownMenuHelpers';
import { ARIA_ATTRIBUTES } from '@core/ui/overlays/dropdown-menu/helpers/DropdownMenuTrigger';
import {
	isSeparator,
	type RenderMenuContentParams,
	type RenderMenuItemParams,
} from '@core/ui/overlays/dropdown-menu/types/DropdownMenuRenderers.types';
import { createRef, type ReactNode } from 'react';

export function renderMenuItem({
	item,
	index,
	highlightedIndex,
	itemRef,
	handleSelect,
}: RenderMenuItemParams): ReactNode {
	if (isSeparator(item)) {
		return (
			<li role={ARIA_ATTRIBUTES.ROLE_NONE} key={item.id} className="my-1">
				<Divider orientation="horizontal" />
			</li>
		);
	}

	// item is DropdownMenuItem here (TypeScript narrows the type)
	return (
		<li role={ARIA_ATTRIBUTES.ROLE_NONE} key={item.id}>
			<MenuItemButton
				item={item}
				isHighlighted={index === highlightedIndex}
				itemRef={itemRef ?? createRef<HTMLButtonElement>()}
				onSelect={handleSelect}
			/>
		</li>
	);
}

export function renderMenuContent({
	items,
	highlightedIndex,
	itemRefs,
	handleSelect,
	emptyState,
}: RenderMenuContentParams): ReactNode {
	if (items.length === 0) {
		return <div className={MENU_STYLES.EMPTY_STATE}>{emptyState}</div>;
	}
	return (
		<ul className={MENU_STYLES.CONTAINER} role={ARIA_ATTRIBUTES.ROLE_NONE}>
			{items.map((item, index) =>
				renderMenuItem({
					item,
					index,
					highlightedIndex,
					itemRef: itemRefs[index] ?? null,
					handleSelect,
				})
			)}
		</ul>
	);
}
