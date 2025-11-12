import type { HTMLAttributes, InputHTMLAttributes, ReactNode } from 'react';

export interface DateRangePickerInputProps
	extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {}

export interface DateRangePickerContentProps {
	readonly dateRangePickerId: string | undefined;
	readonly startDatePickerClasses: string;
	readonly endDatePickerClasses: string;
	readonly startAriaDescribedBy: string | undefined;
	readonly endAriaDescribedBy: string | undefined;
	readonly label?: string | undefined;
	readonly error?: string | undefined;
	readonly helperText?: string | undefined;
	readonly required?: boolean | undefined;
	readonly fullWidth: boolean;
	readonly disabled?: boolean | undefined;
	readonly startFieldProps: Readonly<DateRangePickerInputProps>;
	readonly endFieldProps: Readonly<DateRangePickerInputProps>;
	readonly startLabel?: string | undefined;
	readonly endLabel?: string | undefined;
}

export interface DateRangePickerWrapperProps
	extends Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
	readonly fullWidth: boolean;
	readonly children: ReactNode;
	readonly className?: string | undefined;
}

export interface DateRangePickerContainerProps
	extends Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
	readonly children: ReactNode;
	readonly className?: string | undefined;
}

export interface DateRangePickerFieldProps {
	readonly id: string | undefined;
	readonly datePickerClasses: string;
	readonly ariaDescribedBy: string | undefined;
	readonly disabled?: boolean | undefined;
	readonly required?: boolean | undefined;
	readonly props: Readonly<DateRangePickerInputProps>;
	readonly label?: string | undefined;
}

export interface DateRangePickerMessagesProps {
	readonly dateRangePickerId: string;
	readonly error?: string | undefined;
	readonly helperText?: string | undefined;
}

export interface DateRangePickerLabelProps {
	readonly id: string;
	readonly label: string;
	readonly required?: boolean | undefined;
	readonly size?: 'sm' | 'md' | 'lg' | undefined;
}

export interface DateRangePickerFieldWithLabelProps
	extends Pick<
		DateRangePickerContentProps,
		| 'dateRangePickerId'
		| 'startDatePickerClasses'
		| 'endDatePickerClasses'
		| 'startAriaDescribedBy'
		| 'endAriaDescribedBy'
		| 'required'
		| 'disabled'
		| 'startFieldProps'
		| 'endFieldProps'
		| 'startLabel'
		| 'endLabel'
		| 'label'
	> {}
