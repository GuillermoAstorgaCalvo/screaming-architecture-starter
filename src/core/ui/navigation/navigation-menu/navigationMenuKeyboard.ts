import type { NavigationMenuItem } from '@src-types/ui/navigation/navigationMenu';
import type { KeyboardEvent, RefObject } from 'react';

import { findNextEnabledItemIndex } from './navigationMenuUtils';

interface HandleNavigationKeyDownParams {
	readonly event: KeyboardEvent<HTMLElement>;
	readonly items: readonly NavigationMenuItem[];
	readonly activeItemId: string;
	readonly onItemChange: (itemId: string) => void;
	readonly itemRefs: RefObject<HTMLLIElement | null>[];
}

function focusItemElement(itemRef: RefObject<HTMLLIElement | null>): void {
	const element = itemRef.current?.querySelector('a, button');
	if (element && element instanceof HTMLElement) {
		element.focus();
	}
}

interface NavigateToItemParams {
	readonly items: readonly NavigationMenuItem[];
	readonly index: number;
	readonly onItemChange: (itemId: string) => void;
	readonly itemRefs: RefObject<HTMLLIElement | null>[];
}

function navigateToItem({ items, index, onItemChange, itemRefs }: NavigateToItemParams): void {
	const item = items[index];
	const itemRef = itemRefs[index];
	if (item && itemRef) {
		onItemChange(item.id);
		focusItemElement(itemRef);
	}
}

interface HandleArrowNavigationParams {
	readonly event: KeyboardEvent<HTMLElement>;
	readonly items: readonly NavigationMenuItem[];
	readonly currentIndex: number;
	readonly direction: 1 | -1;
	readonly onItemChange: (itemId: string) => void;
	readonly itemRefs: RefObject<HTMLLIElement | null>[];
}

function handleArrowNavigation({
	event,
	items,
	currentIndex,
	direction,
	onItemChange,
	itemRefs,
}: HandleArrowNavigationParams): void {
	event.preventDefault();
	const targetIndex = findNextEnabledItemIndex(items, currentIndex, direction);
	if (targetIndex >= 0) {
		navigateToItem({ items, index: targetIndex, onItemChange, itemRefs });
	}
}

interface HandleHomeEndNavigationParams {
	readonly event: KeyboardEvent<HTMLElement>;
	readonly items: readonly NavigationMenuItem[];
	readonly startIndex: number;
	readonly direction: 1 | -1;
	readonly onItemChange: (itemId: string) => void;
	readonly itemRefs: RefObject<HTMLLIElement | null>[];
}

function handleHomeEndNavigation({
	event,
	items,
	startIndex,
	direction,
	onItemChange,
	itemRefs,
}: HandleHomeEndNavigationParams): void {
	event.preventDefault();
	const targetIndex = findNextEnabledItemIndex(items, startIndex, direction);
	if (targetIndex >= 0) {
		navigateToItem({ items, index: targetIndex, onItemChange, itemRefs });
	}
}

interface ProcessNavigationKeyParams {
	readonly key: string;
	readonly event: KeyboardEvent<HTMLElement>;
	readonly items: readonly NavigationMenuItem[];
	readonly currentIndex: number;
	readonly onItemChange: (itemId: string) => void;
	readonly itemRefs: RefObject<HTMLLIElement | null>[];
}

function handleForwardKey(params: Omit<ProcessNavigationKeyParams, 'key'>): void {
	handleArrowNavigation({ ...params, direction: 1 });
}

function handleBackwardKey(params: Omit<ProcessNavigationKeyParams, 'key'>): void {
	handleArrowNavigation({ ...params, direction: -1 });
}

function handleHomeKey(params: Omit<ProcessNavigationKeyParams, 'key' | 'currentIndex'>): void {
	handleHomeEndNavigation({ ...params, startIndex: -1, direction: 1 });
}

function handleEndKey(params: Omit<ProcessNavigationKeyParams, 'key' | 'currentIndex'>): void {
	handleHomeEndNavigation({ ...params, startIndex: params.items.length, direction: -1 });
}

function processNavigationKey({
	key,
	event,
	items,
	currentIndex,
	onItemChange,
	itemRefs,
}: ProcessNavigationKeyParams): void {
	const params = { event, items, currentIndex, onItemChange, itemRefs };
	switch (key) {
		case 'ArrowRight':
		case 'ArrowDown': {
			handleForwardKey(params);
			break;
		}
		case 'ArrowLeft':
		case 'ArrowUp': {
			handleBackwardKey(params);
			break;
		}
		case 'Home': {
			handleHomeKey({ event, items, onItemChange, itemRefs });
			break;
		}
		case 'End': {
			handleEndKey({ event, items, onItemChange, itemRefs });
			break;
		}
	}
}

export function handleNavigationKeyDown({
	event,
	items,
	activeItemId,
	onItemChange,
	itemRefs,
}: HandleNavigationKeyDownParams): void {
	const currentIndex = items.findIndex(item => item.id === activeItemId);
	processNavigationKey({
		key: event.key,
		event,
		items,
		currentIndex,
		onItemChange,
		itemRefs,
	});
}
