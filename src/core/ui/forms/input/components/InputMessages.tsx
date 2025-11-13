import ErrorText from '@core/ui/error-text/ErrorText';
import type { InputMessagesProps } from '@core/ui/forms/input/types/InputTypes';
import HelperText from '@core/ui/helper-text/HelperText';

export function InputMessages({ inputId, error, helperText }: Readonly<InputMessagesProps>) {
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
