import type { MenubarItem as MenubarItemType } from '@src-types/ui/navigation';
import type { RefObject } from 'react';

import { getMenubarItemClasses } from './MenubarHelpers';

interface MenubarItemProps {
	readonly item: MenubarItemType;
	readonly isActive: boolean;
	readonly itemRef: RefObject<HTMLButtonElement> | undefined;
	readonly onClick: () => void;
}

export function MenubarItem({ item, isActive, itemRef, onClick }: MenubarItemProps) {
	const classes = getMenubarItemClasses({ isActive, disabled: item.disabled ?? false });
	const ariaLabel = typeof item.label === 'string' ? item.label : undefined;

	return (
		<button
			ref={itemRef}
			type="button"
			role="menuitem"
			className={classes}
			onClick={onClick}
			disabled={item.disabled}
			aria-label={ariaLabel}
			data-active={isActive ? true : undefined}
		>
			{item.icon ? (
				<span className="mr-2" aria-hidden="true">
					{item.icon}
				</span>
			) : null}
			{item.label}
			{item.shortcut ? (
				<span className="ml-auto text-xs text-muted-foreground">{item.shortcut}</span>
			) : null}
		</button>
	);
}
