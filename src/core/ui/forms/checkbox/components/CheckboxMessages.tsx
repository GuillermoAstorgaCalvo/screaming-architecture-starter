import ErrorText from '@core/ui/error-text/ErrorText';
import type { CheckboxMessagesProps } from '@core/ui/forms/checkbox/types/CheckboxTypes';
import HelperText from '@core/ui/helper-text/HelperText';

export function CheckboxMessages({
	checkboxId,
	error,
	helperText,
}: Readonly<CheckboxMessagesProps>) {
	if (!error && !helperText) {
		return null;
	}

	return (
		<>
			{error ? <ErrorText id={`${checkboxId}-error`}>{error}</ErrorText> : null}
			{helperText ? (
				<HelperText id={`${checkboxId}-helper`} className={error ? 'sr-only' : undefined}>
					{helperText}
				</HelperText>
			) : null}
		</>
	);
}
