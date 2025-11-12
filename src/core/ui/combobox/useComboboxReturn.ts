import type { ReactNode } from 'react';

import type { ComboboxOption } from './Combobox';
import type { useComboboxState } from './ComboboxHelpers';
import type { ComboboxContentProps } from './ComboboxTypes';
import type { createFieldProps } from './useComboboxField';
import type { useComboboxInteractions } from './useComboboxState';

export interface BuildAllComboboxPropsParams {
	readonly interactions: ReturnType<typeof useComboboxInteractions>;
	readonly label: string | undefined;
	readonly error: string | undefined;
	readonly helperText: string | undefined;
	readonly required: boolean | undefined;
	readonly fullWidth: boolean;
	readonly inputValue: string;
	readonly setInputValue: (value: string) => void;
	readonly filteredOptions: ComboboxOption[];
	readonly maxHeight: number;
	readonly emptyState: ReactNode;
	readonly menuId: string;
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
	filteredOptions: ComboboxOption[];
}) {
	return {
		inputValue: params.inputValue,
		setInputValue: params.setInputValue,
		filteredOptions: params.filteredOptions,
	};
}

function buildInteractionProps(interactions: BuildAllComboboxPropsParams['interactions']) {
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

function combineComboboxProps(params: {
	state: ReturnType<typeof useComboboxState>;
	fieldProps: ReturnType<typeof createFieldProps>;
	formProps: ReturnType<typeof buildFormProps>;
	inputProps: ReturnType<typeof buildInputProps>;
	interactionProps: ReturnType<typeof buildInteractionProps>;
	uiProps: ReturnType<typeof buildUIProps>;
}): ComboboxContentProps {
	return {
		state: params.state,
		fieldProps: params.fieldProps,
		...params.formProps,
		...params.inputProps,
		...params.interactionProps,
		...params.uiProps,
	};
}

function buildFormPropsForCombobox(params: BuildAllComboboxPropsParams) {
	return buildFormProps({
		label: params.label,
		error: params.error,
		helperText: params.helperText,
		required: params.required,
		fullWidth: params.fullWidth,
	});
}

function buildInputPropsForCombobox(params: BuildAllComboboxPropsParams) {
	return buildInputProps({
		inputValue: params.inputValue,
		setInputValue: params.setInputValue,
		filteredOptions: params.filteredOptions,
	});
}

function buildUIPropsForCombobox(params: BuildAllComboboxPropsParams) {
	return buildUIProps({
		maxHeight: params.maxHeight,
		emptyState: params.emptyState,
		menuId: params.menuId,
	});
}

function buildAllComboboxProps(params: BuildAllComboboxPropsParams) {
	return {
		formProps: buildFormPropsForCombobox(params),
		inputProps: buildInputPropsForCombobox(params),
		interactionProps: buildInteractionProps(params.interactions),
		uiProps: buildUIPropsForCombobox(params),
	};
}

export function buildComboboxReturn(params: {
	state: ReturnType<typeof useComboboxState>;
	fieldProps: ReturnType<typeof createFieldProps>;
	interactions: BuildAllComboboxPropsParams['interactions'];
	label: string | undefined;
	error: string | undefined;
	helperText: string | undefined;
	required: boolean | undefined;
	fullWidth: boolean;
	inputValue: string;
	setInputValue: (value: string) => void;
	filteredOptions: ComboboxOption[];
	maxHeight: number;
	emptyState: ReactNode;
	menuId: string;
}): ComboboxContentProps {
	const { formProps, inputProps, interactionProps, uiProps } = buildAllComboboxProps(params);
	return combineComboboxProps({
		state: params.state,
		fieldProps: params.fieldProps,
		formProps,
		inputProps,
		interactionProps,
		uiProps,
	});
}
