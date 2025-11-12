import type { StandardSize } from '@src-types/ui/base';
import type { HTMLAttributes, InputHTMLAttributes, ReactNode } from 'react';

export interface InputWrapperProps extends HTMLAttributes<HTMLDivElement> {
	readonly fullWidth: boolean;
	readonly children: ReactNode;
}

export interface InputFieldProps {
	readonly id: string | undefined;
	readonly className: string;
	readonly hasError: boolean;
	readonly ariaDescribedBy: string | undefined;
	readonly disabled?: boolean | undefined;
	readonly required?: boolean | undefined;
	readonly leftIcon?: ReactNode;
	readonly rightIcon?: ReactNode;
	readonly props: Readonly<
		Omit<
			InputHTMLAttributes<HTMLInputElement>,
			'size' | 'id' | 'className' | 'disabled' | 'required' | 'aria-invalid' | 'aria-describedby'
		>
	>;
}

export interface InputMessagesProps {
	readonly inputId: string;
	readonly error?: string | undefined;
	readonly helperText?: string | undefined;
}

export interface InputLabelProps {
	readonly id: string;
	readonly label: string;
	readonly required?: boolean | undefined;
}

export interface InputIconProps {
	readonly position: 'left' | 'right';
	readonly children: ReactNode;
}

export interface UseInputStateOptions {
	readonly inputId?: string | undefined;
	readonly label?: string | undefined;
	readonly error?: string | undefined;
	readonly helperText?: string | undefined;
	readonly size: StandardSize;
	readonly leftIcon?: ReactNode;
	readonly rightIcon?: ReactNode;
	readonly className?: string | undefined;
}

export interface UseInputStateReturn {
	readonly finalId: string | undefined;
	readonly hasError: boolean;
	readonly ariaDescribedBy: string | undefined;
	readonly inputClasses: string;
}

export interface InputContentProps {
	readonly state: UseInputStateReturn;
	readonly fieldProps: Readonly<InputFieldProps>;
	readonly label?: string | undefined;
	readonly error?: string | undefined;
	readonly helperText?: string | undefined;
	readonly required?: boolean | undefined;
	readonly fullWidth: boolean;
}
