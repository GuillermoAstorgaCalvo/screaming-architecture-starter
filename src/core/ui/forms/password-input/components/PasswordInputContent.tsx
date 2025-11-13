import { PasswordInputField } from '@core/ui/forms/password-input/components/PasswordInputField';
import { PasswordInputLabel } from '@core/ui/forms/password-input/components/PasswordInputLabel';
import { PasswordInputMessages } from '@core/ui/forms/password-input/components/PasswordInputMessages';
import { PasswordInputWrapper } from '@core/ui/forms/password-input/components/PasswordInputWrapper';
import type { PasswordInputContentProps } from '@core/ui/forms/password-input/types/PasswordInputTypes';

export function PasswordInputContent({
	state,
	fieldProps,
	label,
	error,
	helperText,
	required,
	fullWidth,
}: Readonly<PasswordInputContentProps>) {
	return (
		<PasswordInputWrapper fullWidth={fullWidth}>
			{label && state.finalId ? (
				<PasswordInputLabel id={state.finalId} label={label} required={required} />
			) : null}
			<PasswordInputField {...fieldProps} />
			{state.finalId ? (
				<PasswordInputMessages inputId={state.finalId} error={error} helperText={helperText} />
			) : null}
		</PasswordInputWrapper>
	);
}
