import type { HTMLAttributes, InputHTMLAttributes, ReactNode } from 'react';

export interface DatePickerInputProps
	extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {}

export interface DatePickerContentProps {
	readonly datePickerId: string | undefined;
	readonly datePickerClasses: string;
	readonly ariaDescribedBy: string | undefined;
	readonly label?: string | undefined;
	readonly error?: string | undefined;
	readonly helperText?: string | undefined;
	readonly required?: boolean | undefined;
	readonly fullWidth: boolean;
	readonly disabled?: boolean | undefined;
	readonly fieldProps: Readonly<DatePickerInputProps>;
}

export interface DatePickerWrapperProps extends Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
	readonly fullWidth: boolean;
	readonly children: ReactNode;
	readonly className?: string | undefined;
}

export interface DatePickerContainerProps
	extends Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
	readonly children: ReactNode;
	readonly className?: string | undefined;
}

export interface DatePickerFieldProps {
	readonly id: string | undefined;
	readonly datePickerClasses: string;
	readonly ariaDescribedBy: string | undefined;
	readonly disabled?: boolean | undefined;
	readonly required?: boolean | undefined;
	readonly props: Readonly<DatePickerInputProps>;
}

export interface DatePickerMessagesProps {
	readonly datePickerId: string;
	readonly error?: string | undefined;
	readonly helperText?: string | undefined;
}

export interface DatePickerLabelProps {
	readonly id: string;
	readonly label: string;
	readonly required?: boolean | undefined;
	readonly size?: 'sm' | 'md' | 'lg' | undefined;
}

export interface DatePickerFieldWithLabelProps
	extends Pick<
		DatePickerContentProps,
		| 'datePickerId'
		| 'datePickerClasses'
		| 'ariaDescribedBy'
		| 'label'
		| 'required'
		| 'disabled'
		| 'fieldProps'
	> {}
