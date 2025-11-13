import type { ComboboxOption } from '@core/ui/forms/combobox/Combobox';

export function getOptionLabel(option: ComboboxOption): string {
	if (typeof option.label === 'string') {
		return option.label;
	}
	if (typeof option.label === 'number' || typeof option.label === 'boolean') {
		return String(option.label);
	}
	return '';
}

export function findNextEnabledIndex(
	options: ComboboxOption[],
	startIndex: number,
	direction: 1 | -1
): number {
	let index = startIndex;
	const total = options.length;

	for (let i = 0; i < total; i += 1) {
		index = (index + direction + total) % total;
		if (!options[index]?.disabled) {
			return index;
		}
	}

	return -1;
}
