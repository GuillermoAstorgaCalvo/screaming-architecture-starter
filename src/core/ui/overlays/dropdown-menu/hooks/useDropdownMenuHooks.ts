import {
	handleArrowKeyNavigation,
	handleEndKey,
	handleEnterOrSpace,
	handleEscapeKey,
	handleHomeKey,
} from '@core/ui/overlays/dropdown-menu/helpers/DropdownMenuNavigation';
import type {
	DropdownMenuItem,
	DropdownMenuItemOrSeparator,
} from '@core/ui/overlays/dropdown-menu/types/DropdownMenu.types';
import { createRef, type KeyboardEvent, useCallback, useMemo, useRef, useState } from 'react';

interface UseDropdownMenuRefsParams {
	readonly items: DropdownMenuItemOrSeparator[];
}

function isSeparator(
	item: DropdownMenuItemOrSeparator
): item is { readonly id: string; readonly type: 'separator' } {
	return 'type' in item;
}

export function useDropdownMenuRefs({ items }: UseDropdownMenuRefsParams) {
	const menuRef = useRef<HTMLDivElement | null>(null);
	const itemRefs = useMemo(
		() => items.map(item => (isSeparator(item) ? null : createRef<HTMLButtonElement>())),
		[items]
	);
	return { menuRef, itemRefs };
}

export function useHighlightedIndex() {
	const [highlightedIndex, setHighlightedIndex] = useState(-1);
	return { highlightedIndex, setHighlightedIndex };
}

interface UseDropdownMenuSelectionParams {
	readonly onSelect: ((item: DropdownMenuItem) => void) | undefined;
	readonly setOpen: (open: boolean) => void;
}

export function useDropdownMenuSelection({ onSelect, setOpen }: UseDropdownMenuSelectionParams) {
	const handleSelect = useCallback(
		async (item: DropdownMenuItem): Promise<undefined> => {
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

interface ProcessKeyboardEventParams {
	readonly event: KeyboardEvent<HTMLDivElement>;
	readonly items: DropdownMenuItemOrSeparator[];
	readonly highlightedIndex: number;
	readonly setHighlightedIndex: (index: number) => void;
	readonly setOpen: (open: boolean) => void;
	readonly handleSelect: (item: DropdownMenuItem) => Promise<undefined>;
}

function handleNavigationKey(params: ProcessKeyboardEventParams): void {
	handleArrowKeyNavigation({
		event: params.event,
		items: params.items,
		highlightedIndex: params.highlightedIndex,
		setHighlightedIndex: params.setHighlightedIndex,
	});
}

function handleHomeKeyPress(params: ProcessKeyboardEventParams): void {
	handleHomeKey(params.event, params.items, params.setHighlightedIndex);
}

function handleEndKeyPress(params: ProcessKeyboardEventParams): void {
	handleEndKey(params.event, params.items, params.setHighlightedIndex);
}

function handleEscapeKeyPress(params: ProcessKeyboardEventParams): void {
	handleEscapeKey(params.event, params.setOpen);
}

function handleEnterOrSpaceKey(params: ProcessKeyboardEventParams): void {
	handleEnterOrSpace({
		event: params.event,
		items: params.items,
		highlightedIndex: params.highlightedIndex,
		handleSelect: params.handleSelect,
	});
}

function processKeyboardEvent(params: ProcessKeyboardEventParams): void {
	const { key } = params.event;
	switch (key) {
		case 'ArrowDown':
		case 'ArrowUp': {
			handleNavigationKey(params);
			break;
		}
		case 'Home': {
			handleHomeKeyPress(params);
			break;
		}
		case 'End': {
			handleEndKeyPress(params);
			break;
		}
		case 'Escape': {
			handleEscapeKeyPress(params);
			break;
		}
		case 'Enter':
		case ' ': {
			handleEnterOrSpaceKey(params);
			break;
		}
	}
}

interface UseDropdownMenuKeyboardParams {
	readonly open: boolean;
	readonly items: DropdownMenuItemOrSeparator[];
	readonly highlightedIndex: number;
	readonly setHighlightedIndex: (index: number) => void;
	readonly setOpen: (open: boolean) => void;
	readonly handleSelect: (item: DropdownMenuItem) => Promise<undefined>;
}

export function useDropdownMenuKeyboard({
	open,
	items,
	highlightedIndex,
	setHighlightedIndex,
	setOpen,
	handleSelect,
}: UseDropdownMenuKeyboardParams) {
	const handleKeyDown = useCallback(
		(event: KeyboardEvent<HTMLDivElement>) => {
			if (!open || items.length === 0) {
				return;
			}
			processKeyboardEvent({
				event,
				items,
				highlightedIndex,
				setHighlightedIndex,
				setOpen,
				handleSelect,
			});
		},
		[handleSelect, highlightedIndex, items, open, setOpen, setHighlightedIndex]
	);

	return { handleKeyDown };
}
