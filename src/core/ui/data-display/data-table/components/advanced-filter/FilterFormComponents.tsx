import Button from '@core/ui/button/Button';
import type { AdvancedFilter } from '@src-types/ui/advancedFilter';

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
