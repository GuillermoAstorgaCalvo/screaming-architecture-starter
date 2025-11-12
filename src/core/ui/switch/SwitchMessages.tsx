import ErrorText from '@core/ui/error-text/ErrorText';
import HelperText from '@core/ui/helper-text/HelperText';

import type { SwitchMessagesProps } from './SwitchTypes';

export function SwitchMessages({ switchId, error, helperText }: Readonly<SwitchMessagesProps>) {
	if (!error && !helperText) return null;
	return (
		<>
			{error ? <ErrorText id={`${switchId}-error`}>{error}</ErrorText> : null}
			{helperText ? (
				<HelperText id={`${switchId}-helper`} className={error ? 'sr-only' : undefined}>
					{helperText}
				</HelperText>
			) : null}
		</>
	);
}
