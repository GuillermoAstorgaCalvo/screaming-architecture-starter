import { EmailInputField } from '@core/ui/forms/email-input/components/EmailInputField';
import { EmailInputLabel } from '@core/ui/forms/email-input/components/EmailInputLabel';
import { EmailInputMessages } from '@core/ui/forms/email-input/components/EmailInputMessages';
import { EmailInputWrapper } from '@core/ui/forms/email-input/components/EmailInputWrapper';
import type { EmailInputContentProps } from '@core/ui/forms/email-input/types/EmailInputTypes';

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
