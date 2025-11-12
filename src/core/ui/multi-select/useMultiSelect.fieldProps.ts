import type { KeyboardEvent } from 'react';

import type { MultiSelectProps } from './MultiSelect';
import type { useMultiSelectState } from './MultiSelectHelpers';
import type { MultiSelectFieldProps } from './MultiSelectTypes';
import { createInputEventHandlers } from './useMultiSelect.handlers';
import type { MultiSelectStateSetup } from './useMultiSelect.setup';
import type { useMultiSelectInteractions } from './useMultiSelectState';

interface CreateMultiSelectFieldPropsParams {
	readonly state: ReturnType<typeof useMultiSelectState>;
	readonly disabled: boolean | undefined;
	readonly required: boolean | undefined;
	readonly placeholder: string | undefined;
	readonly rest: Omit<
		MultiSelectProps,
		| 'label'
		| 'error'
		| 'helperText'
		| 'size'
		| 'fullWidth'
		| 'required'
		| 'multiSelectId'
		| 'className'
		| 'disabled'
		| 'placeholder'
		| 'maxHeight'
		| 'emptyState'
	>;
	readonly inputValue: string;
	readonly setInputValue: (value: string) => void;
	readonly setIsOpen: (open: boolean) => void;
	readonly setHighlightedIndex: (index: number) => void;
	readonly handleKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
}

function buildFieldPropsObject(params: CreateMultiSelectFieldPropsParams) {
	const eventHandlers = createInputEventHandlers({
		inputValue: params.inputValue,
		setInputValue: params.setInputValue,
		setIsOpen: params.setIsOpen,
		handleKeyDown: params.handleKeyDown,
	});

	return {
		...params.rest,
		placeholder: params.placeholder,
		...eventHandlers,
	} as MultiSelectFieldProps['props'];
}

function createMultiSelectFieldProps(
	params: CreateMultiSelectFieldPropsParams
): MultiSelectFieldProps {
	return {
		id: params.state.finalId,
		className: params.state.inputClasses,
		hasError: params.state.hasError,
		ariaDescribedBy: params.state.ariaDescribedBy,
		disabled: params.disabled,
		required: params.required,
		props: buildFieldPropsObject(params),
	};
}

export function buildMultiSelectFieldPropsFromState(params: {
	readonly state: ReturnType<typeof useMultiSelectState>;
	readonly disabled: boolean | undefined;
	readonly required: boolean | undefined;
	readonly placeholder: string | undefined;
	readonly rest: Omit<
		MultiSelectProps,
		| 'label'
		| 'error'
		| 'helperText'
		| 'size'
		| 'fullWidth'
		| 'required'
		| 'multiSelectId'
		| 'className'
		| 'disabled'
		| 'placeholder'
		| 'maxHeight'
		| 'emptyState'
	>;
	readonly stateSetup: MultiSelectStateSetup;
	readonly interactions: ReturnType<typeof useMultiSelectInteractions>;
}): MultiSelectFieldProps {
	return createMultiSelectFieldProps({
		state: params.state,
		disabled: params.disabled,
		required: params.required,
		placeholder: params.placeholder,
		rest: params.rest,
		inputValue: params.stateSetup.inputValue,
		setInputValue: params.stateSetup.setInputValue,
		setIsOpen: params.interactions.setIsOpen,
		setHighlightedIndex: params.interactions.setHighlightedIndex,
		handleKeyDown: params.interactions.handleKeyDown,
	});
}
