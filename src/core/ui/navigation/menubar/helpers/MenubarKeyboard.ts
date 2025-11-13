import type { MenubarItem } from '@src-types/ui/navigation/menubar';
import type { KeyboardEvent, RefObject } from 'react';

interface HandleMenubarKeyDownParams {
	readonly event: KeyboardEvent<HTMLElement>;
	readonly items: readonly MenubarItem[];
	readonly activeItemId: string | null;
	readonly openSubmenuId: string | null;
	readonly setActiveItemId: (id: string | null) => void;
	readonly setOpenSubmenuId: (id: string | null) => void;
	readonly itemRefs: Map<string, RefObject<HTMLButtonElement>>;
	readonly handleItemClick: (itemId: string) => void;
}

interface HandleArrowParams {
	readonly items: readonly MenubarItem[];
	readonly currentIndex: number;
	readonly setActiveItemId: (id: string | null) => void;
	readonly itemRefs: Map<string, RefObject<HTMLButtonElement>>;
}

function handleArrowRight({
	items,
	currentIndex,
	setActiveItemId,
	itemRefs,
}: HandleArrowParams): void {
	const nextIndex = findNextEnabledMenubarItemIndex(items, currentIndex, 1);
	if (nextIndex >= 0) {
		const nextItem = items[nextIndex];
		if (nextItem) {
			setActiveItemId(nextItem.id);
			const ref = itemRefs.get(nextItem.id);
			if (ref?.current) {
				ref.current.focus();
			}
		}
	}
}

function handleArrowLeft({
	items,
	currentIndex,
	setActiveItemId,
	itemRefs,
}: HandleArrowParams): void {
	const prevIndex = findNextEnabledMenubarItemIndex(items, currentIndex, -1);
	if (prevIndex >= 0) {
		const prevItem = items[prevIndex];
		if (prevItem) {
			setActiveItemId(prevItem.id);
			const ref = itemRefs.get(prevItem.id);
			if (ref?.current) {
				ref.current.focus();
			}
		}
	}
}

function handleArrowDown(
	items: readonly MenubarItem[],
	activeItemId: string | null,
	setOpenSubmenuId: (id: string | null) => void
): void {
	if (!activeItemId) return;
	const item = items.find(i => i.id === activeItemId);
	if (item?.submenu && item.submenu.length > 0) {
		setOpenSubmenuId(activeItemId);
	}
}

function handleEscapeKey(
	setOpenSubmenuId: (id: string | null) => void,
	setActiveItemId: (id: string | null) => void
): void {
	setOpenSubmenuId(null);
	setActiveItemId(null);
}

function handleEnterOrSpace(
	activeItemId: string | null,
	handleItemClick: (itemId: string) => void
): void {
	if (activeItemId) {
		handleItemClick(activeItemId);
	}
}

interface ProcessKeyParams {
	readonly key: string;
	readonly items: readonly MenubarItem[];
	readonly currentIndex: number;
	readonly activeItemId: string | null;
	readonly setActiveItemId: (id: string | null) => void;
	readonly setOpenSubmenuId: (id: string | null) => void;
	readonly itemRefs: Map<string, RefObject<HTMLButtonElement>>;
	readonly handleItemClick: (itemId: string) => void;
}

function processKey({
	key,
	items,
	currentIndex,
	activeItemId,
	setActiveItemId,
	setOpenSubmenuId,
	itemRefs,
	handleItemClick,
}: ProcessKeyParams): void {
	const keyHandlers: Record<string, () => void> = {
		ArrowRight: () => handleArrowRight({ items, currentIndex, setActiveItemId, itemRefs }),
		ArrowLeft: () => handleArrowLeft({ items, currentIndex, setActiveItemId, itemRefs }),
		ArrowDown: () => handleArrowDown(items, activeItemId, setOpenSubmenuId),
		Escape: () => handleEscapeKey(setOpenSubmenuId, setActiveItemId),
		Enter: () => handleEnterOrSpace(activeItemId, handleItemClick),
		' ': () => handleEnterOrSpace(activeItemId, handleItemClick),
	};

	keyHandlers[key]?.();
}

export function handleMenubarKeyDown({
	event,
	items,
	activeItemId,
	openSubmenuId: _openSubmenuId,
	setActiveItemId,
	setOpenSubmenuId,
	itemRefs,
	handleItemClick,
}: HandleMenubarKeyDownParams): void {
	const currentIndex = activeItemId ? items.findIndex(item => item.id === activeItemId) : -1;
	event.preventDefault();
	processKey({
		key: event.key,
		items,
		currentIndex,
		activeItemId,
		setActiveItemId,
		setOpenSubmenuId,
		itemRefs,
		handleItemClick,
	});
}

export function findNextEnabledMenubarItemIndex(
	items: readonly MenubarItem[],
	startIndex: number,
	direction: 1 | -1
): number {
	let index = startIndex;
	const total = items.length;

	for (let i = 0; i < total; i += 1) {
		index = (index + direction + total) % total;
		if (!items[index]?.disabled) {
			return index;
		}
	}

	return -1;
}
