import { FileUploadFieldWithLabel } from './FileUploadContent.components';
import { FileUploadMessages } from './FileUploadMessages';
import type { FileUploadContentProps } from './FileUploadTypes';
import { FileUploadWrapper } from './FileUploadWrapper';

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
