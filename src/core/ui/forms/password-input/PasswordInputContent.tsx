import { PasswordInputField } from './PasswordInputField';
import { PasswordInputLabel } from './PasswordInputLabel';
import { PasswordInputMessages } from './PasswordInputMessages';
import type { PasswordInputContentProps } from './PasswordInputTypes';
import { PasswordInputWrapper } from './PasswordInputWrapper';

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
