import type { ReactNode } from 'react';

import { getContainerStyle, type HeightValue } from './MarkdownEditorHelpers';

interface MarkdownEditorContainerProps {
	readonly className: string;
	readonly minHeight: HeightValue;
	readonly maxHeight: HeightValue;
	readonly children: ReactNode;
}

/**
 * Container component for markdown editor field
 *
 * Provides styling and layout for the editor with min/max height constraints.
 */
export function MarkdownEditorContainer({
	className,
	minHeight,
	maxHeight,
	children,
}: Readonly<MarkdownEditorContainerProps>) {
	const containerStyle = getContainerStyle(minHeight, maxHeight);

	return (
		<div className={className} style={containerStyle}>
			{children}
		</div>
	);
}
