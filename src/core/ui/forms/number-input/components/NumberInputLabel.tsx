import type { NumberInputLabelProps } from '@core/ui/forms/number-input/types/NumberInputTypes';
import Label from '@core/ui/label/Label';

export function NumberInputLabel({ id, label, required }: Readonly<NumberInputLabelProps>) {
	return (
		<Label htmlFor={id} required={required ?? false} size="sm">
			{label}
		</Label>
	);
}
