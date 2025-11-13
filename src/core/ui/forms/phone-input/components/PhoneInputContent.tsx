import { PhoneInputField } from '@core/ui/forms/phone-input/components/PhoneInputField';
import { PhoneInputLabel } from '@core/ui/forms/phone-input/components/PhoneInputLabel';
import { PhoneInputMessages } from '@core/ui/forms/phone-input/components/PhoneInputMessages';
import { PhoneInputWrapper } from '@core/ui/forms/phone-input/components/PhoneInputWrapper';
import type { PhoneInputContentProps } from '@core/ui/forms/phone-input/types/PhoneInputTypes';

export function PhoneInputContent({
	state,
	fieldProps,
	label,
	error,
	helperText,
	required,
	fullWidth,
}: Readonly<PhoneInputContentProps>) {
	return (
		<PhoneInputWrapper fullWidth={fullWidth}>
			{label && state.finalId ? (
				<PhoneInputLabel id={state.finalId} label={label} required={required} />
			) : null}
			<PhoneInputField {...fieldProps} />
			{state.finalId ? (
				<PhoneInputMessages inputId={state.finalId} error={error} helperText={helperText} />
			) : null}
		</PhoneInputWrapper>
	);
}
