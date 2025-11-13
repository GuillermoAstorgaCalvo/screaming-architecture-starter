import type { TransferOption } from '@src-types/ui/data/transfer';

import type { FilterOptionsParams } from './useTransfer.types';

/**
 * Computes source and target options based on current value
 */
export function computeSourceAndTargetOptions<T>(
	options: readonly TransferOption<T>[],
	currentValue: string[]
): { sourceOptions: TransferOption<T>[]; targetOptions: TransferOption<T>[] } {
	const valueSet = new Set(currentValue);
	const source: TransferOption<T>[] = [];
	const target: TransferOption<T>[] = [];

	for (const option of options) {
		if (valueSet.has(option.value)) {
			target.push(option);
		} else {
			source.push(option);
		}
	}

	return { sourceOptions: source, targetOptions: target };
}

/**
 * Filters options based on search value
 */
export function filterOptions<T>(params: FilterOptionsParams<T>): readonly TransferOption<T>[] {
	const { options, searchValue, showSearch, filterFn } = params;
	if (!showSearch || !searchValue.trim()) {
		return options;
	}

	if (filterFn) {
		return options.filter(option => filterFn(option, searchValue));
	}

	const searchLower = searchValue.toLowerCase();
	return options.filter(option => {
		if (typeof option.label === 'string') {
			return option.label.toLowerCase().includes(searchLower);
		}
		if (typeof option.label === 'number') {
			return String(option.label).toLowerCase().includes(searchLower);
		}
		// For ReactNode that isn't string/number (e.g., React elements), skip filtering
		// as we can't reliably extract searchable text from them
		return false;
	});
}
