import ErrorText from '@core/ui/error-text/ErrorText';
import type { NumberInputMessagesProps } from '@core/ui/forms/number-input/types/NumberInputTypes';
import HelperText from '@core/ui/helper-text/HelperText';

export function NumberInputMessages({
	inputId,
	error,
	helperText,
}: Readonly<NumberInputMessagesProps>) {
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
