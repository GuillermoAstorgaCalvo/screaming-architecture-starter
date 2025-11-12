import type { AutocompleteOption } from './AutocompleteCombobox';
import { buildComboboxBodyProps, getActiveDescendant } from './AutocompleteComboboxHelpers';
import { useAutocompleteCombobox } from './useAutocompleteCombobox';
import { useAutocompleteComboboxIds } from './useAutocompleteComboboxIds';

interface UseAutocompleteComboboxSetupProps {
	readonly id?: string | undefined;
	readonly label?: string | undefined;
	readonly helperText?: string | undefined;
	readonly error?: string | undefined;
	readonly value?: string | undefined;
	readonly inputValue?: string | undefined;
	readonly options: AutocompleteOption[];
	readonly disabled: boolean;
	readonly required: boolean;
	readonly placeholder?: string | undefined;
	readonly isLoading: boolean;
	readonly loadingMessage: string;
	readonly noOptionsMessage: string;
	readonly className?: string | undefined;
	readonly onValueChange?: ((value: string | undefined) => void) | undefined;
	readonly onInputValueChange?: ((value: string) => void) | undefined;
	readonly onOptionSelect?: ((option: AutocompleteOption | undefined) => void) | undefined;
}

export function useAutocompleteComboboxSetup(props: Readonly<UseAutocompleteComboboxSetupProps>) {
	const { comboboxId, labelId, listboxId, helperId, errorId, ownedIds } =
		useAutocompleteComboboxIds(props);
	const combobox = useAutocompleteCombobox(props);
	const activeDescendant = getActiveDescendant(
		comboboxId,
		combobox.highlightedIndex,
		combobox.filteredOptions
	);
	return buildComboboxBodyProps({
		className: props.className,
		containerRef: combobox.containerRef,
		comboboxId,
		labelId,
		label: props.label,
		resolvedInputValue: combobox.resolvedInputValue,
		placeholder: props.placeholder,
		helperText: props.helperText,
		helperId,
		error: props.error,
		errorId,
		disabled: props.disabled,
		required: props.required,
		isOpen: combobox.isOpen,
		listboxId,
		activeDescendant,
		ownedIds,
		filteredOptions: combobox.filteredOptions,
		highlightedIndex: combobox.highlightedIndex,
		selectedValue: props.value,
		isLoading: props.isLoading,
		loadingMessage: props.loadingMessage,
		noOptionsMessage: props.noOptionsMessage,
		handleChange: combobox.handleChange,
		openList: combobox.openList,
		handleKeyDown: combobox.handleKeyDown,
		selectOption: combobox.selectOption,
	});
}
