import type { AutocompleteOption } from '@domains/shared/components/autocomplete-combobox/AutocompleteCombobox';
import type { ChangeEvent } from 'react';

import { useInputCallbacks } from './useAutocompleteComboboxHandlers.input';
import { useKeyboardHandler } from './useAutocompleteComboboxHandlers.keyboard';
import { useListCallbacks } from './useAutocompleteComboboxHandlers.list';
import { useOptionCallbacks } from './useAutocompleteComboboxHandlers.option';

export interface UseAutocompleteHandlersProps {
	readonly disabled: boolean;
	readonly isInputControlled: boolean;
	readonly isOpen: boolean;
	readonly filteredOptions: AutocompleteOption[];
	readonly highlightedIndex: number;
	readonly firstEnabledIndex: number;
	readonly setInternalInputValue: (value: string) => void;
	readonly setIsOpen: (open: boolean) => void;
	readonly setHighlightedIndex: (index: number) => void;
	readonly onInputValueChange?: ((value: string) => void) | undefined;
	readonly onValueChange?: ((value: string | undefined) => void) | undefined;
	readonly onOptionSelect?: ((option: AutocompleteOption | undefined) => void) | undefined;
}

interface ListHandlers {
	readonly openList: () => void;
	readonly closeList: () => void;
}

interface InputHandlers {
	readonly updateInputValue: (value: string) => void;
	readonly handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

interface OptionHandlers {
	readonly moveHighlight: (direction: 1 | -1) => void;
	readonly selectOption: (option: AutocompleteOption | undefined) => void;
}

function useListHandlers(props: UseAutocompleteHandlersProps): ListHandlers {
	return useListCallbacks({
		disabled: props.disabled,
		firstEnabledIndex: props.firstEnabledIndex,
		setIsOpen: props.setIsOpen,
		setHighlightedIndex: props.setHighlightedIndex,
	});
}

function useInputHandlers(
	props: UseAutocompleteHandlersProps,
	listHandlers: ListHandlers
): InputHandlers {
	return useInputCallbacks({
		isInputControlled: props.isInputControlled,
		isOpen: props.isOpen,
		setInternalInputValue: props.setInternalInputValue,
		onInputValueChange: props.onInputValueChange,
		openList: listHandlers.openList,
	});
}

function useOptionHandlers(
	props: UseAutocompleteHandlersProps,
	listHandlers: ListHandlers,
	inputHandlers: InputHandlers
): OptionHandlers {
	return useOptionCallbacks({
		filteredOptions: props.filteredOptions,
		highlightedIndex: props.highlightedIndex,
		setHighlightedIndex: props.setHighlightedIndex,
		onValueChange: props.onValueChange,
		onOptionSelect: props.onOptionSelect,
		updateInputValue: inputHandlers.updateInputValue,
		closeList: listHandlers.closeList,
	});
}

interface KeyboardHandlersContext {
	readonly listHandlers: ListHandlers;
	readonly inputHandlers: InputHandlers;
	readonly optionHandlers: OptionHandlers;
}

function useKeyboardHandlers(
	props: UseAutocompleteHandlersProps,
	context: KeyboardHandlersContext
) {
	return useKeyboardHandler({
		isOpen: props.isOpen,
		filteredOptions: props.filteredOptions,
		highlightedIndex: props.highlightedIndex,
		openList: context.listHandlers.openList,
		moveHighlight: context.optionHandlers.moveHighlight,
		selectOption: context.optionHandlers.selectOption,
		closeList: context.listHandlers.closeList,
		updateInputValue: context.inputHandlers.updateInputValue,
		onValueChange: props.onValueChange,
		onOptionSelect: props.onOptionSelect,
	});
}

export function useAutocompleteHandlers(props: UseAutocompleteHandlersProps) {
	const listHandlers = useListHandlers(props);
	const inputHandlers = useInputHandlers(props, listHandlers);
	const optionHandlers = useOptionHandlers(props, listHandlers, inputHandlers);
	const handleKeyDown = useKeyboardHandlers(props, {
		listHandlers,
		inputHandlers,
		optionHandlers,
	});

	return {
		openList: listHandlers.openList,
		closeList: listHandlers.closeList,
		handleChange: inputHandlers.handleChange,
		handleKeyDown,
		selectOption: optionHandlers.selectOption,
	};
}
