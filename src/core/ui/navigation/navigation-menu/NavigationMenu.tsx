import { useTranslation } from '@core/i18n/useTranslation';
import { NavigationMenuContent } from '@core/ui/navigation/navigation-menu/components/NavigationMenuContent';
import { getNavigationMenuClasses } from '@core/ui/navigation/navigation-menu/helpers/navigationMenuClasses';
import { useNavigationMenu } from '@core/ui/navigation/navigation-menu/hooks/useNavigationMenu';
import type { NavigationMenuProps } from '@src-types/ui/navigation/navigationMenu';

/**
 * NavigationMenu - Accessible navigation menu component
 *
 * Features:
 * - Keyboard navigation (Arrow keys, Home, End)
 * - Active state management
 * - Multiple variants: default, underline, pills
 * - Size variants: sm, md, lg
 * - Dark mode support
 * - Accessible ARIA attributes
 *
 * @example
 * ```tsx
 * const [activeItem, setActiveItem] = useState('home');
 * <NavigationMenu
 *   items={[
 *     { id: 'home', label: 'Home', to: '/' },
 *     { id: 'about', label: 'About', to: '/about' },
 *   ]}
 *   activeItemId={activeItem}
 *   onItemChange={setActiveItem}
 * />
 * ```
 */
export default function NavigationMenu({
	items,
	activeItemId,
	onItemChange,
	variant = 'default',
	size = 'md',
	orientation = 'horizontal',
	className,
	...props
}: Readonly<NavigationMenuProps>) {
	const { t } = useTranslation('common');
	const { handleKeyDown, itemRefs } = useNavigationMenu({ items, activeItemId, onItemChange });
	const classes = getNavigationMenuClasses({ variant, orientation, className });

	return (
		<nav role="navigation" aria-label={t('a11y.mainNavigation')} {...props}>
			<NavigationMenuContent
				items={items}
				activeItemId={activeItemId}
				size={size}
				variant={variant}
				orientation={orientation}
				itemRefs={itemRefs}
				onItemChange={onItemChange}
				handleKeyDown={handleKeyDown}
				classes={classes}
			/>
		</nav>
	);
}
