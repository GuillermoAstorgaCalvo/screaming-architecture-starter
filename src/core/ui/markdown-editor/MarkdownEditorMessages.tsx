import type { MarkdownEditorMessagesProps } from './MarkdownEditorTypes';

export function MarkdownEditorMessages({
	editorId,
	error,
	helperText,
}: Readonly<MarkdownEditorMessagesProps>) {
	if (!error && !helperText) return null;

	return (
		<div className="mt-1">
			{error ? (
				<p id={`${editorId}-error`} className="text-sm text-red-600 dark:text-red-400">
					{error}
				</p>
			) : null}
			{helperText && !error ? (
				<p id={`${editorId}-helper`} className="text-sm text-gray-500 dark:text-gray-400">
					{helperText}
				</p>
			) : null}
		</div>
	);
}
