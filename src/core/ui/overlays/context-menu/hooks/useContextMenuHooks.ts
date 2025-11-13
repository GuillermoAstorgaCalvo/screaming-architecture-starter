import {
	createRef,
	type KeyboardEvent,
	type RefObject,
	useCallback,
	useMemo,
	useRef,
	useState,
} from 'react';

import type { ContextMenuItem, ContextMenuItemOrSeparator } from './ContextMenu';
import {
	findNextEnabledIndex,
	handleArrowKeyNavigation,
	handleEnterOrSpace,
	handleEscapeKey,
} from './ContextMenuHelpers';

function isSeparator(
	item: ContextMenuItemOrSeparator
): item is { readonly id: string; readonly type: 'separator' } {
	return 'type' in item;
}

export function useContextMenuRefs({ items }: { readonly items: ContextMenuItemOrSeparator[] }): {
	readonly menuRef: RefObject<HTMLDivElement | null>;
	readonly itemRefs: (RefObject<HTMLButtonElement | null> | null)[];
} {
	const menuRef = useRef<HTMLDivElement | null>(null);
	const itemRefs = useMemo(
		() => items.map(item => (isSeparator(item) ? null : createRef<HTMLButtonElement | null>())),
		[items]
	);
	return { menuRef, itemRefs };
}

export function useHighlightedIndex(): {
	readonly highlightedIndex: number;
	readonly setHighlightedIndex: (index: number) => void;
} {
	const [highlightedIndex, setHighlightedIndex] = useState(-1);
	return { highlightedIndex, setHighlightedIndex };
}

export function useContextMenuSelection({
	onSelect,
	setOpen,
}: {
	readonly onSelect?: ((item: ContextMenuItem) => void) | undefined;
	readonly setOpen: (open: boolean) => void;
}): {
	readonly handleSelect: (item: ContextMenuItem) => Promise<undefined>;
} {
	const handleSelect = useCallback(
		async (item: ContextMenuItem): Promise<undefined> => {
			if (item.disabled) {
				return undefined;
			}
			await item.onSelect?.();
			onSelect?.(item);
			setOpen(false);
			return undefined;
		},
		[onSelect, setOpen]
	);
	return { handleSelect };
}

function handleHomeKey(
	event: KeyboardEvent<HTMLDivElement>,
	items: ContextMenuItemOrSeparator[],
	setHighlightedIndex: (index: number) => void
): void {
	event.preventDefault();
	const firstEnabled = findNextEnabledIndex(items, -1, 1);
	if (firstEnabled >= 0) {
		setHighlightedIndex(firstEnabled);
	}
}

function handleEndKey(
	event: KeyboardEvent<HTMLDivElement>,
	items: ContextMenuItemOrSeparator[],
	setHighlightedIndex: (index: number) => void
): void {
	event.preventDefault();
	const lastEnabled = findNextEnabledIndex(items, 0, -1);
	if (lastEnabled >= 0) {
		setHighlightedIndex(lastEnabled);
	}
}

interface KeyboardHandlerParams {
	readonly event: KeyboardEvent<HTMLDivElement>;
	readonly items: ContextMenuItemOrSeparator[];
	readonly highlightedIndex: number;
	readonly setHighlightedIndex: (index: number) => void;
	readonly setOpen: (open: boolean) => void;
	readonly handleSelect: (item: ContextMenuItem) => Promise<undefined>;
}

function handleKeyboardEvent({
	event,
	items,
	highlightedIndex,
	setHighlightedIndex,
	setOpen,
	handleSelect,
}: KeyboardHandlerParams): void {
	if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
		handleArrowKeyNavigation({ event, items, highlightedIndex, setHighlightedIndex });
		return;
	}
	if (event.key === 'Enter' || event.key === ' ') {
		handleEnterOrSpace({ event, items, highlightedIndex, handleSelect });
		return;
	}
	if (event.key === 'Escape') {
		handleEscapeKey(event, setOpen);
		return;
	}
	if (event.key === 'Home') {
		handleHomeKey(event, items, setHighlightedIndex);
		return;
	}
	if (event.key === 'End') {
		handleEndKey(event, items, setHighlightedIndex);
	}
}

export function useContextMenuKeyboard({
	items,
	highlightedIndex,
	setHighlightedIndex,
	setOpen,
	handleSelect,
}: {
	readonly items: ContextMenuItemOrSeparator[];
	readonly highlightedIndex: number;
	readonly setHighlightedIndex: (index: number) => void;
	readonly setOpen: (open: boolean) => void;
	readonly handleSelect: (item: ContextMenuItem) => Promise<undefined>;
}): {
	readonly handleKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
} {
	const handleKeyDown = useCallback(
		(event: KeyboardEvent<HTMLDivElement>) => {
			handleKeyboardEvent({
				event,
				items,
				highlightedIndex,
				setHighlightedIndex,
				setOpen,
				handleSelect,
			});
		},
		[items, highlightedIndex, setHighlightedIndex, setOpen, handleSelect]
	);
	return { handleKeyDown };
}
