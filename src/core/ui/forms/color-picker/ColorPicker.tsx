import { ColorPickerContent } from '@core/ui/forms/color-picker/components/ColorPickerContent';
import { useColorPickerProps } from '@core/ui/forms/color-picker/hooks/useColorPicker';
import type { ColorPickerProps } from '@src-types/ui/forms-advanced';

/**
 * ColorPicker - Color selection component with input and preset swatches
 *
 * Features:
 * - Native color input support
 * - Preset color swatches
 * - Label, error, and helper text support
 * - Size variants: sm, md, lg
 * - Full width option
 * - Dark mode support
 * - Accessible ARIA attributes
 *
 * @example
 * ```tsx
 * <ColorPicker
 *   label="Choose a color"
 *   value="#ff0000"
 *   onChange={(color) => console.log(color)}
 * />
 * ```
 *
 * @example
 * ```tsx
 * <ColorPicker
 *   label="Theme Color"
 *   swatches={['#ff0000', '#00ff00', '#0000ff']}
 *   showSwatches
 *   helperText="Select a theme color"
 * />
 * ```
 */
export default function ColorPicker(props: Readonly<ColorPickerProps>) {
	const { contentProps } = useColorPickerProps({ props });
	return <ColorPickerContent {...contentProps} />;
}
