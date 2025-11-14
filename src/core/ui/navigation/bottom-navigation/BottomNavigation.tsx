import type { BottomNavigationProps } from '@src-types/ui/navigation/bottomNavigation';
import { twMerge } from 'tailwind-merge';

import { NavigationItem } from './components/BottomNavigationItem';
import {
	BOTTOM_NAV_BASE_CLASSES,
	BOTTOM_NAV_CONTAINER_CLASSES,
	BOTTOM_NAV_Z_INDEX,
} from './constants/bottomNavigation.constants';

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
		<nav className={containerClasses} style={{ zIndex: BOTTOM_NAV_Z_INDEX }} {...props}>
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
