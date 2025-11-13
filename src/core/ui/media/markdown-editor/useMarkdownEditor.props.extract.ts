import type { StandardSize } from '@src-types/ui/base';
import type { MarkdownEditorProps } from '@src-types/ui/forms-editors';

export interface ExtractedMarkdownEditorProps {
	readonly label?: string | undefined;
	readonly error?: string | undefined;
	readonly helperText?: string | undefined;
	readonly size: StandardSize;
	readonly fullWidth: boolean;
	readonly editorId?: string | undefined;
	readonly className?: string | undefined;
	readonly value?: string | undefined;
	readonly defaultValue?: string | undefined;
	readonly onChange?: ((markdown: string) => void) | undefined;
	readonly placeholder?: string | undefined;
	readonly disabled: boolean;
	readonly readOnly: boolean;
	readonly minHeight?: number | string | undefined;
	readonly maxHeight?: number | string | undefined;
	readonly showPreview: boolean;
	readonly viewMode: 'edit' | 'preview' | 'split';
	readonly onViewModeChange?: ((mode: 'edit' | 'preview' | 'split') => void) | undefined;
	readonly required?: boolean | undefined;
}

/**
 * Extracts basic form-related props from MarkdownEditorProps
 */
export function extractBasicProps(props: Readonly<MarkdownEditorProps>) {
	const { label, error, helperText, size = 'md', fullWidth = false, editorId, className } = props;

	return {
		label,
		error,
		helperText,
		size,
		fullWidth,
		editorId,
		className,
	};
}

/**
 * Extracts editor-specific props from MarkdownEditorProps
 */
export function extractEditorProps(props: Readonly<MarkdownEditorProps>) {
	const {
		value,
		defaultValue,
		onChange,
		placeholder,
		disabled = false,
		readOnly = false,
		minHeight,
		maxHeight,
		showPreview = true,
		viewMode = 'split',
		onViewModeChange,
	} = props;

	return {
		value,
		defaultValue,
		onChange,
		placeholder,
		disabled,
		readOnly,
		minHeight,
		maxHeight,
		showPreview,
		viewMode,
		onViewModeChange,
	};
}

/**
 * Extracts and combines all props from MarkdownEditorProps into a structured format
 */
export function extractMarkdownEditorProps(
	props: Readonly<MarkdownEditorProps>
): ExtractedMarkdownEditorProps {
	const basicProps = extractBasicProps(props);
	const editorProps = extractEditorProps(props);
	const required = 'required' in props ? (props as { required?: boolean }).required : undefined;

	return {
		...basicProps,
		...editorProps,
		required,
	};
}
