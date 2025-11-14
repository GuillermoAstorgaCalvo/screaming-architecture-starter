import i18n from '@core/i18n/i18n';
import type { ComboboxProps } from '@core/ui/forms/combobox/Combobox';
import { useComboboxState } from '@core/ui/forms/combobox/helpers/ComboboxHelpers';
import { createFieldProps } from '@core/ui/forms/combobox/hooks/useComboboxField';
import { buildComboboxReturn } from '@core/ui/forms/combobox/hooks/useComboboxReturn';
import {
	useComboboxInput,
	useComboboxInteractions,
	useComboboxValue,
} from '@core/ui/forms/combobox/hooks/useComboboxState';
import type { ComboboxContentProps } from '@core/ui/forms/combobox/types/ComboboxTypes';
import { useId } from 'react';

function useComboboxStateSetup(props: Readonly<ComboboxProps>) {
	const { comboboxId, label, error, helperText, size = 'md', className } = props;
	const state = useComboboxState({ comboboxId, label, error, helperText, size, className });
	const { value, setValue } = useComboboxValue(props);
	const { inputValue, setInputValue, filteredOptions } = useComboboxInput(props, value, setValue);
	return { state, value, setValue, inputValue, setInputValue, filteredOptions };
}

function useComboboxData(
	props: Readonly<ComboboxProps>,
	stateSetup: ReturnType<typeof useComboboxStateSetup>
) {
	const interactions = useComboboxInteractions({
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

function buildComboboxFieldProps(params: {
	state: ReturnType<typeof useComboboxState>;
	disabled: boolean | undefined;
	required: boolean | undefined;
	placeholder: string | undefined;
	rest: Omit<
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
	inputValue: string;
	setInputValue: (value: string) => void;
	setIsOpen: (open: boolean) => void;
	setHighlightedIndex: (index: number) => void;
}) {
	return createFieldProps(params);
}

function extractComboboxProps(props: Readonly<ComboboxProps>) {
	const {
		label,
		error,
		helperText,
		fullWidth = false,
		required,
		disabled,
		placeholder,
		maxHeight = 280,
		emptyState,
		...rest
	} = props;
	const defaultEmptyState = emptyState ?? i18n.t('common.noOptionsFound', { ns: 'common' });
	return {
		label,
		error,
		helperText,
		fullWidth,
		required,
		disabled,
		placeholder,
		maxHeight,
		emptyState: defaultEmptyState,
		rest,
	};
}

function buildComboboxFieldPropsFromState(params: {
	state: ReturnType<typeof useComboboxState>;
	disabled: boolean | undefined;
	required: boolean | undefined;
	placeholder: string | undefined;
	rest: Omit<
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
	stateSetup: ReturnType<typeof useComboboxStateSetup>;
	interactions: ReturnType<typeof useComboboxInteractions>;
}) {
	return buildComboboxFieldProps({
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

export function useCombobox(props: Readonly<ComboboxProps>): ComboboxContentProps {
	const extracted = extractComboboxProps(props);
	const stateSetup = useComboboxStateSetup(props);
	const { interactions, menuId } = useComboboxData(props, stateSetup);
	const fieldProps = buildComboboxFieldPropsFromState({
		state: stateSetup.state,
		disabled: extracted.disabled,
		required: extracted.required,
		placeholder: extracted.placeholder,
		rest: extracted.rest,
		stateSetup,
		interactions,
	});
	return buildComboboxReturn({
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
	});
}
