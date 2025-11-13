import { TextareaField } from './TextareaField';
import { TextareaLabel } from './TextareaLabel';
import { TextareaMessages } from './TextareaMessages';
import type { TextareaContentProps } from './TextareaTypes';
import { TextareaWrapper } from './TextareaWrapper';

export function TextareaContent({
	state,
	fieldProps,
	label,
	error,
	helperText,
	required,
	fullWidth,
	...props
}: Readonly<TextareaContentProps>) {
	return (
		<TextareaWrapper fullWidth={fullWidth} {...props}>
			{label && state.finalId ? (
				<TextareaLabel id={state.finalId} label={label} required={required} />
			) : null}
			<TextareaField {...fieldProps} />
			{state.finalId ? (
				<TextareaMessages textareaId={state.finalId} error={error} helperText={helperText} />
			) : null}
		</TextareaWrapper>
	);
}
