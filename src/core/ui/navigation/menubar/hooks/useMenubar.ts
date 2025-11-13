import {
	useItemClickHandler,
	useSubmenuCloseHandler,
} from '@core/ui/navigation/menubar/hooks/useMenubar.click';
import { useKeyDownHandler } from '@core/ui/navigation/menubar/hooks/useMenubar.keyboard';
import type { MenubarItem } from '@src-types/ui/navigation/menubar';
import type { RefObject } from 'react';

interface UseMenubarParams {
	readonly items: readonly MenubarItem[];
	readonly activeItemId: string | null;
	readonly setActiveItemId: (id: string | null) => void;
	readonly openSubmenuId: string | null;
	readonly setOpenSubmenuId: (id: string | null) => void;
	readonly itemRefs: Map<string, RefObject<HTMLButtonElement>>;
}

export function useMenubar({
	items,
	activeItemId,
	setActiveItemId,
	openSubmenuId,
	setOpenSubmenuId,
	itemRefs,
}: UseMenubarParams) {
	const handleItemClick = useItemClickHandler({
		items,
		openSubmenuId,
		setOpenSubmenuId,
		setActiveItemId,
	});
	const handleSubmenuClose = useSubmenuCloseHandler({ setOpenSubmenuId, setActiveItemId });
	const handleKeyDown = useKeyDownHandler({
		items,
		activeItemId,
		openSubmenuId,
		setActiveItemId,
		setOpenSubmenuId,
		itemRefs,
		handleItemClick,
	});
	return { handleKeyDown, handleItemClick, handleSubmenuClose };
}
