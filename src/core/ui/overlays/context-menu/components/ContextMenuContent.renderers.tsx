import Divider from '@core/ui/divider/Divider';
import { MenuItemButton } from '@core/ui/dropdown-menu/MenuItemButton';
import Popover from '@core/ui/popover/Popover';
import { classNames } from '@core/utils/classNames';
import type { ReactNode } from 'react';

import { MENU_STYLES } from './ContextMenuContent.styles';
import { createTriggerNode } from './ContextMenuContent.trigger';
import type {
	RenderContextMenuContentParams,
	RenderMenuContentParams,
	RenderPopoverParams,
} from './ContextMenuContent.types';
import { getContextMenuPosition, isSeparator } from './ContextMenuHelpers';

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
		<ul className={MENU_STYLES.CONTAINER} role="none">
			{items.map((item, index) => {
				if (isSeparator(item)) {
					return (
						<li role="none" key={item.id} className="my-1">
							<Divider orientation="horizontal" />
						</li>
					);
				}
				return (
					<li role="none" key={item.id}>
						<MenuItemButton
							item={item}
							isHighlighted={index === highlightedIndex}
							itemRef={itemRefs[index] ?? { current: null }}
							onSelect={handleSelect}
						/>
					</li>
				);
			})}
		</ul>
	);
}

export function renderContextMenuContent({
	menuRef,
	menuId,
	menuLabel,
	maxHeight,
	handleKeyDown,
	menuContent,
}: RenderContextMenuContentParams): ReactNode {
	return (
		<div
			ref={menuRef}
			id={menuId}
			role="menu"
			aria-label={menuLabel}
			tabIndex={-1}
			className={MENU_STYLES.MENU_WRAPPER}
			style={{ ['--menu-max-height' as string]: `${maxHeight}px` }}
			onKeyDown={handleKeyDown}
		>
			{menuContent}
		</div>
	);
}

export function renderPopover(params: RenderPopoverParams): ReactNode {
	return (
		<Popover
			isOpen={params.open}
			onClose={() => params.setOpen(false)}
			trigger={createTriggerNode({
				trigger: params.trigger,
				open: params.open,
				menuId: params.menuId,
				setOpen: params.setOpen,
			})}
			position={getContextMenuPosition(params.align)}
			className={classNames(MENU_STYLES.POPOVER_BASE, params.className)}
		>
			{renderContextMenuContent({
				menuRef: params.menuRef,
				menuId: params.menuId,
				menuLabel: params.menuLabel,
				maxHeight: params.maxHeight,
				handleKeyDown: params.handleKeyDown,
				menuContent: params.menuContent,
			})}
		</Popover>
	);
}
