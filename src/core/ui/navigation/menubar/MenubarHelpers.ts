import { classNames } from '@core/utils/classNames';
import type { MenubarItem } from '@src-types/ui/navigation/menubar';
import type { KeyboardEvent, RefObject } from 'react';

interface GetMenubarClassesParams {
	readonly className?: string | undefined;
}

export function getMenubarClasses({ className }: GetMenubarClassesParams): string {
	const baseClasses =
		'flex items-center gap-1 border-b border-gray-200 bg-white px-2 py-1 dark:border-gray-700 dark:bg-gray-800';

	return classNames(baseClasses, className);
}

interface GetMenubarItemClassesParams {
	readonly isActive: boolean;
	readonly disabled: boolean;
}

export function getMenubarItemClasses({
	isActive,
	disabled: _disabled,
}: GetMenubarItemClassesParams): string {
	const baseClasses =
		'inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';

	const stateClasses = isActive
		? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100'
		: 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-100';

	return classNames(baseClasses, stateClasses);
}

interface GetMenubarSubmenuClassesParams {
	readonly className?: string | undefined;
}

export function getMenubarSubmenuClasses({
	className,
}: GetMenubarSubmenuClassesParams = {}): string {
	const baseClasses =
		'w-56 rounded-lg border border-border bg-popover shadow-lg ring-1 ring-black/5 focus-visible:outline-none';

	return classNames(baseClasses, className);
}

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

	switch (event.key) {
		case 'ArrowRight': {
			event.preventDefault();
			handleArrowRight({ items, currentIndex, setActiveItemId, itemRefs });
			break;
		}
		case 'ArrowLeft': {
			event.preventDefault();
			handleArrowLeft({ items, currentIndex, setActiveItemId, itemRefs });
			break;
		}
		case 'ArrowDown': {
			event.preventDefault();
			handleArrowDown(items, activeItemId, setOpenSubmenuId);
			break;
		}
		case 'Escape': {
			event.preventDefault();
			handleEscapeKey(setOpenSubmenuId, setActiveItemId);
			break;
		}
		case 'Enter':
		case ' ': {
			event.preventDefault();
			handleEnterOrSpace(activeItemId, handleItemClick);
			break;
		}
		// No default
	}
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
