import Link from '@core/ui/link/Link';
import { getNavigationMenuItemClasses } from '@core/ui/navigation/navigation-menu/helpers/navigationMenuClasses';
import type { NavigationMenuItem as NavigationMenuItemType } from '@src-types/ui/navigation/navigationMenu';
import type { ReactNode, RefObject } from 'react';

interface NavigationMenuItemProps {
	readonly item: NavigationMenuItemType;
	readonly isActive: boolean;
	readonly size: 'sm' | 'md' | 'lg';
	readonly variant: 'default' | 'underline' | 'pills';
	readonly orientation: 'horizontal' | 'vertical';
	readonly itemRef: RefObject<HTMLLIElement | null>;
	readonly onClick: () => void;
}

function ItemContent({ icon, label }: { readonly icon?: ReactNode; readonly label: ReactNode }) {
	return (
		<>
			{icon ? (
				<span className="mr-2" aria-hidden="true">
					{icon}
				</span>
			) : null}
			{label}
		</>
	);
}

function renderLinkItem(
	item: NavigationMenuItemType & { to: string },
	itemRef: RefObject<HTMLLIElement | null>,
	commonProps: Record<string, unknown>
) {
	return (
		<li ref={itemRef} role="none">
			<Link to={item.to} {...commonProps}>
				<ItemContent icon={item.icon} label={item.label} />
			</Link>
		</li>
	);
}

function renderButtonItem(
	item: NavigationMenuItemType,
	itemRef: RefObject<HTMLLIElement | null>,
	commonProps: Record<string, unknown>
) {
	return (
		<li ref={itemRef} role="none">
			<button type="button" {...commonProps} disabled={item.disabled}>
				<ItemContent icon={item.icon} label={item.label} />
			</button>
		</li>
	);
}

export function NavigationMenuItem({
	item,
	isActive,
	size,
	variant,
	orientation,
	itemRef,
	onClick,
}: NavigationMenuItemProps) {
	const classes = getNavigationMenuItemClasses({ isActive, size, variant, orientation });
	const commonProps = {
		className: classes,
		onClick,
		'aria-current': isActive ? ('page' as const) : undefined,
		role: 'menuitem' as const,
	};

	if (item.to) {
		return renderLinkItem({ ...item, to: item.to }, itemRef, commonProps);
	}

	return renderButtonItem(item, itemRef, commonProps);
}
