import { InputField } from './InputField';
import { InputLabel } from './InputLabel';
import { InputMessages } from './InputMessages';
import type { InputContentProps } from './InputTypes';
import { InputWrapper } from './InputWrapper';

export function InputContent({
	state,
	fieldProps,
	label,
	error,
	helperText,
	required,
	fullWidth,
}: Readonly<InputContentProps>) {
	return (
		<InputWrapper fullWidth={fullWidth}>
			{label && state.finalId ? (
				<InputLabel id={state.finalId} label={label} required={required} />
			) : null}
			<InputField {...fieldProps} />
			{state.finalId ? (
				<InputMessages inputId={state.finalId} error={error} helperText={helperText} />
			) : null}
		</InputWrapper>
	);
}
