import type { TagInputLabelProps } from '@core/ui/forms/tag-input/types/TagInputTypes';
import Label from '@core/ui/label/Label';

export function TagInputLabel({ id, label, required }: Readonly<TagInputLabelProps>) {
	return (
		<Label htmlFor={id} required={required ?? false} size="sm">
			{label}
		</Label>
	);
}
