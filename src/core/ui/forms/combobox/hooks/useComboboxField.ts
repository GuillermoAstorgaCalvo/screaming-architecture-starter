import type { ComboboxProps } from '@core/ui/forms/combobox/Combobox';
import type { useComboboxState } from '@core/ui/forms/combobox/helpers/ComboboxHelpers';
import type { ComboboxFieldProps } from '@core/ui/forms/combobox/types/ComboboxTypes';
import type { ChangeEvent } from 'react';

const BLUR_DELAY_MS = 200;

type FieldPropsRest = Omit<
	ComboboxProps,
	| 'label'
	| 'error'
	| 'helperText'
	| 'size'
	| 'fullWidth'
	| 'required'
	| 'comboboxId'
	| 'className'
	| 'disabled'
	| 'placeholder'
	| 'maxHeight'
	| 'emptyState'
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
}): ComboboxFieldProps['props'] & { value: string } {
	const { rest, placeholder, handlers, inputValue } = params;
	return {
		...rest,
		placeholder,
		...handlers,
		value: inputValue,
	} as ComboboxFieldProps['props'] & { value: string };
}

function buildFieldPropsObject(params: {
	state: ReturnType<typeof useComboboxState>;
	disabled: boolean | undefined;
	required: boolean | undefined;
	placeholder: string | undefined;
	rest: FieldPropsRest;
	handlers: ReturnType<typeof createInputHandlers>;
	inputValue: string;
}): ComboboxFieldProps {
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
	state: ReturnType<typeof useComboboxState>;
	disabled: boolean | undefined;
	required: boolean | undefined;
	placeholder: string | undefined;
	rest: FieldPropsRest;
	inputValue: string;
	setInputValue: (value: string) => void;
	setIsOpen: (open: boolean) => void;
	setHighlightedIndex: (index: number) => void;
}): ComboboxFieldProps {
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
