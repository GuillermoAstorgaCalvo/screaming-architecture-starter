import { type RefObject, useCallback, useEffect, useRef, useState } from 'react';

import type { MultiSelectOption, MultiSelectProps } from './MultiSelect';
import { defaultFilterFn } from './MultiSelectHelpers';
import { useMultiSelectKeyboard } from './useMultiSelectKeyboard';

export function useMultiSelectValue(
	props: Readonly<Pick<MultiSelectProps, 'value' | 'defaultValue' | 'onChange'>>
) {
	const isControlled = props.value !== undefined;
	const [internalValue, setInternalValue] = useState<string[]>(props.defaultValue ?? []);
	const value = isControlled ? props.value : internalValue;

	const setValue = useCallback(
		(newValue: string[]) => {
			if (!isControlled) {
				setInternalValue(newValue);
			}
			props.onChange?.(newValue);
		},
		[isControlled, props]
	);

	return { value, setValue };
}

export function useMultiSelectInput(
	props: Readonly<Pick<MultiSelectProps, 'options' | 'filterFn' | 'onInputChange'>>,
	_value: string[]
) {
	const [inputValue, setInputValue] = useState('');

	const filterFn = props.filterFn ?? defaultFilterFn;
	const filteredOptions = props.options.filter(option => filterFn(option, inputValue));

	const handleInputChange = useCallback(
		(newInputValue: string) => {
			setInputValue(newInputValue);
			props.onInputChange?.(newInputValue);
		},
		[props]
	);

	return { inputValue, setInputValue: handleInputChange, filteredOptions };
}

export function useMultiSelectOpen() {
	const [isOpen, setIsOpen] = useState(false);
	return { isOpen, setIsOpen };
}

export function useMultiSelectHighlight(filteredOptions: MultiSelectOption[]) {
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

export function useMultiSelectRefs() {
	const inputRef = useRef<HTMLInputElement | null>(null);
	const listboxRef = useRef<HTMLUListElement | null>(null);
	return { inputRef, listboxRef };
}

export function createOptionRefs(count: number): RefObject<HTMLButtonElement | null>[] {
	return Array.from({ length: count }, () => ({ current: null }));
}

export function useMultiSelectStateManagement(filteredOptions: MultiSelectOption[]) {
	const { isOpen, setIsOpen } = useMultiSelectOpen();
	const { highlightedIndex, setHighlightedIndex } = useMultiSelectHighlight(filteredOptions);
	const { inputRef, listboxRef } = useMultiSelectRefs();
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

export function useMultiSelectKeyboardHandlers(params: {
	props: Readonly<MultiSelectProps>;
	value: string[];
	setValue: (value: string[]) => void;
	inputValue: string;
	setInputValue: (value: string) => void;
	filteredOptions: MultiSelectOption[];
	state: ReturnType<typeof useMultiSelectStateManagement>;
}) {
	const { props, value, setValue, setInputValue, filteredOptions, state } = params;
	return useMultiSelectKeyboard(props, {
		isOpen: state.isOpen,
		setIsOpen: state.setIsOpen,
		setInputValue,
		filteredOptions,
		highlightedIndex: state.highlightedIndex,
		setHighlightedIndex: state.setHighlightedIndex,
		value,
		setValue,
	});
}

export function useMultiSelectInteractions(params: {
	props: Readonly<MultiSelectProps>;
	value: string[];
	setValue: (value: string[]) => void;
	inputValue: string;
	setInputValue: (value: string) => void;
	filteredOptions: MultiSelectOption[];
}) {
	const state = useMultiSelectStateManagement(params.filteredOptions);
	const { handleSelect, handleKeyDown } = useMultiSelectKeyboardHandlers({ ...params, state });
	return { ...state, handleSelect, handleKeyDown };
}
