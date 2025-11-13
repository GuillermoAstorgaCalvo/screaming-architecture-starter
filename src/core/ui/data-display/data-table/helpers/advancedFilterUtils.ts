import type { AdvancedFilter } from '@src-types/ui/advancedFilter';
import type { DataTableFilter } from '@src-types/ui/dataTable';

type AdvancedFilterValue = string | string[] | { start: string; end: string };

/**
 * Helper to convert a single text filter value
 */
function convertTextFilter(
	filter: AdvancedFilter & { type: 'text' },
	advancedFilters: Record<string, AdvancedFilterValue>
): void {
	if (filter.value && filter.value.trim() !== '') {
		advancedFilters[filter.id] = filter.value;
	}
}

/**
 * Helper to convert a single select or date filter value
 */
function convertSingleValueFilter(
	filter: AdvancedFilter & { type: 'select' | 'date' },
	advancedFilters: Record<string, AdvancedFilterValue>
): void {
	if (filter.value && filter.value !== '') {
		advancedFilters[filter.id] = filter.value;
	}
}

/**
 * Helper to convert a single multi-select filter value
 */
function convertMultiSelectFilter(
	filter: AdvancedFilter & { type: 'multi-select' },
	advancedFilters: Record<string, AdvancedFilterValue>
): void {
	if (filter.value && filter.value.length > 0) {
		advancedFilters[filter.id] = filter.value;
	}
}

/**
 * Helper to convert a single date-range filter value
 */
function convertDateRangeFilter(
	filter: AdvancedFilter & { type: 'date-range' },
	advancedFilters: Record<string, AdvancedFilterValue>
): void {
	if (
		(filter.startValue && filter.startValue !== '') ||
		(filter.endValue && filter.endValue !== '')
	) {
		advancedFilters[filter.id] = {
			start: filter.startValue ?? '',
			end: filter.endValue ?? '',
		};
	}
}

/**
 * Converts AdvancedFilter array to DataTableFilter format
 */
export function advancedFiltersToDataTableFilter(
	filters: AdvancedFilter[]
): DataTableFilter['advancedFilters'] {
	const advancedFilters: Record<string, AdvancedFilterValue> = {};

	for (const filter of filters) {
		switch (filter.type) {
			case 'text': {
				convertTextFilter(filter, advancedFilters);
				break;
			}
			case 'select':
			case 'date': {
				convertSingleValueFilter(filter, advancedFilters);
				break;
			}
			case 'multi-select': {
				convertMultiSelectFilter(filter, advancedFilters);
				break;
			}
			case 'date-range': {
				convertDateRangeFilter(filter, advancedFilters);
				break;
			}
		}
	}

	return Object.keys(advancedFilters).length > 0 ? advancedFilters : undefined;
}

/**
 * Helper to apply a text filter to a row
 */
function applyTextFilter<T>(row: T, filterValue: string): boolean {
	const searchTerm = filterValue.toLowerCase();
	// This is a simple implementation - you may want to customize based on columnId
	return JSON.stringify(row).toLowerCase().includes(searchTerm);
}

/**
 * Helper to apply a select or date filter to a row
 */
function applySingleValueFilter<T>(row: T, filterValue: string): boolean {
	// This is a simple implementation - you may want to customize based on columnId
	return JSON.stringify(row).includes(filterValue);
}

/**
 * Helper to apply a multi-select filter to a row
 */
function applyMultiSelectFilter<T>(row: T, values: string[]): boolean {
	// This is a simple implementation - you may want to customize based on columnId
	return values.some(value => JSON.stringify(row).includes(value));
}

/**
 * Helper to apply a date-range filter to a row
 */
function applyDateRangeFilter<T>(row: T, range: { start: string; end: string }): boolean {
	// This is a simple implementation - you may want to customize based on columnId
	return (
		(!range.start || JSON.stringify(row).includes(range.start)) &&
		(!range.end || JSON.stringify(row).includes(range.end))
	);
}

/**
 * Applies advanced filters to data
 */
export function applyAdvancedFilters<T>(
	data: T[],
	advancedFilters: DataTableFilter['advancedFilters'],
	filters: AdvancedFilter[]
): T[] {
	if (!advancedFilters || Object.keys(advancedFilters).length === 0) {
		return data;
	}

	return data.filter(row => {
		return filters.every(filter => {
			const filterValue = advancedFilters[filter.id];
			if (!filterValue) return true; // Filter not set, include row

			switch (filter.type) {
				case 'text': {
					return applyTextFilter(row, filterValue as string);
				}
				case 'select':
				case 'date': {
					return applySingleValueFilter(row, filterValue as string);
				}
				case 'multi-select': {
					return applyMultiSelectFilter(row, filterValue as string[]);
				}
				case 'date-range': {
					return applyDateRangeFilter(row, filterValue as { start: string; end: string });
				}
				default: {
					return true;
				}
			}
		});
	});
}
