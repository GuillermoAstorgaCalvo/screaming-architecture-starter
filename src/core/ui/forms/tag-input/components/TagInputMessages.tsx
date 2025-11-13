import ErrorText from '@core/ui/error-text/ErrorText';
import HelperText from '@core/ui/helper-text/HelperText';

import type { TagInputMessagesProps } from './TagInputTypes';

export function TagInputMessages({ inputId, error, helperText }: Readonly<TagInputMessagesProps>) {
	const hasError = Boolean(error);
	const hasHelperText = Boolean(helperText);

	if (!hasError && !hasHelperText) {
		return null;
	}

	return (
		<>
			{hasError ? <ErrorText id={`${inputId}-error`}>{error}</ErrorText> : null}
			{hasHelperText ? (
				<HelperText id={`${inputId}-helper`} className={hasError ? 'sr-only' : undefined}>
					{helperText}
				</HelperText>
			) : null}
		</>
	);
}
