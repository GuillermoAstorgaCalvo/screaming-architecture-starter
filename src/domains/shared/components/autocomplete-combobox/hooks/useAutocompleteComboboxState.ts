import type { AutocompleteOption } from '@domains/shared/components/autocomplete-combobox/AutocompleteCombobox';
import { filterOptions } from '@domains/shared/components/autocomplete-combobox/helpers/AutocompleteComboboxHelpers';
import { useMemo, useState } from 'react';

function useInputValue(
	value: string | undefined,
	inputValue: string | undefined,
	options: AutocompleteOption[]
) {
	const isInputControlled = typeof inputValue === 'string';
	const [internalInputValue, setInternalInputValue] = useState(
		options.find(option => option.value === value)?.label ?? ''
	);

	return {
		isInputControlled,
		internalInputValue,
		setInternalInputValue,
	};
}

function useOpenState() {
	const [isOpen, setIsOpen] = useState(false);

	return {
		isOpen,
		setIsOpen,
	};
}

function useHighlightedIndexState() {
	const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

	return {
		highlightedIndex,
		setHighlightedIndex,
	};
}

function useSelectedOption(value: string | undefined, options: AutocompleteOption[]) {
	const selectedOption = useMemo(
		() => options.find(option => option.value === value),
		[options, value]
	);

	return { selectedOption };
}

interface UseResolvedInputValueParams {
	readonly isInputControlled: boolean;
	readonly inputValue: string | undefined;
	readonly selectedOption: AutocompleteOption | undefined;
	readonly internalInputValue: string;
}

function useResolvedInputValue(params: UseResolvedInputValueParams) {
	const resolvedInputValue = useMemo(
		() =>
			params.isInputControlled
				? (params.inputValue ?? '')
				: (params.selectedOption?.label ?? params.internalInputValue),
		[params.isInputControlled, params.inputValue, params.selectedOption, params.internalInputValue]
	);

	return { resolvedInputValue };
}

function useFilteredOptions(options: AutocompleteOption[], resolvedInputValue: string) {
	const filteredOptions = useMemo(
		() => filterOptions(options, resolvedInputValue),
		[options, resolvedInputValue]
	);

	return { filteredOptions };
}

function useFirstEnabledIndex(filteredOptions: AutocompleteOption[]) {
	const firstEnabledIndex = useMemo(
		() => filteredOptions.findIndex(option => !option.disabled),
		[filteredOptions]
	);

	return { firstEnabledIndex };
}

export function useAutocompleteState(
	value: string | undefined,
	inputValue: string | undefined,
	options: AutocompleteOption[]
) {
	const inputValueState = useInputValue(value, inputValue, options);
	const openState = useOpenState();
	const highlightedIndexState = useHighlightedIndexState();
	const { selectedOption } = useSelectedOption(value, options);
	const { resolvedInputValue } = useResolvedInputValue({
		isInputControlled: inputValueState.isInputControlled,
		inputValue,
		selectedOption,
		internalInputValue: inputValueState.internalInputValue,
	});
	const { filteredOptions } = useFilteredOptions(options, resolvedInputValue);
	const { firstEnabledIndex } = useFirstEnabledIndex(filteredOptions);

	return {
		...inputValueState,
		...openState,
		...highlightedIndexState,
		selectedOption,
		resolvedInputValue,
		filteredOptions,
		firstEnabledIndex,
	};
}
