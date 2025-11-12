import { RichTextEditorField } from './RichTextEditorField';
import { RichTextEditorLabel } from './RichTextEditorLabel';
import { RichTextEditorMessages } from './RichTextEditorMessages';
import type { RichTextEditorContentProps } from './RichTextEditorTypes';
import { RichTextEditorWrapper } from './RichTextEditorWrapper';

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
