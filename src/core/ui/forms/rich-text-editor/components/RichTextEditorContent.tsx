import { RichTextEditorField } from '@core/ui/forms/rich-text-editor/components/RichTextEditorField';
import { RichTextEditorLabel } from '@core/ui/forms/rich-text-editor/components/RichTextEditorLabel';
import { RichTextEditorMessages } from '@core/ui/forms/rich-text-editor/components/RichTextEditorMessages';
import { RichTextEditorWrapper } from '@core/ui/forms/rich-text-editor/components/RichTextEditorWrapper';
import type { RichTextEditorContentProps } from '@core/ui/forms/rich-text-editor/types/RichTextEditorTypes';

export function RichTextEditorContent({
	state,
	editorProps,
	label,
	error,
	helperText,
	required,
	fullWidth,
	...props
}: Readonly<RichTextEditorContentProps>) {
	return (
		<RichTextEditorWrapper fullWidth={fullWidth} {...props}>
			{label && state.finalId ? (
				<RichTextEditorLabel id={state.finalId} label={label} required={required} />
			) : null}
			<RichTextEditorField {...editorProps} />
			{state.finalId ? (
				<RichTextEditorMessages editorId={state.finalId} error={error} helperText={helperText} />
			) : null}
		</RichTextEditorWrapper>
	);
}
