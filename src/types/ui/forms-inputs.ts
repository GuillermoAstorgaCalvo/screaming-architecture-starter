import type { InputHTMLAttributes, ReactNode } from 'react';

import type { StandardSize } from './base';

/**
 * File upload validation options
 */
export interface FileUploadValidation {
	/** Maximum file size in bytes */
	maxSize?: number;
	/** Minimum file size in bytes */
	minSize?: number;
	/** Accepted MIME types or file extensions (e.g., ['image/*', '.pdf', 'application/pdf']) */
	acceptedTypes?: string[];
	/** Maximum number of files allowed */
	maxFiles?: number;
	/** Minimum number of files required */
	minFiles?: number;
}

/**
 * FileUpload component props
 */
export interface FileUploadProps
	extends Omit<
		InputHTMLAttributes<HTMLInputElement>,
		'size' | 'type' | 'multiple' | 'accept' | 'value' | 'onChange'
	> {
	/** Label text for the file upload. If provided, renders a label element */
	label?: string;
	/** Error message to display below the file upload */
	error?: string;
	/** Helper text to display below the file upload */
	helperText?: string;
	/** Size of the file upload @default 'md' */
	size?: StandardSize;
	/** Whether the file upload takes full width @default false */
	fullWidth?: boolean;
	/** ID for the file upload element. If not provided and label exists, will be auto-generated */
	fileUploadId?: string;
	/** Whether multiple files can be selected @default false */
	multiple?: boolean;
	/** Accepted file types (MIME types or extensions) */
	accept?: string | string[];
	/** File validation rules */
	validation?: FileUploadValidation;
	/** Whether to show file previews @default true */
	showPreview?: boolean;
	/** Whether to show upload progress indicators @default false */
	showProgress?: boolean;
	/** Current value (controlled mode) - File or File[] */
	value?: File | File[] | null;
	/** Callback when files change */
	onChange?: (files: File | File[] | null) => void;
	/** Callback when file upload progress updates */
	onFileProgress?: (fileId: string, progress: number) => void;
}

/**
 * OTPInput component props
 */
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

/**
 * NumberInput component props
 */
export interface NumberInputProps
	extends Omit<
		InputHTMLAttributes<HTMLInputElement>,
		'size' | 'type' | 'value' | 'defaultValue' | 'onChange'
	> {
	/** Label text for the number input. If provided, renders a label element */
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
	/** Minimum value */
	min?: number;
	/** Maximum value */
	max?: number;
	/** Step value for increment/decrement @default 1 */
	step?: number;
	/** Current value (controlled) */
	value?: number | string;
	/** Default value (uncontrolled) */
	defaultValue?: number | string;
	/** Callback when value changes (receives the new number value) */
	onChange?: (value: number) => void;
}

/**
 * SearchInput component props
 */
export interface SearchInputProps
	extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'value' | 'onChange'> {
	/** Label text for the search input. If provided, renders a label element */
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
	/** Current value (controlled) */
	value?: string;
	/** Default value (uncontrolled) */
	defaultValue?: string;
	/** Callback when value changes (receives the new string value) */
	onChange?: (value: string) => void;
	/** Whether to show the clear button @default true (shown when value is present) */
	showClearButton?: boolean;
}

/**
 * TagInput component props
 */
export interface TagInputProps
	extends Omit<
		InputHTMLAttributes<HTMLInputElement>,
		'size' | 'value' | 'onChange' | 'defaultValue'
	> {
	/** Label text for the tag input. If provided, renders a label element */
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
	tagInputId?: string;
	/** Current tags array (controlled) */
	tags?: string[];
	/** Default tags array (uncontrolled) */
	defaultTags?: string[];
	/** Callback when tags change */
	onChange?: (tags: string[]) => void;
	/** Current input value (controlled) */
	value?: string;
	/** Default input value (uncontrolled) */
	defaultValue?: string;
	/** Callback when input value changes */
	onValueChange?: (value: string) => void;
	/** Size of the chip tags @default 'sm' */
	chipSize?: StandardSize;
	/** Variant of the chip tags @default 'default' */
	chipVariant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';
	/** Maximum number of tags allowed */
	maxTags?: number;
	/** Separator character(s) or regex pattern for adding tags @default /[,\n]/ */
	separator?: string | RegExp;
	/** Whether duplicate tags are allowed @default false */
	allowDuplicates?: boolean;
}

/**
 * InlineEdit component props
 */
export interface InlineEditProps
	extends Omit<
		InputHTMLAttributes<HTMLInputElement>,
		'size' | 'value' | 'defaultValue' | 'onChange' | 'onBlur'
	> {
	/** Current value (controlled) */
	value?: string;
	/** Default value (uncontrolled) */
	defaultValue?: string;
	/** Callback when value is saved (on blur or Enter key) */
	onSave?: (value: string) => void;
	/** Callback when editing is cancelled (on Escape key) */
	onCancel?: () => void;
	/** Callback when value changes during editing */
	onChange?: (value: string) => void;
	/** Placeholder text when value is empty */
	placeholder?: string;
	/** Size of the component @default 'md' */
	size?: StandardSize;
	/** Whether the component is disabled @default false */
	disabled?: boolean;
	/** Custom class name for the display element */
	displayClassName?: string;
	/** Custom class name for the input element */
	inputClassName?: string;
	/** Whether to show empty state placeholder @default true */
	showEmptyPlaceholder?: boolean;
	/** Custom render function for display mode */
	renderDisplay?: (value: string) => ReactNode;
}
