import ErrorText from '@core/ui/error-text/ErrorText';
import HelperText from '@core/ui/helper-text/HelperText';

import type { TimePickerMessagesProps } from './TimePickerTypes';

export function TimePickerMessages({
	timePickerId,
	error,
	helperText,
}: Readonly<TimePickerMessagesProps>) {
	if (!error && !helperText) return null;
	return (
		<>
			{error ? <ErrorText id={`${timePickerId}-error`}>{error}</ErrorText> : null}
			{helperText ? (
				<HelperText id={`${timePickerId}-helper`} className={error ? 'sr-only' : undefined}>
					{helperText}
				</HelperText>
			) : null}
		</>
	);
}
