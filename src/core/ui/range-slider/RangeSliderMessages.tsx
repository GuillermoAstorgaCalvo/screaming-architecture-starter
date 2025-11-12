import ErrorText from '@core/ui/error-text/ErrorText';
import HelperText from '@core/ui/helper-text/HelperText';

import type { RangeSliderMessagesProps } from './RangeSliderTypes';

export function RangeSliderMessages({
	rangeSliderId,
	error,
	helperText,
}: Readonly<RangeSliderMessagesProps>) {
	if (!error && !helperText) return null;
	return (
		<>
			{error ? <ErrorText id={`${rangeSliderId}-error`}>{error}</ErrorText> : null}
			{helperText ? (
				<HelperText id={`${rangeSliderId}-helper`} className={error ? 'sr-only' : undefined}>
					{helperText}
				</HelperText>
			) : null}
		</>
	);
}
