import type { ActiveFilterValue, AdvancedFilter } from '@src-types/ui/advancedFilter';
import type { ReactNode } from 'react';

import { reactNodeToString } from './filterUtils';

const EMPTY_STRING = '';
const FILTER_TYPE_TEXT = 'text';
const FILTER_TYPE_SELECT = 'select';
const FILTER_TYPE_DATE = 'date';
const FILTER_TYPE_MULTI_SELECT = 'multi-select';
const FILTER_TYPE_DATE_RANGE = 'date-range';

/**
 * Computes display value for text filter
 */
function getTextDisplayValue(value: string | undefined): string {
	return value ?? EMPTY_STRING;
}

/**
 * Computes display value for select filter
 */
function getSelectDisplayValue(
	value: string | undefined,
	options: Array<{ value: string; label: ReactNode }>
): string {
	if (!value) return EMPTY_STRING;
	const option = options.find(opt => opt.value === value);
	return option ? reactNodeToString(option.label) : value;
}

/**
 * Computes display value for multi-select filter
 */
function getMultiSelectDisplayValue(
	value: string[] | undefined,
	options: Array<{ value: string; label: ReactNode }>
): string {
	if (!value || value.length === 0) return EMPTY_STRING;
	const selectedOptions = options.filter(opt => value.includes(opt.value));
	return selectedOptions.map(opt => reactNodeToString(opt.label)).join(', ');
}

/**
 * Computes display value for date filter
 */
function getDateDisplayValue(value: string | undefined): string {
	return value ? new Date(value).toLocaleDateString() : EMPTY_STRING;
}

/**
 * Computes display value for date-range filter
 */
function getDateRangeDisplayValue(
	startValue: string | undefined,
	endValue: string | undefined
): string {
	const start = getDateDisplayValue(startValue);
	const end = getDateDisplayValue(endValue);
	return start && end ? `${start} - ${end}` : start || end;
}

/**
 * Computes display value for a filter
 */
function getFilterDisplayValue(filter: AdvancedFilter): string {
	switch (filter.type) {
		case FILTER_TYPE_TEXT: {
			return getTextDisplayValue(filter.value);
		}
		case FILTER_TYPE_SELECT: {
			return getSelectDisplayValue(filter.value, filter.options);
		}
		case FILTER_TYPE_MULTI_SELECT: {
			return getMultiSelectDisplayValue(filter.value, filter.options);
		}
		case FILTER_TYPE_DATE: {
			return getDateDisplayValue(filter.value);
		}
		case FILTER_TYPE_DATE_RANGE: {
			return getDateRangeDisplayValue(filter.startValue, filter.endValue);
		}
		default: {
			return EMPTY_STRING;
		}
	}
}

/**
 * Gets the raw value for a filter
 */
function getFilterValue(filter: AdvancedFilter): unknown {
	switch (filter.type) {
		case FILTER_TYPE_TEXT:
		case FILTER_TYPE_SELECT:
		case FILTER_TYPE_DATE: {
			return filter.value;
		}
		case FILTER_TYPE_MULTI_SELECT: {
			return filter.value;
		}
		case FILTER_TYPE_DATE_RANGE: {
			const { startValue, endValue } = filter;
			return { start: startValue, end: endValue };
		}
		default: {
			return null;
		}
	}
}

/**
 * Converts active filters to ActiveFilterValue array
 */
export function getActiveFilterValues(filters: AdvancedFilter[]): ActiveFilterValue[] {
	return filters.map(filter => ({
		filterId: filter.id,
		label: filter.label,
		displayValue: getFilterDisplayValue(filter),
		value: getFilterValue(filter),
	}));
}
