import { PhoneInputField } from './PhoneInputField';
import { PhoneInputLabel } from './PhoneInputLabel';
import { PhoneInputMessages } from './PhoneInputMessages';
import type { PhoneInputContentProps } from './PhoneInputTypes';
import { PhoneInputWrapper } from './PhoneInputWrapper';

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
