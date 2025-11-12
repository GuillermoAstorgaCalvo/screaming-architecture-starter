import type { StandardSize } from '@src-types/ui/base';
import type { InputHTMLAttributes, RefObject } from 'react';

import type { OTPInputFieldProps, UseOTPInputStateReturn } from './OTPInputTypes';

export interface UseOTPInputPropsOptions {
	readonly props: Readonly<OTPInputProps>;
}

export interface UseOTPInputPropsReturn {
	readonly state: UseOTPInputStateReturn;
	readonly fieldProps: Readonly<OTPInputFieldProps>;
	readonly label?: string | undefined;
	readonly error?: string | undefined;
	readonly helperText?: string | undefined;
	readonly required?: boolean | undefined;
	readonly fullWidth: boolean;
}

export interface OTPInputProps
	extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'value' | 'onChange'> {
	/** Label text for the OTP input. If provided, renders a label element */
	label?: string;
	/** Error message to display below the input */
	error?: string;
	/** Helper text to display below the input */
	helperText?: string;
	/** Size of the input @default 'md' */
	size?: StandardSize;
	/** Whether the input takes full width @default false */
	fullWidth?: boolean;
	/** ID for the input element. If not provided and label exists, will be auto-generated */
	inputId?: string;
	/** Number of OTP digits @default 6 */
	length?: number;
	/** Current value (controlled) */
	value?: string;
	/** Default value (uncontrolled) */
	defaultValue?: string;
	/** Callback when value changes */
	onChange?: (value: string) => void;
	/** Callback when all digits are filled */
	onComplete?: (value: string) => void;
	/** Whether to auto-focus the first input on mount @default true */
	autoFocus?: boolean;
}

export interface UseOTPInputValueReturn {
	readonly normalizedValue: string;
	readonly isControlled: boolean;
	readonly setInternalValue: (value: string) => void;
}

export interface UseOTPInputChangeHandlerOptions {
	readonly isControlled: boolean;
	readonly setInternalValue: (value: string) => void;
	readonly length: number;
	readonly onChange?: ((value: string) => void) | undefined;
	readonly onComplete?: ((value: string) => void) | undefined;
}

export interface UseOTPInputFieldPropsOptions {
	readonly state: UseOTPInputStateReturn;
	readonly disabled?: boolean | undefined;
	readonly required?: boolean | undefined;
	readonly length: number;
	readonly normalizedValue: string;
	readonly handleChange: (value: string) => void;
	readonly onComplete?: ((value: string) => void) | undefined;
	readonly autoFocus?: boolean | undefined;
	readonly inputRefs: RefObject<(HTMLInputElement | null)[]>;
}
