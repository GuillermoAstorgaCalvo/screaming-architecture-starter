import ErrorText from '@core/ui/error-text/ErrorText';
import type { SearchInputMessagesProps } from '@core/ui/forms/search-input/types/SearchInputTypes';
import HelperText from '@core/ui/helper-text/HelperText';

export function SearchInputMessages({
	inputId,
	error,
	helperText,
}: Readonly<SearchInputMessagesProps>) {
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
