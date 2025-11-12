import type { ReactNode } from 'react';

/**
 * Filter types supported by AdvancedFilterBar
 */
export type AdvancedFilterType = 'text' | 'select' | 'multi-select' | 'date' | 'date-range';

/**
 * Base filter definition
 */
export interface BaseAdvancedFilter {
	/** Unique identifier for the filter */
	id: string;
	/** Label/name for the filter */
	label: string;
	/** Filter type */
	type: AdvancedFilterType;
	/** Column ID this filter applies to (optional) */
	columnId?: string;
}

/**
 * Text filter definition
 */
export interface TextAdvancedFilter extends BaseAdvancedFilter {
	type: 'text';
	/** Placeholder text */
	placeholder?: string;
	/** Current value */
	value?: string;
}

/**
 * Select option
 */
export interface SelectOption {
	value: string;
	label: ReactNode;
	disabled?: boolean;
}

/**
 * Select filter definition
 */
export interface SelectAdvancedFilter extends BaseAdvancedFilter {
	type: 'select';
	/** Available options */
	options: SelectOption[];
	/** Placeholder text */
	placeholder?: string;
	/** Current value */
	value?: string;
}

/**
 * Multi-select filter definition
 */
export interface MultiSelectAdvancedFilter extends BaseAdvancedFilter {
	type: 'multi-select';
	/** Available options */
	options: SelectOption[];
	/** Placeholder text */
	placeholder?: string;
	/** Current values */
	value?: string[];
}

/**
 * Date filter definition
 */
export interface DateAdvancedFilter extends BaseAdvancedFilter {
	type: 'date';
	/** Minimum date (ISO string) */
	minDate?: string;
	/** Maximum date (ISO string) */
	maxDate?: string;
	/** Current value */
	value?: string;
}

/**
 * Date range filter definition
 */
export interface DateRangeAdvancedFilter extends BaseAdvancedFilter {
	type: 'date-range';
	/** Minimum date for start (ISO string) */
	startMin?: string;
	/** Maximum date for start (ISO string) */
	startMax?: string;
	/** Minimum date for end (ISO string) */
	endMin?: string;
	/** Maximum date for end (ISO string) */
	endMax?: string;
	/** Current start value */
	startValue?: string;
	/** Current end value */
	endValue?: string;
}

/**
 * Union type for all advanced filter types
 */
export type AdvancedFilter =
	| TextAdvancedFilter
	| SelectAdvancedFilter
	| MultiSelectAdvancedFilter
	| DateAdvancedFilter
	| DateRangeAdvancedFilter;

/**
 * Extended filter configuration that supports advanced filters
 */
export interface AdvancedFilterConfig {
	/** Available filter definitions */
	filters: AdvancedFilter[];
	/** Callback when filters change */
	onFiltersChange?: (filters: AdvancedFilter[]) => void;
	/** Whether to show filter chips */
	showFilterChips?: boolean;
	/** Whether to show filter builder */
	showFilterBuilder?: boolean;
	/** Custom render function for filter chips */
	renderFilterChip?: (filter: ActiveFilterValue) => ReactNode;
}

/**
 * Active filter value for display in chips
 */
export interface ActiveFilterValue {
	filterId: string;
	label: string;
	displayValue: string;
	value: unknown;
}
