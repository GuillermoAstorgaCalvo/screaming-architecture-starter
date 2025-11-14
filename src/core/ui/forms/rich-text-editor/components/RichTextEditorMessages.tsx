import type { RichTextEditorMessagesProps } from '@core/ui/forms/rich-text-editor/types/RichTextEditorTypes';

export function RichTextEditorMessages({
	editorId,
	error,
	helperText,
}: Readonly<RichTextEditorMessagesProps>) {
	if (!error && !helperText) return null;

	return (
		<div className="mt-1">
			{error ? (
				<p id={`${editorId}-error`} className="text-sm text-destructive">
					{error}
				</p>
			) : null}
			{helperText && !error ? (
				<p id={`${editorId}-helper`} className="text-sm text-text-muted">
					{helperText}
				</p>
			) : null}
		</div>
	);
}
