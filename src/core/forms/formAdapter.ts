/**
 * FormAdapter - Form abstraction layer
 *
 * Provides a library-agnostic interface over form libraries to avoid coupling
 * domain code to specific form implementations. This enables:
 * - Easy swapping of form libraries without changing domain code
 * - Consistent form handling patterns across the application
 * - Simplified testing with mock form implementations
 *
 * Current implementation uses react-hook-form, but domains should depend
 * only on this adapter interface.
 */

import {
	type FieldErrors,
	type FieldValues,
	type FormState,
	useForm,
	type UseFormProps,
	type UseFormReturn,
} from 'react-hook-form';

/**
 * Form control methods exposed by the adapter
 */
export interface FormControls<T extends FieldValues> {
	/**
	 * Register a field with the form
	 * @param _name - Field name/path
	 * @param _options - Optional registration options
	 */
	register: UseFormReturn<T>['register'];

	/**
	 * Handle form submission
	 * @param _onSubmit - Submit handler function
	 */
	handleSubmit: UseFormReturn<T>['handleSubmit'];

	/**
	 * Reset the form to initial values
	 * @param _values - Optional values to reset to
	 */
	reset: UseFormReturn<T>['reset'];

	/**
	 * Set a field value programmatically
	 * @param _name - Field name/path
	 * @param _value - Value to set
	 */
	setValue: UseFormReturn<T>['setValue'];

	/**
	 * Get a field value
	 * @param _name - Field name/path
	 */
	getValues: UseFormReturn<T>['getValues'];

	/**
	 * Trigger validation for specific fields or all fields
	 * @param _name - Optional field name/path, or undefined to validate all
	 */
	trigger: UseFormReturn<T>['trigger'];

	/**
	 * Form state
	 */
	formState: FormState<T>;

	/**
	 * Field errors
	 */
	errors: FieldErrors<T>;

	/**
	 * Watch field values
	 * @param _name - Optional field name/path to watch, or undefined to watch all
	 */
	watch: UseFormReturn<T>['watch'];

	/**
	 * Set field error manually
	 * @param _name - Field name/path
	 * @param _error - Error to set
	 */
	setError: UseFormReturn<T>['setError'];

	/**
	 * Clear field error
	 * @param _name - Field name/path
	 */
	clearErrors: UseFormReturn<T>['clearErrors'];

	/**
	 * Whether the form is valid (no validation errors)
	 */
	isValid: boolean;

	/**
	 * Whether the form is currently being submitted
	 */
	isSubmitting: boolean;

	/**
	 * Whether the form has been modified from its default values
	 */
	isDirty: boolean;

	/**
	 * Get the state of a specific field
	 * @param _name - Field name/path
	 * @returns Field state including error, invalid, isDirty, isTouched, etc.
	 */
	getFieldState: UseFormReturn<T>['getFieldState'];

	/**
	 * Form control object for use with Controller component
	 * Used for controlled components that don't work with register API
	 */
	control: UseFormReturn<T>['control'];
}

/**
 * Configuration options for form initialization
 *
 * Extends react-hook-form's UseFormProps to provide all configuration
 * options while maintaining the adapter abstraction.
 */
export interface UseFormAdapterOptions<T extends FieldValues> extends UseFormProps<T> {}

/**
 * Re-export commonly needed types from react-hook-form for domain use
 *
 * These types are re-exported to allow domains to type their forms
 * without directly depending on react-hook-form. This maintains the
 * adapter abstraction while providing necessary type definitions.
 *
 * - `FieldValues`: Base type for form data
 * - `FieldErrors`: Type for form field errors
 * - `FormState`: Complete form state object
 * - `Path`: Type-safe field path (e.g., 'name' | 'address.street')
 * - `PathValue`: Type-safe field value based on path
 * - `SubmitHandler`: Type-safe submit handler function
 */
export type {
	FieldErrors,
	FieldValues,
	FormState,
	Path,
	PathValue,
	SubmitHandler,
} from 'react-hook-form';

/**
 * Hook to initialize a form using the adapter
 *
 * @param _options - Form configuration options
 * @returns Form controls and state
 */
export function useFormAdapter<T extends FieldValues>(
	_options?: UseFormAdapterOptions<T>
): FormControls<T> {
	const form = useForm<T>(_options);

	return {
		register: form.register,
		handleSubmit: form.handleSubmit,
		reset: form.reset,
		setValue: form.setValue,
		getValues: form.getValues,
		trigger: form.trigger,
		formState: form.formState,
		errors: form.formState.errors,
		watch: form.watch,
		setError: form.setError,
		clearErrors: form.clearErrors,
		getFieldState: form.getFieldState,
		control: form.control,
		isValid: form.formState.isValid,
		isSubmitting: form.formState.isSubmitting,
		isDirty: form.formState.isDirty,
	};
}
