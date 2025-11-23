import type { ComboboxProps } from '@core/ui/forms/combobox/Combobox';
import type { useComboboxState } from '@core/ui/forms/combobox/helpers/ComboboxHelpers';
import type { ComboboxFieldProps } from '@core/ui/forms/combobox/types/ComboboxTypes';
import type { ChangeEvent, KeyboardEvent } from 'react';

const BLUR_DELAY_MS = 200;

export type FieldPropsRest = Omit<
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
	| 'value'
	| 'defaultValue'
	| 'onChange'
	| 'options'
	| 'filterFn'
	| 'onInputChange'
>;

function createInputHandlers(params: {
	setInputValue: (value: string) => void;
	setIsOpen: (open: boolean) => void;
	setHighlightedIndex: (index: number) => void;
	handleKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
}) {
	const { setInputValue, setIsOpen, setHighlightedIndex, handleKeyDown } = params;
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
		...(handleKeyDown && { onKeyDown: handleKeyDown }),
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
	isOpen: boolean;
	ariaControls: string;
}): ComboboxFieldProps {
	const {
		state,
		disabled,
		required,
		placeholder,
		rest,
		handlers,
		inputValue,
		isOpen,
		ariaControls,
	} = params;
	const inputProps = buildInputProps({ rest, placeholder, handlers, inputValue });

	return {
		id: state.finalId,
		className: state.inputClasses,
		hasError: state.hasError,
		ariaDescribedBy: state.ariaDescribedBy,
		disabled,
		required,
		isOpen,
		ariaControls,
		props: inputProps,
	};
}

function prepareFieldPropsData(params: {
	setInputValue: (value: string) => void;
	setIsOpen: (open: boolean) => void;
	setHighlightedIndex: (index: number) => void;
	handleKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
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
	isOpen: boolean;
	ariaControls: string;
	handleKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
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
		isOpen,
		ariaControls,
		handleKeyDown,
	} = params;
	const handlers = prepareFieldPropsData({
		setInputValue,
		setIsOpen,
		setHighlightedIndex,
		...(handleKeyDown && { handleKeyDown }),
	});
	return buildFieldPropsObject({
		state,
		disabled,
		required,
		placeholder,
		rest,
		handlers,
		inputValue,
		isOpen,
		ariaControls,
	});
}
