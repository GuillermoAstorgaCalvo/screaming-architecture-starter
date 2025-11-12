import { OTPInputField } from './OTPInputField';
import { OTPInputLabel } from './OTPInputLabel';
import { OTPInputMessages } from './OTPInputMessages';
import type { OTPInputContentProps } from './OTPInputTypes';
import { OTPInputWrapper } from './OTPInputWrapper';

export function OTPInputContent({
	state,
	fieldProps,
	label,
	error,
	helperText,
	required,
	fullWidth,
}: Readonly<OTPInputContentProps>) {
	return (
		<OTPInputWrapper fullWidth={fullWidth}>
			{label && state.finalId ? (
				<OTPInputLabel id={state.finalId} label={label} required={required} />
			) : null}
			<OTPInputField {...fieldProps} />
			{state.finalId ? (
				<OTPInputMessages inputId={state.finalId} error={error} helperText={helperText} />
			) : null}
		</OTPInputWrapper>
	);
}
