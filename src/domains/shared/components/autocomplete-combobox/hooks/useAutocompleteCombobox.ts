import type { AutocompleteOption } from '@domains/shared/components/autocomplete-combobox/AutocompleteCombobox';
import type { RefObject } from 'react';

import { useComboboxContainer, useComboboxEffects } from './useAutocompleteComboboxEffects';
import { useAutocompleteHandlers } from './useAutocompleteComboboxHandlers';
import { useAutocompleteState } from './useAutocompleteComboboxState';

interface UseAutocompleteComboboxProps {
	readonly value?: string | undefined;
	readonly inputValue?: string | undefined;
	readonly options: AutocompleteOption[];
	readonly disabled: boolean;
	readonly onValueChange?: ((value: string | undefined) => void) | undefined;
	readonly onInputValueChange?: ((value: string) => void) | undefined;
	readonly onOptionSelect?: ((option: AutocompleteOption | undefined) => void) | undefined;
}

interface UseComboboxApiParams {
	readonly containerRef: RefObject<HTMLDivElement | null>;
	readonly state: ReturnType<typeof useAutocompleteState>;
	readonly handlers: ReturnType<typeof useAutocompleteHandlers>;
}

function useComboboxApi(params: UseComboboxApiParams) {
	return {
		containerRef: params.containerRef,
		resolvedInputValue: params.state.resolvedInputValue,
		filteredOptions: params.state.filteredOptions,
		isOpen: params.state.isOpen,
		highlightedIndex: params.state.highlightedIndex,
		selectedOption: params.state.selectedOption,
		handleChange: params.handlers.handleChange,
		handleKeyDown: params.handlers.handleKeyDown,
		openList: params.handlers.openList,
		selectOption: params.handlers.selectOption,
	};
}

export function useAutocompleteCombobox(props: Readonly<UseAutocompleteComboboxProps>) {
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

	const { containerRef } = useComboboxContainer({
		isOpen: state.isOpen,
		onClose: handlers.closeList,
	});

	useComboboxEffects({
		filteredOptions: state.filteredOptions,
		isOpen: state.isOpen,
		firstEnabledIndex: state.firstEnabledIndex,
		setHighlightedIndex: state.setHighlightedIndex,
	});

	return useComboboxApi({ containerRef, state, handlers });
}
