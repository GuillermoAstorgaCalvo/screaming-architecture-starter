import type { extractMultiSelectProps } from '@core/ui/forms/multi-select/helpers/MultiSelectHelpers';
import type {
	MultiSelectData,
	MultiSelectStateSetup,
} from '@core/ui/forms/multi-select/hooks/useMultiSelect.setup';
import type { MultiSelectOption } from '@core/ui/forms/multi-select/MultiSelect';
import type {
	MultiSelectContentProps,
	MultiSelectFieldProps,
} from '@core/ui/forms/multi-select/types/MultiSelectTypes';

export function buildMultiSelectContentProps(params: {
	readonly extracted: ReturnType<typeof extractMultiSelectProps>;
	readonly stateSetup: MultiSelectStateSetup;
	readonly interactions: MultiSelectData['interactions'];
	readonly fieldProps: MultiSelectFieldProps;
	readonly menuId: string;
	readonly options: MultiSelectOption[];
}): MultiSelectContentProps {
	return {
		state: params.stateSetup.state,
		fieldProps: params.fieldProps,
		label: params.extracted.label,
		error: params.extracted.error,
		helperText: params.extracted.helperText,
		required: params.extracted.required,
		fullWidth: params.extracted.fullWidth,
		inputValue: params.stateSetup.inputValue,
		setInputValue: params.stateSetup.setInputValue,
		isOpen: params.interactions.isOpen,
		setIsOpen: params.interactions.setIsOpen,
		filteredOptions: params.stateSetup.filteredOptions,
		highlightedIndex: params.interactions.highlightedIndex,
		setHighlightedIndex: params.interactions.setHighlightedIndex,
		handleSelect: params.interactions.handleSelect,
		handleKeyDown: params.interactions.handleKeyDown,
		inputRef: params.interactions.inputRef,
		listboxRef: params.interactions.listboxRef,
		optionRefs: params.interactions.optionRefs,
		maxHeight: params.extracted.maxHeight,
		emptyState: params.extracted.emptyState,
		menuId: params.menuId,
		selectedValues: params.stateSetup.value,
		allOptions: params.options,
		setValue: params.stateSetup.setValue,
	};
}
