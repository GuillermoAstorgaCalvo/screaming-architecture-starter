import ErrorText from '@core/ui/error-text/ErrorText';
import type { PasswordInputMessagesProps } from '@core/ui/forms/password-input/types/PasswordInputTypes';
import HelperText from '@core/ui/helper-text/HelperText';

export function PasswordInputMessages({
	inputId,
	error,
	helperText,
}: Readonly<PasswordInputMessagesProps>) {
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
