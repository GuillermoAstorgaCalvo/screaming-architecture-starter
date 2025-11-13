import type { AdvancedFilterConfig } from '@src-types/ui/advancedFilter';

import { AdvancedFilterBarContent } from './AdvancedFilterBarContent';
import { useAdvancedFilterBar } from './useAdvancedFilterBar';

export interface AdvancedFilterBarProps extends AdvancedFilterConfig {
	/** Additional className */
	className?: string;
	/** Size variant @default 'md' */
	size?: 'sm' | 'md' | 'lg';
	/** Whether the filter bar is disabled */
	disabled?: boolean;
}

/**
 * AdvancedFilterBar - Standalone advanced filter bar component
 *
 * Features:
 * - Multiple filter types: text, select, multi-select, date, date-range
 * - Filter chips to display active filters
 * - Filter builder UI to add/remove filters
 * - Full integration with DataTableFilter type
 *
 * @example
 * ```tsx
 * <AdvancedFilterBar
 *   filters={[
 *     { id: 'name', label: 'Name', type: 'text', value: '' },
 *     { id: 'status', label: 'Status', type: 'select', options: [...], value: '' },
 *   ]}
 *   onFiltersChange={(filters) => handleFiltersChange(filters)}
 *   showFilterChips
 *   showFilterBuilder
 * />
 * ```
 */
export function AdvancedFilterBar({
	filters,
	onFiltersChange,
	showFilterChips = true,
	showFilterBuilder = true,
	renderFilterChip,
	className,
	size = 'md',
	disabled = false,
}: Readonly<AdvancedFilterBarProps>) {
	const {
		isBuilderOpen,
		activeFilterValues,
		handleFilterChange,
		handleRemoveFilter,
		handleClearAllFilters,
		toggleBuilder,
	} = useAdvancedFilterBar({ filters, onFiltersChange });

	return (
		<AdvancedFilterBarContent
			filters={filters}
			activeFilterValues={activeFilterValues}
			onFilterChange={handleFilterChange}
			onRemoveFilter={handleRemoveFilter}
			onClearAllFilters={handleClearAllFilters}
			showFilterChips={showFilterChips}
			showFilterBuilder={showFilterBuilder}
			renderFilterChip={renderFilterChip}
			size={size}
			disabled={disabled}
			isBuilderOpen={isBuilderOpen}
			onToggleBuilder={toggleBuilder}
			onFiltersChange={onFiltersChange}
			className={className}
		/>
	);
}
