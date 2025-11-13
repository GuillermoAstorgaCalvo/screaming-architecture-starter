import { MarkdownEditorContainer } from './MarkdownEditorContainer';
import { buildContentProps, extractFieldProps } from './MarkdownEditorField.utils';
import {
	getEditorCanViewConfig,
	getEditorHeight,
	getEditorViewConfig,
} from './MarkdownEditorHelpers';
import { MarkdownEditorContentWrapper } from './MarkdownEditorInner';
import type { MarkdownEditorFieldProps } from './MarkdownEditorTypes';
import { useMarkdownEditorFieldState } from './useMarkdownEditorFieldState';

/**
 * Markdown editor field component
 *
 * A controlled/uncontrolled markdown editor field with preview capabilities.
 * Supports view mode switching (edit, preview, split) and customizable height.
 */
export function MarkdownEditorField(props: Readonly<MarkdownEditorFieldProps>) {
	const extractedProps = extractFieldProps(props);
	const { editorValue, currentViewMode, handleChange } = useMarkdownEditorFieldState({
		value: extractedProps.value,
		defaultValue: extractedProps.defaultValue,
		viewMode: extractedProps.viewMode,
		onChange: extractedProps.onChange,
		onViewModeChange: extractedProps.onViewModeChange,
	});
	const contentProps = buildContentProps({
		extractedProps,
		editorValue,
		currentViewMode,
		handleChange,
	});

	const editorStyle = { height: getEditorHeight(extractedProps.minHeight) };
	const viewConfig = getEditorViewConfig(currentViewMode, extractedProps.showPreview);
	const canViewConfig = getEditorCanViewConfig(extractedProps.showPreview);

	return (
		<MarkdownEditorContainer
			className={extractedProps.className}
			minHeight={extractedProps.minHeight}
			maxHeight={extractedProps.maxHeight}
		>
			<MarkdownEditorContentWrapper
				{...contentProps}
				editorStyle={editorStyle}
				viewConfig={viewConfig}
				canViewConfig={canViewConfig}
			/>
		</MarkdownEditorContainer>
	);
}
