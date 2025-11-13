import DatePicker from '@core/ui/forms/date-picker/DatePicker';
import DateRangePicker from '@core/ui/forms/date-range-picker/DateRangePicker';
import Input from '@core/ui/forms/input/Input';
import MultiSelect from '@core/ui/forms/multi-select/MultiSelect';
import Select from '@core/ui/forms/select/Select';
import type {
	DateAdvancedFilter,
	DateRangeAdvancedFilter,
	MultiSelectAdvancedFilter,
	SelectAdvancedFilter,
	TextAdvancedFilter,
} from '@src-types/ui/advancedFilter';

export interface FilterInputCommonProps {
	disabled?: boolean;
	size?: 'sm' | 'md' | 'lg';
	onChange: (filterId: string, value: unknown) => void;
}

export function TextFilterInput({
	filter,
	commonProps,
}: Readonly<{
	filter: TextAdvancedFilter;
	commonProps: FilterInputCommonProps;
}>) {
	const { id, value, label, placeholder } = filter;
	return (
		<Input
			{...commonProps}
			type="text"
			placeholder={placeholder ?? `Filter by ${label}`}
			value={value ?? ''}
			onChange={e => commonProps.onChange(id, e.target.value)}
		/>
	);
}

export function SelectFilterInput({
	filter,
	commonProps,
}: Readonly<{
	filter: SelectAdvancedFilter;
	commonProps: FilterInputCommonProps;
}>) {
	const { id, value, label, options, placeholder } = filter;
	return (
		<Select
			{...commonProps}
			value={value ?? ''}
			onChange={e => commonProps.onChange(id, e.target.value)}
		>
			<option value="">{placeholder ?? `All ${label}`}</option>
			{options.map(option => (
				<option key={option.value} value={option.value} disabled={option.disabled}>
					{option.label}
				</option>
			))}
		</Select>
	);
}

export function MultiSelectFilterInput({
	filter,
	commonProps,
}: Readonly<{
	filter: MultiSelectAdvancedFilter;
	commonProps: FilterInputCommonProps;
}>) {
	const { id, value, label, options, placeholder } = filter;
	return (
		<MultiSelect
			{...commonProps}
			placeholder={placeholder ?? `Select ${label}`}
			options={options}
			value={value ?? []}
			onChange={values => commonProps.onChange(id, values)}
		/>
	);
}

export function DateFilterInput({
	filter,
	commonProps,
}: Readonly<{
	filter: DateAdvancedFilter;
	commonProps: FilterInputCommonProps;
}>) {
	const { id, value, minDate, maxDate } = filter;
	return (
		<DatePicker
			{...commonProps}
			value={value ?? ''}
			onChange={e => commonProps.onChange(id, e.target.value)}
			min={minDate}
			max={maxDate}
		/>
	);
}

export function DateRangeFilterInput({
	filter,
	commonProps,
}: Readonly<{
	filter: DateRangeAdvancedFilter;
	commonProps: FilterInputCommonProps;
}>) {
	const { id, startValue, endValue, startMin, startMax, endMin, endMax } = filter;
	const dateRangeProps: {
		startMin?: string;
		startMax?: string;
		endMin?: string;
		endMax?: string;
	} = {};
	if (startMin !== undefined) dateRangeProps.startMin = startMin;
	if (startMax !== undefined) dateRangeProps.startMax = startMax;
	if (endMin !== undefined) dateRangeProps.endMin = endMin;
	if (endMax !== undefined) dateRangeProps.endMax = endMax;

	return (
		<DateRangePicker
			{...commonProps}
			startValue={startValue ?? ''}
			endValue={endValue ?? ''}
			onStartChange={e => {
				const currentEnd = endValue ?? '';
				commonProps.onChange(id, { start: e.target.value, end: currentEnd });
			}}
			onEndChange={e => {
				const currentStart = startValue ?? '';
				commonProps.onChange(id, { start: currentStart, end: e.target.value });
			}}
			{...dateRangeProps}
		/>
	);
}
