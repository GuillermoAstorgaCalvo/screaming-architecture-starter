import { EmailInputField } from './EmailInputField';
import { EmailInputLabel } from './EmailInputLabel';
import { EmailInputMessages } from './EmailInputMessages';
import type { EmailInputContentProps } from './EmailInputTypes';
import { EmailInputWrapper } from './EmailInputWrapper';

export function EmailInputContent({
	state,
	fieldProps,
	label,
	error,
	helperText,
	required,
	fullWidth,
}: Readonly<EmailInputContentProps>) {
	return (
		<EmailInputWrapper fullWidth={fullWidth}>
			{label && state.finalId ? (
				<EmailInputLabel id={state.finalId} label={label} required={required} />
			) : null}
			<EmailInputField {...fieldProps} />
			{state.finalId ? (
				<EmailInputMessages inputId={state.finalId} error={error} helperText={helperText} />
			) : null}
		</EmailInputWrapper>
	);
}
