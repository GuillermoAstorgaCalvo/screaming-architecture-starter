import ErrorText from '@core/ui/error-text/ErrorText';
import HelperText from '@core/ui/helper-text/HelperText';

import type { SliderMessagesProps } from './SliderTypes';

export function SliderMessages({ sliderId, error, helperText }: Readonly<SliderMessagesProps>) {
	if (!error && !helperText) return null;
	return (
		<>
			{error ? <ErrorText id={`${sliderId}-error`}>{error}</ErrorText> : null}
			{helperText ? (
				<HelperText id={`${sliderId}-helper`} className={error ? 'sr-only' : undefined}>
					{helperText}
				</HelperText>
			) : null}
		</>
	);
}
