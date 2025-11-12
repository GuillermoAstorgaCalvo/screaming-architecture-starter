import type { ChangeEvent, InputHTMLAttributes } from 'react';

import type { StandardSize } from './base';

/**
 * DatePicker component props
 */
export interface DatePickerProps
	extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
	/** Label text for the date picker. If provided, renders a label element */
	label?: string;
	/** Error message to display below the date picker */
	error?: string;
	/** Helper text to display below the date picker */
	helperText?: string;
	/** Size of the date picker @default 'md' */
	size?: StandardSize;
	/** Whether the date picker takes full width @default false */
	fullWidth?: boolean;
	/** ID for the date picker element. If not provided and label exists, will be auto-generated */
	datePickerId?: string;
}

/**
 * DateRangePicker component props
 */
export interface DateRangePickerProps
	extends Omit<
		InputHTMLAttributes<HTMLInputElement>,
		'size' | 'type' | 'value' | 'onChange' | 'min' | 'max'
	> {
	/** Label text for the date range picker. If provided, renders a label element */
	label?: string;
	/** Error message to display below the date range picker */
	error?: string;
	/** Helper text to display below the date range picker */
	helperText?: string;
	/** Size of the date range picker @default 'md' */
	size?: StandardSize;
	/** Whether the date range picker takes full width @default false */
	fullWidth?: boolean;
	/** ID for the date range picker element. If not provided and label exists, will be auto-generated */
	dateRangePickerId?: string;
	/** Start date value (controlled) */
	startValue?: string;
	/** End date value (controlled) */
	endValue?: string;
	/** Start date default value (uncontrolled) */
	defaultStartValue?: string;
	/** End date default value (uncontrolled) */
	defaultEndValue?: string;
	/** Handler for start date change */
	onStartChange?: (event: ChangeEvent<HTMLInputElement>) => void;
	/** Handler for end date change */
	onEndChange?: (event: ChangeEvent<HTMLInputElement>) => void;
	/** Minimum date for start date picker */
	startMin?: string;
	/** Maximum date for start date picker */
	startMax?: string;
	/** Minimum date for end date picker */
	endMin?: string;
	/** Maximum date for end date picker */
	endMax?: string;
	/** Label text for the start date picker */
	startLabel?: string;
	/** Label text for the end date picker */
	endLabel?: string;
}

/**
 * TimePicker component props
 */
export interface TimePickerProps
	extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
	/** Label text for the time picker. If provided, renders a label element */
	label?: string;
	/** Error message to display below the time picker */
	error?: string;
	/** Helper text to display below the time picker */
	helperText?: string;
	/** Size of the time picker @default 'md' */
	size?: StandardSize;
	/** Whether the time picker takes full width @default false */
	fullWidth?: boolean;
	/** ID for the time picker element. If not provided and label exists, will be auto-generated */
	timePickerId?: string;
}
