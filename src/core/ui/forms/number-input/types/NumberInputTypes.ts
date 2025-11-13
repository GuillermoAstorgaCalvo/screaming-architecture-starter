import type { StandardSize } from '@src-types/ui/base';
import type { HTMLAttributes, InputHTMLAttributes, ReactNode } from 'react';

export interface NumberInputWrapperProps extends HTMLAttributes<HTMLDivElement> {
	readonly fullWidth: boolean;
	readonly children: ReactNode;
}

export interface NumberInputFieldProps {
	readonly id: string | undefined;
	readonly className: string;
	readonly hasError: boolean;
	readonly ariaDescribedBy: string | undefined;
	readonly disabled?: boolean | undefined;
	readonly required?: boolean | undefined;
	readonly min?: number | undefined;
	readonly max?: number | undefined;
	readonly step?: number | undefined;
	readonly onIncrement: () => void;
	readonly onDecrement: () => void;
	readonly canIncrement: boolean;
	readonly canDecrement: boolean;
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
			| 'min'
			| 'max'
			| 'step'
		>
	>;
}

export interface NumberInputMessagesProps {
	readonly inputId: string;
	readonly error?: string | undefined;
	readonly helperText?: string | undefined;
}

export interface NumberInputLabelProps {
	readonly id: string;
	readonly label: string;
	readonly required?: boolean | undefined;
}

export interface NumberInputButtonProps {
	readonly onClick: () => void;
	readonly disabled: boolean;
	readonly 'aria-label': string;
	readonly children: ReactNode;
}

export interface UseNumberInputStateOptions {
	readonly inputId?: string | undefined;
	readonly label?: string | undefined;
	readonly error?: string | undefined;
	readonly helperText?: string | undefined;
	readonly size: StandardSize;
	readonly className?: string | undefined;
}

export interface UseNumberInputStateReturn {
	readonly finalId: string | undefined;
	readonly hasError: boolean;
	readonly ariaDescribedBy: string | undefined;
	readonly inputClasses: string;
}

export interface NumberInputContentProps {
	readonly state: UseNumberInputStateReturn;
	readonly fieldProps: Readonly<NumberInputFieldProps>;
	readonly label?: string | undefined;
	readonly error?: string | undefined;
	readonly helperText?: string | undefined;
	readonly required?: boolean | undefined;
	readonly fullWidth: boolean;
}
