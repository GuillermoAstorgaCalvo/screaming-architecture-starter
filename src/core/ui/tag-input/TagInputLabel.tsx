import Label from '@core/ui/label/Label';

import type { TagInputLabelProps } from './TagInputTypes';

export function TagInputLabel({ id, label, required }: Readonly<TagInputLabelProps>) {
	return (
		<Label htmlFor={id} required={required ?? false} size="sm">
			{label}
		</Label>
	);
}
