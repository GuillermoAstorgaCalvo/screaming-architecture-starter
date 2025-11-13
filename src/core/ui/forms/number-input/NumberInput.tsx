import { NumberInputContent } from '@core/ui/forms/number-input/components/NumberInputContent';
import { useNumberInputProps } from '@core/ui/forms/number-input/hooks/useNumberInput';
import type { NumberInputProps } from '@src-types/ui/forms-inputs';

/**
 * NumberInput - Specialized number input with increment/decrement controls
 *
 * Features:
 * - Accessible: proper ARIA attributes and relationships
 * - Increment/decrement buttons with arrow icons
 * - Size variants: sm, md, lg
 * - Error and helper text display
 * - Full width option
 * - Min/max/step support
 * - Dark mode support
 * - Automatic ID generation when label is provided
 * - Disabled state for buttons when min/max limits are reached
 *
 * @example
 * ```tsx
 * <NumberInput
 *   label="Quantity"
 *   min={0}
 *   max={100}
 *   step={1}
 *   value={quantity}
 *   onChange={setQuantity}
 *   error={errors.quantity}
 *   helperText="Enter a quantity between 0 and 100"
 * />
 * ```
 *
 * @example
 * ```tsx
 * <NumberInput
 *   label="Price"
 *   min={0}
 *   step={0.01}
 *   value={price}
 *   onChange={setPrice}
 *   size="lg"
 *   fullWidth
 * />
 * ```
 */
export default function NumberInput(props: Readonly<NumberInputProps>) {
	const { state, fieldProps, label, error, helperText, required, fullWidth } = useNumberInputProps({
		props,
	});
	return (
		<NumberInputContent
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
