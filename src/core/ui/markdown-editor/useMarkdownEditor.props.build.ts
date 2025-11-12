import type { MarkdownEditorFieldProps, UseMarkdownEditorStateReturn } from './MarkdownEditorTypes';
import type { ExtractedMarkdownEditorProps } from './useMarkdownEditor.props.extract';

export interface BuildEditorPropsOptions {
	readonly state: UseMarkdownEditorStateReturn;
	readonly extractedProps: ExtractedMarkdownEditorProps;
}

/**
 * Builds value-related props (value, defaultValue, onChange) for the editor field
 */
export function buildEditorValueProps(extractedProps: ExtractedMarkdownEditorProps) {
	const valueProps: Record<string, unknown> = {};

	if (extractedProps.value !== undefined) {
		valueProps['value'] = extractedProps.value;
	}

	if (extractedProps.defaultValue !== undefined) {
		valueProps['defaultValue'] = extractedProps.defaultValue;
	}

	if (extractedProps.onChange !== undefined) {
		valueProps['onChange'] = extractedProps.onChange;
	}

	return valueProps;
}

/**
 * Builds behavior-related props (disabled, readOnly, required) for the editor field
 */
export function buildEditorBehaviorProps(extractedProps: ExtractedMarkdownEditorProps) {
	const behaviorProps: Record<string, unknown> = {};

	if (extractedProps.disabled) {
		behaviorProps['disabled'] = true;
	}

	if (extractedProps.readOnly) {
		behaviorProps['readOnly'] = true;
	}

	if (extractedProps.required !== undefined) {
		behaviorProps['required'] = extractedProps.required;
	}

	return behaviorProps;
}

/**
 * Builds display-related props (placeholder, heights, view mode) for the editor field
 */
export function buildEditorDisplayProps(extractedProps: ExtractedMarkdownEditorProps) {
	const displayProps: Record<string, unknown> = {
		viewMode: extractedProps.viewMode,
	};

	if (extractedProps.placeholder !== undefined) {
		displayProps['placeholder'] = extractedProps.placeholder;
	}

	if (extractedProps.minHeight !== undefined) {
		displayProps['minHeight'] = extractedProps.minHeight;
	}

	if (extractedProps.maxHeight !== undefined) {
		displayProps['maxHeight'] = extractedProps.maxHeight;
	}

	if (extractedProps.showPreview) {
		displayProps['showPreview'] = true;
	}

	if (extractedProps.onViewModeChange !== undefined) {
		displayProps['onViewModeChange'] = extractedProps.onViewModeChange;
	}

	return displayProps;
}

/**
 * Builds the complete MarkdownEditorFieldProps by combining state and extracted props
 */
export function buildMarkdownEditorFieldProps({
	state,
	extractedProps,
}: Readonly<BuildEditorPropsOptions>): MarkdownEditorFieldProps {
	const valueProps = buildEditorValueProps(extractedProps);
	const behaviorProps = buildEditorBehaviorProps(extractedProps);
	const displayProps = buildEditorDisplayProps(extractedProps);

	return {
		id: state.finalId,
		className: state.editorClasses,
		hasError: state.hasError,
		ariaDescribedBy: state.ariaDescribedBy,
		...valueProps,
		...behaviorProps,
		...displayProps,
	} as MarkdownEditorFieldProps;
}
