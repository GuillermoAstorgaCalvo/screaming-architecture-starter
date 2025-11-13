import ErrorText from '@core/ui/error-text/ErrorText';
import type { DatePickerMessagesProps } from '@core/ui/forms/date-picker/types/DatePickerTypes';
import HelperText from '@core/ui/helper-text/HelperText';

export function DatePickerMessages({
	datePickerId,
	error,
	helperText,
}: Readonly<DatePickerMessagesProps>) {
	if (!error && !helperText) return null;
	return (
		<>
			{error ? <ErrorText id={`${datePickerId}-error`}>{error}</ErrorText> : null}
			{helperText ? (
				<HelperText id={`${datePickerId}-helper`} className={error ? 'sr-only' : undefined}>
					{helperText}
				</HelperText>
			) : null}
		</>
	);
}
