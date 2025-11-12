import { type RefObject, useEffect, useMemo, useRef, useState } from 'react';

import type { AutocompleteOption } from './AutocompleteCombobox';
import { filterOptions } from './AutocompleteComboboxHelpers';
import { useAutocompleteHandlers } from './useAutocompleteComboboxHandlers';

function useClickOutside(
	containerRef: RefObject<HTMLDivElement | null>,
	isOpen: boolean,
	onClose: () => void
) {
	useEffect(() => {
		if (!isOpen) {
			return;
		}

		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as Node;
			if (containerRef.current?.contains(target)) {
				return;
			}
			onClose();
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isOpen, containerRef, onClose]);
}

function useHighlightReset(
	filteredOptions: AutocompleteOption[],
	isOpen: boolean,
	firstEnabledIndex: number,
	setHighlightedIndex: (index: number) => void
) {
	const previousFilteredOptionsRef = useRef(filteredOptions);

	useEffect(() => {
		if (isOpen && previousFilteredOptionsRef.current !== filteredOptions) {
			previousFilteredOptionsRef.current = filteredOptions;
			queueMicrotask(() => {
				setHighlightedIndex(firstEnabledIndex >= 0 ? firstEnabledIndex : -1);
			});
		}
	}, [filteredOptions, isOpen, firstEnabledIndex, setHighlightedIndex]);
}

interface UseAutocompleteComboboxProps {
	readonly value?: string | undefined;
	readonly inputValue?: string | undefined;
	readonly options: AutocompleteOption[];
	readonly disabled: boolean;
	readonly onValueChange?: ((value: string | undefined) => void) | undefined;
	readonly onInputValueChange?: ((value: string) => void) | undefined;
	readonly onOptionSelect?: ((option: AutocompleteOption | undefined) => void) | undefined;
}

function useAutocompleteState(
	value: string | undefined,
	inputValue: string | undefined,
	options: AutocompleteOption[]
) {
	const isInputControlled = typeof inputValue === 'string';
	const [internalInputValue, setInternalInputValue] = useState(
		options.find(option => option.value === value)?.label ?? ''
	);
	const [isOpen, setIsOpen] = useState(false);
	const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

	const selectedOption = useMemo(
		() => options.find(option => option.value === value),
		[options, value]
	);

	const resolvedInputValue = isInputControlled
		? inputValue
		: (selectedOption?.label ?? internalInputValue);

	const filteredOptions = useMemo(
		() => filterOptions(options, resolvedInputValue),
		[options, resolvedInputValue]
	);

	const firstEnabledIndex = useMemo(
		() => filteredOptions.findIndex(option => !option.disabled),
		[filteredOptions]
	);

	return {
		isInputControlled,
		internalInputValue,
		setInternalInputValue,
		isOpen,
		setIsOpen,
		highlightedIndex,
		setHighlightedIndex,
		selectedOption,
		resolvedInputValue,
		filteredOptions,
		firstEnabledIndex,
	};
}

export function useAutocompleteCombobox(props: Readonly<UseAutocompleteComboboxProps>) {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const state = useAutocompleteState(props.value, props.inputValue, props.options);
	const handlers = useAutocompleteHandlers({
		disabled: props.disabled,
		isInputControlled: state.isInputControlled,
		isOpen: state.isOpen,
		filteredOptions: state.filteredOptions,
		highlightedIndex: state.highlightedIndex,
		firstEnabledIndex: state.firstEnabledIndex,
		setInternalInputValue: state.setInternalInputValue,
		setIsOpen: state.setIsOpen,
		setHighlightedIndex: state.setHighlightedIndex,
		onInputValueChange: props.onInputValueChange,
		onValueChange: props.onValueChange,
		onOptionSelect: props.onOptionSelect,
	});

	useClickOutside(containerRef, state.isOpen, handlers.closeList);
	useHighlightReset(
		state.filteredOptions,
		state.isOpen,
		state.firstEnabledIndex,
		state.setHighlightedIndex
	);

	return {
		containerRef,
		resolvedInputValue: state.resolvedInputValue,
		filteredOptions: state.filteredOptions,
		isOpen: state.isOpen,
		highlightedIndex: state.highlightedIndex,
		selectedOption: state.selectedOption,
		handleChange: handlers.handleChange,
		handleKeyDown: handlers.handleKeyDown,
		openList: handlers.openList,
		selectOption: handlers.selectOption,
	};
}
