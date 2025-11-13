import type {
	AdvancedFilter,
	AdvancedFilterType,
	DateAdvancedFilter,
	DateRangeAdvancedFilter,
	MultiSelectAdvancedFilter,
	SelectAdvancedFilter,
	TextAdvancedFilter,
} from '@src-types/ui/advancedFilter';

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
function isSimpleValueFilterActive(
	filter: TextAdvancedFilter | SelectAdvancedFilter | DateAdvancedFilter
): boolean {
	return isSimpleFilterActive(filter.value);
}

function isMultiSelectFilterActive(filter: MultiSelectAdvancedFilter): boolean {
	return Boolean(filter.value?.some(value => isSimpleFilterActive(value)));
}

function isDateRangeFilterActive(filter: DateRangeAdvancedFilter): boolean {
	return isSimpleFilterActive(filter.startValue) || isSimpleFilterActive(filter.endValue);
}

const FILTER_ACTIVE_CHECKERS: Record<AdvancedFilterType, (filter: AdvancedFilter) => boolean> = {
	[FILTER_TYPE_TEXT]: filter => isSimpleValueFilterActive(filter as TextAdvancedFilter),
	[FILTER_TYPE_SELECT]: filter => isSimpleValueFilterActive(filter as SelectAdvancedFilter),
	[FILTER_TYPE_DATE]: filter => isSimpleValueFilterActive(filter as DateAdvancedFilter),
	[FILTER_TYPE_MULTI_SELECT]: filter =>
		isMultiSelectFilterActive(filter as MultiSelectAdvancedFilter),
	[FILTER_TYPE_DATE_RANGE]: filter => isDateRangeFilterActive(filter as DateRangeAdvancedFilter),
};

export function isFilterActive(filter: AdvancedFilter): boolean {
	return FILTER_ACTIVE_CHECKERS[filter.type](filter);
}

/**
 * Gets active filters from a list of filters
 */
export function getActiveFilters(filters: AdvancedFilter[]): AdvancedFilter[] {
	return filters.filter(filter => isFilterActive(filter));
}
