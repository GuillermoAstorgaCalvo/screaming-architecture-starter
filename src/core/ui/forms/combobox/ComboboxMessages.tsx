import ErrorText from '@core/ui/error-text/ErrorText';
import HelperText from '@core/ui/helper-text/HelperText';

export interface ComboboxMessagesProps {
	readonly comboboxId: string;
	readonly error?: string;
	readonly helperText?: string;
}

export function ComboboxMessages({
	comboboxId,
	error,
	helperText,
}: Readonly<ComboboxMessagesProps>) {
	return (
		<>
			{error ? (
				<ErrorText id={`${comboboxId}-error`} aria-live="polite">
					{error}
				</ErrorText>
			) : null}
			{helperText && !error ? (
				<HelperText id={`${comboboxId}-helper`}>{helperText}</HelperText>
			) : null}
		</>
	);
}
