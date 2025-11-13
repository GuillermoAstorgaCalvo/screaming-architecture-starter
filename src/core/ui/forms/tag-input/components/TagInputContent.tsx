import { TagInputField } from '@core/ui/forms/tag-input/components/TagInputField';
import { TagInputLabel } from '@core/ui/forms/tag-input/components/TagInputLabel';
import { TagInputMessages } from '@core/ui/forms/tag-input/components/TagInputMessages';
import { TagInputWrapper } from '@core/ui/forms/tag-input/components/TagInputWrapper';
import type { TagInputContentProps } from '@core/ui/forms/tag-input/types/TagInputTypes';

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
