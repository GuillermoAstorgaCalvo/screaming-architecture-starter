import { UI_TIMEOUTS } from '@core/constants/timeouts';
import { useDebounce } from '@core/hooks/useDebounce';
import type { ComboboxOption, ComboboxProps } from '@core/ui/forms/combobox/Combobox';
import { defaultFilterFn } from '@core/ui/forms/combobox/helpers/ComboboxHelpers';
import { getOptionLabel } from '@core/ui/forms/combobox/helpers/useComboboxHelpers';
import { useComboboxKeyboard } from '@core/ui/forms/combobox/hooks/useComboboxKeyboard';
import { type RefObject, useCallback, useEffect, useRef, useState } from 'react';

export function useComboboxValue(
	props: Readonly<Pick<ComboboxProps, 'value' | 'defaultValue' | 'onChange'>>
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

function getInitialInputValue(options: ComboboxOption[], value: string): string {
	const selectedOption = options.find(opt => opt.value === value);
	return selectedOption ? getOptionLabel(selectedOption) : '';
}

function syncInputValue(
	options: ComboboxOption[],
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

export function useComboboxInput(
	props: Readonly<Pick<ComboboxProps, 'options' | 'filterFn' | 'onInputChange'>>,
	value: string,
	setValue: (value: string) => void
) {
	const [inputValue, setInputValue] = useState(() => getInitialInputValue(props.options, value));

	// Debounce the input value for onInputChange callback to reduce callback frequency
	// This matches the behavior of Autocomplete component
	const debouncedInputValue = useDebounce(inputValue, UI_TIMEOUTS.DEBOUNCE_DEFAULT);

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

	return { inputValue, setInputValue: handleInputChange, filteredOptions };
}

export function useComboboxOpen() {
	const [isOpen, setIsOpen] = useState(false);
	return { isOpen, setIsOpen };
}

export function useComboboxHighlight(filteredOptions: ComboboxOption[]) {
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

export function useComboboxRefs() {
	const inputRef = useRef<HTMLInputElement | null>(null);
	const listboxRef = useRef<HTMLUListElement | null>(null);
	return { inputRef, listboxRef };
}

export function createOptionRefs(count: number): RefObject<HTMLButtonElement | null>[] {
	return Array.from({ length: count }, () => ({ current: null }));
}

export function useComboboxStateManagement(filteredOptions: ComboboxOption[]) {
	const { isOpen, setIsOpen } = useComboboxOpen();
	const { highlightedIndex, setHighlightedIndex } = useComboboxHighlight(filteredOptions);
	const { inputRef, listboxRef } = useComboboxRefs();
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

export function useComboboxKeyboardHandlers(params: {
	props: Readonly<ComboboxProps>;
	value: string;
	setValue: (value: string) => void;
	inputValue: string;
	setInputValue: (value: string) => void;
	filteredOptions: ComboboxOption[];
	state: ReturnType<typeof useComboboxStateManagement>;
}) {
	const { props, value, setValue, inputValue, setInputValue, filteredOptions, state } = params;
	return useComboboxKeyboard(props, {
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

export function useComboboxInteractions(params: {
	props: Readonly<ComboboxProps>;
	value: string;
	setValue: (value: string) => void;
	inputValue: string;
	setInputValue: (value: string) => void;
	filteredOptions: ComboboxOption[];
}) {
	const state = useComboboxStateManagement(params.filteredOptions);
	const { handleSelect, handleKeyDown } = useComboboxKeyboardHandlers({ ...params, state });
	return { ...state, handleSelect, handleKeyDown };
}
