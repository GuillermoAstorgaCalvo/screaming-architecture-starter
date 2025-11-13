import { ColorInputContent } from '@core/ui/forms/color-input/components/ColorInputContent';
import { useColorInputProps } from '@core/ui/forms/color-input/hooks/useColorInput';
import type { ColorInputProps } from '@src-types/ui/forms';

/**
 * ColorInput - Simple native color input wrapper
 *
 * Features:
 * - Native color input support
 * - Label, error, and helper text support
 * - Size variants: sm, md, lg
 * - Full width option
 * - Dark mode support
 * - Accessible ARIA attributes
 * - Automatic ID generation when label is provided
 *
 * @example
 * ```tsx
 * <ColorInput
 *   label="Choose a color"
 *   value="#ff0000"
 *   onChange={(color) => console.log(color)}
 * />
 * ```
 *
 * @example
 * ```tsx
 * <ColorInput
 *   label="Theme Color"
 *   helperText="Select a theme color"
 *   error={errors.color}
 *   size="lg"
 *   fullWidth
 * />
 * ```
 */
export default function ColorInput(props: Readonly<ColorInputProps>) {
	const { state, fieldProps, label, error, helperText, required, fullWidth } = useColorInputProps({
		props,
	});
	return (
		<ColorInputContent
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
