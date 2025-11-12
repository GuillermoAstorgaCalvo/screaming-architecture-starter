/**
 * Form-related types
 *
 * Provides form-related type definitions for use across the application.
 */

// Import FieldValues for use in this file's types
import type { FieldValues } from 'react-hook-form';

/**
 * Common form field types
 */
export type FormFieldType =
	| 'text'
	| 'email'
	| 'password'
	| 'number'
	| 'tel'
	| 'url'
	| 'search'
	| 'date'
	| 'datetime-local'
	| 'time'
	| 'month'
	| 'week'
	| 'color'
	| 'file'
	| 'checkbox'
	| 'radio'
	| 'textarea'
	| 'select';

/**
 * Form validation error structure
 */
export interface FormValidationError {
	/** Field name or path */
	field: string;
	/** Error message */
	message: string;
	/** Error type or code */
	type?: string;
}

/**
 * Form submission state
 */
export interface FormSubmissionState {
	/** Whether the form is currently being submitted */
	isSubmitting: boolean;
	/** Whether the form submission was successful */
	isSuccess: boolean;
	/** Whether the form submission failed */
	isError: boolean;
	/** Submission error message */
	error: string | null;
}

/**
 * Generic form data type
 */
export type FormData<T extends Record<string, unknown> = Record<string, unknown>> = T;

/**
 * Form field value type
 */
export type FormFieldValue = string | number | boolean | File | File[] | null | undefined;

/**
 * Form reset options
 */
export interface FormResetOptions<T extends FieldValues> {
	/** Values to reset to (defaults to initial values) */
	values?: Partial<T>;
	/** Whether to reset errors */
	keepErrors?: boolean;
	/** Whether to keep dirty state */
	keepDirty?: boolean;
	/** Whether to keep values */
	keepValues?: boolean;
	/** Whether to keep default values */
	keepDefaultValues?: boolean;
}
