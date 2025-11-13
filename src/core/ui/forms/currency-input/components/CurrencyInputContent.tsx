import { CurrencyInputField } from '@core/ui/forms/currency-input/components/CurrencyInputField';
import { CurrencyInputLabel } from '@core/ui/forms/currency-input/components/CurrencyInputLabel';
import { CurrencyInputMessages } from '@core/ui/forms/currency-input/components/CurrencyInputMessages';
import { CurrencyInputWrapper } from '@core/ui/forms/currency-input/components/CurrencyInputWrapper';
import type { CurrencyInputContentProps } from '@core/ui/forms/currency-input/types/CurrencyInputTypes';

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
