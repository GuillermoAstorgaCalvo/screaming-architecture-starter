import { FileUploadFieldWithLabel } from '@core/ui/forms/file-upload/components/FileUploadContent.components';
import { FileUploadMessages } from '@core/ui/forms/file-upload/components/FileUploadMessages';
import { FileUploadWrapper } from '@core/ui/forms/file-upload/components/FileUploadWrapper';
import type { FileUploadContentProps } from '@core/ui/forms/file-upload/types/FileUploadTypes';

export function FileUploadContent(props: Readonly<FileUploadContentProps>) {
	const { fileUploadId, error, helperText, fullWidth } = props;
	return (
		<FileUploadWrapper fullWidth={fullWidth}>
			<FileUploadFieldWithLabel {...props} />
			{fileUploadId ? (
				<FileUploadMessages fileUploadId={fileUploadId} error={error} helperText={helperText} />
			) : null}
		</FileUploadWrapper>
	);
}
