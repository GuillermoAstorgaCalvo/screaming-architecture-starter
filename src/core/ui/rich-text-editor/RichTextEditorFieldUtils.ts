import type { useEditor } from '@tiptap/react';

import { formatHeight } from './RichTextEditorEditor';
import type { RichTextEditorEditorContentProps } from './RichTextEditorEditorContent';

export function getContainerStyle(minHeight?: number | string, maxHeight?: number | string) {
	return {
		minHeight: formatHeight(minHeight),
		maxHeight: formatHeight(maxHeight),
	};
}

export function getContentProps(
	editor: ReturnType<typeof useEditor>,
	hasError: boolean,
	ariaDescribedBy?: string
): RichTextEditorEditorContentProps {
	return {
		editor,
		hasError,
		...(ariaDescribedBy && { ariaDescribedBy }),
	};
}
