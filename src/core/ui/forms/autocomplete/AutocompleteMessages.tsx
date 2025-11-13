import ErrorText from '@core/ui/error-text/ErrorText';
import HelperText from '@core/ui/helper-text/HelperText';

export interface AutocompleteMessagesProps {
	readonly autocompleteId: string;
	readonly error?: string;
	readonly helperText?: string;
}

export function AutocompleteMessages({
	autocompleteId,
	error,
	helperText,
}: Readonly<AutocompleteMessagesProps>) {
	return (
		<>
			{error ? (
				<ErrorText id={`${autocompleteId}-error`} aria-live="polite">
					{error}
				</ErrorText>
			) : null}
			{helperText && !error ? (
				<HelperText id={`${autocompleteId}-helper`}>{helperText}</HelperText>
			) : null}
		</>
	);
}
