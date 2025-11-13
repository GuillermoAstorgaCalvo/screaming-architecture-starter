import { useCallback } from 'react';

import type { AutocompleteOption } from './Autocomplete';
import { getOptionLabel } from './useAutocompleteHelpers';

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
