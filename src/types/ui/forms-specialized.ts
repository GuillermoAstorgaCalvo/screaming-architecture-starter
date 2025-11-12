import type { InputHTMLAttributes } from 'react';

import type { StandardSize } from './base';

/**
 * PasswordInput component props
 */
export interface PasswordInputProps
	extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
	/** Label text for the password input. If provided, renders a label element */
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
}

/**
 * EmailInput component props
 */
export interface EmailInputProps
	extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
	/** Label text for the email input. If provided, renders a label element */
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
}

/**
 * CurrencyInput component props
 */
export interface CurrencyInputProps
	extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
	/** Label text for the currency input. If provided, renders a label element */
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
	/** Currency code (e.g., 'USD', 'EUR', 'GBP') @default 'USD' */
	currency?: string;
}

/**
 * PhoneInput component props
 */
export interface PhoneInputProps
	extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
	/** Label text for the phone input. If provided, renders a label element */
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
	/** Default country code (e.g., '+1', '+44') */
	defaultCountryCode?: string;
	/** Callback when country code changes */
	onCountryCodeChange?: (code: string) => void;
}
