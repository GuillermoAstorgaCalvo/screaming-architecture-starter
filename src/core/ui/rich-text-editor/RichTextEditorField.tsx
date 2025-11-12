import { type EditorConfigOptions, useRichTextEditor } from './RichTextEditorEditor';
import { RichTextEditorEditorContent } from './RichTextEditorEditorContent';
import { getContainerStyle, getContentProps } from './RichTextEditorFieldUtils';
import type { RichTextEditorFieldProps } from './RichTextEditorTypes';

export function RichTextEditorField({
	id: _id,
	className,
	hasError,
	ariaDescribedBy,
	disabled,
	required: _required,
	value,
	defaultValue,
	onChange,
	placeholder,
	readOnly,
	minHeight,
	maxHeight,
	extensions,
	toolbar,
}: Readonly<RichTextEditorFieldProps>) {
	const editorOptions: EditorConfigOptions = {
		extensions,
		toolbar,
		placeholder,
		value,
		defaultValue,
		disabled,
		readOnly,
		onChange,
	};

	const editor = useRichTextEditor(editorOptions);

	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	if (!editor) {
		return null;
	}

	return (
		<div className={className} style={getContainerStyle(minHeight, maxHeight)}>
			<RichTextEditorEditorContent {...getContentProps(editor, hasError, ariaDescribedBy)} />
		</div>
	);
}
