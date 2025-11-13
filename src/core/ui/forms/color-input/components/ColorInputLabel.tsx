import type { ColorInputLabelProps } from '@core/ui/forms/color-input/types/ColorInputTypes';
import Label from '@core/ui/label/Label';

export function ColorInputLabel({ id, label, required }: Readonly<ColorInputLabelProps>) {
	return (
		<Label htmlFor={id} required={required ?? false} size="sm">
			{label}
		</Label>
	);
}
