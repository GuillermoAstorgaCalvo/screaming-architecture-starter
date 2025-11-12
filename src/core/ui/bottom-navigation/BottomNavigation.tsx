import type { BottomNavigationItem, BottomNavigationProps } from '@src-types/ui/navigation';
import { twMerge } from 'tailwind-merge';

/**
 * Bottom navigation base classes
 */
const BOTTOM_NAV_BASE_CLASSES =
	'fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border dark:bg-background-dark dark:border-border-dark';

/**
 * Bottom navigation container classes
 */
const BOTTOM_NAV_CONTAINER_CLASSES = 'flex items-center justify-around h-16 px-2 safe-area-bottom';

/**
 * Bottom navigation item base classes
 */
const BOTTOM_NAV_ITEM_BASE_CLASSES =
	'flex flex-col items-center justify-center min-w-0 flex-1 h-full px-2 py-1 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

/**
 * Bottom navigation item active classes
 */
const BOTTOM_NAV_ITEM_ACTIVE_CLASSES = 'text-primary dark:text-primary';

/**
 * Bottom navigation item inactive classes
 */
const BOTTOM_NAV_ITEM_INACTIVE_CLASSES =
	'text-text-muted hover:text-text-primary hover:bg-muted dark:text-text-muted dark:hover:text-text-primary dark:hover:bg-muted-dark';

/**
 * Bottom navigation item size classes
 */
const BOTTOM_NAV_ITEM_SIZE_CLASSES = {
	sm: 'text-xs gap-1',
	md: 'text-sm gap-1.5',
	lg: 'text-base gap-2',
} as const;

/**
 * Badge classes
 */
const BADGE_CLASSES =
	'absolute -top-1 -right-1 min-w-[1.25rem] h-5 px-1.5 flex items-center justify-center text-xs font-medium rounded-full bg-primary text-primary-foreground dark:bg-primary dark:text-primary-foreground';

/**
 * Handles item click event
 */
function handleItemClick(item: BottomNavigationItem, onItemChange: (itemId: string) => void): void {
	if (!item.disabled) {
		onItemChange(item.id);
	}
}

/**
 * Computes CSS classes for a navigation item
 */
function getItemClasses(isActive: boolean, size: 'sm' | 'md' | 'lg'): string {
	const itemSizeClasses = BOTTOM_NAV_ITEM_SIZE_CLASSES[size];
	const stateClasses = isActive ? BOTTOM_NAV_ITEM_ACTIVE_CLASSES : BOTTOM_NAV_ITEM_INACTIVE_CLASSES;

	return twMerge(BOTTOM_NAV_ITEM_BASE_CLASSES, itemSizeClasses, stateClasses);
}

/**
 * Renders a single navigation item
 */
function NavigationItem({
	item,
	isActive,
	size,
	showLabels,
	onItemChange,
}: Readonly<{
	item: BottomNavigationItem;
	isActive: boolean;
	size: 'sm' | 'md' | 'lg';
	showLabels: boolean;
	onItemChange: (itemId: string) => void;
}>) {
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

/**
 * BottomNavigation - Bottom navigation bar for mobile apps
 *
 * Features:
 * - Accessible: proper semantic HTML, keyboard navigation, focus states
 * - Size variants: sm, md, lg
 * - Badge support for notifications
 * - Optional labels
 * - Fixed positioning at bottom
 * - Safe area support for mobile devices
 * - Dark mode support
 *
 * @example
 * ```tsx
 * <BottomNavigation
 *   items={[
 *     { id: 'home', label: 'Home', icon: <HomeIcon /> },
 *     { id: 'search', label: 'Search', icon: <SearchIcon /> },
 *     { id: 'profile', label: 'Profile', icon: <ProfileIcon />, badge: 3 },
 *   ]}
 *   activeItemId="home"
 *   onItemChange={handleItemChange}
 * />
 * ```
 */
export default function BottomNavigation({
	items,
	activeItemId,
	onItemChange,
	size = 'md',
	showLabels = true,
	className,
	...props
}: Readonly<BottomNavigationProps>) {
	const containerClasses = twMerge(BOTTOM_NAV_BASE_CLASSES, className);

	return (
		<nav className={containerClasses} {...props}>
			<div className={BOTTOM_NAV_CONTAINER_CLASSES}>
				{items.map(item => (
					<NavigationItem
						key={item.id}
						item={item}
						isActive={item.id === activeItemId}
						size={size}
						showLabels={showLabels}
						onItemChange={onItemChange}
					/>
				))}
			</div>
		</nav>
	);
}
