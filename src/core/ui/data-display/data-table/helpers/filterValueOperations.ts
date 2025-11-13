import type { AdvancedFilter } from '@src-types/ui/advancedFilter';

const EMPTY_STRING = '';
const FILTER_TYPE_TEXT = 'text';
const FILTER_TYPE_SELECT = 'select';
const FILTER_TYPE_DATE = 'date';
const FILTER_TYPE_MULTI_SELECT = 'multi-select';
const FILTER_TYPE_DATE_RANGE = 'date-range';

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
 * Updates a filter with a new value
 */
export function updateFilterValue(filter: AdvancedFilter, newValue: unknown): AdvancedFilter {
	switch (filter.type) {
		case FILTER_TYPE_TEXT:
		case FILTER_TYPE_SELECT:
		case FILTER_TYPE_DATE: {
			return { ...filter, value: newValue as string };
		}
		case FILTER_TYPE_MULTI_SELECT: {
			return { ...filter, value: newValue as string[] };
		}
		case FILTER_TYPE_DATE_RANGE: {
			const range = newValue as { start?: string; end?: string };
			return {
				...filter,
				startValue: range.start ?? filter.startValue ?? EMPTY_STRING,
				endValue: range.end ?? filter.endValue ?? EMPTY_STRING,
			};
		}
		default: {
			return filter;
		}
	}
}
