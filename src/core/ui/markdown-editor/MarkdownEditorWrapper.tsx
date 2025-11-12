import type { MarkdownEditorWrapperProps } from './MarkdownEditorTypes';

export function MarkdownEditorWrapper({
	fullWidth,
	children,
	...props
}: Readonly<MarkdownEditorWrapperProps>) {
	return (
		<div className={fullWidth ? 'w-full' : undefined} {...props}>
			{children}
		</div>
	);
}
