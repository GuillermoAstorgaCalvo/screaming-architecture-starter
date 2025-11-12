import { useCallback } from 'react';

import type { AutocompleteOption } from './AutocompleteCombobox';
import { findNextEnabledIndex } from './AutocompleteComboboxHelpers';

export interface OptionCallbacks {
	readonly moveHighlight: (direction: 1 | -1) => void;
	readonly selectOption: (option: AutocompleteOption | undefined) => void;
}

export interface OptionCallbacksParams {
	readonly filteredOptions: AutocompleteOption[];
	readonly highlightedIndex: number;
	readonly setHighlightedIndex: (index: number) => void;
	readonly onValueChange?: ((value: string | undefined) => void) | undefined;
	readonly onOptionSelect?: ((option: AutocompleteOption | undefined) => void) | undefined;
	readonly updateInputValue: (value: string) => void;
	readonly closeList: () => void;
}

export function useOptionCallbacks(params: OptionCallbacksParams): OptionCallbacks {
	const {
		filteredOptions,
		highlightedIndex,
		setHighlightedIndex,
		onValueChange,
		onOptionSelect,
		updateInputValue,
		closeList,
	} = params;
	const moveHighlight = useCallback(
		(direction: 1 | -1) => {
			const nextIndex = findNextEnabledIndex(filteredOptions, highlightedIndex, direction);
			if (nextIndex >= 0) {
				setHighlightedIndex(nextIndex);
			}
		},
		[filteredOptions, highlightedIndex, setHighlightedIndex]
	);

	const selectOption = useCallback(
		(option: AutocompleteOption | undefined) => {
			if (!option || option.disabled) {
				return;
			}
			onValueChange?.(option.value);
			onOptionSelect?.(option);
			updateInputValue(option.label);
			closeList();
		},
		[closeList, onOptionSelect, onValueChange, updateInputValue]
	);

	return { moveHighlight, selectOption };
}
