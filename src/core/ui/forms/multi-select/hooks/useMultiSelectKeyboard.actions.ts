import type { MultiSelectOption } from '@core/ui/forms/multi-select/MultiSelect';
import { useCallback } from 'react';

export interface ActionHandlersParams {
	readonly isOpen: boolean;
	readonly highlightedIndex: number;
	readonly filteredOptions: MultiSelectOption[];
	readonly handleSelect: (option: MultiSelectOption) => void;
	readonly setIsOpen: (open: boolean) => void;
	readonly setHighlightedIndex: (index: number) => void;
}

export function useActionHandlers(params: ActionHandlersParams) {
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
