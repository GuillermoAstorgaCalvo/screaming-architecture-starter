import { createItemRefs } from '@core/ui/navigation/menubar/helpers/MenubarRefs';
import type { MenubarItem } from '@src-types/ui/navigation/menubar';
import { type RefObject, useMemo, useState } from 'react';

interface UseMenubarStateReturn {
	readonly activeItemId: string | null;
	readonly setActiveItemId: (id: string | null) => void;
	readonly openSubmenuId: string | null;
	readonly setOpenSubmenuId: (id: string | null) => void;
	readonly itemRefs: Map<string, RefObject<HTMLButtonElement>>;
}

/**
 * Hook to manage menubar state (active item, open submenu, and item refs)
 */
export function useMenubarState(items: readonly MenubarItem[]): UseMenubarStateReturn {
	const [activeItemId, setActiveItemId] = useState<string | null>(null);
	const [openSubmenuId, setOpenSubmenuId] = useState<string | null>(null);
	const itemRefs = useMemo(() => createItemRefs(items), [items]);
	return { activeItemId, setActiveItemId, openSubmenuId, setOpenSubmenuId, itemRefs };
}
