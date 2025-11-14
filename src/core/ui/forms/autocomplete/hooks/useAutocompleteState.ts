import { useDebounce } from '@core/hooks/debounce/useDebounce';
import type {
	AutocompleteOption,
	AutocompleteProps,
} from '@core/ui/forms/autocomplete/Autocomplete';
import { defaultFilterFn } from '@core/ui/forms/autocomplete/helpers/AutocompleteHelpers';
import { getOptionLabel } from '@core/ui/forms/autocomplete/helpers/useAutocompleteHelpers';
import { useAutocompleteKeyboard } from '@core/ui/forms/autocomplete/hooks/useAutocompleteKeyboard';
import { type RefObject, useCallback, useEffect, useRef, useState } from 'react';

export function useAutocompleteValue(
	props: Readonly<Pick<AutocompleteProps, 'value' | 'defaultValue' | 'onChange'>>
) {
	const isControlled = props.value !== undefined;
	const [internalValue, setInternalValue] = useState(props.defaultValue ?? '');
	const value = isControlled ? props.value : internalValue;

	const setValue = useCallback(
		(newValue: string) => {
			if (!isControlled) {
				setInternalValue(newValue);
			}
			props.onChange?.(newValue);
		},
		[isControlled, props]
	);

	return { value, setValue };
}

function getInitialInputValue(options: AutocompleteOption[], value: string): string {
	const selectedOption = options.find(opt => opt.value === value);
	return selectedOption ? getOptionLabel(selectedOption) : '';
}

function syncInputValue(
	options: AutocompleteOption[],
	value: string,
	setInputValue: (value: string) => void
) {
	const selectedOption = options.find(opt => opt.value === value);
	if (selectedOption) {
		const selectedLabel = getOptionLabel(selectedOption);
		if (selectedLabel) {
			setTimeout(() => {
				setInputValue(selectedLabel);
			}, 0);
		}
	} else if (!value) {
		setTimeout(() => {
			setInputValue('');
		}, 0);
	}
}

export function useAutocompleteInput(
	props: Readonly<
		Pick<AutocompleteProps, 'options' | 'filterFn' | 'onInputChange' | 'debounceDelay'>
	>,
	value: string,
	setValue: (value: string) => void
) {
	const [inputValue, setInputValue] = useState(() => getInitialInputValue(props.options, value));

	// Debounce the input value for search
	const DEBOUNCE_DELAY_MS = 300;
	const debounceDelay = props.debounceDelay ?? DEBOUNCE_DELAY_MS;
	const debouncedInputValue = useDebounce(inputValue, debounceDelay);

	// Call onInputChange with debounced value
	useEffect(() => {
		props.onInputChange?.(debouncedInputValue);
	}, [debouncedInputValue, props]);

	const filterFn = props.filterFn ?? defaultFilterFn;
	// Filter using the debounced value for better performance with async searches
	const filteredOptions = props.options.filter(option => filterFn(option, debouncedInputValue));

	const handleInputChange = useCallback(
		(newInputValue: string) => {
			setInputValue(newInputValue);
			const selectedOption = props.options.find(opt => opt.value === value);
			if (selectedOption) {
				const selectedLabel = getOptionLabel(selectedOption);
				if (selectedLabel && selectedLabel !== newInputValue) {
					setValue('');
				}
			}
		},
		[props, value, setValue]
	);

	useEffect(() => {
		syncInputValue(props.options, value, setInputValue);
	}, [value, props.options, setInputValue]);

	return {
		inputValue,
		setInputValue: handleInputChange,
		filteredOptions,
		searchQuery: debouncedInputValue,
	};
}

export function useAutocompleteOpen() {
	const [isOpen, setIsOpen] = useState(false);
	return { isOpen, setIsOpen };
}

export function useAutocompleteHighlight(filteredOptions: AutocompleteOption[]) {
	const [highlightedIndex, setHighlightedIndex] = useState(-1);

	useEffect(() => {
		if (highlightedIndex >= filteredOptions.length) {
			// Use setTimeout to avoid synchronous setState in effect
			setTimeout(() => {
				setHighlightedIndex(-1);
			}, 0);
		}
	}, [filteredOptions.length, highlightedIndex]);

	return { highlightedIndex, setHighlightedIndex };
}

export function useAutocompleteRefs() {
	const inputRef = useRef<HTMLInputElement | null>(null);
	const listboxRef = useRef<HTMLUListElement | null>(null);
	return { inputRef, listboxRef };
}

export function createOptionRefs(count: number): RefObject<HTMLButtonElement | null>[] {
	return Array.from({ length: count }, () => ({ current: null }));
}

export function useAutocompleteStateManagement(filteredOptions: AutocompleteOption[]) {
	const { isOpen, setIsOpen } = useAutocompleteOpen();
	const { highlightedIndex, setHighlightedIndex } = useAutocompleteHighlight(filteredOptions);
	const { inputRef, listboxRef } = useAutocompleteRefs();
	const optionRefs = createOptionRefs(filteredOptions.length);
	return {
		isOpen,
		setIsOpen,
		highlightedIndex,
		setHighlightedIndex,
		inputRef,
		listboxRef,
		optionRefs,
	};
}

export function useAutocompleteKeyboardHandlers(params: {
	props: Readonly<AutocompleteProps>;
	value: string;
	setValue: (value: string) => void;
	inputValue: string;
	setInputValue: (value: string) => void;
	filteredOptions: AutocompleteOption[];
	state: ReturnType<typeof useAutocompleteStateManagement>;
}) {
	const { props, value, setValue, inputValue, setInputValue, filteredOptions, state } = params;
	return useAutocompleteKeyboard(props, {
		isOpen: state.isOpen,
		setIsOpen: state.setIsOpen,
		inputValue,
		setInputValue,
		filteredOptions,
		highlightedIndex: state.highlightedIndex,
		setHighlightedIndex: state.setHighlightedIndex,
		value,
		setValue,
	});
}

export function useAutocompleteInteractions(params: {
	props: Readonly<AutocompleteProps>;
	value: string;
	setValue: (value: string) => void;
	inputValue: string;
	setInputValue: (value: string) => void;
	filteredOptions: AutocompleteOption[];
}) {
	const state = useAutocompleteStateManagement(params.filteredOptions);
	const { handleSelect, handleKeyDown } = useAutocompleteKeyboardHandlers({ ...params, state });
	return { ...state, handleSelect, handleKeyDown };
}
