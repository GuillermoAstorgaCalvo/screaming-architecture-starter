import type { StandardSize } from '@src-types/ui/base';
import type { HTMLAttributes, InputHTMLAttributes, ReactNode } from 'react';

export interface SearchInputWrapperProps extends HTMLAttributes<HTMLDivElement> {
	readonly fullWidth: boolean;
	readonly children: ReactNode;
}

export interface SearchInputFieldProps {
	readonly id: string | undefined;
	readonly className: string;
	readonly hasError: boolean;
	readonly ariaDescribedBy: string | undefined;
	readonly disabled?: boolean | undefined;
	readonly required?: boolean | undefined;
	readonly value?: string | undefined;
	readonly onClear: () => void;
	readonly showClearButton: boolean;
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
			| 'value'
		>
	>;
}

export interface SearchInputMessagesProps {
	readonly inputId: string;
	readonly error?: string | undefined;
	readonly helperText?: string | undefined;
}

export interface SearchInputLabelProps {
	readonly id: string;
	readonly label: string;
	readonly required?: boolean | undefined;
}

export interface UseSearchInputStateOptions {
	readonly inputId?: string | undefined;
	readonly label?: string | undefined;
	readonly error?: string | undefined;
	readonly helperText?: string | undefined;
	readonly size: StandardSize;
	readonly className?: string | undefined;
	readonly hasClearButton: boolean;
}

export interface UseSearchInputStateReturn {
	readonly finalId: string | undefined;
	readonly hasError: boolean;
	readonly ariaDescribedBy: string | undefined;
	readonly inputClasses: string;
}

export interface SearchInputContentProps {
	readonly state: UseSearchInputStateReturn;
	readonly fieldProps: Readonly<SearchInputFieldProps>;
	readonly label?: string | undefined;
	readonly error?: string | undefined;
	readonly helperText?: string | undefined;
	readonly required?: boolean | undefined;
	readonly fullWidth: boolean;
}
