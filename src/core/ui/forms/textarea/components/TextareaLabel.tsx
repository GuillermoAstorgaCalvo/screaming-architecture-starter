import Label from '@core/ui/label/Label';

import type { TextareaLabelProps } from './TextareaTypes';

export function TextareaLabel({ id, label, required }: Readonly<TextareaLabelProps>) {
	return (
		<Label htmlFor={id} required={required ?? false} size="sm">
			{label}
		</Label>
	);
}
