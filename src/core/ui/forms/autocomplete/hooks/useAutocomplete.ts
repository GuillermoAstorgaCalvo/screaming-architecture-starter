import type { AutocompleteProps } from '@core/ui/forms/autocomplete/Autocomplete';
import { useAutocompleteState } from '@core/ui/forms/autocomplete/helpers/AutocompleteHelpers';
import { createFieldProps } from '@core/ui/forms/autocomplete/hooks/useAutocompleteField';
import { buildAutocompleteReturn } from '@core/ui/forms/autocomplete/hooks/useAutocompleteReturn';
import {
	useAutocompleteInput,
	useAutocompleteInteractions,
	useAutocompleteValue,
} from '@core/ui/forms/autocomplete/hooks/useAutocompleteState';
import type { AutocompleteContentProps } from '@core/ui/forms/autocomplete/types/AutocompleteTypes';
import { useId } from 'react';

function useAutocompleteStateSetup(props: Readonly<AutocompleteProps>) {
	const { autocompleteId, label, error, helperText, size = 'md', className } = props;
	const state = useAutocompleteState({ autocompleteId, label, error, helperText, size, className });
	const { value, setValue } = useAutocompleteValue(props);
	const { inputValue, setInputValue, filteredOptions, searchQuery } = useAutocompleteInput(
		props,
		value,
		setValue
	);
	return { state, value, setValue, inputValue, setInputValue, filteredOptions, searchQuery };
}

function useAutocompleteData(
	props: Readonly<AutocompleteProps>,
	stateSetup: ReturnType<typeof useAutocompleteStateSetup>
) {
	const interactions = useAutocompleteInteractions({
		props,
		value: stateSetup.value,
		setValue: stateSetup.setValue,
		inputValue: stateSetup.inputValue,
		setInputValue: stateSetup.setInputValue,
		filteredOptions: stateSetup.filteredOptions,
	});
	const menuId = useId();
	return { interactions, menuId };
}

function buildAutocompleteFieldProps(params: {
	state: ReturnType<typeof useAutocompleteState>;
	disabled: boolean | undefined;
	required: boolean | undefined;
	placeholder: string | undefined;
	rest: Omit<
		AutocompleteProps,
		| 'label'
		| 'error'
		| 'helperText'
		| 'size'
		| 'fullWidth'
		| 'required'
		| 'autocompleteId'
		| 'className'
		| 'disabled'
		| 'placeholder'
		| 'maxHeight'
		| 'emptyState'
		| 'debounceDelay'
		| 'highlightMatches'
	>;
	stateSetup: ReturnType<typeof useAutocompleteStateSetup>;
	interactions: ReturnType<typeof useAutocompleteInteractions>;
}) {
	return createFieldProps({
		state: params.state,
		disabled: params.disabled,
		required: params.required,
		placeholder: params.placeholder,
		rest: params.rest,
		inputValue: params.stateSetup.inputValue,
		setInputValue: params.stateSetup.setInputValue,
		setIsOpen: params.interactions.setIsOpen,
		setHighlightedIndex: params.interactions.setHighlightedIndex,
	});
}

function extractAutocompleteProps(props: Readonly<AutocompleteProps>) {
	const {
		label,
		error,
		helperText,
		fullWidth = false,
		required,
		disabled,
		placeholder,
		maxHeight = 280,
		emptyState = 'No options found',
		highlightMatches = true,
		...rest
	} = props;
	return {
		label,
		error,
		helperText,
		fullWidth,
		required,
		disabled,
		placeholder,
		maxHeight,
		emptyState,
		highlightMatches,
		rest,
	};
}

function buildAutocompleteFieldPropsFromState(params: {
	state: ReturnType<typeof useAutocompleteState>;
	disabled: boolean | undefined;
	required: boolean | undefined;
	placeholder: string | undefined;
	rest: Omit<
		AutocompleteProps,
		| 'label'
		| 'error'
		| 'helperText'
		| 'size'
		| 'fullWidth'
		| 'required'
		| 'autocompleteId'
		| 'className'
		| 'disabled'
		| 'placeholder'
		| 'maxHeight'
		| 'emptyState'
		| 'debounceDelay'
		| 'highlightMatches'
	>;
	stateSetup: ReturnType<typeof useAutocompleteStateSetup>;
	interactions: ReturnType<typeof useAutocompleteInteractions>;
}) {
	return buildAutocompleteFieldProps({
		state: params.state,
		disabled: params.disabled,
		required: params.required,
		placeholder: params.placeholder,
		rest: params.rest,
		stateSetup: params.stateSetup,
		interactions: params.interactions,
	});
}

export function useAutocomplete(props: Readonly<AutocompleteProps>): AutocompleteContentProps {
	const extracted = extractAutocompleteProps(props);
	const stateSetup = useAutocompleteStateSetup(props);
	const { interactions, menuId } = useAutocompleteData(props, stateSetup);
	const fieldProps = buildAutocompleteFieldPropsFromState({
		state: stateSetup.state,
		disabled: extracted.disabled,
		required: extracted.required,
		placeholder: extracted.placeholder,
		rest: extracted.rest,
		stateSetup,
		interactions,
	});
	return buildAutocompleteReturn({
		state: stateSetup.state,
		fieldProps,
		interactions,
		label: extracted.label,
		error: extracted.error,
		helperText: extracted.helperText,
		required: extracted.required,
		fullWidth: extracted.fullWidth,
		inputValue: stateSetup.inputValue,
		setInputValue: stateSetup.setInputValue,
		filteredOptions: stateSetup.filteredOptions,
		maxHeight: extracted.maxHeight,
		emptyState: extracted.emptyState,
		menuId,
		searchQuery: stateSetup.searchQuery,
		highlightMatches: extracted.highlightMatches,
	});
}
