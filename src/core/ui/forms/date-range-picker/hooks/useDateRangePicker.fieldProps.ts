import type { DateRangePickerInputProps } from '@core/ui/forms/date-range-picker/types/DateRangePickerTypes';
import type { BuildFieldPropsOptions } from '@core/ui/forms/date-range-picker/types/useDateRangePicker.types';
import type { DateRangePickerProps } from '@src-types/ui/forms-dates';

export function buildFieldProps(options: Readonly<BuildFieldPropsOptions>): {
	readonly startFieldProps: Readonly<DateRangePickerInputProps>;
	readonly endFieldProps: Readonly<DateRangePickerInputProps>;
} {
	const {
		rest,
		startValue,
		endValue,
		defaultStartValue,
		defaultEndValue,
		onStartChange,
		onEndChange,
		startMin,
		startMax,
		endMin,
		endMax,
	} = options;

	return {
		startFieldProps: {
			...rest,
			value: startValue,
			defaultValue: defaultStartValue,
			onChange: onStartChange,
			min: startMin,
			max: startMax,
		},
		endFieldProps: {
			...rest,
			value: endValue,
			defaultValue: defaultEndValue,
			onChange: onEndChange,
			min: endMin,
			max: endMax,
		},
	};
}

export function createFieldOptionsFromProps(
	props: Readonly<DateRangePickerProps>
): Readonly<BuildFieldPropsOptions> {
	const {
		startValue,
		endValue,
		defaultStartValue,
		defaultEndValue,
		onStartChange,
		onEndChange,
		startMin,
		startMax,
		endMin,
		endMax,
		...rest
	} = props;
	return {
		rest,
		startValue,
		endValue,
		defaultStartValue,
		defaultEndValue,
		onStartChange,
		onEndChange,
		startMin,
		startMax,
		endMin,
		endMax,
	};
}
