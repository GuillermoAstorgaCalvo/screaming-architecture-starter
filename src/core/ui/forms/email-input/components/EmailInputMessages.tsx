import ErrorText from '@core/ui/error-text/ErrorText';
import type { EmailInputMessagesProps } from '@core/ui/forms/email-input/types/EmailInputTypes';
import HelperText from '@core/ui/helper-text/HelperText';

export function EmailInputMessages({
	inputId,
	error,
	helperText,
}: Readonly<EmailInputMessagesProps>) {
	const hasError = Boolean(error);
	const hasHelperText = Boolean(helperText);

	if (!hasError && !hasHelperText) {
		return null;
	}

	return (
		<>
			{hasError ? <ErrorText id={`${inputId}-error`}>{error}</ErrorText> : null}
			{hasHelperText ? (
				<HelperText id={`${inputId}-helper`} className={hasError ? 'sr-only' : undefined}>
					{helperText}
				</HelperText>
			) : null}
		</>
	);
}
