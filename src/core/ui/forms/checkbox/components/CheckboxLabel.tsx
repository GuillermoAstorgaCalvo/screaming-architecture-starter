import type { CheckboxLabelProps } from '@core/ui/forms/checkbox/types/CheckboxTypes';
import Label from '@core/ui/label/Label';

export function CheckboxLabel({ id, label, required, size = 'sm' }: Readonly<CheckboxLabelProps>) {
	return (
		<Label htmlFor={id} required={required ?? false} size={size}>
			{label}
		</Label>
	);
}
