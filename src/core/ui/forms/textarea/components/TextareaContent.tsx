import { TextareaField } from '@core/ui/forms/textarea/components/TextareaField';
import { TextareaLabel } from '@core/ui/forms/textarea/components/TextareaLabel';
import { TextareaMessages } from '@core/ui/forms/textarea/components/TextareaMessages';
import { TextareaWrapper } from '@core/ui/forms/textarea/components/TextareaWrapper';
import type { TextareaContentProps } from '@core/ui/forms/textarea/types/TextareaTypes';

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
