import type { AdvancedFilter } from '@src-types/ui/advancedFilter';

const EMPTY_STRING = '';
const FILTER_TYPE_TEXT = 'text';
const FILTER_TYPE_SELECT = 'select';
const FILTER_TYPE_DATE = 'date';
const FILTER_TYPE_MULTI_SELECT = 'multi-select';
const FILTER_TYPE_DATE_RANGE = 'date-range';

/**
 * Checks if a text/select/date filter has an active value
 */
function isSimpleFilterActive(value: string | undefined): boolean {
	return Boolean(value && value.trim() !== EMPTY_STRING);
}

/**
 * Checks if a filter has an active value
 */
export function isFilterActive(filter: AdvancedFilter): boolean {
	switch (filter.type) {
		case FILTER_TYPE_TEXT:
		case FILTER_TYPE_SELECT:
		case FILTER_TYPE_DATE: {
			return isSimpleFilterActive(filter.value);
		}
		case FILTER_TYPE_MULTI_SELECT: {
			return Boolean(filter.value && filter.value.length > 0);
		}
		case FILTER_TYPE_DATE_RANGE: {
			return isSimpleFilterActive(filter.startValue) || isSimpleFilterActive(filter.endValue);
		}
		default: {
			return false;
		}
	}
}

/**
 * Gets active filters from a list of filters
 */
export function getActiveFilters(filters: AdvancedFilter[]): AdvancedFilter[] {
	return filters.filter(filter => isFilterActive(filter));
}
