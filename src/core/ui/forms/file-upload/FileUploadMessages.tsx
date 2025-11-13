import ErrorText from '@core/ui/error-text/ErrorText';
import HelperText from '@core/ui/helper-text/HelperText';

import type { FileUploadMessagesProps } from './FileUploadTypes';

export function FileUploadMessages({
	fileUploadId,
	error,
	helperText,
}: Readonly<FileUploadMessagesProps>) {
	if (!error && !helperText) return null;
	return (
		<>
			{error ? <ErrorText id={`${fileUploadId}-error`}>{error}</ErrorText> : null}
			{helperText ? (
				<HelperText id={`${fileUploadId}-helper`} className={error ? 'sr-only' : undefined}>
					{helperText}
				</HelperText>
			) : null}
		</>
	);
}
