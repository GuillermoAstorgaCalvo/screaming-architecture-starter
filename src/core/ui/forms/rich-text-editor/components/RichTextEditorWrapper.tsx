import type { RichTextEditorWrapperProps } from './RichTextEditorTypes';

export function RichTextEditorWrapper({
	fullWidth,
	children,
	...props
}: Readonly<RichTextEditorWrapperProps>) {
	return (
		<div className={fullWidth ? 'w-full' : undefined} {...props}>
			{children}
		</div>
	);
}
