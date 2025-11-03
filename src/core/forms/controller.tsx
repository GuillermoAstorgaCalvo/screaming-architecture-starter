/**
 * Controller - Controlled component wrapper for forms
 *
 * Provides a controlled component interface for form fields that don't work
 * with the `register` API (e.g., third-party UI libraries, custom components).
 *
 * This is a re-export from react-hook-form through the adapter layer to maintain
 * the abstraction while providing necessary functionality.
 *
 * Usage:
 * ```tsx
 * import { Controller } from '@core/forms/controller';
 * import { useFormAdapter } from '@core/forms/formAdapter';
 * import MyCustomInput from './MyCustomInput';
 *
 * const { control } = useFormAdapter();
 *
 * <Controller
 *   name="email"
 *   control={control}
 *   render={({ field }) => (
 *     <MyCustomInput {...field} />
 *   )}
 * />
 * ```
 */

export { Controller } from 'react-hook-form';
