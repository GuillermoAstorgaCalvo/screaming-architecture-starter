import { useId } from 'react';

import type { MultiSelectOption, MultiSelectProps } from './MultiSelect';
import { useMultiSelectState } from './MultiSelectHelpers';
import {
	useMultiSelectInput,
	useMultiSelectInteractions,
	useMultiSelectValue,
} from './useMultiSelectState';

export interface MultiSelectStateSetup {
	readonly state: ReturnType<typeof useMultiSelectState>;
	readonly value: string[];
	readonly setValue: (value: string[]) => void;
	readonly inputValue: string;
	readonly setInputValue: (value: string) => void;
	readonly filteredOptions: MultiSelectOption[];
}

export interface MultiSelectData {
	readonly interactions: ReturnType<typeof useMultiSelectInteractions>;
	readonly menuId: string;
}

export function useMultiSelectStateSetup(props: Readonly<MultiSelectProps>): MultiSelectStateSetup {
	const {
		multiSelectId,
		label,
		error,
		helperText,
		size = 'md',
		className,
		options,
		filterFn,
		onInputChange,
	} = props;
	const state = useMultiSelectState({ multiSelectId, label, error, helperText, size, className });
	const { value, setValue } = useMultiSelectValue(props);
	const inputProps = {
		options,
		filterFn,
		onInputChange,
	} as Readonly<Pick<MultiSelectProps, 'options' | 'filterFn' | 'onInputChange'>>;
	const { inputValue, setInputValue, filteredOptions } = useMultiSelectInput(inputProps, value);
	return { state, value, setValue, inputValue, setInputValue, filteredOptions };
}

export function useMultiSelectData(
	props: Readonly<MultiSelectProps>,
	stateSetup: MultiSelectStateSetup
): MultiSelectData {
	const interactions = useMultiSelectInteractions({
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
