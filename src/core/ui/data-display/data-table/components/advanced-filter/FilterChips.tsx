import Chip from '@core/ui/forms/chip/Chip';
import type { ActiveFilterValue } from '@src-types/ui/advancedFilter';
import type { ReactNode } from 'react';

export interface FilterChipsProps {
	/** Active filter values to display */
	activeFilters: ActiveFilterValue[];
	/** Callback when a filter is removed */
	onRemoveFilter: (filterId: string) => void;
	/** Callback when all filters are cleared */
	onClearAll?: () => void;
	/** Custom render function for filter chips */
	renderFilterChip?: (filter: ActiveFilterValue) => ReactNode;
	/** Size variant @default 'md' */
	size?: 'sm' | 'md' | 'lg';
	/** Additional className */
	className?: string;
}

type ChipSize = 'sm' | 'md' | 'lg';

/**
 * Maps the FilterChips size prop to the Chip component size
 */
function getChipSize(size: 'sm' | 'md' | 'lg'): ChipSize {
	return size;
}

/**
 * Renders the "Active filters:" label
 */
function FilterChipsLabel() {
	return (
		<span className="text-sm font-medium text-gray-700 dark:text-gray-300">Active filters:</span>
	);
}

interface DefaultFilterChipProps {
	filter: ActiveFilterValue;
	chipSize: ChipSize;
	onRemove: (filterId: string) => void;
}

/**
 * Renders a default filter chip with label and value
 */
function DefaultFilterChip({ filter, chipSize, onRemove }: Readonly<DefaultFilterChipProps>) {
	return (
		<Chip
			variant="default"
			size={chipSize}
			removable
			onRemove={() => onRemove(filter.filterId)}
			removeAriaLabel={`Remove ${filter.label} filter`}
		>
			<span className="font-medium">{filter.label}:</span> {filter.displayValue}
		</Chip>
	);
}

interface FilterChipItemProps {
	filter: ActiveFilterValue;
	chipSize: ChipSize;
	onRemoveFilter: (filterId: string) => void;
	renderFilterChip?: ((filter: ActiveFilterValue) => ReactNode) | undefined;
}

/**
 * Renders a single filter chip (either custom or default)
 */
function FilterChipItem({
	filter,
	chipSize,
	onRemoveFilter,
	renderFilterChip,
}: Readonly<FilterChipItemProps>) {
	if (renderFilterChip) {
		return <div key={filter.filterId}>{renderFilterChip(filter)}</div>;
	}

	return <DefaultFilterChip filter={filter} chipSize={chipSize} onRemove={onRemoveFilter} />;
}

interface ClearAllButtonProps {
	onClearAll: () => void;
}

/**
 * Renders the "Clear all" button
 */
function ClearAllButton({ onClearAll }: Readonly<ClearAllButtonProps>) {
	return (
		<button
			type="button"
			onClick={onClearAll}
			className="text-sm text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
			aria-label="Clear all filters"
		>
			Clear all
		</button>
	);
}

/**
 * FilterChips - Displays active filters as removable chips
 *
 * Features:
 * - Shows all active filters as chips
 * - Individual remove buttons for each filter
 * - Clear all filters button
 * - Custom render support
 *
 * @example
 * ```tsx
 * <FilterChips
 *   activeFilters={activeFilters}
 *   onRemoveFilter={(id) => handleRemove(id)}
 *   onClearAll={() => handleClearAll()}
 * />
 * ```
 */
export function FilterChips({
	activeFilters,
	onRemoveFilter,
	onClearAll,
	renderFilterChip,
	size = 'md',
	className,
}: Readonly<FilterChipsProps>) {
	if (activeFilters.length === 0) {
		return null;
	}

	const chipSize = getChipSize(size);

	return (
		<div className={`flex flex-wrap items-center gap-2 ${className ?? ''}`}>
			<FilterChipsLabel />
			{activeFilters.map(filter => (
				<FilterChipItem
					key={filter.filterId}
					filter={filter}
					chipSize={chipSize}
					onRemoveFilter={onRemoveFilter}
					renderFilterChip={renderFilterChip}
				/>
			))}
			{onClearAll ? <ClearAllButton onClearAll={onClearAll} /> : null}
		</div>
	);
}
