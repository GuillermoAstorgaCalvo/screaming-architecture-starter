import ErrorText from '@core/ui/error-text/ErrorText';
import HelperText from '@core/ui/helper-text/HelperText';

import type { ColorInputMessagesProps } from './ColorInputTypes';

export function ColorInputMessages({
	colorInputId,
	error,
	helperText,
}: Readonly<ColorInputMessagesProps>) {
	const hasError = Boolean(error);
	const hasHelperText = Boolean(helperText);

	if (!hasError && !hasHelperText) {
		return null;
	}

	return (
		<>
			{hasError ? <ErrorText id={`${colorInputId}-error`}>{error}</ErrorText> : null}
			{hasHelperText ? (
				<HelperText id={`${colorInputId}-helper`} className={hasError ? 'sr-only' : undefined}>
					{helperText}
				</HelperText>
			) : null}
		</>
	);
}
