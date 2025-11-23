import type { RichTextEditorEditorContentProps } from '@core/ui/forms/rich-text-editor/components/RichTextEditorEditorContent';
import { formatHeight } from '@core/ui/forms/rich-text-editor/helpers/RichTextEditorEditor';
import type { useEditor } from '@tiptap/react';

export function getContainerStyle(minHeight?: number | string, maxHeight?: number | string) {
	return {
		minHeight: formatHeight(minHeight),
		maxHeight: formatHeight(maxHeight),
	};
}

/**
 * Creates props for RichTextEditorEditorContent.
 * Editor must be non-null (this function is only called after null checks).
 */
export function getContentProps(
	editor: NonNullable<ReturnType<typeof useEditor>>,
	hasError: boolean,
	ariaDescribedBy?: string
): RichTextEditorEditorContentProps {
	return {
		editor,
		hasError,
		...(ariaDescribedBy && { ariaDescribedBy }),
	};
}
