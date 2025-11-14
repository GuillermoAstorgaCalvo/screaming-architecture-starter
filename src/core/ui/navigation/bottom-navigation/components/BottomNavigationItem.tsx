import { BADGE_CLASSES } from '@core/ui/navigation/bottom-navigation/constants/bottomNavigation.constants';
import {
	getItemClasses,
	handleItemClick,
} from '@core/ui/navigation/bottom-navigation/utils/bottomNavigation.utils';
import type { BottomNavigationItem } from '@src-types/ui/navigation/bottomNavigation';

/**
 * Props for BottomNavigationItem component
 */
export interface BottomNavigationItemProps {
	/** Navigation item data */
	item: BottomNavigationItem;
	/** Whether this item is currently active */
	isActive: boolean;
	/** Size variant */
	size: 'sm' | 'md' | 'lg';
	/** Whether to show labels */
	showLabels: boolean;
	/** Callback when item changes */
	onItemChange: (itemId: string) => void;
}

/**
 * Renders a single navigation item
 */
export function NavigationItem({
	item,
	isActive,
	size,
	showLabels,
	onItemChange,
}: Readonly<BottomNavigationItemProps>) {
	const itemClasses = getItemClasses(isActive, size);
	const hasBadge = item.badge !== undefined;

	return (
		<button
			type="button"
			className={itemClasses}
			onClick={() => handleItemClick(item, onItemChange)}
			disabled={item.disabled}
			aria-label={item.label}
			aria-current={isActive ? 'page' : undefined}
		>
			<span className="relative">
				{item.icon}
				{hasBadge ? <span className={BADGE_CLASSES}>{item.badge}</span> : null}
			</span>
			{showLabels ? <span className="truncate max-w-full">{item.label}</span> : null}
		</button>
	);
}
