import { findNextEnabledIndex } from '@core/ui/overlays/dropdown-menu/helpers/DropdownMenuNavigation';
import {
	useDropdownMenuKeyboard,
	useDropdownMenuRefs,
	useDropdownMenuSelection,
	useHighlightedIndex,
} from '@core/ui/overlays/dropdown-menu/hooks/useDropdownMenuHooks';
import type {
	DropdownMenuItem,
	DropdownMenuItemOrSeparator,
} from '@core/ui/overlays/dropdown-menu/types/DropdownMenu.types';
import { type RefObject, useCallback, useEffect, useId, useRef, useState } from 'react';

interface UseDropdownMenuParams {
	readonly items: DropdownMenuItemOrSeparator[];
	readonly isOpen?: boolean | undefined;
	readonly onOpenChange?: ((isOpen: boolean) => void) | undefined;
	readonly onSelect?: ((item: DropdownMenuItem) => void) | undefined;
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
	readonly items: DropdownMenuItemOrSeparator[];
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

export function useDropdownMenu({ items, isOpen, onOpenChange, onSelect }: UseDropdownMenuParams) {
	const { menuRef, itemRefs } = useDropdownMenuRefs({ items });
	const { highlightedIndex, setHighlightedIndex } = useHighlightedIndex();
	const menuId = useId();
	const { open, setOpen } = useOpenState(isOpen, onOpenChange, setHighlightedIndex);
	const { focusItem } = useFocusItem(itemRefs, highlightedIndex);
	useFocusOnOpen({ open, items, menuRef, setHighlightedIndex, focusItem });
	const { handleSelect } = useDropdownMenuSelection({ onSelect, setOpen });
	const { handleKeyDown } = useDropdownMenuKeyboard({
		open,
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
