import Divider from '@core/ui/divider/Divider';
import Popover from '@core/ui/popover/Popover';
import type {
	MenubarItem as MenubarItemType,
	MenubarSubmenuItemOrSeparator,
} from '@src-types/ui/navigation/menubar';
import type { ReactNode, RefObject } from 'react';

import { getMenubarItemClasses, getMenubarSubmenuClasses } from './MenubarHelpers';
import { MenubarSubmenuItem } from './MenubarSubmenuItem';

interface MenubarSubmenuProps {
	readonly item: MenubarItemType;
	readonly isActive: boolean;
	readonly isOpen: boolean;
	readonly itemRef: RefObject<HTMLButtonElement> | undefined;
	readonly onItemClick: () => void;
	readonly onSubmenuClose: () => void;
}

function getAriaLabel(label: ReactNode): string | undefined {
	if (typeof label === 'string') {
		return label;
	}
	return undefined;
}

function MenubarSubmenuTrigger({
	item,
	isActive,
	isOpen,
	itemRef,
	onItemClick,
}: {
	readonly item: MenubarItemType;
	readonly isActive: boolean;
	readonly isOpen: boolean;
	readonly itemRef: RefObject<HTMLButtonElement> | undefined;
	readonly onItemClick: () => void;
}) {
	const buttonClasses = getMenubarItemClasses({ isActive, disabled: item.disabled ?? false });

	return (
		<button
			ref={itemRef}
			type="button"
			role="menuitem"
			aria-haspopup="true"
			aria-expanded={isOpen}
			className={buttonClasses}
			onClick={onItemClick}
			disabled={item.disabled}
			aria-label={getAriaLabel(item.label)}
			data-active={isActive ? true : undefined}
		>
			{item.icon ? (
				<span className="mr-2" aria-hidden="true">
					{item.icon}
				</span>
			) : null}
			{item.label}
			<span className="ml-2" aria-hidden="true">
				▼
			</span>
		</button>
	);
}

function renderSubmenuContent(submenu: readonly MenubarSubmenuItemOrSeparator[] | undefined) {
	if (!submenu) {
		return null;
	}

	return (
		<div className="flex flex-col gap-1 py-2">
			{submenu.map(submenuItem => {
				if ('type' in submenuItem) {
					return (
						<div key={submenuItem.id} className="my-1">
							<Divider orientation="horizontal" />
						</div>
					);
				}
				return (
					<MenubarSubmenuItem
						key={submenuItem.id}
						item={submenuItem}
						onSelect={submenuItem.onSelect}
					/>
				);
			})}
		</div>
	);
}

export function MenubarSubmenu({
	item,
	isActive,
	isOpen,
	itemRef,
	onItemClick,
	onSubmenuClose,
}: MenubarSubmenuProps) {
	const submenuClasses = getMenubarSubmenuClasses();

	return (
		<Popover
			isOpen={isOpen}
			onClose={onSubmenuClose}
			trigger={
				<MenubarSubmenuTrigger
					item={item}
					isActive={isActive}
					isOpen={isOpen}
					itemRef={itemRef}
					onItemClick={onItemClick}
				/>
			}
			position="bottom-start"
			className={submenuClasses}
		>
			{renderSubmenuContent(item.submenu)}
		</Popover>
	);
}
