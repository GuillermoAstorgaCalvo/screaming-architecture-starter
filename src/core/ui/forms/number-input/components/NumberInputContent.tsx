import { NumberInputField } from '@core/ui/forms/number-input/components/NumberInputField';
import { NumberInputLabel } from '@core/ui/forms/number-input/components/NumberInputLabel';
import { NumberInputMessages } from '@core/ui/forms/number-input/components/NumberInputMessages';
import { NumberInputWrapper } from '@core/ui/forms/number-input/components/NumberInputWrapper';
import type { NumberInputContentProps } from '@core/ui/forms/number-input/types/NumberInputTypes';

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
