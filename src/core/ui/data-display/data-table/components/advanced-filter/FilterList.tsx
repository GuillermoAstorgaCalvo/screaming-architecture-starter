import IconButton from '@core/ui/icon-button/IconButton';
import CloseIcon from '@core/ui/icons/close-icon/CloseIcon';
import type { AdvancedFilter } from '@src-types/ui/advancedFilter';

interface FilterListItemProps {
	readonly filter: AdvancedFilter;
	readonly onRemove: (filterId: string) => void;
	readonly disabled?: boolean;
}

export function FilterListItem({ filter, onRemove, disabled }: FilterListItemProps) {
	return (
		<div className="flex items-center justify-between rounded-md border border-border bg-muted px-3 py-2 dark:border-border dark:bg-muted">
			<div className="flex items-center gap-2">
				<span className="text-sm font-medium text-text-primary dark:text-text-primary">
					{filter.label}
				</span>
				<span className="text-xs text-text-muted dark:text-text-muted">({filter.type})</span>
			</div>
			<IconButton
				icon={<CloseIcon />}
				aria-label={`Remove ${filter.label} filter`}
				onClick={() => onRemove(filter.id)}
				variant="ghost"
				size="sm"
				disabled={disabled}
			/>
		</div>
	);
}

interface FilterListProps {
	readonly filters: AdvancedFilter[];
	readonly onRemoveFilter: (filterId: string) => void;
	readonly disabled?: boolean;
}

export function FilterList({ filters, onRemoveFilter, disabled }: FilterListProps) {
	if (filters.length === 0) {
		return null;
	}

	return (
		<div className="mb-4">
			<h4 className="mb-2 text-sm font-medium text-text-secondary dark:text-text-secondary">
				Current Filters
			</h4>
			<div className="space-y-2">
				{filters.map(filter => (
					<FilterListItem
						key={filter.id}
						filter={filter}
						onRemove={onRemoveFilter}
						disabled={disabled ?? false}
					/>
				))}
			</div>
		</div>
	);
}
