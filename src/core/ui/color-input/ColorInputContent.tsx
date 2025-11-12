import { ColorInputField } from './ColorInputField';
import { ColorInputLabel } from './ColorInputLabel';
import { ColorInputMessages } from './ColorInputMessages';
import type { ColorInputContentProps } from './ColorInputTypes';
import { ColorInputWrapper } from './ColorInputWrapper';

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
