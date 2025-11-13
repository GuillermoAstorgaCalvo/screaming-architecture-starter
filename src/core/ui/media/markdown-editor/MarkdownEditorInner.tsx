// Import the CSS for react-markdown-editor-lite
import 'react-markdown-editor-lite/lib/index.css';

import { lazy, Suspense } from 'react';

import type { MarkdownEditorContentProps } from './MarkdownEditorField.utils';
import type { EditorCanViewConfig, EditorViewConfig } from './MarkdownEditorHelpers';

// Dynamically import react-markdown-editor-lite to avoid SSR issues
const MdEditor = lazy(() => import('react-markdown-editor-lite'));

interface MarkdownEditorInnerProps {
	readonly editorValue: string;
	readonly handleChange: ({ text }: { text: string }) => void;
	readonly editorStyle: { height: string };
	readonly placeholder: string | undefined;
	readonly readOnly: boolean | undefined;
	readonly disabled: boolean | undefined;
	readonly viewConfig: EditorViewConfig;
	readonly canViewConfig: EditorCanViewConfig;
}

/**
 * Inner markdown editor component that wraps the MdEditor
 *
 * This component handles the actual rendering of the react-markdown-editor-lite
 * component with lazy loading to avoid SSR issues.
 */
export function MarkdownEditorInner({
	editorValue,
	handleChange,
	editorStyle,
	placeholder,
	readOnly,
	disabled,
	viewConfig,
	canViewConfig,
}: Readonly<MarkdownEditorInnerProps>) {
	return (
		<MdEditor
			value={editorValue}
			style={editorStyle}
			renderHTML={(text: string) => {
				// This will be handled by react-markdown
				return text;
			}}
			onChange={handleChange}
			placeholder={placeholder ?? 'Start typing markdown...'}
			readOnly={readOnly ?? disabled ?? false}
			view={viewConfig}
			canView={canViewConfig}
		/>
	);
}

interface MarkdownEditorContentWrapperProps extends MarkdownEditorContentProps {
	readonly editorStyle: { height: string };
	readonly viewConfig: EditorViewConfig;
	readonly canViewConfig: EditorCanViewConfig;
}

/**
 * Content wrapper component that provides Suspense boundary and styling
 */
export function MarkdownEditorContentWrapper({
	hasError,
	ariaDescribedBy,
	editorValue,
	handleChange,
	editorStyle,
	placeholder,
	readOnly,
	disabled,
	viewConfig,
	canViewConfig,
}: Readonly<MarkdownEditorContentWrapperProps>) {
	return (
		<div
			className="rounded border border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800"
			aria-invalid={hasError}
			aria-describedby={ariaDescribedBy}
		>
			<Suspense fallback={<div className="p-4">Loading editor...</div>}>
				<MarkdownEditorInner
					editorValue={editorValue}
					handleChange={handleChange}
					editorStyle={editorStyle}
					placeholder={placeholder}
					readOnly={readOnly}
					disabled={disabled}
					viewConfig={viewConfig}
					canViewConfig={canViewConfig}
				/>
			</Suspense>
		</div>
	);
}
