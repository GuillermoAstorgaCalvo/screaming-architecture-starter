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
	const start = filter.startValue ?? '';
	const end = filter.endValue ?? '';

	if (start !== '' || end !== '') {
		advancedFilters[filter.id] = { start, end };
	}
}

const filterConverters: Record<
	AdvancedFilter['type'],
	(filter: AdvancedFilter, advancedFilters: Record<string, AdvancedFilterValue>) => void
> = {
	text: (filter, advancedFilters) =>
		convertTextFilter(filter as AdvancedFilter & { type: 'text' }, advancedFilters),
	select: (filter, advancedFilters) =>
		convertSingleValueFilter(filter as AdvancedFilter & { type: 'select' }, advancedFilters),
	date: (filter, advancedFilters) =>
		convertSingleValueFilter(filter as AdvancedFilter & { type: 'date' }, advancedFilters),
	'multi-select': (filter, advancedFilters) =>
		convertMultiSelectFilter(filter as AdvancedFilter & { type: 'multi-select' }, advancedFilters),
	'date-range': (filter, advancedFilters) =>
		convertDateRangeFilter(filter as AdvancedFilter & { type: 'date-range' }, advancedFilters),
};

/**
 * Converts AdvancedFilter array to DataTableFilter format
 */
export function advancedFiltersToDataTableFilter(
	filters: AdvancedFilter[]
): DataTableFilter['advancedFilters'] | undefined {
	const advancedFilters: Record<string, AdvancedFilterValue> = {};

	for (const filter of filters) {
		filterConverters[filter.type](filter, advancedFilters);
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

const filterAppliers: Record<
	AdvancedFilter['type'],
	<T>(row: T, filterValue: AdvancedFilterValue, filter: AdvancedFilter) => boolean
> = {
	text: (row, value) => applyTextFilter(row, value as string),
	select: (row, value) => applySingleValueFilter(row, value as string),
	date: (row, value) => applySingleValueFilter(row, value as string),
	'multi-select': (row, value) => applyMultiSelectFilter(row, value as string[]),
	'date-range': (row, value) => applyDateRangeFilter(row, value as { start: string; end: string }),
};

/**
 * Applies advanced filters to data
 */
export function applyAdvancedFilters<T>(
	data: T[],
	advancedFilters: DataTableFilter['advancedFilters'] | undefined,
	filters: AdvancedFilter[]
): T[] {
	if (!advancedFilters || Object.keys(advancedFilters).length === 0) {
		return data;
	}

	return data.filter(row => {
		return filters.every(filter => {
			const filterValue = advancedFilters[filter.id];
			if (filterValue === undefined) return true; // Filter not set, include row

			return filterAppliers[filter.type](row, filterValue, filter);
		});
	});
}
