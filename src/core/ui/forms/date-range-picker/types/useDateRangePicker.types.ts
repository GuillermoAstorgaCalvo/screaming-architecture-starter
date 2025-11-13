import type {
	DateRangePickerContentProps,
	DateRangePickerInputProps,
} from '@core/ui/forms/date-range-picker/types/DateRangePickerTypes';
import type { StandardSize } from '@src-types/ui/base';
import type { DateRangePickerProps } from '@src-types/ui/forms-dates';

export interface UseDateRangePickerPropsOptions {
	readonly props: Readonly<DateRangePickerProps>;
}

export interface UseDateRangePickerPropsReturn {
	readonly contentProps: Readonly<DateRangePickerContentProps>;
}

export interface UseDateRangePickerStateOptions {
	readonly dateRangePickerId?: string | undefined;
	readonly label?: string | undefined;
	readonly error?: string | undefined;
	readonly helperText?: string | undefined;
	readonly size: StandardSize;
	readonly className?: string | undefined;
}

export interface UseDateRangePickerStateReturn {
	readonly finalId: string | undefined;
	readonly startDatePickerClasses: string;
	readonly endDatePickerClasses: string;
	readonly startAriaDescribedBy: string | undefined;
	readonly endAriaDescribedBy: string | undefined;
}

export interface BuildDateRangePickerContentPropsOptions {
	readonly props: Readonly<DateRangePickerProps>;
	readonly state: UseDateRangePickerStateReturn;
	readonly startFieldProps: Readonly<DateRangePickerInputProps>;
	readonly endFieldProps: Readonly<DateRangePickerInputProps>;
}

export interface BuildFieldPropsOptions {
	readonly rest: Omit<
		DateRangePickerProps,
		| 'label'
		| 'error'
		| 'helperText'
		| 'size'
		| 'dateRangePickerId'
		| 'className'
		| 'startValue'
		| 'endValue'
		| 'defaultStartValue'
		| 'defaultEndValue'
		| 'onStartChange'
		| 'onEndChange'
		| 'startMin'
		| 'startMax'
		| 'endMin'
		| 'endMax'
		| 'startLabel'
		| 'endLabel'
	>;
	readonly startValue?: DateRangePickerProps['startValue'];
	readonly endValue?: DateRangePickerProps['endValue'];
	readonly defaultStartValue?: DateRangePickerProps['defaultStartValue'];
	readonly defaultEndValue?: DateRangePickerProps['defaultEndValue'];
	readonly onStartChange?: DateRangePickerProps['onStartChange'];
	readonly onEndChange?: DateRangePickerProps['onEndChange'];
	readonly startMin?: DateRangePickerProps['startMin'];
	readonly startMax?: DateRangePickerProps['startMax'];
	readonly endMin?: DateRangePickerProps['endMin'];
	readonly endMax?: DateRangePickerProps['endMax'];
}
