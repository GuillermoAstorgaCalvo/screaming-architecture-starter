import { MarkdownEditorField } from './MarkdownEditorField';
import { MarkdownEditorLabel } from './MarkdownEditorLabel';
import { MarkdownEditorMessages } from './MarkdownEditorMessages';
import type { MarkdownEditorContentProps } from './MarkdownEditorTypes';
import { MarkdownEditorWrapper } from './MarkdownEditorWrapper';

export function MarkdownEditorContent({
	state,
	editorProps,
	label,
	error,
	helperText,
	required,
	fullWidth,
	...props
}: Readonly<MarkdownEditorContentProps>) {
	return (
		<MarkdownEditorWrapper fullWidth={fullWidth} {...props}>
			{label && state.finalId ? (
				<MarkdownEditorLabel id={state.finalId} label={label} required={required} />
			) : null}
			<MarkdownEditorField {...editorProps} />
			{state.finalId ? (
				<MarkdownEditorMessages editorId={state.finalId} error={error} helperText={helperText} />
			) : null}
		</MarkdownEditorWrapper>
	);
}
