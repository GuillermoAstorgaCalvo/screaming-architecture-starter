import type { KeyboardEvent, MouseEvent as ReactMouseEvent, ReactElement } from 'react';

import type {
	DropdownMenuItem,
	DropdownMenuItemOrSeparator,
	DropdownMenuProps,
} from './DropdownMenu.types';

function isSeparator(
	item: DropdownMenuItemOrSeparator | undefined
): item is { readonly id: string; readonly type: 'separator' } {
	return item !== undefined && 'type' in item;
}

function isEnabledItem(item: DropdownMenuItemOrSeparator | undefined): item is DropdownMenuItem {
	return item !== undefined && !isSeparator(item) && !item.disabled;
}

export function findNextEnabledIndex(
	items: DropdownMenuItemOrSeparator[],
	startIndex: number,
	direction: 1 | -1
): number {
	let index = startIndex;
	const total = items.length;

	for (let i = 0; i < total; i += 1) {
		index = (index + direction + total) % total;
		if (isEnabledItem(items[index])) {
			return index;
		}
	}

	return -1;
}

interface HandleArrowKeyNavigationParams {
	readonly event: KeyboardEvent<HTMLDivElement>;
	readonly items: DropdownMenuItemOrSeparator[];
	readonly highlightedIndex: number;
	readonly setHighlightedIndex: (index: number) => void;
}

export function handleArrowKeyNavigation({
	event,
	items,
	highlightedIndex,
	setHighlightedIndex,
}: HandleArrowKeyNavigationParams): void {
	event.preventDefault();
	const direction = event.key === 'ArrowDown' ? 1 : -1;
	const nextIndex = findNextEnabledIndex(items, highlightedIndex, direction);
	if (nextIndex >= 0) {
		setHighlightedIndex(nextIndex);
	}
}

export function handleHomeKey(
	event: KeyboardEvent<HTMLDivElement>,
	items: DropdownMenuItemOrSeparator[],
	setHighlightedIndex: (index: number) => void
): void {
	event.preventDefault();
	const firstEnabled = findNextEnabledIndex(items, -1, 1);
	if (firstEnabled >= 0) {
		setHighlightedIndex(firstEnabled);
	}
}

export function handleEndKey(
	event: KeyboardEvent<HTMLDivElement>,
	items: DropdownMenuItemOrSeparator[],
	setHighlightedIndex: (index: number) => void
): void {
	event.preventDefault();
	const lastEnabled = findNextEnabledIndex(items, 0, -1);
	if (lastEnabled >= 0) {
		setHighlightedIndex(lastEnabled);
	}
}

export function handleEscapeKey(
	event: KeyboardEvent<HTMLDivElement>,
	setOpen: (open: boolean) => void
): void {
	event.preventDefault();
	setOpen(false);
}

interface HandleEnterOrSpaceParams {
	readonly event: KeyboardEvent<HTMLDivElement>;
	readonly items: DropdownMenuItemOrSeparator[];
	readonly highlightedIndex: number;
	readonly handleSelect: (item: DropdownMenuItem) => Promise<undefined>;
}

export function handleEnterOrSpace({
	event,
	items,
	highlightedIndex,
	handleSelect,
}: HandleEnterOrSpaceParams): void {
	event.preventDefault();
	const item = items[highlightedIndex];
	if (isEnabledItem(item)) {
		handleSelect(item).catch(() => {
			// Ignore errors from async select handler
		});
	}
}

const POSITION_MAP: Record<'start' | 'center' | 'end', 'bottom-start' | 'bottom' | 'bottom-end'> = {
	start: 'bottom-start',
	center: 'bottom',
	end: 'bottom-end',
};

export function getDropdownPosition(align: DropdownMenuProps['align'] = 'center') {
	return POSITION_MAP[align];
}

// Constants for dropdown menu rendering
export const TRIGGER_OPEN_KEYS = ['ArrowDown', 'Enter', ' '] as const;
export const ARIA_ATTRIBUTES = {
	HAS_POPUP: 'menu',
	ROLE_MENU: 'menu',
	ROLE_NONE: 'none',
} as const;
export const MENU_STYLES = {
	CONTAINER: 'flex flex-col gap-1 py-2',
	EMPTY_STATE: 'px-4 py-3 text-sm text-muted-foreground',
	MENU_WRAPPER: 'max-h-[--menu-max-height] overflow-y-auto focus:outline-none',
	POPOVER_BASE:
		'w-56 rounded-lg border border-border bg-popover shadow-lg ring-1 ring-black/5 focus-visible:outline-none',
} as const;

// Trigger handler helpers
export function getOriginalHandlers(trigger: ReactElement<Record<string, unknown>>) {
	const originalOnClick = trigger.props['onClick'] as
		| ((event: ReactMouseEvent<Element>) => void)
		| undefined;
	const originalOnKeyDown = trigger.props['onKeyDown'] as
		| ((event: KeyboardEvent<Element>) => void)
		| undefined;
	return { originalOnClick, originalOnKeyDown };
}

interface CreateTriggerHandlersParams {
	readonly originalOnClick: ((event: ReactMouseEvent<Element>) => void) | undefined;
	readonly originalOnKeyDown: ((event: KeyboardEvent<Element>) => void) | undefined;
	readonly toggleOpen: () => void;
	readonly setOpen: (open: boolean) => void;
}

export function createTriggerHandlers({
	originalOnClick,
	originalOnKeyDown,
	toggleOpen,
	setOpen,
}: CreateTriggerHandlersParams) {
	const handleTriggerKeyDown = (event: KeyboardEvent<Element>) => {
		if (TRIGGER_OPEN_KEYS.includes(event.key as (typeof TRIGGER_OPEN_KEYS)[number])) {
			event.preventDefault();
			setOpen(true);
		}
	};
	const handleClick = (event: ReactMouseEvent<Element>) => {
		originalOnClick?.(event);
		event.preventDefault();
		event.stopPropagation();
		toggleOpen();
	};
	const handleKeyDown = (event: KeyboardEvent<Element>) => {
		originalOnKeyDown?.(event);
		handleTriggerKeyDown(event);
	};
	return { handleClick, handleKeyDown };
}

export function createTriggerAriaAttributes(open: boolean, menuId: string) {
	return {
		'aria-haspopup': ARIA_ATTRIBUTES.HAS_POPUP,
		'aria-expanded': open,
		'aria-controls': open ? menuId : undefined,
	} as const;
}
