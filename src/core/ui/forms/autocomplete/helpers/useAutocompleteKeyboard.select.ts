import type { AutocompleteOption } from '@core/ui/forms/autocomplete/Autocomplete';
import { getOptionLabel } from '@core/ui/forms/autocomplete/helpers/useAutocompleteHelpers';
import { useCallback } from 'react';

export interface UseSelectHandlerParams {
	setInputValue: (value: string) => void;
	setValue: (value: string) => void;
	setIsOpen: (open: boolean) => void;
	setHighlightedIndex: (index: number) => void;
}

export function useSelectHandler(params: UseSelectHandlerParams) {
	const { setInputValue, setValue, setIsOpen, setHighlightedIndex } = params;
	return useCallback(
		(option: AutocompleteOption) => {
			if (option.disabled) {
				return;
			}
			const labelStr = getOptionLabel(option);
			if (labelStr) {
				setInputValue(labelStr);
			}
			setValue(option.value);
			setIsOpen(false);
			setHighlightedIndex(-1);
		},
		[setInputValue, setValue, setIsOpen, setHighlightedIndex]
	);
}
