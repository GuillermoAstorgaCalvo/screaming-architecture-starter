import type { AutocompleteOption } from '@domains/shared/components/autocomplete-combobox/AutocompleteCombobox';
import {
	buildComboboxBodyProps,
	getActiveDescendant,
} from '@domains/shared/components/autocomplete-combobox/helpers/AutocompleteComboboxHelpers';
import { useMemo } from 'react';

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

function useActiveDescendant(
	comboboxId: string,
	highlightedIndex: number,
	filteredOptions: AutocompleteOption[]
) {
	return useMemo(
		() => getActiveDescendant(comboboxId, highlightedIndex, filteredOptions),
		[comboboxId, highlightedIndex, filteredOptions]
	);
}

interface BuildComboboxPropsParamsParams {
	readonly props: Readonly<UseAutocompleteComboboxSetupProps>;
	readonly ids: ReturnType<typeof useAutocompleteComboboxIds>;
	readonly combobox: ReturnType<typeof useAutocompleteCombobox>;
	readonly activeDescendant: string | undefined;
}

function buildComboboxIdentityProps(
	props: Readonly<UseAutocompleteComboboxSetupProps>,
	ids: ReturnType<typeof useAutocompleteComboboxIds>
) {
	return {
		className: props.className,
		comboboxId: ids.comboboxId,
		labelId: ids.labelId,
		label: props.label,
		placeholder: props.placeholder,
		helperText: props.helperText,
		helperId: ids.helperId,
		error: props.error,
		errorId: ids.errorId,
		disabled: props.disabled,
		required: props.required,
	};
}

interface BuildComboboxStatePropsParams {
	readonly props: Readonly<UseAutocompleteComboboxSetupProps>;
	readonly ids: ReturnType<typeof useAutocompleteComboboxIds>;
	readonly combobox: ReturnType<typeof useAutocompleteCombobox>;
	readonly activeDescendant: string | undefined;
}

function buildComboboxStateProps({
	props,
	ids,
	combobox,
	activeDescendant,
}: BuildComboboxStatePropsParams) {
	return {
		containerRef: combobox.containerRef,
		resolvedInputValue: combobox.resolvedInputValue,
		isOpen: combobox.isOpen,
		listboxId: ids.listboxId,
		activeDescendant,
		ownedIds: ids.ownedIds,
		filteredOptions: combobox.filteredOptions,
		highlightedIndex: combobox.highlightedIndex,
		selectedValue: props.value,
		isLoading: props.isLoading,
		loadingMessage: props.loadingMessage,
		noOptionsMessage: props.noOptionsMessage,
	};
}

function buildComboboxHandlerProps(combobox: ReturnType<typeof useAutocompleteCombobox>) {
	return {
		handleChange: combobox.handleChange,
		openList: combobox.openList,
		handleKeyDown: combobox.handleKeyDown,
		selectOption: combobox.selectOption,
	};
}

function buildComboboxPropsParams({
	props,
	ids,
	combobox,
	activeDescendant,
}: BuildComboboxPropsParamsParams) {
	return {
		...buildComboboxIdentityProps(props, ids),
		...buildComboboxStateProps({ props, ids, combobox, activeDescendant }),
		...buildComboboxHandlerProps(combobox),
	};
}

export function useAutocompleteComboboxSetup(props: Readonly<UseAutocompleteComboboxSetupProps>) {
	const ids = useAutocompleteComboboxIds(props);
	const combobox = useAutocompleteCombobox(props);
	const activeDescendant = useActiveDescendant(
		ids.comboboxId,
		combobox.highlightedIndex,
		combobox.filteredOptions
	);

	const propsParams = buildComboboxPropsParams({
		props,
		ids,
		combobox,
		activeDescendant,
	});

	return buildComboboxBodyProps(propsParams);
}
