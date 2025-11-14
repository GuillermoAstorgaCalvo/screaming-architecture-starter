import type { ComboboxOption } from '@core/ui/forms/combobox/Combobox';
import type { ComboboxContentProps } from '@core/ui/forms/combobox/types/ComboboxTypes';
import { classNames } from '@core/utils/classNames';
import type { CSSProperties, KeyboardEvent, MouseEvent, RefObject } from 'react';

export const MENU_STYLES = {
	CONTAINER: 'flex flex-col gap-xs py-sm',
	EMPTY_STATE: 'px-lg py-md text-sm text-muted-foreground',
	LISTBOX: 'max-h-[--menu-max-height] overflow-y-auto focus:outline-none',
	POPOVER_BASE:
		'w-full rounded-lg border border-border bg-popover shadow-lg ring-1 ring-black/5 focus-visible:outline-none',
	OPTION: 'px-lg py-sm text-sm cursor-pointer hover:bg-accent focus:bg-accent focus:outline-none',
	OPTION_HIGHLIGHTED: 'bg-accent',
	OPTION_DISABLED: 'opacity-disabled cursor-not-allowed',
} as const;

export function createOptionHandlers(
	option: ComboboxOption,
	isDisabled: boolean,
	onSelect: (option: ComboboxOption) => void
) {
	const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		if (!isDisabled) {
			onSelect(option);
		}
	};

	const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			if (!isDisabled) {
				onSelect(option);
			}
		}
	};

	return { handleClick, handleKeyDown };
}

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

export interface OptionItemData {
	readonly option: ComboboxOption;
	readonly index: number;
	readonly highlightedIndex: number;
	readonly optionRef: RefObject<HTMLButtonElement | null>;
	readonly handleSelect: (option: ComboboxOption) => void;
}

export interface RenderOptionsParams {
	readonly filteredOptions: ComboboxOption[];
	readonly highlightedIndex: number;
	readonly optionRefs: RefObject<HTMLButtonElement | null>[];
	readonly handleSelect: (option: ComboboxOption) => void;
}

export function prepareLabelProps(
	label: string | undefined,
	finalId: string | undefined,
	required: boolean | undefined
) {
	return !label || !finalId
		? null
		: { id: finalId, label, ...(required !== undefined && { required }) };
}

export function prepareMessagesProps(
	finalId: string | undefined,
	error: string | undefined,
	helperText: string | undefined
) {
	if (!finalId) return null;
	return {
		comboboxId: finalId,
		...(error !== undefined && { error }),
		...(helperText !== undefined && { helperText }),
	};
}

export type ComboboxListboxProps = Pick<
	ComboboxContentProps,
	| 'filteredOptions'
	| 'highlightedIndex'
	| 'optionRefs'
	| 'handleSelect'
	| 'emptyState'
	| 'listboxRef'
	| 'menuId'
	| 'maxHeight'
	| 'isOpen'
>;

export function buildListboxProps(props: Readonly<ComboboxContentProps>): ComboboxListboxProps {
	const {
		filteredOptions,
		highlightedIndex,
		optionRefs,
		handleSelect,
		emptyState,
		listboxRef,
		menuId,
		maxHeight,
		isOpen,
	} = props;
	return {
		filteredOptions,
		highlightedIndex,
		optionRefs,
		handleSelect,
		emptyState,
		listboxRef,
		menuId,
		maxHeight,
		isOpen,
	};
}
