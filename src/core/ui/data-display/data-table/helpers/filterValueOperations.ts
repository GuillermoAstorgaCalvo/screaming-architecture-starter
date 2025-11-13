import type { AdvancedFilter } from '@src-types/ui/advancedFilter';

const EMPTY_STRING = '';
const FILTER_TYPE_TEXT = 'text';
const FILTER_TYPE_SELECT = 'select';
const FILTER_TYPE_DATE = 'date';
const FILTER_TYPE_MULTI_SELECT = 'multi-select';
const FILTER_TYPE_DATE_RANGE = 'date-range';

type SimpleValueFilter = Extract<AdvancedFilter, { type: 'text' | 'select' | 'date' }>;
type MultiSelectFilter = Extract<AdvancedFilter, { type: 'multi-select' }>;
type DateRangeFilter = Extract<AdvancedFilter, { type: 'date-range' }>;

interface DateRangeValue {
	start?: string | null;
	end?: string | null;
}

/**
 * Simple string type guard
 */
function isString(value: unknown): value is string {
	return typeof value === 'string';
}

/**
 * Resolve a date part to a usable string
 */
function resolveDatePart(next: string | null | undefined, current: string | undefined): string {
	if (typeof next === 'string') {
		return next;
	}

	if (typeof current === 'string') {
		return current;
	}

	return EMPTY_STRING;
}

/**
 * Type guard for a valid date range payload
 */
function isDateRangeValue(value: unknown): value is DateRangeValue {
	return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Resets a filter to its default empty state
 */
export function resetFilter(filter: AdvancedFilter): AdvancedFilter {
	switch (filter.type) {
		case FILTER_TYPE_TEXT:
		case FILTER_TYPE_SELECT:
		case FILTER_TYPE_DATE: {
			return { ...filter, value: EMPTY_STRING };
		}
		case FILTER_TYPE_MULTI_SELECT: {
			return { ...filter, value: [] };
		}
		case FILTER_TYPE_DATE_RANGE: {
			return { ...filter, startValue: EMPTY_STRING, endValue: EMPTY_STRING };
		}
		default: {
			return filter;
		}
	}
}

/**
 * Update helper for text/select/date filters
 */
function updateSimpleFilterValue(filter: SimpleValueFilter, newValue: unknown): SimpleValueFilter {
	const value = typeof newValue === 'string' ? newValue : (filter.value ?? EMPTY_STRING);
	return { ...filter, value };
}

/**
 * Update helper for multi-select filters
 */
function updateMultiSelectFilter(filter: MultiSelectFilter, newValue: unknown): MultiSelectFilter {
	const value = Array.isArray(newValue)
		? newValue.filter(item => isString(item))
		: (filter.value ?? []);
	return { ...filter, value };
}

/**
 * Update helper for date-range filters
 */
function updateDateRangeFilter(filter: DateRangeFilter, newValue: unknown): DateRangeFilter {
	const range = isDateRangeValue(newValue) ? newValue : undefined;
	return {
		...filter,
		startValue: resolveDatePart(range?.start ?? undefined, filter.startValue),
		endValue: resolveDatePart(range?.end ?? undefined, filter.endValue),
	};
}

/**
 * Updates a filter with a new value
 */
export function updateFilterValue(filter: AdvancedFilter, newValue: unknown): AdvancedFilter {
	switch (filter.type) {
		case FILTER_TYPE_TEXT:
		case FILTER_TYPE_SELECT:
		case FILTER_TYPE_DATE: {
			return updateSimpleFilterValue(filter, newValue);
		}
		case FILTER_TYPE_MULTI_SELECT: {
			return updateMultiSelectFilter(filter, newValue);
		}
		case FILTER_TYPE_DATE_RANGE: {
			return updateDateRangeFilter(filter, newValue);
		}
		default: {
			return filter;
		}
	}
}
