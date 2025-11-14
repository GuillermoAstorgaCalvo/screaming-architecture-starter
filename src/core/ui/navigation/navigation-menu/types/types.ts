import type { NavigationMenuItem as NavigationMenuItemType } from '@src-types/ui/navigation/navigationMenu';
import type { KeyboardEvent, RefObject } from 'react';

/**
 * Shared props interface - properties are used by extending interfaces and passed to components via spread
 */
export interface SharedMenuProps {
	readonly items: readonly NavigationMenuItemType[];
	readonly activeItemId: string;
	readonly size: 'sm' | 'md' | 'lg';
	readonly variant: 'default' | 'underline' | 'pills';
	readonly orientation: 'horizontal' | 'vertical';
	readonly itemRefs: readonly (RefObject<HTMLLIElement | null> | undefined)[];
	readonly onItemChange: (itemId: string) => void;
}

export interface MenuItemRendererProps extends SharedMenuProps {
	readonly item: NavigationMenuItemType;
	readonly index: number;
}

export interface NavigationMenuContentProps extends SharedMenuProps {
	readonly handleKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
	readonly classes: string;
}
