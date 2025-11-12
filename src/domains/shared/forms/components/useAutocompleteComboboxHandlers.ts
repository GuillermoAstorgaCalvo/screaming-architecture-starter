import type { AutocompleteOption } from './AutocompleteCombobox';
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

export function useAutocompleteHandlers(props: UseAutocompleteHandlersProps) {
	const { openList, closeList } = useListCallbacks({
		disabled: props.disabled,
		firstEnabledIndex: props.firstEnabledIndex,
		setIsOpen: props.setIsOpen,
		setHighlightedIndex: props.setHighlightedIndex,
	});

	const { updateInputValue, handleChange } = useInputCallbacks({
		isInputControlled: props.isInputControlled,
		isOpen: props.isOpen,
		setInternalInputValue: props.setInternalInputValue,
		onInputValueChange: props.onInputValueChange,
		openList,
	});

	const { moveHighlight, selectOption } = useOptionCallbacks({
		filteredOptions: props.filteredOptions,
		highlightedIndex: props.highlightedIndex,
		setHighlightedIndex: props.setHighlightedIndex,
		onValueChange: props.onValueChange,
		onOptionSelect: props.onOptionSelect,
		updateInputValue,
		closeList,
	});

	const handleKeyDown = useKeyboardHandler({
		isOpen: props.isOpen,
		filteredOptions: props.filteredOptions,
		highlightedIndex: props.highlightedIndex,
		openList,
		moveHighlight,
		selectOption,
		closeList,
		updateInputValue,
		onValueChange: props.onValueChange,
		onOptionSelect: props.onOptionSelect,
	});

	return { openList, closeList, handleChange, handleKeyDown, selectOption };
}
