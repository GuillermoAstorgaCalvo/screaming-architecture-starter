import { OTPInputField } from '@core/ui/forms/otp-input/components/OTPInputField';
import { OTPInputLabel } from '@core/ui/forms/otp-input/components/OTPInputLabel';
import { OTPInputMessages } from '@core/ui/forms/otp-input/components/OTPInputMessages';
import { OTPInputWrapper } from '@core/ui/forms/otp-input/components/OTPInputWrapper';
import type { OTPInputContentProps } from '@core/ui/forms/otp-input/types/OTPInputTypes';

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
