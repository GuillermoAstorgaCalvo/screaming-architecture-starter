import { TagInputField } from './TagInputField';
import { TagInputLabel } from './TagInputLabel';
import { TagInputMessages } from './TagInputMessages';
import type { TagInputContentProps } from './TagInputTypes';
import { TagInputWrapper } from './TagInputWrapper';

export function TagInputContent({
	state,
	fieldProps,
	label,
	error,
	helperText,
	required,
	fullWidth,
}: Readonly<TagInputContentProps>) {
	return (
		<TagInputWrapper fullWidth={fullWidth}>
			{label && state.finalId ? (
				<TagInputLabel id={state.finalId} label={label} required={required} />
			) : null}
			<TagInputField {...fieldProps} />
			{state.finalId ? (
				<TagInputMessages inputId={state.finalId} error={error} helperText={helperText} />
			) : null}
		</TagInputWrapper>
	);
}
