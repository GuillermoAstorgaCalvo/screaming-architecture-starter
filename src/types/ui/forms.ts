import type {
	HTMLAttributes,
	InputHTMLAttributes,
	LabelHTMLAttributes,
	ReactNode,
	SelectHTMLAttributes,
	TextareaHTMLAttributes,
} from 'react';

import type { StandardSize } from './base';

/**
 * Input component props
 */
export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
	/** Label text for the input. If provided, renders a label element */
	label?: string;
	/** Error message to display below the input */
	error?: string;
	/** Helper text to display below the input */
	helperText?: string;
	/** Size of the input @default 'md' */
	size?: StandardSize;
	/** Whether the input takes full width @default false */
	fullWidth?: boolean;
	/** Icon or element to display on the left side of the input */
	leftIcon?: ReactNode;
	/** Icon or element to display on the right side of the input */
	rightIcon?: ReactNode;
	/** ID for the input element. If not provided and label exists, will be auto-generated */
	inputId?: string;
}

/**
 * Textarea component props
 */
export interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
	/** Label text for the textarea. If provided, renders a label element */
	label?: string;
	/** Error message to display below the textarea */
	error?: string;
	/** Helper text to display below the textarea */
	helperText?: string;
	/** Size of the textarea @default 'md' */
	size?: StandardSize;
	/** Whether the textarea takes full width @default false */
	fullWidth?: boolean;
	/** ID for the textarea element. If not provided and label exists, will be auto-generated */
	textareaId?: string;
}

/**
 * Label component props
 */
export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
	/** Label text or content */
	children: ReactNode;
	/** Whether the field is required (shows asterisk) @default false */
	required?: boolean;
	/** Size variant @default 'md' */
	size?: StandardSize;
}

/**
 * Base props for text message components (ErrorText and HelperText)
 */
export interface BaseTextMessageProps extends HTMLAttributes<HTMLParagraphElement> {
	/** Message content to display */
	children: ReactNode;
	/** Optional ID for ARIA relationships */
	id?: string;
	/** Size variant @default 'md' */
	size?: StandardSize;
}

/**
 * Error text component props
 */
export interface ErrorTextProps extends BaseTextMessageProps {}

/**
 * Helper text component props
 */
export interface HelperTextProps extends BaseTextMessageProps {}

/**
 * Select component props
 */
export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
	/** Label text for the select. If provided, renders a label element */
	label?: string;
	/** Error message to display below the select */
	error?: string;
	/** Helper text to display below the select */
	helperText?: string;
	/** Size of the select @default 'md' */
	size?: StandardSize;
	/** Whether the select takes full width @default false */
	fullWidth?: boolean;
	/** ID for the select element. If not provided and label exists, will be auto-generated */
	selectId?: string;
	/** Options for the select element */
	children: ReactNode;
}

/**
 * Checkbox component props
 */
export interface CheckboxProps
	extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
	/** Label text for the checkbox. If provided, renders a label element */
	label?: string;
	/** Error message to display below the checkbox */
	error?: string;
	/** Helper text to display below the checkbox */
	helperText?: string;
	/** Size of the checkbox @default 'md' */
	size?: StandardSize;
	/** Whether the checkbox takes full width @default false */
	fullWidth?: boolean;
	/** ID for the checkbox element. If not provided and label exists, will be auto-generated */
	checkboxId?: string;
	/** Whether the checkbox is checked (controlled) */
	checked?: boolean;
	/** Default checked state (uncontrolled) */
	defaultChecked?: boolean;
}

/**
 * Switch component props
 */
export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
	/** Label text for the switch. If provided, renders a label element */
	label?: string;
	/** Error message to display below the switch */
	error?: string;
	/** Helper text to display below the switch */
	helperText?: string;
	/** Size of the switch @default 'md' */
	size?: StandardSize;
	/** Whether the switch takes full width @default false */
	fullWidth?: boolean;
	/** ID for the switch element. If not provided and label exists, will be auto-generated */
	switchId?: string;
	/** Whether the switch is checked (controlled) */
	checked?: boolean;
	/** Default checked state (uncontrolled) */
	defaultChecked?: boolean;
}

/**
 * Radio component props
 */
export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
	/** Label text for the radio. If provided, renders a label element */
	label?: string;
	/** Error message to display below the radio */
	error?: string;
	/** Helper text to display below the radio */
	helperText?: string;
	/** Size of the radio @default 'md' */
	size?: StandardSize;
	/** Whether the radio takes full width @default false */
	fullWidth?: boolean;
	/** ID for the radio element. If not provided and label exists, will be auto-generated */
	radioId?: string;
	/** Whether the radio is checked (controlled) */
	checked?: boolean;
	/** Default checked state (uncontrolled) */
	defaultChecked?: boolean;
	/** Name attribute for radio group (required for radio buttons) */
	name: string;
	/** Value attribute for the radio option (required) */
	value: string;
}

/**
 * ColorInput component props
 */
export interface ColorInputProps
	extends Omit<
		InputHTMLAttributes<HTMLInputElement>,
		'size' | 'type' | 'value' | 'defaultValue' | 'onChange'
	> {
	/** Label text for the color input. If provided, renders a label element */
	label?: string;
	/** Error message to display below the color input */
	error?: string;
	/** Helper text to display below the color input */
	helperText?: string;
	/** Size of the color input @default 'md' */
	size?: StandardSize;
	/** Whether the color input takes full width @default false */
	fullWidth?: boolean;
	/** ID for the color input element. If not provided and label exists, will be auto-generated */
	colorInputId?: string;
	/** Current color value (hex format, e.g., '#ff0000') */
	value?: string;
	/** Default color value (uncontrolled) */
	defaultValue?: string;
	/** Callback when color changes */
	onChange?: (color: string) => void;
}

/**
 * Fieldset component props
 */
export interface FieldsetProps extends HTMLAttributes<HTMLFieldSetElement> {
	/** Legend text for the fieldset */
	legend?: string;
	/** Fieldset content */
	children: ReactNode;
	/** Whether the fieldset is disabled @default false */
	disabled?: boolean;
	/** Size variant for legend text @default 'md' */
	size?: StandardSize;
}

/**
 * FormGroup alignment types
 */
export type FormGroupAlignment = 'start' | 'center' | 'end' | 'stretch';

/**
 * FormGroup component props
 */
export interface FormGroupProps extends HTMLAttributes<HTMLDivElement> {
	/** Form group content */
	children: ReactNode;
	/** Gap between fields @default 'md' */
	gap?: StandardSize | 'none';
	/** Alignment of fields @default 'start' */
	align?: FormGroupAlignment;
	/** Whether the group takes full width @default false */
	fullWidth?: boolean;
}

/**
 * FormActions alignment types
 */
export type FormActionsAlignment = 'start' | 'center' | 'end' | 'space-between';

/**
 * FormActions component props
 */
export interface FormActionsProps extends HTMLAttributes<HTMLDivElement> {
	/** Action buttons/content */
	children: ReactNode;
	/** Gap between actions @default 'md' */
	gap?: StandardSize | 'none';
	/** Alignment of actions @default 'end' */
	align?: FormActionsAlignment;
	/** Whether actions take full width @default false */
	fullWidth?: boolean;
}
