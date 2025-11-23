import { EditorContent, type useEditor } from '@tiptap/react';

/**
 * Props for RichTextEditorEditorContent.
 * Editor is non-nullable here because this component is only called
 * after a null check in the parent component.
 */
export interface RichTextEditorEditorContentProps {
	readonly editor: NonNullable<ReturnType<typeof useEditor>>;
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
			className="rounded border border-border bg-surface p-2 dark:border-border dark:bg-surface"
			aria-invalid={hasError}
			aria-describedby={ariaDescribedBy}
		>
			<EditorContent editor={editor} />
		</div>
	);
}
