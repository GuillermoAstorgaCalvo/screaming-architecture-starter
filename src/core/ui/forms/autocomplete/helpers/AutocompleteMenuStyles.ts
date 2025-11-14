import { classNames } from '@core/utils/classNames';
import type { CSSProperties } from 'react';

export const MENU_STYLES = {
	CONTAINER: 'flex flex-col gap-1 py-2',
	EMPTY_STATE: 'px-4 py-3 text-sm text-muted-foreground',
	LISTBOX: 'max-h-[--menu-max-height] overflow-y-auto focus:outline-none',
	POPOVER_BASE:
		'w-full rounded-lg border border-border bg-popover shadow-lg ring-1 ring-black/5 focus-visible:outline-none',
	OPTION: 'px-4 py-2 text-sm cursor-pointer hover:bg-accent focus:bg-accent focus:outline-none',
	OPTION_HIGHLIGHTED: 'bg-accent',
	OPTION_DISABLED: 'opacity-disabled cursor-not-allowed',
	MATCH_HIGHLIGHT: 'font-semibold bg-primary/20 text-primary',
} as const;

export function getOptionClassName(isHighlighted: boolean, isDisabled: boolean): string {
	return classNames(
		MENU_STYLES.OPTION,
		isHighlighted && MENU_STYLES.OPTION_HIGHLIGHTED,
		isDisabled && MENU_STYLES.OPTION_DISABLED
	);
}

export function getListboxStyles(maxHeight: number) {
	return {
		className: classNames(MENU_STYLES.CONTAINER, MENU_STYLES.LISTBOX),
		style: { ['--menu-max-height' as string]: `${maxHeight}px` } as CSSProperties,
	};
}
