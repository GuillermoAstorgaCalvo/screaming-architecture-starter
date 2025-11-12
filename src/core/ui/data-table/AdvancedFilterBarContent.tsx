import type { ActiveFilterValue, AdvancedFilterConfig } from '@src-types/ui/advancedFilter';

import { FilterBuilder } from './FilterBuilder';
import { FilterChips } from './FilterChips';
import { FilterInputsGrid } from './FilterInputsGrid';

export interface AdvancedFilterBarContentProps {
	filters: AdvancedFilterConfig['filters'];
	activeFilterValues: ActiveFilterValue[];
	onFilterChange: (filterId: string, value: unknown) => void;
	onRemoveFilter: (filterId: string) => void;
	onClearAllFilters: () => void;
	showFilterChips: boolean;
	showFilterBuilder: boolean;
	renderFilterChip?: AdvancedFilterConfig['renderFilterChip'] | undefined;
	size: 'sm' | 'md' | 'lg';
	disabled: boolean;
	isBuilderOpen: boolean;
	onToggleBuilder: () => void;
	onFiltersChange?: AdvancedFilterConfig['onFiltersChange'] | undefined;
	className?: string | undefined;
}

/**
 * AdvancedFilterBarContent - Renders the content of the filter bar
 */
interface FilterChipsSectionProps {
	shouldShow: boolean;
	activeFilterValues: ActiveFilterValue[];
	onRemoveFilter: (filterId: string) => void;
	onClearAll: () => void;
	renderFilterChip: AdvancedFilterBarContentProps['renderFilterChip'];
	size: AdvancedFilterBarContentProps['size'];
}

function renderFilterChipsSection(props: Readonly<FilterChipsSectionProps>) {
	if (!props.shouldShow) return null;
	const filterChipProps = props.renderFilterChip
		? { renderFilterChip: props.renderFilterChip }
		: {};
	return (
		<FilterChips
			activeFilters={props.activeFilterValues}
			onRemoveFilter={props.onRemoveFilter}
			onClearAll={props.onClearAll}
			{...filterChipProps}
			size={props.size}
		/>
	);
}

interface FilterBuilderSectionProps {
	shouldShow: boolean;
	isOpen: boolean;
	onToggle: () => void;
	filters: AdvancedFilterBarContentProps['filters'];
	onFiltersChange: AdvancedFilterBarContentProps['onFiltersChange'];
	disabled: boolean;
}

function renderFilterBuilderSection(props: Readonly<FilterBuilderSectionProps>) {
	if (!props.shouldShow) return null;
	if (!props.onFiltersChange) return null;
	return (
		<FilterBuilder
			isOpen={props.isOpen}
			onToggle={props.onToggle}
			filters={props.filters}
			onFiltersChange={props.onFiltersChange}
			disabled={props.disabled}
		/>
	);
}

export function AdvancedFilterBarContent(props: Readonly<AdvancedFilterBarContentProps>) {
	const shouldShowFilterChips = props.showFilterChips && props.activeFilterValues.length > 0;
	const shouldShowFilterBuilder = Boolean(props.showFilterBuilder && props.onFiltersChange);

	return (
		<div className={props.className}>
			<FilterInputsGrid
				filters={props.filters}
				onFilterChange={props.onFilterChange}
				disabled={props.disabled}
				size={props.size}
			/>
			{renderFilterChipsSection({
				shouldShow: shouldShowFilterChips,
				activeFilterValues: props.activeFilterValues,
				onRemoveFilter: props.onRemoveFilter,
				onClearAll: props.onClearAllFilters,
				renderFilterChip: props.renderFilterChip,
				size: props.size,
			})}
			{renderFilterBuilderSection({
				shouldShow: shouldShowFilterBuilder,
				isOpen: props.isBuilderOpen,
				onToggle: props.onToggleBuilder,
				filters: props.filters,
				onFiltersChange: props.onFiltersChange,
				disabled: props.disabled,
			})}
		</div>
	);
}
