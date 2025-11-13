import type { NavigationMenuItem } from '@src-types/ui/navigation/navigationMenu';
import { createRef, type KeyboardEvent, useCallback, useMemo } from 'react';

import { handleNavigationKeyDown } from './navigationMenuKeyboard';

interface UseNavigationMenuParams {
	readonly items: readonly NavigationMenuItem[];
	readonly activeItemId: string;
	readonly onItemChange: (itemId: string) => void;
}

export function useNavigationMenu({ items, activeItemId, onItemChange }: UseNavigationMenuParams) {
	const itemRefs = useMemo(() => items.map(() => createRef<HTMLLIElement | null>()), [items]);

	const handleKeyDown = useCallback(
		(event: KeyboardEvent<HTMLElement>) => {
			handleNavigationKeyDown({
				event,
				items,
				activeItemId,
				onItemChange,
				itemRefs,
			});
		},
		[items, activeItemId, onItemChange, itemRefs]
	);

	return { handleKeyDown, itemRefs };
}
