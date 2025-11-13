import type { StandardSize } from '@src-types/ui/base';
import type { HTMLAttributes, InputHTMLAttributes, ReactNode } from 'react';

export interface EmailInputWrapperProps extends HTMLAttributes<HTMLDivElement> {
	readonly fullWidth: boolean;
	readonly children: ReactNode;
}

export interface EmailInputFieldProps {
	readonly id: string | undefined;
	readonly className: string;
	readonly hasError: boolean;
	readonly ariaDescribedBy: string | undefined;
	readonly disabled?: boolean | undefined;
	readonly required?: boolean | undefined;
	readonly props: Readonly<
		Omit<
			InputHTMLAttributes<HTMLInputElement>,
			| 'size'
			| 'id'
			| 'className'
			| 'disabled'
			| 'required'
			| 'aria-invalid'
			| 'aria-describedby'
			| 'type'
		>
	>;
}

export interface EmailInputMessagesProps {
	readonly inputId: string;
	readonly error?: string | undefined;
	readonly helperText?: string | undefined;
}

export interface EmailInputLabelProps {
	readonly id: string;
	readonly label: string;
	readonly required?: boolean | undefined;
}

export interface UseEmailInputStateOptions {
	readonly inputId?: string | undefined;
	readonly label?: string | undefined;
	readonly error?: string | undefined;
	readonly helperText?: string | undefined;
	readonly size: StandardSize;
	readonly className?: string | undefined;
}

export interface UseEmailInputStateReturn {
	readonly finalId: string | undefined;
	readonly hasError: boolean;
	readonly ariaDescribedBy: string | undefined;
	readonly inputClasses: string;
}

export interface EmailInputContentProps {
	readonly state: UseEmailInputStateReturn;
	readonly fieldProps: Readonly<EmailInputFieldProps>;
	readonly label?: string | undefined;
	readonly error?: string | undefined;
	readonly helperText?: string | undefined;
	readonly required?: boolean | undefined;
	readonly fullWidth: boolean;
}
