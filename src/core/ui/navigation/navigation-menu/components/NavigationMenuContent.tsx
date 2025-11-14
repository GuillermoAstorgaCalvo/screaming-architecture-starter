import { MenuItemsList } from '@core/ui/navigation/navigation-menu/components/MenuItemsList';
import { getMenuContainerProps } from '@core/ui/navigation/navigation-menu/helpers/navigationMenuUtils';
import type { NavigationMenuContentProps } from '@core/ui/navigation/navigation-menu/types/types';

export function NavigationMenuContent(props: Readonly<NavigationMenuContentProps>) {
	const { classes, handleKeyDown, ...menuListProps } = props;
	const containerProps = getMenuContainerProps(menuListProps.orientation, classes, handleKeyDown);

	return (
		<div {...containerProps}>
			<MenuItemsList {...menuListProps} />
		</div>
	);
}
