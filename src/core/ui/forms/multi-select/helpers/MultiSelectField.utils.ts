import type { MultiSelectOption } from '@core/ui/forms/multi-select/MultiSelect';

export function isOptionSelected(option: MultiSelectOption, selectedValues: string[]): boolean {
	return selectedValues.includes(option.value);
}

export function getSelectedOptions(
	options: MultiSelectOption[],
	selectedValues: string[]
): MultiSelectOption[] {
	return options.filter(opt => isOptionSelected(opt, selectedValues));
}
