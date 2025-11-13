import ErrorText from '@core/ui/error-text/ErrorText';
import type { CurrencyInputMessagesProps } from '@core/ui/forms/currency-input/types/CurrencyInputTypes';
import HelperText from '@core/ui/helper-text/HelperText';

export function CurrencyInputMessages({
	inputId,
	error,
	helperText,
}: Readonly<CurrencyInputMessagesProps>) {
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
