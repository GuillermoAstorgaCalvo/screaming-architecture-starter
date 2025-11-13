import type { AutocompleteOption } from '@core/ui/forms/autocomplete/Autocomplete';
import type { useAutocompleteState } from '@core/ui/forms/autocomplete/helpers/AutocompleteHelpers';
import type { AutocompleteContentProps } from '@core/ui/forms/autocomplete/types/AutocompleteTypes';
import type { ReactNode } from 'react';

import type { createFieldProps } from './useAutocompleteField';
import type { useAutocompleteInteractions } from './useAutocompleteState';

export interface BuildAllAutocompletePropsParams {
	readonly interactions: ReturnType<typeof useAutocompleteInteractions>;
	readonly label: string | undefined;
	readonly error: string | undefined;
	readonly helperText: string | undefined;
	readonly required: boolean | undefined;
	readonly fullWidth: boolean;
	readonly inputValue: string;
	readonly setInputValue: (value: string) => void;
	readonly filteredOptions: AutocompleteOption[];
	readonly maxHeight: number;
	readonly emptyState: ReactNode;
	readonly menuId: string;
	readonly searchQuery: string;
}

function buildFormProps(params: {
	label: string | undefined;
	error: string | undefined;
	helperText: string | undefined;
	required: boolean | undefined;
	fullWidth: boolean;
}) {
	return {
		label: params.label,
		error: params.error,
		helperText: params.helperText,
		required: params.required,
		fullWidth: params.fullWidth,
	};
}

function buildInputProps(params: {
	inputValue: string;
	setInputValue: (value: string) => void;
	filteredOptions: AutocompleteOption[];
	searchQuery: string;
}) {
	return {
		inputValue: params.inputValue,
		setInputValue: params.setInputValue,
		filteredOptions: params.filteredOptions,
		searchQuery: params.searchQuery,
	};
}

function buildInteractionProps(interactions: BuildAllAutocompletePropsParams['interactions']) {
	const {
		isOpen,
		setIsOpen,
		highlightedIndex,
		setHighlightedIndex,
		handleSelect,
		handleKeyDown,
		inputRef,
		listboxRef,
		optionRefs,
	} = interactions;
	return {
		isOpen,
		setIsOpen,
		highlightedIndex,
		setHighlightedIndex,
		handleSelect,
		handleKeyDown,
		inputRef,
		listboxRef,
		optionRefs,
	};
}

function buildUIProps(params: { maxHeight: number; emptyState: ReactNode; menuId: string }) {
	return {
		maxHeight: params.maxHeight,
		emptyState: params.emptyState,
		menuId: params.menuId,
	};
}

function combineAutocompleteProps(params: {
	state: ReturnType<typeof useAutocompleteState>;
	fieldProps: ReturnType<typeof createFieldProps>;
	formProps: ReturnType<typeof buildFormProps>;
	inputProps: ReturnType<typeof buildInputProps>;
	interactionProps: ReturnType<typeof buildInteractionProps>;
	uiProps: ReturnType<typeof buildUIProps>;
	highlightMatches: boolean | undefined;
}): AutocompleteContentProps {
	const baseProps = {
		state: params.state,
		fieldProps: params.fieldProps,
		...params.formProps,
		...params.inputProps,
		...params.interactionProps,
		...params.uiProps,
	};
	if (params.highlightMatches !== undefined) {
		return { ...baseProps, highlightMatches: params.highlightMatches };
	}
	return baseProps;
}

function buildFormPropsForAutocomplete(params: BuildAllAutocompletePropsParams) {
	return buildFormProps({
		label: params.label,
		error: params.error,
		helperText: params.helperText,
		required: params.required,
		fullWidth: params.fullWidth,
	});
}

function buildInputPropsForAutocomplete(params: BuildAllAutocompletePropsParams) {
	return buildInputProps({
		inputValue: params.inputValue,
		setInputValue: params.setInputValue,
		filteredOptions: params.filteredOptions,
		searchQuery: params.searchQuery,
	});
}

function buildUIPropsForAutocomplete(params: BuildAllAutocompletePropsParams) {
	return buildUIProps({
		maxHeight: params.maxHeight,
		emptyState: params.emptyState,
		menuId: params.menuId,
	});
}

function buildAllAutocompleteProps(params: BuildAllAutocompletePropsParams) {
	return {
		formProps: buildFormPropsForAutocomplete(params),
		inputProps: buildInputPropsForAutocomplete(params),
		interactionProps: buildInteractionProps(params.interactions),
		uiProps: buildUIPropsForAutocomplete(params),
	};
}

export function buildAutocompleteReturn(params: {
	state: ReturnType<typeof useAutocompleteState>;
	fieldProps: ReturnType<typeof createFieldProps>;
	interactions: BuildAllAutocompletePropsParams['interactions'];
	label: string | undefined;
	error: string | undefined;
	helperText: string | undefined;
	required: boolean | undefined;
	fullWidth: boolean;
	inputValue: string;
	setInputValue: (value: string) => void;
	filteredOptions: AutocompleteOption[];
	maxHeight: number;
	emptyState: ReactNode;
	menuId: string;
	searchQuery: string;
	highlightMatches?: boolean;
}): AutocompleteContentProps {
	const { formProps, inputProps, interactionProps, uiProps } = buildAllAutocompleteProps(params);
	return combineAutocompleteProps({
		state: params.state,
		fieldProps: params.fieldProps,
		formProps,
		inputProps,
		interactionProps,
		uiProps,
		highlightMatches: params.highlightMatches,
	});
}
