/**
 * useController - Hook for controlled components in forms
 *
 * Provides a hook interface for form fields that don't work with the `register` API.
 * This is used when you need more control than the Controller component provides.
 *
 * This is a re-export from react-hook-form through the adapter layer to maintain
 * the abstraction while providing necessary functionality.
 *
 * Usage:
 * ```tsx
 * import { useController } from '@core/forms/useController';
 * import { useFormAdapter } from '@core/forms/formAdapter';
 * import MyCustomInput from './MyCustomInput';
 *
 * const { control } = useFormAdapter();
 * const { field, fieldState } = useController({
 *   name: 'email',
 *   control,
 * });
 *
 * <MyCustomInput {...field} />
 * ```
 */

export { useController } from 'react-hook-form';

// Re-export Controller-related types for type-safe usage
export type {
	ControllerProps,
	ControllerRenderProps,
	FieldPath,
	UseControllerProps,
	UseControllerReturn,
} from 'react-hook-form';
