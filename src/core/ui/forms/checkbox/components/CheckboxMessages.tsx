import ErrorText from '@core/ui/error-text/ErrorText';
import HelperText from '@core/ui/helper-text/HelperText';

import type { CheckboxMessagesProps } from './CheckboxTypes';

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
