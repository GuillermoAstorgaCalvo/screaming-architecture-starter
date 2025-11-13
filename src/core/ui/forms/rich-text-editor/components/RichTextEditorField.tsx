import { RichTextEditorEditorContent } from '@core/ui/forms/rich-text-editor/components/RichTextEditorEditorContent';
import {
	type EditorConfigOptions,
	useRichTextEditor,
} from '@core/ui/forms/rich-text-editor/helpers/RichTextEditorEditor';
import {
	getContainerStyle,
	getContentProps,
} from '@core/ui/forms/rich-text-editor/helpers/RichTextEditorFieldUtils';
import type { RichTextEditorFieldProps } from '@core/ui/forms/rich-text-editor/types/RichTextEditorTypes';

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
