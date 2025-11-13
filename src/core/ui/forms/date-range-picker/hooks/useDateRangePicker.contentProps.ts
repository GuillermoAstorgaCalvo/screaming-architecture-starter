import { buildFieldProps } from '@core/ui/forms/date-range-picker/hooks/useDateRangePicker.fieldProps';
import type { DateRangePickerContentProps } from '@core/ui/forms/date-range-picker/types/DateRangePickerTypes';
import type {
	BuildDateRangePickerContentPropsOptions,
	BuildFieldPropsOptions,
	UseDateRangePickerStateReturn,
} from '@core/ui/forms/date-range-picker/types/useDateRangePicker.types';
import type { DateRangePickerProps } from '@src-types/ui/forms-dates';

export function buildDateRangePickerContentProps(
	options: Readonly<BuildDateRangePickerContentPropsOptions>
): DateRangePickerContentProps {
	const { props, state, startFieldProps, endFieldProps } = options;
	return {
		dateRangePickerId: state.finalId,
		startDatePickerClasses: state.startDatePickerClasses,
		endDatePickerClasses: state.endDatePickerClasses,
		startAriaDescribedBy: state.startAriaDescribedBy,
		endAriaDescribedBy: state.endAriaDescribedBy,
		label: props.label,
		error: props.error,
		helperText: props.helperText,
		required: props.required,
		fullWidth: props.fullWidth ?? false,
		disabled: props.disabled,
		startFieldProps,
		endFieldProps,
		startLabel: props.startLabel,
		endLabel: props.endLabel,
	};
}

export function buildContentPropsFromValues(
	props: Readonly<DateRangePickerProps>,
	state: UseDateRangePickerStateReturn,
	fieldOptions: Readonly<BuildFieldPropsOptions>
): DateRangePickerContentProps {
	const { startFieldProps, endFieldProps } = buildFieldProps(fieldOptions);
	return buildDateRangePickerContentProps({ props, state, startFieldProps, endFieldProps });
}
