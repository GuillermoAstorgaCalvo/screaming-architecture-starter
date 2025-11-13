import type { MultiSelectOption } from './MultiSelect';

export function getOptionLabel(option: MultiSelectOption): string {
	if (typeof option.label === 'string') {
		return option.label;
	}
	if (typeof option.label === 'number' || typeof option.label === 'boolean') {
		return String(option.label);
	}
	return '';
}

export function findNextEnabledIndex(
	options: MultiSelectOption[],
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
