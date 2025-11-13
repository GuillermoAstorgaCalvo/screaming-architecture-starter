import type { AutocompleteOption } from '@core/ui/forms/autocomplete/Autocomplete';
import { useCallback } from 'react';

export interface UseActionHandlersParams {
	isOpen: boolean;
	highlightedIndex: number;
	filteredOptions: AutocompleteOption[];
	handleSelect: (option: AutocompleteOption) => void;
	setIsOpen: (open: boolean) => void;
	setHighlightedIndex: (index: number) => void;
}

export function useActionHandlers(params: UseActionHandlersParams) {
	const {
		isOpen,
		highlightedIndex,
		filteredOptions,
		handleSelect,
		setIsOpen,
		setHighlightedIndex,
	} = params;

	const handleEnterOrSpace = useCallback(() => {
		if (!isOpen || highlightedIndex < 0 || !filteredOptions[highlightedIndex]) {
			return;
		}
		handleSelect(filteredOptions[highlightedIndex]);
	}, [isOpen, highlightedIndex, filteredOptions, handleSelect]);

	const handleEscape = useCallback(() => {
		setIsOpen(false);
		setHighlightedIndex(-1);
	}, [setIsOpen, setHighlightedIndex]);

	return { handleEnterOrSpace, handleEscape };
}
