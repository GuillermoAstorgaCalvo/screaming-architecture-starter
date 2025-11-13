import { SelectContent } from '@core/ui/forms/select/components/SelectContent';
import { useSelectProps } from '@core/ui/forms/select/hooks/useSelect';
import type { SelectProps } from '@src-types/ui/forms';

/**
 * Select - Reusable select/dropdown component with label, error, and helper text support
 *
 * Features:
 * - Accessible: proper ARIA attributes and relationships
 * - Size variants: sm, md, lg
 * - Error and helper text display
 * - Full width option
 * - Dark mode support
 * - Automatic ID generation when label is provided
 * - Custom dropdown arrow icon
 *
 * @example
 * ```tsx
 * <Select
 *   label="Country"
 *   placeholder="Select a country"
 *   required
 *   error={errors.country}
 *   helperText="Choose your country"
 * >
 *   <option value="">Select...</option>
 *   <option value="us">United States</option>
 *   <option value="uk">United Kingdom</option>
 * </Select>
 * ```
 *
 * @example
 * ```tsx
 * <Select
 *   label="Size"
 *   size="lg"
 *   fullWidth
 *   defaultValue="md"
 * >
 *   <option value="sm">Small</option>
 *   <option value="md">Medium</option>
 *   <option value="lg">Large</option>
 * </Select>
 * ```
 */
export default function Select(props: Readonly<SelectProps>) {
	const { state, fieldProps, label, error, helperText, required, fullWidth } = useSelectProps({
		props,
	});
	return (
		<SelectContent
			state={state}
			fieldProps={fieldProps}
			label={label}
			error={error}
			helperText={helperText}
			required={required}
			fullWidth={fullWidth}
		/>
	);
}
