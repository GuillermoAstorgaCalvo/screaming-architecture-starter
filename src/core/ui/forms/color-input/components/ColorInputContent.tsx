import { ColorInputField } from '@core/ui/forms/color-input/components/ColorInputField';
import { ColorInputLabel } from '@core/ui/forms/color-input/components/ColorInputLabel';
import { ColorInputMessages } from '@core/ui/forms/color-input/components/ColorInputMessages';
import { ColorInputWrapper } from '@core/ui/forms/color-input/components/ColorInputWrapper';
import type { ColorInputContentProps } from '@core/ui/forms/color-input/types/ColorInputTypes';

export function ColorInputContent({
	state,
	fieldProps,
	label,
	error,
	helperText,
	required,
	fullWidth,
}: Readonly<ColorInputContentProps>) {
	return (
		<ColorInputWrapper fullWidth={fullWidth}>
			{label && state.finalId ? (
				<ColorInputLabel id={state.finalId} label={label} required={required} />
			) : null}
			<ColorInputField {...fieldProps} />
			{state.finalId ? (
				<ColorInputMessages colorInputId={state.finalId} error={error} helperText={helperText} />
			) : null}
		</ColorInputWrapper>
	);
}
