import type { ChangeEvent } from 'react';

import type { AutocompleteProps } from './Autocomplete';
import type { useAutocompleteState } from './AutocompleteHelpers';
import type { AutocompleteFieldProps } from './AutocompleteTypes';

const BLUR_DELAY_MS = 200;

type FieldPropsRest = Omit<
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

function createInputHandlers(params: {
	setInputValue: (value: string) => void;
	setIsOpen: (open: boolean) => void;
	setHighlightedIndex: (index: number) => void;
}) {
	const { setInputValue, setIsOpen, setHighlightedIndex } = params;
	return {
		onChange: (e: ChangeEvent<HTMLInputElement>) => {
			setInputValue(e.target.value);
			setIsOpen(true);
		},
		onFocus: () => {
			setIsOpen(true);
		},
		onBlur: () => {
			setTimeout(() => {
				setIsOpen(false);
				setHighlightedIndex(-1);
			}, BLUR_DELAY_MS);
		},
	};
}

function buildInputProps(params: {
	rest: FieldPropsRest;
	placeholder: string | undefined;
	handlers: ReturnType<typeof createInputHandlers>;
	inputValue: string;
}): AutocompleteFieldProps['props'] {
	const { rest, placeholder, handlers, inputValue } = params;
	return {
		...rest,
		placeholder,
		...handlers,
		value: inputValue,
	} as AutocompleteFieldProps['props'];
}

function buildFieldPropsObject(params: {
	state: ReturnType<typeof useAutocompleteState>;
	disabled: boolean | undefined;
	required: boolean | undefined;
	placeholder: string | undefined;
	rest: FieldPropsRest;
	handlers: ReturnType<typeof createInputHandlers>;
	inputValue: string;
}): AutocompleteFieldProps {
	const { state, disabled, required, placeholder, rest, handlers, inputValue } = params;
	const inputProps = buildInputProps({ rest, placeholder, handlers, inputValue });

	return {
		id: state.finalId,
		className: state.inputClasses,
		hasError: state.hasError,
		ariaDescribedBy: state.ariaDescribedBy,
		disabled,
		required,
		props: inputProps,
	};
}

function prepareFieldPropsData(params: {
	setInputValue: (value: string) => void;
	setIsOpen: (open: boolean) => void;
	setHighlightedIndex: (index: number) => void;
}): ReturnType<typeof createInputHandlers> {
	return createInputHandlers(params);
}

export function createFieldProps(params: {
	state: ReturnType<typeof useAutocompleteState>;
	disabled: boolean | undefined;
	required: boolean | undefined;
	placeholder: string | undefined;
	rest: FieldPropsRest;
	inputValue: string;
	setInputValue: (value: string) => void;
	setIsOpen: (open: boolean) => void;
	setHighlightedIndex: (index: number) => void;
}): AutocompleteFieldProps {
	const {
		state,
		disabled,
		required,
		placeholder,
		rest,
		inputValue,
		setInputValue,
		setIsOpen,
		setHighlightedIndex,
	} = params;
	const handlers = prepareFieldPropsData({ setInputValue, setIsOpen, setHighlightedIndex });
	return buildFieldPropsObject({
		state,
		disabled,
		required,
		placeholder,
		rest,
		handlers,
		inputValue,
	});
}
