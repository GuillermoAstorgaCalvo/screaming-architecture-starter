import type { TextareaLabelProps } from '@core/ui/forms/textarea/types/TextareaTypes';
import Label from '@core/ui/label/Label';

export function TextareaLabel({ id, label, required }: Readonly<TextareaLabelProps>) {
	return (
		<Label htmlFor={id} required={required ?? false} size="sm">
			{label}
		</Label>
	);
}
