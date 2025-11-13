import type { ColorPickerLabelProps } from '@core/ui/forms/color-picker/types/ColorPickerTypes';
import Label from '@core/ui/label/Label';

export function ColorPickerLabel({ id, label, required, size }: Readonly<ColorPickerLabelProps>) {
	return (
		<Label htmlFor={id} required={required ?? false} size={size ?? 'md'}>
			{label}
		</Label>
	);
}
