import type { HTMLAttributes, InputHTMLAttributes, ReactNode } from 'react';

export interface TimePickerInputProps
	extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {}

export interface TimePickerContentProps {
	readonly timePickerId: string | undefined;
	readonly timePickerClasses: string;
	readonly ariaDescribedBy: string | undefined;
	readonly label?: string | undefined;
	readonly error?: string | undefined;
	readonly helperText?: string | undefined;
	readonly required?: boolean | undefined;
	readonly fullWidth: boolean;
	readonly disabled?: boolean | undefined;
	readonly fieldProps: Readonly<TimePickerInputProps>;
}

export interface TimePickerWrapperProps extends Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
	readonly fullWidth: boolean;
	readonly children: ReactNode;
	readonly className?: string | undefined;
}

export interface TimePickerContainerProps
	extends Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
	readonly children: ReactNode;
	readonly className?: string | undefined;
}

export interface TimePickerFieldProps {
	readonly id: string | undefined;
	readonly timePickerClasses: string;
	readonly ariaDescribedBy: string | undefined;
	readonly disabled?: boolean | undefined;
	readonly required?: boolean | undefined;
	readonly props: Readonly<TimePickerInputProps>;
}

export interface TimePickerMessagesProps {
	readonly timePickerId: string;
	readonly error?: string | undefined;
	readonly helperText?: string | undefined;
}

export interface TimePickerLabelProps {
	readonly id: string;
	readonly label: string;
	readonly required?: boolean | undefined;
	readonly size?: 'sm' | 'md' | 'lg' | undefined;
}

export interface TimePickerFieldWithLabelProps
	extends Pick<
		TimePickerContentProps,
		| 'timePickerId'
		| 'timePickerClasses'
		| 'ariaDescribedBy'
		| 'label'
		| 'required'
		| 'disabled'
		| 'fieldProps'
	> {}
