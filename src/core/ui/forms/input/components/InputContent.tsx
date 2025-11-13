import { InputField } from '@core/ui/forms/input/components/InputField';
import { InputLabel } from '@core/ui/forms/input/components/InputLabel';
import { InputMessages } from '@core/ui/forms/input/components/InputMessages';
import { InputWrapper } from '@core/ui/forms/input/components/InputWrapper';
import type { InputContentProps } from '@core/ui/forms/input/types/InputTypes';

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
