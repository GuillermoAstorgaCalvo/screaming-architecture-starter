import { useId } from 'react';

import {
	generateEditorId,
	getAriaDescribedBy,
	getMarkdownEditorClasses,
} from './MarkdownEditorHelpers';
import type {
	UseMarkdownEditorStateOptions,
	UseMarkdownEditorStateReturn,
} from './MarkdownEditorTypes';

/**
 * Hook to compute markdown editor state (ID, error state, ARIA attributes, and classes)
 *
 * Generates a unique ID for the editor if not provided, determines error state,
 * builds ARIA described-by attributes, and computes CSS classes based on
 * size and error state.
 *
 * @param options - Configuration options for markdown editor state
 * @returns Computed markdown editor state including ID, error flag, ARIA attributes, and classes
 */
export function useMarkdownEditorState({
	editorId,
	label,
	error,
	helperText,
	size,
	className,
}: Readonly<UseMarkdownEditorStateOptions>): UseMarkdownEditorStateReturn {
	const generatedId = useId();
	const finalId = generateEditorId(generatedId, editorId, label);
	const hasError = Boolean(error);
	const ariaDescribedBy = finalId ? getAriaDescribedBy(finalId, error, helperText) : undefined;
	const editorClasses = getMarkdownEditorClasses(size, hasError, className);
	return { finalId, hasError, ariaDescribedBy, editorClasses };
}
