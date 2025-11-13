import type { MultiSelectOption } from '@core/ui/forms/multi-select/MultiSelect';
import { useCallback } from 'react';

export interface SelectHandlerParams {
	readonly setInputValue: (value: string) => void;
	readonly setValue: (value: string[]) => void;
	readonly setHighlightedIndex: (index: number) => void;
	readonly value: string[];
}

export function useSelectHandler(params: SelectHandlerParams) {
	const { setInputValue, setValue, setHighlightedIndex, value } = params;
	return useCallback(
		(option: MultiSelectOption) => {
			if (option.disabled) {
				return;
			}
			// Toggle selection
			const isSelected = value.includes(option.value);
			if (isSelected) {
				setValue(value.filter(v => v !== option.value));
			} else {
				setValue([...value, option.value]);
			}
			// Keep input focused and dropdown open for multi-select
			setInputValue('');
			setHighlightedIndex(-1);
		},
		[setInputValue, setValue, setHighlightedIndex, value]
	);
}
