import ErrorText from '@core/ui/error-text/ErrorText';
import HelperText from '@core/ui/helper-text/HelperText';

import type { TextareaMessagesProps } from './TextareaTypes';

export function TextareaMessages({
	textareaId,
	error,
	helperText,
}: Readonly<TextareaMessagesProps>) {
	const hasError = Boolean(error);
	const hasHelperText = Boolean(helperText);

	if (!hasError && !hasHelperText) {
		return null;
	}

	return (
		<>
			{hasError ? <ErrorText id={`${textareaId}-error`}>{error}</ErrorText> : null}
			{hasHelperText && !hasError ? (
				<HelperText id={`${textareaId}-helper`}>{helperText}</HelperText>
			) : null}
		</>
	);
}
