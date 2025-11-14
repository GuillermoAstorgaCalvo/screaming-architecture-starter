import {
	DateFilterInput,
	DateRangeFilterInput,
	type FilterInputCommonProps,
	MultiSelectFilterInput,
	SelectFilterInput,
	TextFilterInput,
} from '@core/ui/data-display/data-table/components/filterInputComponents';
import type { AdvancedFilter } from '@src-types/ui/advancedFilter';

export interface FilterInputProps {
	filter: AdvancedFilter;
	onChange: (filterId: string, value: unknown) => void;
	disabled?: boolean;
	size?: 'sm' | 'md' | 'lg';
}

/**
 * FilterInput - Renders the appropriate input component for a filter
 */
export function FilterInput({
	filter,
	onChange,
	disabled = false,
	size = 'md',
}: Readonly<FilterInputProps>) {
	const commonProps: FilterInputCommonProps = {
		disabled,
		size,
		onChange,
	};

	switch (filter.type) {
		case 'text': {
			return <TextFilterInput filter={filter} commonProps={commonProps} />;
		}
		case 'select': {
			return <SelectFilterInput filter={filter} commonProps={commonProps} />;
		}
		case 'multi-select': {
			return <MultiSelectFilterInput filter={filter} commonProps={commonProps} />;
		}
		case 'date': {
			return <DateFilterInput filter={filter} commonProps={commonProps} />;
		}
		case 'date-range': {
			return <DateRangeFilterInput filter={filter} commonProps={commonProps} />;
		}
		default: {
			return null;
		}
	}
}
