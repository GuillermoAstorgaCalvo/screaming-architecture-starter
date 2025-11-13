import ErrorText from '@core/ui/error-text/ErrorText';
import HelperText from '@core/ui/helper-text/HelperText';

// ============================================================================
// Messages Component
// ============================================================================

interface SelectMessagesProps {
	readonly selectId: string;
	readonly error?: string | undefined;
	readonly helperText?: string | undefined;
}

export function SelectMessages({ selectId, error, helperText }: Readonly<SelectMessagesProps>) {
	if (!error && !helperText) {
		return null;
	}

	return (
		<>
			{error ? <ErrorText id={`${selectId}-error`}>{error}</ErrorText> : null}
			{helperText ? (
				<HelperText id={`${selectId}-helper`} className={error ? 'sr-only' : undefined}>
					{helperText}
				</HelperText>
			) : null}
		</>
	);
}
