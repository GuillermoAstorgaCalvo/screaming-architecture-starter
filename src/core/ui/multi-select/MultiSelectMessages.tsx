import ErrorText from '@core/ui/error-text/ErrorText';
import HelperText from '@core/ui/helper-text/HelperText';

export interface MultiSelectMessagesProps {
	readonly multiSelectId: string;
	readonly error?: string;
	readonly helperText?: string;
}

export function MultiSelectMessages({
	multiSelectId,
	error,
	helperText,
}: Readonly<MultiSelectMessagesProps>) {
	return (
		<>
			{error ? (
				<ErrorText id={`${multiSelectId}-error`} aria-live="polite">
					{error}
				</ErrorText>
			) : null}
			{helperText && !error ? (
				<HelperText id={`${multiSelectId}-helper`}>{helperText}</HelperText>
			) : null}
		</>
	);
}
