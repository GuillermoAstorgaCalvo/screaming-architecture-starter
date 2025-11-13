import { NavigationMenuItem } from '@core/ui/navigation/navigation-menu/components/NavigationMenuItem';
import { getNavigationMenuClasses } from '@core/ui/navigation/navigation-menu/helpers/navigationMenuClasses';
import { useNavigationMenu } from '@core/ui/navigation/navigation-menu/hooks/useNavigationMenu';
import type {
	NavigationMenuItem as NavigationMenuItemType,
	NavigationMenuProps,
} from '@src-types/ui/navigation/navigationMenu';
import type { KeyboardEvent, RefObject } from 'react';

// Shared props interface - properties are used by extending interfaces and passed to components via spread
interface SharedMenuProps {
	readonly items: readonly NavigationMenuItemType[];
	readonly activeItemId: string;
	readonly size: 'sm' | 'md' | 'lg';
	readonly variant: 'default' | 'underline' | 'pills';
	readonly orientation: 'horizontal' | 'vertical';
	readonly itemRefs: readonly (RefObject<HTMLLIElement | null> | undefined)[];
	readonly onItemChange: (itemId: string) => void;
}

interface MenuItemRendererProps extends SharedMenuProps {
	readonly item: NavigationMenuItemType;
	readonly index: number;
}

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

function MenuItemsList(props: SharedMenuProps) {
	return (
		<ul className="flex list-none gap-1">
			{props.items.map((item: NavigationMenuItemType, index: number) =>
				renderMenuItem({ ...props, item, index })
			)}
		</ul>
	);
}

interface NavigationMenuContentProps extends SharedMenuProps {
	readonly handleKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
	readonly classes: string;
}

function getMenuContainerProps(
	orientation: 'horizontal' | 'vertical',
	classes: string,
	handleKeyDown: (event: KeyboardEvent<HTMLElement>) => void
) {
	return {
		role: 'menu' as const,
		className: classes,
		onKeyDown: handleKeyDown,
		tabIndex: 0,
		'aria-orientation': orientation,
	};
}

function NavigationMenuContent(props: NavigationMenuContentProps) {
	const { classes, handleKeyDown, ...menuListProps } = props;
	const containerProps = getMenuContainerProps(menuListProps.orientation, classes, handleKeyDown);

	return (
		<div {...containerProps}>
			<MenuItemsList {...menuListProps} />
		</div>
	);
}

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
	const { handleKeyDown, itemRefs } = useNavigationMenu({ items, activeItemId, onItemChange });
	const classes = getNavigationMenuClasses({ variant, orientation, className });

	return (
		<nav role="navigation" aria-label="Main navigation" {...props}>
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
