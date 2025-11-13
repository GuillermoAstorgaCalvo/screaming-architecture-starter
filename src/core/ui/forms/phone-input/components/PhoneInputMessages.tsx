import ErrorText from '@core/ui/error-text/ErrorText';
import type { PhoneInputMessagesProps } from '@core/ui/forms/phone-input/types/PhoneInputTypes';
import HelperText from '@core/ui/helper-text/HelperText';

export function PhoneInputMessages({
	inputId,
	error,
	helperText,
}: Readonly<PhoneInputMessagesProps>) {
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
