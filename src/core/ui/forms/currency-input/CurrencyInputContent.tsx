import { CurrencyInputField } from './CurrencyInputField';
import { CurrencyInputLabel } from './CurrencyInputLabel';
import { CurrencyInputMessages } from './CurrencyInputMessages';
import type { CurrencyInputContentProps } from './CurrencyInputTypes';
import { CurrencyInputWrapper } from './CurrencyInputWrapper';

export function CurrencyInputContent({
	state,
	fieldProps,
	label,
	error,
	helperText,
	required,
	fullWidth,
}: Readonly<CurrencyInputContentProps>) {
	return (
		<CurrencyInputWrapper fullWidth={fullWidth}>
			{label && state.finalId ? (
				<CurrencyInputLabel id={state.finalId} label={label} required={required} />
			) : null}
			<CurrencyInputField {...fieldProps} />
			{state.finalId ? (
				<CurrencyInputMessages inputId={state.finalId} error={error} helperText={helperText} />
			) : null}
		</CurrencyInputWrapper>
	);
}
