import type { MultiSelectOption } from '@core/ui/forms/multi-select/MultiSelect';
import type { MultiSelectContentProps } from '@core/ui/forms/multi-select/types/MultiSelectTypes';
import { classNames } from '@core/utils/classNames';
import type { CSSProperties, KeyboardEvent, MouseEvent, RefObject } from 'react';

export const MENU_STYLES = {
	CONTAINER: 'flex flex-col gap-1 py-2',
	EMPTY_STATE: 'px-4 py-3 text-sm text-muted-foreground',
	LISTBOX: 'max-h-[--menu-max-height] overflow-y-auto focus:outline-none',
	POPOVER_BASE:
		'w-full rounded-lg border border-border bg-popover shadow-lg ring-1 ring-black/5 focus-visible:outline-none',
	OPTION:
		'px-4 py-2 text-sm cursor-pointer hover:bg-accent focus:bg-accent focus:outline-none flex items-center gap-2',
	OPTION_HIGHLIGHTED: 'bg-accent',
	OPTION_DISABLED: 'opacity-disabled cursor-not-allowed',
	CHECKBOX: 'h-4 w-4 rounded border-border text-primary focus:ring-primary',
} as const;

export function createOptionHandlers(
	option: MultiSelectOption,
	isDisabled: boolean,
	onSelect: (option: MultiSelectOption) => void
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
	readonly option: MultiSelectOption;
	readonly index: number;
	readonly highlightedIndex: number;
	readonly optionRef: RefObject<HTMLButtonElement | null>;
	readonly handleSelect: (option: MultiSelectOption) => void;
	readonly isSelected: boolean;
}

export interface RenderOptionsParams {
	readonly filteredOptions: MultiSelectOption[];
	readonly highlightedIndex: number;
	readonly optionRefs: RefObject<HTMLButtonElement | null>[];
	readonly handleSelect: (option: MultiSelectOption) => void;
	readonly selectedValues: string[];
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
		multiSelectId: finalId,
		...(error !== undefined && { error }),
		...(helperText !== undefined && { helperText }),
	};
}

export type MultiSelectListboxProps = Pick<
	MultiSelectContentProps,
	| 'filteredOptions'
	| 'highlightedIndex'
	| 'optionRefs'
	| 'handleSelect'
	| 'emptyState'
	| 'listboxRef'
	| 'menuId'
	| 'maxHeight'
	| 'isOpen'
	| 'selectedValues'
>;

export function buildListboxProps(
	props: Readonly<MultiSelectContentProps>
): MultiSelectListboxProps {
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
		selectedValues,
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
		selectedValues,
	};
}
