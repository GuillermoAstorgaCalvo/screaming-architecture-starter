import type { NamespaceKeys } from '@core/i18n/types/types';
import { useTranslation } from '@core/i18n/useTranslation';
import Button from '@core/ui/button/Button';
import type { AdvancedFilter } from '@src-types/ui/advancedFilter';

interface FilterLabelInputProps {
	readonly value: string;
	readonly onChange: (value: string) => void;
	readonly disabled?: boolean;
}

export function FilterLabelInput({ value, onChange, disabled }: FilterLabelInputProps) {
	const { t } = useTranslation('common');
	return (
		<div>
			<label
				htmlFor="filter-label"
				className="mb-1 block text-sm text-text-secondary dark:text-text-secondary"
			>
				{t('filters.filterLabel')}
			</label>
			<input
				id="filter-label"
				type="text"
				value={value}
				onChange={e => onChange(e.target.value)}
				placeholder={t('filters.filterLabelPlaceholder')}
				disabled={disabled}
				className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-border dark:bg-surface dark:text-text-primary"
			/>
		</div>
	);
}

interface FilterTypeSelectProps {
	readonly value: AdvancedFilter['type'];
	readonly onChange: (type: AdvancedFilter['type']) => void;
	readonly disabled?: boolean;
}

export function FilterTypeSelect({ value, onChange, disabled }: FilterTypeSelectProps) {
	const { t } = useTranslation('common');
	const FILTER_TYPE_OPTIONS: Array<{
		value: AdvancedFilter['type'];
		labelKey: NamespaceKeys<'common'>;
	}> = [
		{ value: 'text', labelKey: 'filters.filterTypeText' },
		{ value: 'select', labelKey: 'filters.filterTypeSelect' },
		{ value: 'multi-select', labelKey: 'filters.filterTypeMultiSelect' },
		{ value: 'date', labelKey: 'filters.filterTypeDate' },
		{ value: 'date-range', labelKey: 'filters.filterTypeDateRange' },
	] as const;

	return (
		<div>
			<label
				htmlFor="filter-type"
				className="mb-1 block text-sm text-text-secondary dark:text-text-secondary"
			>
				{t('filters.filterType')}
			</label>
			<select
				id="filter-type"
				value={value}
				onChange={e => onChange(e.target.value as AdvancedFilter['type'])}
				disabled={disabled}
				className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-border dark:bg-surface dark:text-text-primary"
			>
				{FILTER_TYPE_OPTIONS.map(option => (
					<option key={option.value} value={option.value}>
						{t(option.labelKey)}
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
	const { t } = useTranslation('common');
	const isAddButtonDisabled = (disabled ?? false) || !filterLabel.trim();

	return (
		<div className="space-y-3">
			<h4 className="text-sm font-medium text-text-secondary dark:text-text-secondary">
				{t('filters.addNewFilter')}
			</h4>
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
				{t('filters.addFilter')}
			</Button>
		</div>
	);
}
