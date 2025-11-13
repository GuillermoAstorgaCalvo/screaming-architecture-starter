import type { MarkdownEditorProps } from '@src-types/ui/forms-editors';

import type { MarkdownEditorFieldProps, UseMarkdownEditorStateReturn } from './MarkdownEditorTypes';
import { buildMarkdownEditorFieldProps } from './useMarkdownEditor.props.build';
import { extractMarkdownEditorProps } from './useMarkdownEditor.props.extract';
import { useMarkdownEditorState } from './useMarkdownEditor.state';

export interface UseMarkdownEditorPropsOptions {
	readonly props: Readonly<MarkdownEditorProps>;
}

export interface UseMarkdownEditorPropsReturn {
	readonly state: UseMarkdownEditorStateReturn;
	readonly editorProps: Readonly<MarkdownEditorFieldProps>;
	readonly label?: string | undefined;
	readonly error?: string | undefined;
	readonly helperText?: string | undefined;
	readonly required?: boolean | undefined;
	readonly fullWidth: boolean;
}

/**
 * Hook to process MarkdownEditor component props and return state and field props
 *
 * Extracts and processes MarkdownEditor component props, computes state using
 * useMarkdownEditorState, and builds field props. Returns all necessary data
 * for rendering the MarkdownEditor component.
 *
 * @param options - Options containing MarkdownEditor component props
 * @returns Processed state, field props, and extracted props
 */
export function useMarkdownEditorProps({
	props,
}: Readonly<UseMarkdownEditorPropsOptions>): UseMarkdownEditorPropsReturn {
	const extractedProps = extractMarkdownEditorProps(props);

	const state = useMarkdownEditorState({
		editorId: extractedProps.editorId,
		label: extractedProps.label,
		error: extractedProps.error,
		helperText: extractedProps.helperText,
		size: extractedProps.size,
		className: extractedProps.className,
	});

	const editorProps = buildMarkdownEditorFieldProps({
		state,
		extractedProps,
	});

	return {
		state,
		editorProps,
		label: extractedProps.label,
		error: extractedProps.error,
		helperText: extractedProps.helperText,
		required: extractedProps.required,
		fullWidth: extractedProps.fullWidth,
	};
}
