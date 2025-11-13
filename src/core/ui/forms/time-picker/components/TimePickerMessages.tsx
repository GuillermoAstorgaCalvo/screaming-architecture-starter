import ErrorText from '@core/ui/error-text/ErrorText';
import type { TimePickerMessagesProps } from '@core/ui/forms/time-picker/types/TimePickerTypes';
import HelperText from '@core/ui/helper-text/HelperText';

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
