import type { AutocompleteOption } from '@domains/shared/components/autocomplete-combobox/AutocompleteCombobox';
import type { ChangeEvent, KeyboardEvent, RefObject } from 'react';

export function filterOptions(
	options: AutocompleteOption[],
	searchTerm: string
): AutocompleteOption[] {
	if (!searchTerm) {
		return options;
	}
	const term = searchTerm.toLowerCase();
	return options.filter(option => {
		const keywordMatch =
			option.keywords?.some(keyword => keyword.toLowerCase().includes(term)) ?? false;
		return (
			option.label.toLowerCase().includes(term) ||
			option.value.toLowerCase().includes(term) ||
			keywordMatch
		);
	});
}

export function findNextEnabledIndex(
	options: AutocompleteOption[],
	currentIndex: number,
	direction: 1 | -1
): number {
	if (options.length === 0) {
		return -1;
	}

	let nextIndex = currentIndex;
	for (const _ of options) {
		nextIndex = (nextIndex + direction + options.length) % options.length;
		if (!options[nextIndex]?.disabled) {
			return nextIndex;
		}
	}
	return -1;
}

export function getActiveDescendant(
	comboboxId: string,
	highlightedIndex: number,
	filteredOptions: AutocompleteOption[]
): string | undefined {
	if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
		return `${comboboxId}-option-${filteredOptions[highlightedIndex].value}`;
	}
	return undefined;
}

interface BuildComboboxBodyPropsParams {
	readonly className?: string | undefined;
	readonly containerRef: RefObject<HTMLDivElement | null>;
	readonly comboboxId: string;
	readonly labelId?: string | undefined;
	readonly label?: string | undefined;
	readonly resolvedInputValue: string;
	readonly placeholder?: string | undefined;
	readonly helperText?: string | undefined;
	readonly helperId?: string | undefined;
	readonly error?: string | undefined;
	readonly errorId?: string | undefined;
	readonly disabled: boolean;
	readonly required: boolean;
	readonly isOpen: boolean;
	readonly listboxId: string;
	readonly activeDescendant?: string | undefined;
	readonly ownedIds?: string | undefined;
	readonly filteredOptions: AutocompleteOption[];
	readonly highlightedIndex: number;
	readonly selectedValue?: string | undefined;
	readonly isLoading: boolean;
	readonly loadingMessage: string;
	readonly noOptionsMessage: string;
	readonly handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
	readonly openList: () => void;
	readonly handleKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
	readonly selectOption: (option: AutocompleteOption) => void;
}

export function buildComboboxBodyProps(params: BuildComboboxBodyPropsParams) {
	const { handleChange, openList, handleKeyDown, selectOption, ...rest } = params;

	return {
		...rest,
		onChange: handleChange,
		onFocus: openList,
		onKeyDown: handleKeyDown,
		onSelect: selectOption,
	};
}
