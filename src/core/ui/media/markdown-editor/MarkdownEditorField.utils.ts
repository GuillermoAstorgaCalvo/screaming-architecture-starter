import type { HeightValue, ViewMode } from './MarkdownEditorHelpers';
import type { MarkdownEditorFieldProps } from './MarkdownEditorTypes';

export interface ExtractedFieldProps {
	readonly className: string;
	readonly hasError: boolean;
	readonly ariaDescribedBy: string | undefined;
	readonly disabled: boolean | undefined;
	readonly value: string | undefined;
	readonly defaultValue: string | undefined;
	readonly onChange: ((markdown: string) => void) | undefined;
	readonly placeholder: string | undefined;
	readonly readOnly: boolean | undefined;
	readonly minHeight: HeightValue;
	readonly maxHeight: HeightValue;
	readonly showPreview: boolean;
	readonly viewMode: ViewMode;
	readonly onViewModeChange: ((mode: ViewMode) => void) | undefined;
}

export interface MarkdownEditorContentProps {
	readonly editorValue: string;
	readonly handleChange: ({ text }: { text: string }) => void;
	readonly hasError: boolean;
	readonly ariaDescribedBy: string | undefined;
	readonly minHeight: HeightValue;
	readonly placeholder: string | undefined;
	readonly readOnly: boolean | undefined;
	readonly disabled: boolean | undefined;
	readonly showPreview: boolean;
	readonly currentViewMode: ViewMode;
}

/**
 * Extracts field props from MarkdownEditorFieldProps, filtering out internal props
 *
 * @param props - The full MarkdownEditorFieldProps
 * @returns Extracted field props with defaults applied
 */
export function extractFieldProps(props: Readonly<MarkdownEditorFieldProps>): ExtractedFieldProps {
	const {
		id: _id,
		className,
		hasError,
		ariaDescribedBy,
		disabled,
		required: _required,
		value,
		defaultValue,
		onChange,
		placeholder,
		readOnly,
		minHeight,
		maxHeight,
		showPreview = true,
		viewMode = 'split',
		onViewModeChange,
	} = props;

	return {
		className,
		hasError,
		ariaDescribedBy,
		disabled,
		value,
		defaultValue,
		onChange,
		placeholder,
		readOnly,
		minHeight,
		maxHeight,
		showPreview,
		viewMode,
		onViewModeChange,
	};
}

interface BuildContentPropsOptions {
	readonly extractedProps: ExtractedFieldProps;
	readonly editorValue: string;
	readonly currentViewMode: ViewMode;
	readonly handleChange: ({ text }: { text: string }) => void;
}

/**
 * Builds content props for MarkdownEditorContent component
 *
 * @param options - Options containing extracted props and editor state
 * @returns Props for MarkdownEditorContent component
 */
export function buildContentProps({
	extractedProps,
	editorValue,
	currentViewMode,
	handleChange,
}: Readonly<BuildContentPropsOptions>): MarkdownEditorContentProps {
	return {
		editorValue,
		handleChange,
		hasError: extractedProps.hasError,
		ariaDescribedBy: extractedProps.ariaDescribedBy,
		minHeight: extractedProps.minHeight,
		placeholder: extractedProps.placeholder,
		readOnly: extractedProps.readOnly,
		disabled: extractedProps.disabled,
		showPreview: extractedProps.showPreview,
		currentViewMode,
	};
}
