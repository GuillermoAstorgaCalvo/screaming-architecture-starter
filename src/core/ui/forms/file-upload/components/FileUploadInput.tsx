import type { FileUploadInputProps } from './FileUploadContentHelpers';

export function FileUploadInput({
	inputId,
	multiple,
	accept,
	disabled,
	required,
	fileUploadId,
	onChange,
	inputRef,
}: Readonly<FileUploadInputProps>) {
	return (
		<input
			ref={inputRef}
			id={inputId}
			type="file"
			multiple={multiple}
			accept={accept}
			onChange={onChange}
			disabled={disabled}
			required={required}
			className="hidden"
			aria-describedby={
				fileUploadId ? `${fileUploadId}-error ${fileUploadId}-helper`.trim() : undefined
			}
		/>
	);
}
