import {
	FilterBuilderClosed,
	FilterBuilderHeader,
} from '@core/ui/data-display/data-table/components/advanced-filter/FilterBuilderHeader';
import { AddFilterForm } from '@core/ui/data-display/data-table/components/advanced-filter/FilterFormComponents';
import { FilterList } from '@core/ui/data-display/data-table/components/advanced-filter/FilterList';
import { useFilterBuilder } from '@core/ui/data-display/data-table/hooks/useFilterBuilder';
import type { AdvancedFilter } from '@src-types/ui/advancedFilter';

export interface FilterBuilderProps {
	/** Whether the builder is open */
	readonly isOpen: boolean;
	/** Callback to toggle builder open/close */
	readonly onToggle: () => void;
	/** Current filters */
	readonly filters: AdvancedFilter[];
	/** Callback when filters change */
	readonly onFiltersChange?: (filters: AdvancedFilter[]) => void;
	/** Whether the builder is disabled */
	readonly disabled?: boolean;
}

/**
 * FilterBuilder - UI component for adding/removing filters
 *
 * Features:
 * - Add new filters
 * - Remove existing filters
 * - Collapsible UI
 *
 * @example
 * ```tsx
 * <FilterBuilder
 *   isOpen={isOpen}
 *   onToggle={() => setIsOpen(!isOpen)}
 *   filters={filters}
 *   onFiltersChange={(filters) => handleChange(filters)}
 * />
 * ```
 */
export function FilterBuilder({
	isOpen,
	onToggle,
	filters,
	onFiltersChange,
	disabled = false,
}: FilterBuilderProps) {
	const {
		newFilterType,
		newFilterLabel,
		setNewFilterType,
		setNewFilterLabel,
		handleAddFilter,
		handleRemoveFilter,
	} = useFilterBuilder({ filters, onFiltersChange });

	if (!isOpen) {
		return <FilterBuilderClosed onToggle={onToggle} disabled={disabled} />;
	}

	return (
		<div className="rounded-lg border border-border bg-surface p-4 dark:border-border dark:bg-surface">
			<FilterBuilderHeader onClose={onToggle} />
			<FilterList filters={filters} onRemoveFilter={handleRemoveFilter} disabled={disabled} />
			<AddFilterForm
				filterType={newFilterType}
				filterLabel={newFilterLabel}
				onFilterTypeChange={setNewFilterType}
				onFilterLabelChange={setNewFilterLabel}
				onAddFilter={handleAddFilter}
				disabled={disabled}
			/>
		</div>
	);
}
