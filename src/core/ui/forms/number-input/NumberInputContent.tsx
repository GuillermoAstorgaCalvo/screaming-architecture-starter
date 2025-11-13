import { NumberInputField } from './NumberInputField';
import { NumberInputLabel } from './NumberInputLabel';
import { NumberInputMessages } from './NumberInputMessages';
import type { NumberInputContentProps } from './NumberInputTypes';
import { NumberInputWrapper } from './NumberInputWrapper';

export function NumberInputContent({
	state,
	fieldProps,
	label,
	error,
	helperText,
	required,
	fullWidth,
}: Readonly<NumberInputContentProps>) {
	return (
		<NumberInputWrapper fullWidth={fullWidth}>
			{label && state.finalId ? (
				<NumberInputLabel id={state.finalId} label={label} required={required} />
			) : null}
			<NumberInputField {...fieldProps} />
			{state.finalId ? (
				<NumberInputMessages inputId={state.finalId} error={error} helperText={helperText} />
			) : null}
		</NumberInputWrapper>
	);
}
