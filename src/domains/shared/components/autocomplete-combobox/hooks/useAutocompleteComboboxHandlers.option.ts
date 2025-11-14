import type { AutocompleteOption } from '@domains/shared/components/autocomplete-combobox/AutocompleteCombobox';
import { findNextEnabledIndex } from '@domains/shared/components/autocomplete-combobox/helpers/AutocompleteComboboxHelpers';
import { useCallback } from 'react';

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

export interface MoveHighlightParams {
	readonly filteredOptions: AutocompleteOption[];
	readonly highlightedIndex: number;
	readonly setHighlightedIndex: (index: number) => void;
}

export function useMoveHighlight(params: MoveHighlightParams) {
	const { filteredOptions, highlightedIndex, setHighlightedIndex } = params;

	return useCallback(
		(direction: 1 | -1) => {
			const nextIndex = findNextEnabledIndex(filteredOptions, highlightedIndex, direction);
			if (nextIndex >= 0) {
				setHighlightedIndex(nextIndex);
			}
		},
		[filteredOptions, highlightedIndex, setHighlightedIndex]
	);
}

export interface SelectOptionParams {
	readonly onValueChange?: ((value: string | undefined) => void) | undefined;
	readonly onOptionSelect?: ((option: AutocompleteOption | undefined) => void) | undefined;
	readonly updateInputValue: (value: string) => void;
	readonly closeList: () => void;
}

export function useSelectOption(params: SelectOptionParams) {
	const { onValueChange, onOptionSelect, updateInputValue, closeList } = params;

	return useCallback(
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
}

export function useOptionCallbacks(params: OptionCallbacksParams): OptionCallbacks {
	const moveHighlight = useMoveHighlight({
		filteredOptions: params.filteredOptions,
		highlightedIndex: params.highlightedIndex,
		setHighlightedIndex: params.setHighlightedIndex,
	});

	const selectOption = useSelectOption({
		onValueChange: params.onValueChange,
		onOptionSelect: params.onOptionSelect,
		updateInputValue: params.updateInputValue,
		closeList: params.closeList,
	});

	return { moveHighlight, selectOption };
}
