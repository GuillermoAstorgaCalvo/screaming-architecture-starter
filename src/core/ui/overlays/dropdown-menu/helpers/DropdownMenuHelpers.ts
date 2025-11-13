import type { DropdownMenuProps } from '@core/ui/overlays/dropdown-menu/types/DropdownMenu.types';

const POSITION_MAP: Record<'start' | 'center' | 'end', 'bottom-start' | 'bottom' | 'bottom-end'> = {
	start: 'bottom-start',
	center: 'bottom',
	end: 'bottom-end',
};

export function getDropdownPosition(align: DropdownMenuProps['align'] = 'center') {
	return POSITION_MAP[align];
}

export const MENU_STYLES = {
	CONTAINER: 'flex flex-col gap-1 py-2',
	EMPTY_STATE: 'px-4 py-3 text-sm text-muted-foreground',
	MENU_WRAPPER: 'max-h-[--menu-max-height] overflow-y-auto focus:outline-none',
	POPOVER_BASE:
		'w-56 rounded-lg border border-border bg-popover shadow-lg ring-1 ring-black/5 focus-visible:outline-none',
} as const;
