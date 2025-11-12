import Button from '@core/ui/button/Button';
import IconButton from '@core/ui/icon-button/IconButton';
import CloseIcon from '@core/ui/icons/close-icon/CloseIcon';
import type { AdvancedFilter } from '@src-types/ui/advancedFilter';

interface FilterBuilderHeaderProps {
	readonly onClose: () => void;
}

export function FilterBuilderHeader({ onClose }: FilterBuilderHeaderProps) {
	return (
		<div className="mb-4 flex items-center justify-between">
			<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Filter Builder</h3>
			<IconButton
				icon={<CloseIcon />}
				aria-label="Close filter builder"
				onClick={onClose}
				variant="ghost"
				size="sm"
			/>
		</div>
	);
}

interface FilterBuilderClosedProps {
	readonly onToggle: () => void;
	readonly disabled?: boolean;
}

export function FilterBuilderClosed({ onToggle, disabled }: FilterBuilderClosedProps) {
	return (
		<Button variant="ghost" size="sm" onClick={onToggle} disabled={disabled}>
			Add Filter
		</Button>
	);
}

interface FilterListItemProps {
	readonly filter: AdvancedFilter;
	readonly onRemove: (filterId: string) => void;
	readonly disabled?: boolean;
}

export function FilterListItem({ filter, onRemove, disabled }: FilterListItemProps) {
	return (
		<div className="flex items-center justify-between rounded-md border border-gray-200 bg-gray-50 px-3 py-2 dark:border-gray-700 dark:bg-gray-900">
			<div className="flex items-center gap-2">
				<span className="text-sm font-medium text-gray-900 dark:text-gray-100">{filter.label}</span>
				<span className="text-xs text-gray-500 dark:text-gray-400">({filter.type})</span>
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
			<h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Current Filters</h4>
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

interface FilterLabelInputProps {
	readonly value: string;
	readonly onChange: (value: string) => void;
	readonly disabled?: boolean;
}

export function FilterLabelInput({ value, onChange, disabled }: FilterLabelInputProps) {
	return (
		<div>
			<label htmlFor="filter-label" className="mb-1 block text-sm text-gray-700 dark:text-gray-300">
				Filter Label
			</label>
			<input
				id="filter-label"
				type="text"
				value={value}
				onChange={e => onChange(e.target.value)}
				placeholder="e.g., Status, Date, Category"
				disabled={disabled}
				className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
			/>
		</div>
	);
}

interface FilterTypeSelectProps {
	readonly value: AdvancedFilter['type'];
	readonly onChange: (type: AdvancedFilter['type']) => void;
	readonly disabled?: boolean;
}

const FILTER_TYPE_OPTIONS: Array<{ value: AdvancedFilter['type']; label: string }> = [
	{ value: 'text', label: 'Text' },
	{ value: 'select', label: 'Select' },
	{ value: 'multi-select', label: 'Multi-Select' },
	{ value: 'date', label: 'Date' },
	{ value: 'date-range', label: 'Date Range' },
] as const;

export function FilterTypeSelect({ value, onChange, disabled }: FilterTypeSelectProps) {
	return (
		<div>
			<label htmlFor="filter-type" className="mb-1 block text-sm text-gray-700 dark:text-gray-300">
				Filter Type
			</label>
			<select
				id="filter-type"
				value={value}
				onChange={e => onChange(e.target.value as AdvancedFilter['type'])}
				disabled={disabled}
				className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
			>
				{FILTER_TYPE_OPTIONS.map(option => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
			</select>
		</div>
	);
}

interface AddFilterFormProps {
	readonly filterType: AdvancedFilter['type'];
	readonly filterLabel: string;
	readonly onFilterTypeChange: (type: AdvancedFilter['type']) => void;
	readonly onFilterLabelChange: (label: string) => void;
	readonly onAddFilter: () => void;
	readonly disabled?: boolean;
}

export function AddFilterForm({
	filterType,
	filterLabel,
	onFilterTypeChange,
	onFilterLabelChange,
	onAddFilter,
	disabled,
}: AddFilterFormProps) {
	const isAddButtonDisabled = (disabled ?? false) || !filterLabel.trim();

	return (
		<div className="space-y-3">
			<h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Add New Filter</h4>
			<div className="grid gap-3 md:grid-cols-2">
				<FilterLabelInput
					value={filterLabel}
					onChange={onFilterLabelChange}
					disabled={disabled ?? false}
				/>
				<FilterTypeSelect
					value={filterType}
					onChange={onFilterTypeChange}
					disabled={disabled ?? false}
				/>
			</div>
			<Button variant="primary" size="sm" onClick={onAddFilter} disabled={isAddButtonDisabled}>
				Add Filter
			</Button>
		</div>
	);
}
