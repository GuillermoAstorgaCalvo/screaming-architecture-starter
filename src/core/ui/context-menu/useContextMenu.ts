import { type RefObject, useCallback, useEffect, useId, useRef, useState } from 'react';

import type { ContextMenuItem, ContextMenuItemOrSeparator } from './ContextMenu';
import { findNextEnabledIndex } from './ContextMenuHelpers';
import {
	useContextMenuKeyboard,
	useContextMenuRefs,
	useContextMenuSelection,
	useHighlightedIndex,
} from './useContextMenuHooks';

interface UseContextMenuParams {
	readonly items: ContextMenuItemOrSeparator[];
	readonly isOpen?: boolean | undefined;
	readonly onOpenChange?: ((isOpen: boolean) => void) | undefined;
	readonly onSelect?: ((item: ContextMenuItem) => void) | undefined;
}

function useOpenState(
	isOpen: boolean | undefined,
	onOpenChange: ((isOpen: boolean) => void) | undefined,
	setHighlightedIndex: (index: number) => void
) {
	const isControlled = typeof isOpen === 'boolean';
	const [internalOpen, setInternalOpen] = useState(false);
	const open = isControlled ? isOpen : internalOpen;

	const setOpen = useCallback(
		(next: boolean) => {
			if (!isControlled) {
				setInternalOpen(next);
			}
			if (!next) {
				setHighlightedIndex(-1);
			}
			onOpenChange?.(next);
		},
		[isControlled, onOpenChange, setHighlightedIndex]
	);

	return { open, setOpen };
}

interface UseFocusOnOpenParams {
	readonly open: boolean;
	readonly items: ContextMenuItemOrSeparator[];
	readonly menuRef: RefObject<HTMLDivElement | null>;
	readonly setHighlightedIndex: (index: number) => void;
	readonly focusItem: (index: number) => void;
}

function useFocusOnOpen({
	open,
	items,
	menuRef,
	setHighlightedIndex,
	focusItem,
}: UseFocusOnOpenParams) {
	const previousOpenRef = useRef(open);

	useEffect(() => {
		const wasClosed = !previousOpenRef.current;
		previousOpenRef.current = open;

		if (!open || !wasClosed) {
			return;
		}

		const firstEnabled = findNextEnabledIndex(items, -1, 1);
		// Use requestAnimationFrame to defer state update
		requestAnimationFrame(() => {
			setHighlightedIndex(firstEnabled >= 0 ? firstEnabled : -1);
			setTimeout(() => {
				if (firstEnabled >= 0) {
					focusItem(firstEnabled);
				} else {
					menuRef.current?.focus();
				}
			}, 0);
		});
	}, [focusItem, items, open, menuRef, setHighlightedIndex]);
}

function useFocusItem(
	itemRefs: (RefObject<HTMLButtonElement | null> | null)[],
	highlightedIndex: number
) {
	const focusItem = useCallback(
		(index: number) => {
			const targetRef = itemRefs[index];
			if (targetRef?.current) {
				targetRef.current.focus();
			}
		},
		[itemRefs]
	);

	useEffect(() => {
		if (highlightedIndex >= 0) {
			focusItem(highlightedIndex);
		}
	}, [focusItem, highlightedIndex]);

	return { focusItem };
}

export function useContextMenu({ items, isOpen, onOpenChange, onSelect }: UseContextMenuParams) {
	const { menuRef, itemRefs } = useContextMenuRefs({ items });
	const { highlightedIndex, setHighlightedIndex } = useHighlightedIndex();
	const menuId = useId();
	const { open, setOpen } = useOpenState(isOpen, onOpenChange, setHighlightedIndex);
	const { focusItem } = useFocusItem(itemRefs, highlightedIndex);
	useFocusOnOpen({ open, items, menuRef, setHighlightedIndex, focusItem });
	const { handleSelect } = useContextMenuSelection({ onSelect, setOpen });
	const { handleKeyDown } = useContextMenuKeyboard({
		items,
		highlightedIndex,
		setHighlightedIndex,
		setOpen,
		handleSelect,
	});

	return {
		open,
		menuRef,
		itemRefs,
		highlightedIndex,
		setHighlightedIndex,
		menuId,
		setOpen,
		focusItem,
		handleSelect,
		handleKeyDown,
	};
}
