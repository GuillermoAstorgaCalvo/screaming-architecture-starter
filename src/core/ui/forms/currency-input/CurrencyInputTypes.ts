import type { StandardSize } from '@src-types/ui/base';
import type { HTMLAttributes, InputHTMLAttributes, ReactNode } from 'react';

export interface CurrencyInputWrapperProps extends HTMLAttributes<HTMLDivElement> {
	readonly fullWidth: boolean;
	readonly children: ReactNode;
}

export interface CurrencyInputFieldProps {
	readonly id: string | undefined;
	readonly className: string;
	readonly hasError: boolean;
	readonly ariaDescribedBy: string | undefined;
	readonly disabled?: boolean | undefined;
	readonly required?: boolean | undefined;
	readonly currency: string;
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

export interface CurrencyInputMessagesProps {
	readonly inputId: string;
	readonly error?: string | undefined;
	readonly helperText?: string | undefined;
}

export interface CurrencyInputLabelProps {
	readonly id: string;
	readonly label: string;
	readonly required?: boolean | undefined;
}

export interface UseCurrencyInputStateOptions {
	readonly inputId?: string | undefined;
	readonly label?: string | undefined;
	readonly error?: string | undefined;
	readonly helperText?: string | undefined;
	readonly size: StandardSize;
	readonly className?: string | undefined;
}

export interface UseCurrencyInputStateReturn {
	readonly finalId: string | undefined;
	readonly hasError: boolean;
	readonly ariaDescribedBy: string | undefined;
	readonly inputClasses: string;
}

export interface CurrencyInputContentProps {
	readonly state: UseCurrencyInputStateReturn;
	readonly fieldProps: Readonly<CurrencyInputFieldProps>;
	readonly label?: string | undefined;
	readonly error?: string | undefined;
	readonly helperText?: string | undefined;
	readonly required?: boolean | undefined;
	readonly fullWidth: boolean;
}
