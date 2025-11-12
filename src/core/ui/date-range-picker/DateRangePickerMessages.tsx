import ErrorText from '@core/ui/error-text/ErrorText';
import HelperText from '@core/ui/helper-text/HelperText';

import type { DateRangePickerMessagesProps } from './DateRangePickerTypes';

export function DateRangePickerMessages({
	dateRangePickerId,
	error,
	helperText,
}: Readonly<DateRangePickerMessagesProps>) {
	if (!error && !helperText) return null;
	return (
		<>
			{error ? <ErrorText id={`${dateRangePickerId}-error`}>{error}</ErrorText> : null}
			{helperText ? (
				<HelperText id={`${dateRangePickerId}-helper`} className={error ? 'sr-only' : undefined}>
					{helperText}
				</HelperText>
			) : null}
		</>
	);
}
