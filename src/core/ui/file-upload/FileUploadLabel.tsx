import Label from '@core/ui/label/Label';

import type { FileUploadLabelProps } from './FileUploadTypes';

export function FileUploadLabel({
	id,
	label,
	required,
	size = 'sm',
}: Readonly<FileUploadLabelProps>) {
	return (
		<Label htmlFor={id} required={required ?? false} size={size}>
			{label}
		</Label>
	);
}
