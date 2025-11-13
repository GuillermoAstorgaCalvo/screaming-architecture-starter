import type { KeyboardEvent, MouseEvent as ReactMouseEvent, ReactElement } from 'react';

export const TRIGGER_OPEN_KEYS = ['ArrowDown', 'Enter', ' '] as const;

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

export const ARIA_ATTRIBUTES = {
	HAS_POPUP: 'menu',
	ROLE_MENU: 'menu',
	ROLE_NONE: 'none',
} as const;

export function createTriggerAriaAttributes(open: boolean, menuId: string) {
	return {
		'aria-haspopup': ARIA_ATTRIBUTES.HAS_POPUP,
		'aria-expanded': open,
		'aria-controls': open ? menuId : undefined,
	} as const;
}
