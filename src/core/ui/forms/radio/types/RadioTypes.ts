import type { HTMLAttributes, InputHTMLAttributes, ReactNode } from 'react';

export interface RadioWrapperProps extends HTMLAttributes<HTMLDivElement> {
	readonly fullWidth: boolean;
	readonly children: ReactNode;
}

export interface RadioContainerProps extends HTMLAttributes<HTMLDivElement> {
	readonly children: ReactNode;
}

export interface RadioFieldProps {
	readonly id: string | undefined;
	readonly name: string;
	readonly value: string;
	readonly className: string;
	readonly ariaDescribedBy: string | undefined;
	readonly disabled?: boolean | undefined;
	readonly required?: boolean | undefined;
	readonly checked?: boolean | undefined;
	readonly defaultChecked?: boolean | undefined;
	readonly props: Readonly<
		Omit<
			InputHTMLAttributes<HTMLInputElement>,
			| 'size'
			| 'type'
			| 'id'
			| 'name'
			| 'value'
			| 'className'
			| 'disabled'
			| 'required'
			| 'aria-describedby'
			| 'checked'
			| 'defaultChecked'
		>
	>;
}

export interface RadioMessagesProps {
	readonly radioId: string;
	readonly error?: string | undefined;
	readonly helperText?: string | undefined;
}

export interface RadioLabelProps {
	readonly id: string;
	readonly label: string;
	readonly required?: boolean | undefined;
	readonly size?: 'sm' | 'md' | 'lg' | undefined;
}

export interface RadioContentProps {
	readonly radioId: string | undefined;
	readonly name: string;
	readonly value: string;
	readonly radioClasses: string;
	readonly ariaDescribedBy: string | undefined;
	readonly label?: string | undefined;
	readonly error?: string | undefined;
	readonly helperText?: string | undefined;
	readonly required?: boolean | undefined;
	readonly fullWidth: boolean;
	readonly disabled?: boolean | undefined;
	readonly checked?: boolean | undefined;
	readonly defaultChecked?: boolean | undefined;
	readonly fieldProps: Readonly<
		Omit<
			InputHTMLAttributes<HTMLInputElement>,
			| 'size'
			| 'type'
			| 'id'
			| 'name'
			| 'value'
			| 'className'
			| 'disabled'
			| 'required'
			| 'aria-describedby'
			| 'checked'
			| 'defaultChecked'
		>
	>;
}

export interface RadioFieldWithLabelProps
	extends Pick<
		RadioContentProps,
		| 'radioId'
		| 'radioClasses'
		| 'name'
		| 'value'
		| 'ariaDescribedBy'
		| 'label'
		| 'required'
		| 'disabled'
		| 'checked'
		| 'defaultChecked'
		| 'fieldProps'
	> {}
