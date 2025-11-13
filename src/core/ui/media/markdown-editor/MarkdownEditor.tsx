import type { MarkdownEditorProps } from '@src-types/ui/forms-editors';

import { MarkdownEditorContent } from './MarkdownEditorContent';
import { useMarkdownEditorProps } from './useMarkdownEditor';

/**
 * MarkdownEditor - Markdown editor with preview
 *
 * Features:
 * - Markdown editing with live preview
 * - Accessible: proper ARIA attributes and relationships
 * - Size variants: sm, md, lg
 * - Error and helper text display
 * - Full width option
 * - Dark mode support
 * - Automatic ID generation when label is provided
 * - Multiple view modes: edit, preview, split
 * - Placeholder support
 *
 * @example
 * ```tsx
 * <MarkdownEditor
 *   label="Content"
 *   placeholder="Start typing markdown..."
 *   required
 *   error={errors.content}
 *   helperText="Use markdown syntax"
 *   onChange={(markdown) => setContent(markdown)}
 * />
 * ```
 *
 * @example
 * ```tsx
 * <MarkdownEditor
 *   label="Description"
 *   value={content}
 *   viewMode="split"
 *   showPreview={true}
 *   minHeight={400}
 * />
 * ```
 */
export default function MarkdownEditor(props: Readonly<MarkdownEditorProps>) {
	const { state, editorProps, label, error, helperText, required, fullWidth, ...rest } =
		useMarkdownEditorProps({ props });

	return (
		<MarkdownEditorContent
			state={state}
			editorProps={editorProps}
			label={label}
			error={error}
			helperText={helperText}
			required={required}
			fullWidth={fullWidth}
			{...rest}
		/>
	);
}
