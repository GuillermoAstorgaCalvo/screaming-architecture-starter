import { EditorContent, type useEditor } from '@tiptap/react';

export interface RichTextEditorEditorContentProps {
	readonly editor: ReturnType<typeof useEditor>;
	readonly hasError: boolean;
	readonly ariaDescribedBy?: string;
}

export function RichTextEditorEditorContent({
	editor,
	hasError,
	ariaDescribedBy,
}: Readonly<RichTextEditorEditorContentProps>) {
	return (
		<div
			className="rounded border border-gray-300 bg-white p-2 dark:border-gray-600 dark:bg-gray-800"
			aria-invalid={hasError}
			aria-describedby={ariaDescribedBy}
		>
			<EditorContent editor={editor} />
		</div>
	);
}
