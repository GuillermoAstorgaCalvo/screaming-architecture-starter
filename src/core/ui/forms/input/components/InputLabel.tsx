import type { InputLabelProps } from '@core/ui/forms/input/types/InputTypes';
import Label from '@core/ui/label/Label';

export function InputLabel({ id, label, required }: Readonly<InputLabelProps>) {
	return (
		<Label htmlFor={id} required={required ?? false} size="sm">
			{label}
		</Label>
	);
}
