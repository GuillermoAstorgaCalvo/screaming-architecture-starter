import type { RichTextEditorProps } from '@src-types/ui/forms-editors';

import { RichTextEditorContent } from './RichTextEditorContent';
import { useRichTextEditorProps } from './useRichTextEditor';

/**
 * RichTextEditor - WYSIWYG editor for rich text
 *
 * Features:
 * - Full WYSIWYG editing experience
 * - Accessible: proper ARIA attributes and relationships
 * - Size variants: sm, md, lg
 * - Error and helper text display
 * - Full width option
 * - Dark mode support
 * - Automatic ID generation when label is provided
 * - Customizable toolbar
 * - Placeholder support
 *
 * @example
 * ```tsx
 * <RichTextEditor
 *   label="Content"
 *   placeholder="Start typing..."
 *   required
 *   error={errors.content}
 *   helperText="Enter your content here"
 *   onChange={(html) => setContent(html)}
 * />
 * ```
 *
 * @example
 * ```tsx
 * <RichTextEditor
 *   label="Description"
 *   value={content}
 *   minHeight={300}
 *   toolbar={{
 *     bold: true,
 *     italic: true,
 *     headings: true,
 *     link: true,
 *   }}
 * />
 * ```
 */
export default function RichTextEditor(props: Readonly<RichTextEditorProps>) {
	const { state, editorProps, label, error, helperText, required, fullWidth, ...rest } =
		useRichTextEditorProps({ props });

	return (
		<RichTextEditorContent
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
