import type { FileUploadLabelProps } from '@core/ui/forms/file-upload/types/FileUploadTypes';
import Label from '@core/ui/label/Label';

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
